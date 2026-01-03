import Link from "next/link"
import Image from "next/image"
import { BookListing, Category, CampusLocation, ListingImage } from "@prisma/client"
import { formatDistanceToNow } from "date-fns"
import { MapPin, Book } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface ListingCardProps {
    listing: BookListing & {
        category: Category
        location: CampusLocation
        images: ListingImage[]
    }
}

export function ListingCard({ listing }: ListingCardProps) {
    return (
        <Link href={`/book/${listing.id}`}>
            <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                <div className="aspect-[3/4] relative w-full overflow-hidden bg-muted">
                    {listing.images[0]?.url ? (
                        <Image
                            src={listing.images[0].url}
                            alt={listing.title}
                            fill
                            className="object-cover transition-transform hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            <Book className="h-12 w-12 opacity-20" />
                        </div>
                    )}
                    {listing.status !== "AVAILABLE" && (
                        <div className="absolute right-2 top-2">
                            <Badge variant="secondary">{listing.status}</Badge>
                        </div>
                    )}
                </div>
                <CardHeader className="p-4">
                    <div className="space-y-1">
                        <h3 className="line-clamp-1 font-semibold leading-none tracking-tight">
                            {listing.title}
                        </h3>
                        <p className="line-clamp-1 text-sm text-muted-foreground">
                            {listing.author}
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs font-normal">
                            {listing.category.name}
                        </Badge>
                        <Badge variant="outline" className="text-xs font-normal">
                            {listing.condition.replace("_", " ")}
                        </Badge>
                    </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
                    <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="line-clamp-1 max-w-[100px]">{listing.location.name}</span>
                        </div>
                        <span>{formatDistanceToNow(new Date(listing.createdAt))} ago</span>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    )
}
