import { prisma } from "@/lib/prisma"
import { ListingItem } from "@/components/listings/listing-item"

export default async function AdminListingsPage() {
    const listings = await prisma.bookListing.findMany({
        orderBy: { createdAt: "desc" },
        include: { donor: true }
    })

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">All Listings</h3>
                <p className="text-sm text-muted-foreground">
                    Manage all book listings.
                </p>
            </div>
            <div className="space-y-4">
                {listings.map((listing) => (
                    <div key={listing.id} className="flex flex-col gap-1">
                        <p className="text-xs text-muted-foreground">Donor: {listing.donor.name} ({listing.donor.email})</p>
                        <ListingItem listing={listing} />
                    </div>
                ))}
            </div>
        </div>
    )
}
