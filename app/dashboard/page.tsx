"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth/context"
import { useRouter } from "next/navigation"
import { Header } from "@/components/navigation/header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { ArticleCard } from "@/components/dashboard/article-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Article {
  _id: string
  title: string
  excerpt: string
  status: "draft" | "pending" | "published" | "rejected"
  viewCount: number
  createdAt: string
  rejectionReason?: string
}

export default function DashboardPage() {
  const { user, token, isLoading } = useAuth()
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }

    if (user && token) {
      fetchArticles()
    }
  }, [user, token, isLoading, router])

  const fetchArticles = async () => {
    try {
      const response = await fetch(`/api/articles?userId=${user?.id}`, {
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

  const handleSubmit = async (id: string) => {
    try {
      const response = await fetch(`/api/articles/${id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        alert("Article submitted for review!")
        fetchArticles()
      } else {
        const error = await response.json()
        alert(`Failed to submit article: ${error.message || "Unknown error"}`)
      }
    } catch (error) {
      console.error("[v0] Submit article error:", error)
      alert("Failed to submit article")
    }
  }

  const filterArticles = (status: string) => {
    if (status === "all") return articles
    return articles.filter((article) => article.status === status)
  }

  if (isLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user || (user.role !== "writer" && user.role !== "admin")) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Access denied. Writer or Admin role required.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Manage your articles</p>
            </div>
            <Button asChild>
              <Link href="/dashboard/articles/new">
                <Plus className="mr-2 h-4 w-4" />
                New Article
              </Link>
            </Button>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All ({articles.length})</TabsTrigger>
              <TabsTrigger value="draft">Drafts ({filterArticles("draft").length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({filterArticles("pending").length})</TabsTrigger>
              <TabsTrigger value="published">Published ({filterArticles("published").length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({filterArticles("rejected").length})</TabsTrigger>
            </TabsList>

            {["all", "draft", "pending", "published", "rejected"].map((status) => (
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
                      <ArticleCard
                        key={article._id}
                        id={article._id}
                        {...article}
                        createdAt={new Date(article.createdAt)}
                        onSubmit={handleSubmit}
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
