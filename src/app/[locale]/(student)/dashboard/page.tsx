import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Inbox, MessageSquare, PlusCircle, Search, ArrowRight } from "lucide-react"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getTranslations } from "next-intl/server"

export default async function DashboardPage() {
    const session = await auth()
    const t = await getTranslations("Dashboard")
    const nav = await getTranslations("Nav")

    if (!session?.user) return null

    const listingsCount = await prisma.bookListing.count({
        where: { donorId: session.user.id },
    })

    const requestsCount = await prisma.request.count({
        where: {
            OR: [
                { requesterId: session.user.id },
                { listing: { donorId: session.user.id } }
            ],
            status: "PENDING"
        },
    })

    const unreadMessagesCount = await prisma.message.count({
        where: {
            conversation: {
                participants: {
                    some: { id: session.user.id }
                }
            },
            senderId: { not: session.user.id },
            read: false
        }
    })

    const stats = [
        {
            title: t("stats.active"),
            value: listingsCount,
            description: "Books you are donating",
            icon: BookOpen,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            title: t("stats.pending"),
            value: requestsCount,
            description: "Incoming and outgoing",
            icon: Inbox,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
        },
        {
            title: t("stats.unread"),
            value: unreadMessagesCount,
            description: "In your inbox",
            icon: MessageSquare,
            color: "text-pink-500",
            bg: "bg-pink-500/10",
        },
    ]

    return (
        <div className="space-y-10">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                        {t("welcome")} <span className="gradient-text">{session.user.name?.split(" ")[0]}!</span>
                    </h1>
                    <p className="text-muted-foreground">
                        {t("subtitle")}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/listings/new">
                        <Button className="glow gap-2 h-11 px-6">
                            <PlusCircle className="h-4 w-4" />
                            {nav("newListing")}
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                {stats.map((stat) => (
                    <Card key={stat.title} className="overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm hover-lift">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={cn("p-2 rounded-lg", stat.bg)}>
                                <stat.icon className={cn("h-4 w-4", stat.color)} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid gap-8 lg:grid-cols-7">
                <div className="lg:col-span-4 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">{t("quickActions.title")}</h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Link href="/browse" className="group">
                            <div className="glass p-6 rounded-2xl border-border/40 hover:border-primary/40 transition-smooth h-full">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
                                    <Search className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold mb-1">{t("quickActions.find.title")}</h3>
                                <p className="text-sm text-muted-foreground">{t("quickActions.find.desc")}</p>
                            </div>
                        </Link>
                        <Link href="/dashboard/listings/new" className="group">
                            <div className="glass p-6 rounded-2xl border-border/40 hover:border-primary/40 transition-smooth h-full">
                                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
                                    <PlusCircle className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold mb-1">{t("quickActions.donate.title")}</h3>
                                <p className="text-sm text-muted-foreground">{t("quickActions.donate.desc")}</p>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">{t("recentActivity")}</h2>
                        <Link href="/dashboard/activity" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
                            {t("viewAll")} <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                        </Link>
                    </div>
                    <div className="glass rounded-2xl border-border/40 divide-y divide-border/40">
                        <div className="p-4 text-center py-12">
                            <p className="text-sm text-muted-foreground">{t("noActivity")}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
