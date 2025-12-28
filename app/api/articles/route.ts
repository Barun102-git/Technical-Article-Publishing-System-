import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/db/mongodb"
import type { Article } from "@/lib/db/models"
import { getUserFromRequest } from "@/lib/auth/jwt"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const userId = searchParams.get("userId")

    const db = await getDatabase()
    const articlesCollection = db.collection<Article>("articles")

    const query: any = {}

    // Only show published articles to non-authenticated users
    const user = await getUserFromRequest(request)

    if (!user) {
      query.status = "published"
    } else if (user.role === "writer" && userId) {
      query.authorId = new ObjectId(userId)
      if (status) query.status = status
    } else if (user.role === "admin") {
      if (status) query.status = status
    } else {
      query.status = "published"
    }

    const articles = await articlesCollection.find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(articles)
  } catch (error) {
    console.error("[v0] Get articles error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)

    if (!user || (user.role !== "writer" && user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, excerpt, tags, coverImage } = body

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const db = await getDatabase()
    const usersCollection = db.collection("users")
    const articlesCollection = db.collection<Article>("articles")

    const author = await usersCollection.findOne({ _id: new ObjectId(user.userId) })

    const newArticle: Article = {
      title,
      content,
      excerpt: excerpt || content.substring(0, 150),
      authorId: new ObjectId(user.userId),
      authorName: author?.username || "Unknown",
      status: "draft",
      tags: tags || [],
      coverImage,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await articlesCollection.insertOne(newArticle)

    return NextResponse.json(
      {
        id: result.insertedId.toString(),
        ...newArticle,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Create article error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
