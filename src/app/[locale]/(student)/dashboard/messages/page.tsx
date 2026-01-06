import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Link } from "@/i18n/routing"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { getTranslations } from "next-intl/server"

export default async function MessagesPage() {
    const session = await auth()
    const t = await getTranslations("Messages")

    if (!session?.user) return null

    const conversations = await prisma.conversation.findMany({
        where: {
            participants: {
                some: { id: session.user.id }
            }
        },
        include: {
            participants: true,
            messages: {
                orderBy: { createdAt: "desc" },
                take: 1
            }
        },
        orderBy: { updatedAt: "desc" }
    })

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">{t("title")}</h3>
                <p className="text-sm text-muted-foreground">
                    {t("description")}
                </p>
            </div>

            <div className="space-y-2">
                {conversations.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t("noMessages")}</p>
                ) : (
                    conversations.map(conv => {
                        const otherParticipant = conv.participants.find(p => p.id !== session.user.id)
                        const lastMessage = conv.messages[0]

                        return (
                            <Link key={conv.id} href={`/dashboard/messages/${conv.id}`}>
                                <div className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                                    <Avatar>
                                        <AvatarImage src={otherParticipant?.image || ""} />
                                        <AvatarFallback>{otherParticipant?.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">{otherParticipant?.name}</h4>
                                            {lastMessage && (
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(lastMessage.createdAt))}
                                                </span>
                                            )}
                                        </div>
                                        <p className="truncate text-sm text-muted-foreground">
                                            {lastMessage?.content || t("noMessages")}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                )}
            </div>
        </div>
    )
}
