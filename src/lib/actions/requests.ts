"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { ListingStatus, RequestStatus } from "@prisma/client"

export async function createRequest(listingId: string, message: string) {
    const session = await auth()
    if (!session?.user) return { error: "Unauthorized" }

    const listing = await prisma.bookListing.findUnique({
        where: { id: listingId },
    })

    if (!listing) return { error: "Listing not found" }
    if (listing.donorId === session.user.id) return { error: "You cannot request your own book" }
    if (listing.status !== ListingStatus.AVAILABLE) return { error: "Book is not available" }

    // Check if already requested
    const existingRequest = await prisma.request.findFirst({
        where: {
            listingId,
            requesterId: session.user.id,
            status: { not: RequestStatus.CANCELLED }
        }
    })

    if (existingRequest) return { error: "You have already requested this book" }

    // Create request
    const request = await prisma.request.create({
        data: {
            listingId,
            requesterId: session.user.id,
            message,
            status: RequestStatus.PENDING,
        },
    })

    // Create conversation
    const conversation = await prisma.conversation.create({
        data: {
            participants: {
                connect: [
                    { id: session.user.id },
                    { id: listing.donorId }
                ]
            },
            requestId: request.id
        }
    })

    // Add initial message
    await prisma.message.create({
        data: {
            conversationId: conversation.id,
            senderId: session.user.id,
            content: message,
        }
    })

    revalidatePath(`/book/${listingId}`)
    revalidatePath("/dashboard/requests")
    return { success: true }
}

export async function updateRequestStatus(requestId: string, status: RequestStatus) {
    const session = await auth()
    if (!session?.user) return { error: "Unauthorized" }

    const request = await prisma.request.findUnique({
        where: { id: requestId },
        include: { listing: true }
    })

    if (!request) return { error: "Request not found" }

    // Only donor can approve/reject
    if (request.listing.donorId !== session.user.id) {
        return { error: "Unauthorized" }
    }

    await prisma.request.update({
        where: { id: requestId },
        data: { status }
    })

    if (status === RequestStatus.APPROVED) {
        // Update listing status to REQUESTED
        await prisma.bookListing.update({
            where: { id: request.listingId },
            data: { status: ListingStatus.REQUESTED }
        })
    }

    revalidatePath("/dashboard/requests")
    return { success: true }
}
