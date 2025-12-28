import { RegisterForm } from "@/components/auth/register-form"

export const metadata = {
  title: "Sign Up - Article CMS",
  description: "Create a new Article CMS account",
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Article CMS</h1>
          <p className="mt-2 text-sm text-muted-foreground">Create your account to get started</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
