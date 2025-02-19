"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Moon, Sun, HardHat } from "lucide-react"
import { motion } from "framer-motion"

export default function WelcomePage() {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: "url('/construction-bg.jpg')" }}
      ></div>
      <Card className="w-full max-w-md z-10">
        <CardContent className="flex flex-col items-center space-y-6 p-6">
          <motion.h1
            className="text-4xl font-bold text-foreground"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Welcome to CSkit
          </motion.h1>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col space-y-4 w-full"
          >
            <Link href="/consumer/login">
              <Button className="w-full text-lg" size="lg">
                <HardHat className="mr-2 h-5 w-5" /> Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="w-full text-lg" variant="outline" size="lg">
                Sign Up
              </Button>
            </Link>
          </motion.div>
        </CardContent>
      </Card>
      <Button variant="outline" size="icon" className="absolute top-4 right-4 z-10" onClick={toggleDarkMode}>
        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        <span className="sr-only">Toggle dark mode</span>
      </Button>
    </div>
  )
}

