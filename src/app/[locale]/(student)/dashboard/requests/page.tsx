import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { RequestCard } from "@/components/dashboard/request-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTranslations } from "next-intl/server"

export default async function RequestsPage() {
    const session = await auth()
    const t = await getTranslations("Requests")

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
                <h3 className="text-lg font-medium">{t("title")}</h3>
                <p className="text-sm text-muted-foreground">
                    {t("description")}
                </p>
            </div>

            <Tabs defaultValue="incoming" className="w-full">
                <TabsList>
                    <TabsTrigger value="incoming">{t("tabs.incoming")} ({incomingRequests.length})</TabsTrigger>
                    <TabsTrigger value="outgoing">{t("tabs.outgoing")} ({outgoingRequests.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="incoming" className="space-y-4 mt-4">
                    {incomingRequests.length === 0 ? (
                        <p className="text-sm text-muted-foreground">{t("noIncoming")}</p>
                    ) : (
                        incomingRequests.map(req => (
                            <RequestCard key={req.id} request={req} isDonor={true} />
                        ))
                    )}
                </TabsContent>
                <TabsContent value="outgoing" className="space-y-4 mt-4">
                    {outgoingRequests.length === 0 ? (
                        <p className="text-sm text-muted-foreground">{t("noOutgoing")}</p>
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
