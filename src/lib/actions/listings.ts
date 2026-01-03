"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"
import { Condition, ListingStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

const listingSchema = z.object({
    title: z.string().min(3),
    author: z.string().min(2),
    edition: z.string().optional(),
    courseCode: z.string().optional(),
    condition: z.nativeEnum(Condition),
    description: z.string().min(10),
    categoryId: z.string(),
    locationId: z.string(),
    images: z.array(z.string()),
})

export async function createListing(data: z.infer<typeof listingSchema>) {
    const session = await auth()
    if (!session?.user) {
        return { error: "Unauthorized" }
    }

    const { images, ...rest } = listingSchema.parse(data)

    await prisma.bookListing.create({
        data: {
            ...rest,
            images: {
                create: images.map(url => ({ url }))
            },
            donorId: session.user.id,
            status: ListingStatus.AVAILABLE,
        },
    })

    revalidatePath("/dashboard/listings")
    revalidatePath("/browse")
    return { success: true }
}

export async function deleteListing(listingId: string) {
    const session = await auth()
    if (!session?.user) return { error: "Unauthorized" }

    const listing = await prisma.bookListing.findUnique({
        where: { id: listingId },
    })

    if (!listing) return { error: "Not found" }

    if (listing.donorId !== session.user.id && session.user.role !== "ADMIN") {
        return { error: "Unauthorized" }
    }

    await prisma.bookListing.delete({
        where: { id: listingId },
    })

    revalidatePath("/dashboard/listings")
    revalidatePath("/browse")
    return { success: true }
}

export async function updateListingStatus(listingId: string, status: ListingStatus) {
    const session = await auth()
    if (!session?.user) return { error: "Unauthorized" }

    const listing = await prisma.bookListing.findUnique({
        where: { id: listingId },
    })

    if (!listing || listing.donorId !== session.user.id) {
        return { error: "Unauthorized" }
    }

    await prisma.bookListing.update({
        where: { id: listingId },
        data: { status },
    })

    revalidatePath("/dashboard/listings")
    revalidatePath("/browse")
    return { success: true }
}
