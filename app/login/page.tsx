import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: "Sign In - Article CMS",
  description: "Sign in to your Article CMS account",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Article CMS</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage and publish your content</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
