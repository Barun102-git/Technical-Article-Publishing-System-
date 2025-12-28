"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  username: string
  email: string
  role: "admin" | "writer" | "reader"
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string, role?: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth token
    const storedToken = localStorage.getItem("auth_token")
    const storedUser = localStorage.getItem("auth_user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      try {
        const error = await response.json()
        throw new Error(error.error || "Login failed")
      } catch (e) {
        throw new Error("Login failed. Please check your MongoDB connection and try again.")
      }
    }

    const data = await response.json()
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem("auth_token", data.token)
    localStorage.setItem("auth_user", JSON.stringify(data.user))
  }

  const register = async (username: string, email: string, password: string, role = "reader") => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, role }),
    })

    if (!response.ok) {
      try {
        const error = await response.json()
        throw new Error(error.error || "Registration failed")
      } catch (e) {
        throw new Error(
          "Registration failed. Please ensure MongoDB is running and check your MONGODB_URI environment variable.",
        )
      }
    }

    const data = await response.json()
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem("auth_token", data.token)
    localStorage.setItem("auth_user", JSON.stringify(data.user))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
