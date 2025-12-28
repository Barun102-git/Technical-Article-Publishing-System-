import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getDatabase } from "@/lib/db/mongodb"
import type { User } from "@/lib/db/models"
import { createToken } from "@/lib/auth/jwt"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 })
    }

    const db = await getDatabase()
    const usersCollection = db.collection<User>("users")

    // Find user
    const user = await usersCollection.findOne({ email })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create token
    const token = await createToken({
      id: user._id!.toString(),
      email: user.email,
      role: user.role,
    })

    return NextResponse.json({
      token,
      user: {
        id: user._id!.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
