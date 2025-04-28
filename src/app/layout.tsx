import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Providers } from "@/components/providers/providers"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" })

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
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-6">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
