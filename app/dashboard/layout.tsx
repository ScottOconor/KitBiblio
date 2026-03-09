"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div suppressHydrationWarning className="min-h-screen flex flex-col">
      <Header />
      <main suppressHydrationWarning className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
