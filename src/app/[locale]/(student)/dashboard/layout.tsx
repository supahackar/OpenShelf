import { auth } from "@/lib/auth"
import { redirect, Link } from "@/i18n/routing"
import {
    LayoutDashboard,
    BookOpen,
    PlusCircle,
    MessageSquare,
    Inbox,
    ChevronRight
} from "lucide-react"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { cn } from "@/lib/utils"
import { getTranslations } from "next-intl/server"

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    const session = await auth()
    const t = await getTranslations("Nav")

    if (!session) {
        redirect({ href: "/login", locale })
    }

    const navItems = [
        { href: "/dashboard", label: t("overview"), icon: LayoutDashboard },
        { href: "/dashboard/listings", label: t("myListings"), icon: BookOpen },
        { href: "/dashboard/listings/new", label: t("newListing"), icon: PlusCircle },
        { href: "/dashboard/requests", label: t("requests"), icon: Inbox },
        { href: "/dashboard/messages", label: t("messages"), icon: MessageSquare },
    ]

    return (
        <div className="flex min-h-screen bg-background/50">
            {/* Sidebar */}
            <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50 border-r border-border/40 bg-card/30 backdrop-blur-xl rtl:border-r-0 rtl:border-l">
                <div className="flex h-20 items-center px-8 border-b border-border/40">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-smooth">
                            <BookOpen className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-xl tracking-tight gradient-text">OpenShelf</span>
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center justify-between group px-4 py-3 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-smooth"
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className="h-5 w-5" />
                                <span className="font-medium">{item.label}</span>
                            </div>
                            <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-smooth rtl:rotate-180 rtl:group-hover:-translate-x-0 rtl:group-hover:translate-x-2" />
                        </Link>
                    ))}
                </div>

                <div className="p-6 mt-auto border-t border-border/40">
                    <div className="glass rounded-2xl p-4 flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {session?.user?.name?.[0] || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{session?.user?.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
                        </div>
                    </div>
                    <SignOutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-72 rtl:md:ml-0 rtl:md:mr-72 min-h-screen">
                <div className="container py-8 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
