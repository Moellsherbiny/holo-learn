import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background text-foreground overflow-hidden">
      
      {/* Glow blobs */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-pulse" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl animate-pulse" />

      <div className="z-10 mx-auto max-w-md text-center px-6">
        
        {/* Animated 404 (pure CSS) */}
        <h1 className="text-7xl sm:text-8xl font-extrabold tracking-tight bg-linear-to-br from-primary to-accent bg-clip-text text-transparent animate-float">
          404
        </h1>

        <h2 className="mt-4 text-xl font-semibold">
          Page not found
        </h2>

        <p className="mt-2 text-muted-foreground">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}