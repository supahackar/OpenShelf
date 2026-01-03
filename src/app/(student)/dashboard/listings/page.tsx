import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ListingItem } from "@/components/listings/listing-item"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export default async function MyListingsPage() {
    const session = await auth()
    if (!session?.user) return null

    const listings = await prisma.bookListing.findMany({
        where: { donorId: session.user.id },
        orderBy: { createdAt: "desc" },
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">My Listings</h3>
                    <p className="text-sm text-muted-foreground">
                        Manage your donated books.
                    </p>
                </div>
                <Link href="/dashboard/listings/new">
                    <Button size="sm" className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Add New
                    </Button>
                </Link>
            </div>
            <div className="space-y-4">
                {listings.length === 0 ? (
                    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                        <p className="text-sm text-muted-foreground">No listings found.</p>
                    </div>
                ) : (
                    listings.map((listing) => (
                        <ListingItem key={listing.id} listing={listing} />
                    ))
                )}
            </div>
        </div>
    )
}
