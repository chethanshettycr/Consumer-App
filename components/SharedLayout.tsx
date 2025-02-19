"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Home, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/lib/auth"

const SharedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter()
  const { user } = useAuth()
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(isDarkMode)
    document.documentElement.classList.toggle("dark", isDarkMode)
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("darkMode", newDarkMode.toString())
    document.documentElement.classList.toggle("dark", newDarkMode)
  }

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "dark" : ""}`}>
      <header className="bg-background border-b border-border transition-colors duration-300 ease-in-out">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link href="/" className="text-2xl font-bold text-foreground transition-colors duration-300 ease-in-out">
            CSkit
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" className="text-foreground" onClick={() => router.push("/")}>
              <Home className="h-5 w-5" />
              <span className="sr-only">Home</span>
            </Button>
            <Button onClick={toggleDarkMode} variant="outline" size="icon" className="text-foreground">
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4">{children}</main>
      <footer className="bg-background border-t border-border text-foreground transition-colors duration-300 ease-in-out p-4">
        <div className="container mx-auto text-center">
          &copy; 2025 CSkit. All rights reserved. Created by Chethan Shetty
        </div>
      </footer>
    </div>
  )
}

export default SharedLayout

