import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Search, HeartHandshake } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">
                OpenShelf
              </span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                href="/browse"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Browse
              </Link>
              <Link
                href="/about"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                About
              </Link>
            </nav>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Share Knowledge, <br className="hidden sm:inline" />
              One Book at a Time.
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              OpenShelf connects university students to share textbooks and course materials.
              Donate books you don't need, or find the ones you do—for free.
            </p>
            <div className="space-x-4">
              <Link href="/browse">
                <Button size="lg" className="gap-2">
                  <Search className="h-4 w-4" /> Find a Book
                </Button>
              </Link>
              <Link href="/dashboard/listings/new">
                <Button variant="outline" size="lg" className="gap-2">
                  <HeartHandshake className="h-4 w-4" /> Donate Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section id="features" className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
              How it works
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Simple, transparent, and built for students.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Search className="h-12 w-12" />
                <div className="space-y-2">
                  <h3 className="font-bold">Browse</h3>
                  <p className="text-sm text-muted-foreground">
                    Search for textbooks by course code, title, or category.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <HeartHandshake className="h-12 w-12" />
                <div className="space-y-2">
                  <h3 className="font-bold">Request</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect with the donor and arrange a pickup on campus.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <BookOpen className="h-12 w-12" />
                <div className="space-y-2">
                  <h3 className="font-bold">Learn</h3>
                  <p className="text-sm text-muted-foreground">
                    Get the resources you need to succeed in your studies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built for students. Open Source.
          </p>
        </div>
      </footer>
    </div>
  )
}
