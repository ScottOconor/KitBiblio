import * as net from 'net'
import { PrismaClient } from '@prisma/client'

// ── PostgreSQL wire protocol via socket Unix ────────────────────────
const PG_SOCKET   = '/var/run/postgresql/.s.PGSQL.5432'
const PG_DATABASE = 'bookshelf_db'
const PG_USER     = 'automate'

// ── OID → ColumnType (Prisma 7 enum) ───────────────────────────────
// https://github.com/prisma/prisma/blob/main/packages/driver-adapter-utils/src/types.ts
const OID_TO_COL: Record<number, number> = {
  16: 5,    // bool      → Boolean
  20: 1,    // int8      → Int64
  21: 0,    // int2      → Int32
  23: 0,    // int4      → Int32
  25: 7,    // text      → Text
  114: 11,  // json      → Json
  700: 2,   // float4    → Float
  701: 3,   // float8    → Double
  1043: 7,  // varchar   → Text
  1082: 8,  // date      → Date
  1114: 10, // timestamp → DateTime
  1184: 10, // timestamptz → DateTime
  1700: 4,  // numeric   → Numeric
  2950: 15, // uuid      → Uuid
  3802: 11, // jsonb     → Json
}
const colType = (oid: number) => OID_TO_COL[oid] ?? 7

// ── Sérialisation $1,$2,… → SQL littéral ───────────────────────────
function serialize(v: unknown): string {
  if (v === null || v === undefined) return 'NULL'
  if (typeof v === 'boolean')        return v ? 'true' : 'false'
  if (typeof v === 'number')         return String(v)
  if (typeof v === 'bigint')         return String(v)
  if (v instanceof Date)             return `'${v.toISOString()}'`
  if (typeof v === 'object')         return `'${JSON.stringify(v).replace(/'/g, "''")}'`
  return `'${String(v).replace(/'/g, "''")}'`
}

function substParams(sql: string, args: unknown[]): string {
  return sql.replace(/\$(\d+)/g, (_, n) => {
    const i = parseInt(n, 10) - 1
    return i < args.length ? serialize(args[i]) : 'NULL'
  })
}

// ── Helpers buffer ──────────────────────────────────────────────────
const r32 = (b: Buffer, o: number) => b.readInt32BE(o)
const r16 = (b: Buffer, o: number) => b.readInt16BE(o)

interface Col  { name: string; oid: number }
interface Res  { cols: Col[]; rows: (string | null)[][]; tag: string }
interface Pend { sql: string; ok: (r: Res) => void; err: (e: Error) => void }

// ── Client PostgreSQL (wire protocol v3) ────────────────────────────
class PgConn {
  private sock: net.Socket | null = null
  private buf = Buffer.alloc(0)
  private q: Pend[] = []
  private cur: Pend | null = null
  private res: Res = { cols: [], rows: [], tag: '' }
  private _ready = false
  private _closed = false

  get isIdle() { return this._ready && !this.cur && !this._closed }

  async open(): Promise<void> {
    return new Promise((resolve, reject) => {
      const sock = net.createConnection({ path: PG_SOCKET })
      this.sock = sock

      // Startup message
      sock.on('connect', () => {
        const p = Buffer.from(`user\0${PG_USER}\0database\0${PG_DATABASE}\0\0`)
        const b = Buffer.alloc(8 + p.length)
        b.writeInt32BE(8 + p.length, 0)
        b.writeInt32BE(196608, 4) // protocol 3.0
        p.copy(b, 8)
        sock.write(b)
      })

      const onMsg = (type: string, payload: Buffer) => {
        if (type === 'R') {
          if (r32(payload, 0) !== 0) reject(new Error(`PG auth type not supported: ${r32(payload, 0)}`))
        } else if (type === 'Z') {
          if (!this._ready) { this._ready = true; resolve() }
          else {
            const r = this.res
            this.res = { cols: [], rows: [], tag: '' }
            const p = this.cur!; this.cur = null
            p.ok(r); this.next()
          }
        } else if (type === 'E') {
          let msg = 'PG error'
          for (let i = 0; i < payload.length - 1;) {
            const c = String.fromCharCode(payload[i++])
            let e = i; while (e < payload.length && payload[e]) e++
            if (c === 'M') msg = payload.slice(i, e).toString()
            i = e + 1
          }
          const err = new Error(msg)
          if (!this._ready) reject(err)
          else {
            this.res = { cols: [], rows: [], tag: '' }
            const p = this.cur; this.cur = null; p?.err(err); this.next()
          }
        } else if (type === 'T') {
          this.res.cols = []
          const n = r16(payload, 0); let off = 2
          for (let i = 0; i < n; i++) {
            let e = off; while (e < payload.length && payload[e]) e++
            const name = payload.slice(off, e).toString()
            off = e + 1 + 6           // skip null + tableOid(4) + attrNum(2)
            const oid = r32(payload, off)
            off += 12                 // typeOid(4) + typeSize(2) + typeMod(4) + format(2)
            this.res.cols.push({ name, oid })
          }
        } else if (type === 'D') {
          const n = r16(payload, 0); const row: (string | null)[] = []; let off = 2
          for (let i = 0; i < n; i++) {
            const len = r32(payload, off); off += 4
            if (len === -1) row.push(null)
            else { row.push(payload.slice(off, off + len).toString()); off += len }
          }
          this.res.rows.push(row)
        } else if (type === 'C') {
          this.res.tag = payload.slice(0, -1).toString()
        }
      }

      sock.on('data', chunk => {
        this.buf = Buffer.concat([this.buf, chunk])
        while (this.buf.length >= 5) {
          const t = String.fromCharCode(this.buf[0])
          const l = r32(this.buf, 1)
          if (this.buf.length < 1 + l) break
          const payload = this.buf.slice(5, 1 + l)
          this.buf = this.buf.slice(1 + l)
          onMsg(t, payload)
        }
      })

      sock.on('error', err => {
        if (!this._ready) reject(err)
        else { this.cur?.err(err as Error); this.cur = null; this.next() }
      })
      sock.on('close', () => {
        this._closed = true
        this.cur?.err(new Error('Connection closed')); this.cur = null
      })
    })
  }

