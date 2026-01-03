import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
    LayoutDashboard,
    BookOpen,
    PlusCircle,
    MessageSquare,
    Inbox,
    LogOut,
    User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/auth/sign-out-button"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <aside className="w-full border-r bg-muted/40 md:w-64 md:flex-col">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <BookOpen className="h-6 w-6" />
                        <span className="">OpenShelf</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Overview
                        </Link>
                        <Link
                            href="/dashboard/listings"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <BookOpen className="h-4 w-4" />
                            My Listings
                        </Link>
                        <Link
                            href="/dashboard/listings/new"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <PlusCircle className="h-4 w-4" />
                            New Listing
                        </Link>
                        <Link
                            href="/dashboard/requests"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <Inbox className="h-4 w-4" />
                            Requests
                        </Link>
                        <Link
                            href="/dashboard/messages"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <MessageSquare className="h-4 w-4" />
                            Messages
                        </Link>
                    </nav>
                </div>
                <div className="mt-auto p-4">
                    <div className="flex items-center gap-2 mb-4 px-2">
                        <User className="h-4 w-4" />
                        <span className="text-sm font-medium truncate">{session.user?.name}</span>
                    </div>
                    <SignOutButton />
                </div>
            </aside>
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                {children}
            </main>
        </div>
    )
}
