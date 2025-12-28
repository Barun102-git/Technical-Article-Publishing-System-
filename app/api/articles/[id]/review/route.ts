import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/db/mongodb"
import { getUserFromRequest } from "@/lib/auth/jwt"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getUserFromRequest(request)

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { action, rejectionReason } = body // action: 'approve' or 'reject'

    if (!action || (action !== "approve" && action !== "reject")) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const db = await getDatabase()
    const articlesCollection = db.collection("articles")

    const updateData: any = {
      status: action === "approve" ? "published" : "rejected",
      updatedAt: new Date(),
    }

    if (action === "approve") {
      updateData.publishedAt = new Date()
    } else if (rejectionReason) {
      updateData.rejectionReason = rejectionReason
    }

    await articlesCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Review article error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
