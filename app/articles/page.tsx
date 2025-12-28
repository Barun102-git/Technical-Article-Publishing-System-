"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/navigation/header"
import { ArticlePreviewCard } from "@/components/articles/article-preview-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Article {
  _id: string
  title: string
  excerpt: string
  authorName: string
  tags: string[]
  viewCount: number
  publishedAt: string
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticles()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredArticles(articles)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.authorName.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
      setFilteredArticles(filtered)
    }
  }, [searchQuery, articles])

  const fetchArticles = async () => {
    try {
      const response = await fetch("/api/articles?status=published")
      const data = await response.json()
      setArticles(data)
      setFilteredArticles(data)
    } catch (error) {
      console.error("[v0] Failed to fetch articles:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="mb-4 text-3xl font-bold">Browse Articles</h1>
            <p className="mb-6 text-muted-foreground">Discover technical articles from our community</p>

            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search articles, authors, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <p className="text-muted-foreground">Loading articles...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
              <div className="text-center">
                <p className="text-muted-foreground">
                  {searchQuery ? "No articles found matching your search" : "No published articles yet"}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <ArticlePreviewCard
                  key={article._id}
                  id={article._id}
                  {...article}
                  publishedAt={new Date(article.publishedAt)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
