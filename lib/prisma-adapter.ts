/**
 * Adaptateur Prisma 7 custom utilisant postgres.js (déjà installé)
 * Compatible avec l'interface DriverAdapter de Prisma 7
 */
import postgres from 'postgres'
import type { DriverAdapter, Query, Result, ResultSet, Transaction, TransactionOptions } from '@prisma/client/runtime/library'

function fieldToColumnType(typeId: number): string {
  // mapping PostgreSQL OID -> Prisma column type
  const types: Record<number, string> = {
    16: 'Boolean',
    20: 'Int64',
    21: 'Int32',
    23: 'Int32',
    25: 'Text',
    700: 'Float',
    701: 'Float',
    1082: 'Date',
    1114: 'DateTime',
    1184: 'DateTime',
    2950: 'Uuid',
    114: 'Json',
    3802: 'Json',
    1043: 'Text',
    1700: 'Numeric',
  }
  return types[typeId] ?? 'Text'
}

function convertRow(row: Record<string, unknown>): unknown[] {
  return Object.values(row).map(v => {
    if (v === null) return null
    if (v instanceof Date) return v.toISOString()
    if (typeof v === 'bigint') return Number(v)
    return v
  })
}

class PostgresTransaction implements Transaction {
  provider: 'postgres' = 'postgres'
  adapterName: string = '@custom/postgres'

  constructor(private sql: postgres.Sql) {}

  async queryRaw(query: Query): Promise<Result<ResultSet>> {
    try {
      const rows = await this.sql.unsafe(query.sql, query.args as any[])
      const fields = rows.columns?.map((col: any) => ({
        name: col.name,
        typeId: fieldToColumnType(col.dataTypeID),
      })) ?? []
      return {
        ok: true,
        value: {
          columnNames: fields.map((f: any) => f.name),
          columnTypes: fields.map((f: any) => f.typeId as any),
          rows: rows.map(row => convertRow(row as Record<string, unknown>)),
        },
      }
    } catch (e: any) {
      return { ok: false, error: { kind: 'GenericJs', id: 0, error: e } }
    }
  }

  async executeRaw(query: Query): Promise<Result<number>> {
    try {
      const result = await this.sql.unsafe(query.sql, query.args as any[])
      return { ok: true, value: result.count ?? 0 }
    } catch (e: any) {
      return { ok: false, error: { kind: 'GenericJs', id: 0, error: e } }
    }
  }

  async commit(): Promise<Result<void>> {
    return { ok: true, value: undefined }
  }

  async rollback(): Promise<Result<void>> {
    return { ok: true, value: undefined }
  }
}

export class PostgresAdapter implements DriverAdapter {
  provider: 'postgres' = 'postgres'
  adapterName: string = '@custom/postgres'
  private sql: postgres.Sql

  constructor(connectionConfig?: postgres.Options<{}>) {
    this.sql = postgres({
      host: '/var/run/postgresql',
      database: 'bookshelf_db',
      username: 'automate',
      max: 10,
      idle_timeout: 20,
      ...connectionConfig,
    })
  }

  async queryRaw(query: Query): Promise<Result<ResultSet>> {
    try {
      const rows = await this.sql.unsafe(query.sql, query.args as any[])
      const columns = (rows as any).columns ?? []
      return {
        ok: true,
        value: {
          columnNames: columns.map((c: any) => c.name),
          columnTypes: columns.map((c: any) => fieldToColumnType(c.dataTypeID) as any),
          rows: rows.map(row => convertRow(row as Record<string, unknown>)),
        },
      }
    } catch (e: any) {
      return { ok: false, error: { kind: 'GenericJs', id: 0, error: e } }
    }
  }

  async executeRaw(query: Query): Promise<Result<number>> {
    try {
      const result = await this.sql.unsafe(query.sql, query.args as any[])
      return { ok: true, value: (result as any).count ?? 0 }
    } catch (e: any) {
      return { ok: false, error: { kind: 'GenericJs', id: 0, error: e } }
    }
  }

  async startTransaction(options?: TransactionOptions): Promise<Result<Transaction>> {
    const sqlTx = this.sql
    return { ok: true, value: new PostgresTransaction(sqlTx) }
  }

  async getConnectionInfo?(): Promise<Result<{ schemaName?: string }>> {
    return { ok: true, value: { schemaName: 'public' } }
  }
}
