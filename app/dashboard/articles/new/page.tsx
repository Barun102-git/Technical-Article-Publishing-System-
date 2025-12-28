"use client"

import { useState } from "react"
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

export default function NewArticlePage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [tags, setTags] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSaveDraft = async () => {
    if (!title || !content) {
      alert("Title and content are required")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/articles", {
        method: "POST",
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
        alert("Failed to save article")
      }
    } catch (error) {
      console.error("[v0] Save article error:", error)
      alert("Failed to save article")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmitForReview = async () => {
    if (!title || !content) {
      alert("Title and content are required")
      return
    }

    setIsSubmitting(true)
    try {
      // First create the article
      const createResponse = await fetch("/api/articles", {
        method: "POST",
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

      if (!createResponse.ok) {
        alert("Failed to create article")
        return
      }

      const article = await createResponse.json()

      // Then submit for review
      const submitResponse = await fetch(`/api/articles/${article.id}/submit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (submitResponse.ok) {
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
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              Draft
            </Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create New Article</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter article title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Input
                  id="excerpt"
                  placeholder="Brief summary of your article..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="JavaScript, React, Web Development (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input
                  id="coverImage"
                  placeholder="https://example.com/image.jpg"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write your article content here..."
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  variant="outline"
                  className="flex-1 bg-transparent"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save as Draft"}
                </Button>
                <Button onClick={handleSubmitForReview} disabled={isSubmitting} className="flex-1">
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Submitting..." : "Submit for Review"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
