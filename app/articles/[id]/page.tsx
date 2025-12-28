"use client"

import { useEffect, useState, use } from "react"
import { Header } from "@/components/navigation/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Eye, Clock } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface Article {
  _id: string
  title: string
  content: string
  excerpt: string
  authorName: string
  tags: string[]
  viewCount: number
  publishedAt: string
  createdAt: string
}

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticle()
  }, [])

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/articles/${id}`)
      const data = await response.json()
      setArticle(data)
    } catch (error) {
      console.error("[v0] Fetch article error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading article...</p>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="mb-4 text-muted-foreground">Article not found</p>
            <Button asChild>
              <Link href="/articles">Browse Articles</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <article className="container max-w-4xl py-8">
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/articles">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Link>
          </Button>

          <div className="rounded-lg bg-card p-8 shadow-sm">
            <header className="mb-8 border-b pb-6">
              <h1 className="mb-4 text-balance text-4xl font-bold">{article.title}</h1>

              <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="font-medium">By {article.authorName}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {format(new Date(article.publishedAt || article.createdAt), "PPP")}
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {article.viewCount} views
                </div>
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
            </header>

            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: renderContent(article.content) }} />
            </div>
          </div>
        </article>
      </main>
    </div>
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
