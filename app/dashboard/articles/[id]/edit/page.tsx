"use client"

import { useEffect, useState, use } from "react"
import { useAuth } from "@/lib/auth/context"
import { useRouter } from "next/navigation"
import { Header } from "@/components/navigation/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RichTextEditor } from "@/components/editor/rich-text-editor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Send } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const statusColors = {
  draft: "bg-muted text-muted-foreground",
  pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  published: "bg-green-500/10 text-green-600 dark:text-green-400",
  rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
}

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user, token } = useAuth()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [tags, setTags] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [status, setStatus] = useState<"draft" | "pending" | "published" | "rejected">("draft")
  const [rejectionReason, setRejectionReason] = useState("")
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (token) {
      fetchArticle()
    }
  }, [token])

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const article = await response.json()
      setTitle(article.title)
      setContent(article.content)
      setExcerpt(article.excerpt || "")
      setTags(article.tags?.join(", ") || "")
      setCoverImage(article.coverImage || "")
      setStatus(article.status)
      setRejectionReason(article.rejectionReason || "")
    } catch (error) {
      console.error("[v0] Fetch article error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!title || !content) {
      alert("Title and content are required")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          coverImage,
        }),
      })

      if (response.ok) {
        router.push("/dashboard")
      } else {
        alert("Failed to update article")
      }
    } catch (error) {
      console.error("[v0] Update article error:", error)
      alert("Failed to update article")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmitForReview = async () => {
    setIsSubmitting(true)
    try {
      // First update the article
      await handleSave()

      // Then submit for review
      const response = await fetch(`/api/articles/${id}/submit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        router.push("/dashboard")
      } else {
        alert("Failed to submit article for review")
      }
    } catch (error) {
      console.error("[v0] Submit article error:", error)
      alert("Failed to submit article")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container max-w-4xl py-8">
          <div className="mb-6 flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <Badge variant="secondary" className={statusColors[status]}>
              {status}
            </Badge>
          </div>

          {rejectionReason && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                <strong>Rejection reason:</strong> {rejectionReason}
              </p>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Edit Article</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Input id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input id="coverImage" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <RichTextEditor value={content} onChange={setContent} />
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSave} disabled={isSaving} variant="outline" className="flex-1 bg-transparent">
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                {status !== "published" && status !== "pending" && (
                  <Button onClick={handleSubmitForReview} disabled={isSubmitting} className="flex-1">
                    <Send className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Submitting..." : "Submit for Review"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
