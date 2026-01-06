import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ChatWindow } from "@/components/dashboard/chat-window"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

interface ConversationPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function ConversationPage({ params }: ConversationPageProps) {
    const { id } = await params
    const session = await auth()
    const t = await getTranslations("Messages")

    if (!session?.user) return null

    const conversation = await prisma.conversation.findUnique({
        where: { id },
        include: {
            participants: true,
            messages: {
                include: { sender: true },
                orderBy: { createdAt: "asc" }
            }
        }
    })

    if (!conversation) notFound()

    const isParticipant = conversation.participants.some(p => p.id === session.user.id)
    if (!isParticipant) notFound()

    const otherParticipant = conversation.participants.find(p => p.id !== session.user.id)

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h3 className="text-lg font-medium">
                    {t("chatWith", { name: otherParticipant?.name || "" })}
                </h3>
            </div>
            <ChatWindow
                conversationId={conversation.id}
                initialMessages={conversation.messages}
                currentUserId={session.user.id}
            />
        </div>
    )
}
