"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

type UserRole = "consumer"

type User = {
  id: string
  email: string
  name: string
  role: UserRole
}

type AuthContextType = {
  user: User | null
  signUp: (email: string, password: string, username: string) => Promise<void>
  signIn: (email: string, name: string) => Promise<void>
  logout: () => void
  isLoggedIn: () => boolean
  updateUser: (updatedUser: User) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])

  const signUp = useCallback(async (email: string, password: string, username: string) => {
    // This is a mock implementation. Replace with actual API call.
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name: username,
      role: "consumer",
    }

    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
  }, [])

  const signIn = useCallback(async (email: string, name: string) => {
    // This is a mock implementation. Replace with actual API call.
    const user: User = {
      id: Date.now().toString(),
      email,
      name,
      role: "consumer",
    }

    setUser(user)
    localStorage.setItem("user", JSON.stringify(user))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/") // Redirect to the welcome page
  }, [router])

  const isLoggedIn = useCallback(() => {
    return !!localStorage.getItem("user")
  }, [])

  const updateUser = useCallback(async (updatedUser: User) => {
    // This is a mock implementation. Replace with actual API call.
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        signUp,
        signIn,
        logout,
        isLoggedIn,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

