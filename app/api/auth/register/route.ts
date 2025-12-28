import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getDatabase } from "@/lib/db/mongodb"
import type { User } from "@/lib/db/models"
import { createToken } from "@/lib/auth/jwt"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, password, role = "reader" } = body

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Attempting to connect to MongoDB:", process.env.MONGODB_URI)

    const db = await getDatabase()

    console.log("[v0] Successfully connected to MongoDB")

    const usersCollection = db.collection<User>("users")

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const newUser: User = {
      username,
      email,
      password: hashedPassword,
      role: role as "admin" | "writer" | "reader",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await usersCollection.insertOne(newUser)

    // Create token
    const token = await createToken({
      id: result.insertedId.toString(),
      email,
      role,
    })

    return NextResponse.json(
      {
        token,
        user: {
          id: result.insertedId.toString(),
          username,
          email,
          role,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Registration error:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    console.error("[v0] Error details:", errorMessage)

    return NextResponse.json(
      {
        error:
          "Registration failed. Please ensure MongoDB is running at mongodb://localhost:27017 and the MONGODB_URI environment variable is set correctly.",
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}
