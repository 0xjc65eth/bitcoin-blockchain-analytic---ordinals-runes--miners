import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Providers } from "@/components/providers/providers"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { QueryProvider } from "./providers/query-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "CYPHER ORDI FUTURE",
  description: "Bitcoin data analysis platform for Ordinals and Runes",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
        <QueryProvider>
          <ThemeProvider>
            <Providers>
              <Header />
              <main className="flex-grow container mx-auto px-4 py-6">
                {children}
              </main>
              <Footer />
            </Providers>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
