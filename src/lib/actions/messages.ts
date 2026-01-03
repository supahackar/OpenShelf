"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function sendMessage(conversationId: string, content: string) {
    const session = await auth()
    if (!session?.user) return { error: "Unauthorized" }

    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { participants: true }
    })

    if (!conversation) return { error: "Conversation not found" }

    const isParticipant = conversation.participants.some(p => p.id === session.user.id)
    if (!isParticipant) return { error: "Unauthorized" }

    await prisma.message.create({
        data: {
            conversationId,
            senderId: session.user.id,
            content,
        }
    })

    revalidatePath(`/dashboard/messages/${conversationId}`)
    return { success: true }
}
