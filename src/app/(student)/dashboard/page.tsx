import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Inbox, MessageSquare } from "lucide-react"

export default async function DashboardPage() {
    const session = await auth()
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

    // Unread messages count (approximate for now)
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

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Listings
                        </CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{listingsCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Books you are donating
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pending Requests
                        </CardTitle>
                        <Inbox className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{requestsCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Incoming and outgoing
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Unread Messages
                        </CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{unreadMessagesCount}</div>
                        <p className="text-xs text-muted-foreground">
                            In your inbox
                        </p>
                    </CardContent>
                </Card>
            </div>
            {/* Add recent activity list here later */}
        </div>
    )
}
