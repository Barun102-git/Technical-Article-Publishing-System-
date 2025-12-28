import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/db/mongodb"
import { getUserFromRequest } from "@/lib/auth/jwt"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getUserFromRequest(request)

    if (!user || user.role !== "writer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const articlesCollection = db.collection("articles")

    const article = await articlesCollection.findOne({ _id: new ObjectId(id) })

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    if (article.authorId.toString() !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await articlesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "pending", updatedAt: new Date() } },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Submit article error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
