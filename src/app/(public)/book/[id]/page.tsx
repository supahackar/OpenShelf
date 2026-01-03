import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { notFound } from "next/navigation"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { MapPin, User, Book, Calendar } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RequestButton } from "@/components/listings/request-button"
import { RequestStatus } from "@prisma/client"

interface BookPageProps {
    params: {
        id: string
    }
}

export default async function BookPage({ params }: BookPageProps) {
    const { id } = await params
    const session = await auth()

    const listing = await prisma.bookListing.findUnique({
        where: { id },
        include: {
            donor: true,
            category: true,
            location: true,
            images: true,
            requests: {
                where: { requesterId: session?.user?.id, status: { not: RequestStatus.CANCELLED } }
            }
        },
    })

    if (!listing) {
        notFound()
    }

    const isRequested = listing.requests.length > 0

    return (
        <div className="container py-8 md:py-12">
            <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
                <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
                    {listing.images[0]?.url ? (
                        <Image
                            src={listing.images[0].url}
                            alt={listing.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            <Book className="h-24 w-24 opacity-20" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-6">
                    <div>
                        <div className="mb-4 flex items-center gap-2">
                            <Badge variant="outline">{listing.category.name}</Badge>
                            <Badge variant={listing.status === "AVAILABLE" ? "default" : "secondary"}>
                                {listing.status}
                            </Badge>
                        </div>
                        <h1 className="text-3xl font-bold md:text-4xl">{listing.title}</h1>
                        <p className="mt-2 text-xl text-muted-foreground">{listing.author}</p>
                    </div>

                    <div className="grid gap-4 rounded-lg border p-4 text-sm">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>Donated by {listing.donor.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{listing.location.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Listed {formatDistanceToNow(new Date(listing.createdAt))} ago</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">Condition:</span>
                            <span>{listing.condition.replace("_", " ")}</span>
                        </div>
                        {listing.courseCode && (
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Course Code:</span>
                                <span>{listing.courseCode}</span>
                            </div>
                        )}
                        {listing.edition && (
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Edition:</span>
                                <span>{listing.edition}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold">Description</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">{listing.description}</p>
                    </div>

                    <div className="mt-auto">
                        <RequestButton
                            listingId={listing.id}
                            donorId={listing.donorId}
                            currentUserId={session?.user?.id}
                            isRequested={isRequested}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
