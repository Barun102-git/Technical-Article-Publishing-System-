"use client"

import { useEffect, useState, use } from "react"
import { useAuth } from "@/lib/auth/context"
import { useRouter } from "next/navigation"
import { Header } from "@/components/navigation/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, X } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Article {
  _id: string
  title: string
  content: string
  excerpt: string
  authorName: string
  status: "draft" | "pending" | "published" | "rejected"
  tags: string[]
  viewCount: number
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export default function AdminReviewArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user, token } = useAuth()
  const router = useRouter()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

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
      const data = await response.json()
      setArticle(data)
    } catch (error) {
      console.error("[v0] Fetch article error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (action: "approve" | "reject", reason?: string) => {
    setIsProcessing(true)
    try {
      const response = await fetch(`/api/articles/${id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, rejectionReason: reason }),
      })

      console.log("[v0] Review response status:", response.status)
      const data = await response.json()
      console.log("[v0] Review response data:", data)

      if (response.ok) {
        alert(`Article ${action === "approve" ? "published" : "rejected"} successfully!`)
        router.push("/admin")
      } else {
        alert(`Failed to ${action} article: ${data.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("[v0] Review article error:", error)
      alert(`Error: ${error instanceof Error ? error.message : "Failed to review article"}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleApprove = () => handleReview("approve")

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason")
      return
    }
    await handleReview("reject", rejectionReason)
    setShowRejectDialog(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Article not found</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-muted/30">
          <div className="container max-w-4xl py-8">
            <div className="mb-6 flex items-center justify-between">
              <Button variant="ghost" asChild>
                <Link href="/admin">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Admin
                </Link>
              </Button>
              <Badge
                variant="secondary"
                className={
                  article.status === "pending"
                    ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                    : article.status === "published"
                      ? "bg-green-500/10 text-green-600 dark:text-green-400"
                      : "bg-red-500/10 text-red-600 dark:text-red-400"
                }
              >
                {article.status}
              </Badge>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <div className="space-y-4">
                  <CardTitle className="text-3xl">{article.title}</CardTitle>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span>By {article.authorName}</span>
                    <span>•</span>
                    <span>Created {format(new Date(article.createdAt), "PPP")}</span>
                    <span>•</span>
                    <span>{article.viewCount} views</span>
                  </div>
                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div dangerouslySetInnerHTML={{ __html: renderContent(article.content) }} />
                </div>
              </CardContent>
            </Card>

            {article.status === "pending" && (
              <div className="flex gap-3">
                <Button onClick={handleApprove} disabled={isProcessing} className="flex-1">
                  <Check className="mr-2 h-4 w-4" />
                  {isProcessing ? "Approving..." : "Approve & Publish"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowRejectDialog(true)}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Article</DialogTitle>
            <DialogDescription>Please provide a reason for rejecting this article.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reason">Rejection Reason</Label>
            <Textarea
              id="reason"
              placeholder="Explain why this article is being rejected..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowRejectDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isProcessing}>
              {isProcessing ? "Rejecting..." : "Reject Article"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function renderContent(text: string): string {
  return text
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br/>")
}