  private next() {
    if (this.q.length && !this.cur) {
      this.cur = this.q.shift()!
      const qb = Buffer.from(this.cur.sql + '\0')
      const b  = Buffer.alloc(5 + qb.length)
      b[0] = 0x51 // 'Q'
      b.writeInt32BE(4 + qb.length, 1)
      qb.copy(b, 5)
      this.sock?.write(b)
    }
  }

  query(sql: string): Promise<Res> {
    return new Promise((ok, err) => {
      if (this._closed) return err(new Error('Connection closed'))
      this.q.push({ sql, ok, err })
      if (!this.cur) this.next()
    })
  }

  async close(): Promise<void> {
    if (this._closed || !this.sock) return
    this.sock.write(Buffer.from([0x58, 0, 0, 0, 4])) // Terminate
    this.sock.end()
  }
}

// ── Pool de connexions ──────────────────────────────────────────────
const g = globalThis as any
if (!g._pgPool) g._pgPool = []
const pool: PgConn[] = g._pgPool

async function acquire(): Promise<PgConn> {
  const idle = pool.find(c => c.isIdle)
  if (idle) return idle
  const c = new PgConn()
  await c.open()
  if (pool.length < 10) pool.push(c)
  return c
}

// ── Conversion valeur PostgreSQL → JS ──────────────────────────────
function pgVal(val: string | null, oid: number): unknown {
  if (val === null) return null
  switch (oid) {
    case 16: return val === 't'
    case 20: return parseInt(val, 10)   // int8 → Int32 (COUNT retourne int8)
    case 21: case 23: return parseInt(val, 10)
    case 700: case 701: return parseFloat(val)
    default: return val
  }
}

function parseTag(tag: string): number {
  const p = tag.split(' '); const n = parseInt(p[p.length - 1], 10); return isNaN(n) ? 0 : n
}

// ── Adaptateur Prisma 7 (interface exacte v7.4.2) ──────────────────
// Ref: SqlDriverAdapterFactory + SqlDriverAdapter + Transaction
const ADAPTER_INFO = {
  provider:    'postgres' as const,
  adapterName: '@custom/native-net',
}

function buildResultSet(r: Res) {
  return {
    columnNames: r.cols.map(c => c.name),
    columnTypes: r.cols.map(c => colType(c.oid)),
    rows: r.rows.map(row => row.map((v, i) => pgVal(v, r.cols[i]?.oid ?? 25))),
  }
}

function makeQueryable(exec: (sql: string) => Promise<Res>) {
  return {
    ...ADAPTER_INFO,
    async queryRaw(q: { sql: string; args: unknown[] }) {
      const r = await exec(substParams(q.sql, q.args ?? []))
      return buildResultSet(r)
    },
    async executeRaw(q: { sql: string; args: unknown[] }) {
      const r = await exec(substParams(q.sql, q.args ?? []))
      return parseTag(r.tag)
    },
  }
}

function createAdapter() {
  return {
    ...ADAPTER_INFO,

    async connect() {
      const conn = await acquire()
      const exec  = (sql: string) => conn.query(sql)

      return {
        ...makeQueryable(exec),

        // Exécute un script SQL multi-instructions
        async executeScript(script: string) {
          await conn.query(script)
        },

        // Infos connexion
        getConnectionInfo() {
          return { supportsRelationJoins: true }
        },

        // Transaction
        async startTransaction(isolationLevel?: string) {
          const tx = new PgConn()
          await tx.open()
          const level = isolationLevel ?? 'READ COMMITTED'
          await tx.query(`BEGIN ISOLATION LEVEL ${level}`)
          const txExec = (sql: string) => tx.query(sql)

          return {
            ...makeQueryable(txExec),
            options: { usePhantomQuery: false },
            async commit()   { await tx.query('COMMIT');   await tx.close() },
            async rollback() { await tx.query('ROLLBACK'); await tx.close() },
          }
        },

        async dispose() { /* pool géré globalement */ },
      }
    },
  }
}

// ── Singleton PrismaClient ──────────────────────────────────────────
export const prisma: PrismaClient =
  g.prisma ?? new PrismaClient({ adapter: createAdapter() as any })

if (process.env.NODE_ENV !== 'production') g.prisma = prisma
