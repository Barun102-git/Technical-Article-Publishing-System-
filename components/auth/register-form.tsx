"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth/context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Loader2 } from "lucide-react"

export function RegisterForm() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("reader")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters long")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      await register(username, email, password, role)
      router.push("/dashboard")
    } catch (err: any) {
      const errorMessage = err.message || "Registration failed. Please try again."
      setError(errorMessage)
      console.error("[v0] Registration error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border border-border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
        <CardDescription>Sign up to start publishing articles</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="border border-input"
              required
            />
            {username && username.length < 3 && (
              <p className="text-xs text-muted-foreground">Minimum 3 characters required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="border border-input"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">
              Account Type
            </Label>
            <Select value={role} onValueChange={setRole} disabled={isLoading}>
              <SelectTrigger className="border border-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reader">
                  <div className="flex flex-col">
                    <span>Reader</span>
                    <span className="text-xs text-muted-foreground">Read published articles</span>
                  </div>
                </SelectItem>
                <SelectItem value="writer">
                  <div className="flex flex-col">
                    <span>Writer</span>
                    <span className="text-xs text-muted-foreground">Create and submit articles</span>
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex flex-col">
                    <span>Admin</span>
                    <span className="text-xs text-muted-foreground">Review and publish articles</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="border border-input"
              required
            />
            {password && password.length < 6 && (
              <p className="text-xs text-muted-foreground">Minimum 6 characters required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              className="border border-input"
              required
            />
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-destructive">Passwords do not match</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading} size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
