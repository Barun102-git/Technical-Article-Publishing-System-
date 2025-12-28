import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/db/mongodb"
import type { Article } from "@/lib/db/models"
import { getUserFromRequest } from "@/lib/auth/jwt"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDatabase()
    const articlesCollection = db.collection<Article>("articles")

    const article = await articlesCollection.findOne({ _id: new ObjectId(id) })

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Increment view count
    await articlesCollection.updateOne({ _id: new ObjectId(id) }, { $inc: { viewCount: 1 } })

    return NextResponse.json(article)
  } catch (error) {
    console.error("[v0] Get article error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const db = await getDatabase()
    const articlesCollection = db.collection<Article>("articles")

    const article = await articlesCollection.findOne({ _id: new ObjectId(id) })

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Check permissions
    if (user.role === "writer" && article.authorId.toString() !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updateData: any = {
      ...body,
      updatedAt: new Date(),
    }

    await articlesCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    const updatedArticle = await articlesCollection.findOne({ _id: new ObjectId(id) })

    return NextResponse.json(updatedArticle)
  } catch (error) {
    console.error("[v0] Update article error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getUserFromRequest(request)

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const articlesCollection = db.collection<Article>("articles")

    await articlesCollection.deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete article error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
