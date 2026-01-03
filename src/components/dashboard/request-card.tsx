"use client"

import { Request, BookListing, User, RequestStatus } from "@prisma/client"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { updateRequestStatus } from "@/lib/actions/requests"
import { Loader2 } from "lucide-react"

interface RequestCardProps {
    request: Request & {
        listing: BookListing
        requester: User
    }
    isDonor: boolean
}

export function RequestCard({ request, isDonor }: RequestCardProps) {
    const [isLoading, setIsLoading] = useState(false)

    async function onUpdateStatus(status: RequestStatus) {
        setIsLoading(true)
        await updateRequestStatus(request.id, status)
        setIsLoading(false)
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                        <Link href={`/book/${request.listingId}`} className="hover:underline">
                            {request.listing.title}
                        </Link>
                    </CardTitle>
                    <Badge variant={request.status === "PENDING" ? "outline" : "default"}>
                        {request.status}
                    </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                    {isDonor ? `Requested by ${request.requester.name}` : `Request sent`} • {formatDistanceToNow(new Date(request.createdAt))} ago
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm">{request.message}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                {isDonor && request.status === "PENDING" && (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateStatus(RequestStatus.REJECTED)}
                            disabled={isLoading}
                        >
                            Reject
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => onUpdateStatus(RequestStatus.APPROVED)}
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Approve
                        </Button>
                    </>
                )}
                {request.status === "APPROVED" && (
                    <Link href={`/dashboard/messages`}>
                        <Button size="sm" variant="outline">Message</Button>
                    </Link>
                )}
            </CardFooter>
        </Card>
    )
}
