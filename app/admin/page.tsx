"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth/context"
import { useRouter } from "next/navigation"
import { Header } from "@/components/navigation/header"
import { ReviewArticleCard } from "@/components/admin/review-article-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react"

interface Article {
  _id: string
  title: string
  excerpt: string
  authorName: string
  status: "draft" | "pending" | "published" | "rejected"
  viewCount: number
  createdAt: string
}

export default function AdminDashboardPage() {
  const { user, token, isLoading } = useAuth()
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }

    if (user?.role !== "admin") {
      router.push("/dashboard")
    }

    if (user && token) {
      fetchArticles()
    }
  }, [user, token, isLoading, router])

  const fetchArticles = async () => {
    try {
      const response = await fetch("/api/articles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      setArticles(data)
    } catch (error) {
      console.error("[v0] Failed to fetch articles:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (id: string, action: "approve" | "reject", reason?: string) => {
    try {
      const response = await fetch(`/api/articles/${id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, rejectionReason: reason }),
      })

      if (response.ok) {
        fetchArticles()
      } else {
        alert("Failed to review article")
      }
    } catch (error) {
      console.error("[v0] Review article error:", error)
      alert("Failed to review article")
    }
  }

  const filterArticles = (status: string) => {
    if (status === "all") return articles
    return articles.filter((article) => article.status === status)
  }

  const stats = {
    total: articles.length,
    pending: filterArticles("pending").length,
    published: filterArticles("published").length,
    rejected: filterArticles("rejected").length,
  }

  if (isLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Access denied. Admin role required.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Review and manage all articles</p>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pending}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.published}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.rejected}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList>
              <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
              <TabsTrigger value="published">Published ({stats.published})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            </TabsList>

            {["pending", "published", "rejected", "all"].map((status) => (
              <TabsContent key={status} value={status} className="space-y-6">
                {filterArticles(status).length === 0 ? (
                  <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
                    <div className="text-center">
                      <p className="text-muted-foreground">No articles found</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filterArticles(status).map((article) => (
                      <ReviewArticleCard
                        key={article._id}
                        id={article._id}
                        {...article}
                        createdAt={new Date(article.createdAt)}
                        onReview={handleReview}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  )
}
