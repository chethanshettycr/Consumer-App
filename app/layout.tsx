import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/app/lib/auth"
import { Toaster } from "@/components/ui/toaster"
import ConsumerMenu from "@/components/ConsumerMenu"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CSkit Consumer",
  description: "Your all-in-one platform for construction materials and services",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} transition-colors duration-300`}>
        <AuthProvider>
          <ConsumerMenu />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'