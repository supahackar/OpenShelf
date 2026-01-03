import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { RequestCard } from "@/components/dashboard/request-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function RequestsPage() {
    const session = await auth()
    if (!session?.user) return null

    const incomingRequests = await prisma.request.findMany({
        where: {
            listing: { donorId: session.user.id }
        },
        include: {
            listing: true,
            requester: true
        },
        orderBy: { createdAt: "desc" }
    })

    const outgoingRequests = await prisma.request.findMany({
        where: {
            requesterId: session.user.id
        },
        include: {
            listing: true,
            requester: true
        },
        orderBy: { createdAt: "desc" }
    })

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Requests</h3>
                <p className="text-sm text-muted-foreground">
                    Manage incoming requests for your books and track requests you&apos;ve made.
                </p>
            </div>

            <Tabs defaultValue="incoming" className="w-full">
                <TabsList>
                    <TabsTrigger value="incoming">Incoming ({incomingRequests.length})</TabsTrigger>
                    <TabsTrigger value="outgoing">Outgoing ({outgoingRequests.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="incoming" className="space-y-4 mt-4">
                    {incomingRequests.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No incoming requests.</p>
                    ) : (
                        incomingRequests.map(req => (
                            <RequestCard key={req.id} request={req} isDonor={true} />
                        ))
                    )}
                </TabsContent>
                <TabsContent value="outgoing" className="space-y-4 mt-4">
                    {outgoingRequests.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No outgoing requests.</p>
                    ) : (
                        outgoingRequests.map(req => (
                            <RequestCard key={req.id} request={req} isDonor={false} />
                        ))
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
