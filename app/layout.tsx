import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "./providers/session-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "BookShelf - Livres & Cours Premium | K.I.T",
  description: "Découvrez et achetez des livres numériques et cours premium. Livraison digitale instantanée. Par Kairos Innovation Technologies (K.I.T).",
  keywords: ["livres numériques", "ebooks", "cours en ligne", "formation", "K.I.T", "Kairos Innovation Technologies"],
  authors: [{ name: "Kairos Innovation Technologies (K.I.T)" }],
  creator: "K.I.T - Kairos Innovation Technologies",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased" style={{ backgroundColor: "#faf8f3", color: "#1a1a1a", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
