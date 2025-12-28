import { Header } from "@/components/navigation/header"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, Users, Shield } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b bg-gradient-to-b from-background to-muted/20 py-20 md:py-32">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-6xl">
                Technical Article Publishing Platform
              </h1>
              <p className="mb-8 text-balance text-lg text-muted-foreground md:text-xl">
                A comprehensive content management system designed for technical writers, editors, and readers. Create,
                review, and publish high-quality technical articles with ease.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/articles">
                    Browse Articles
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">Features</h2>
              <p className="text-balance text-lg text-muted-foreground">
                Everything you need for a complete publishing workflow
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Rich Text Editor</h3>
                <p className="text-pretty text-muted-foreground">
                  Write and format your articles with our markdown-based editor featuring live preview and formatting
                  tools.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Review Workflow</h3>
                <p className="text-pretty text-muted-foreground">
                  Admin review process ensures quality content. Writers receive feedback on rejected articles for
                  improvement.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Role-Based Access</h3>
                <p className="text-pretty text-muted-foreground">
                  Three user roles - Admin, Writer, and Reader - each with appropriate permissions and interfaces.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-muted/30 py-20">
          <div className="container px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold">Ready to Start Publishing?</h2>
              <p className="mb-8 text-balance text-lg text-muted-foreground">
                Join our platform today and start creating amazing technical content.
              </p>
              <Button size="lg" asChild>
                <Link href="/register">Create Your Account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Technical Article CMS. Built with Next.js and MongoDB.</p>
        </div>
      </footer>
    </div>
  )
}
