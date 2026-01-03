import { prisma } from "@/lib/prisma"
import { ListingCard } from "@/components/listings/listing-card"
import { SearchFilters } from "@/components/listings/search-filters"
import { Condition, ListingStatus } from "@prisma/client"

interface BrowsePageProps {
    searchParams: Promise<{
        q?: string
        category?: string
        condition?: string
        location?: string
        page?: string
    }>
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
    const params = await searchParams
    const { q, category, condition, location } = params

    const where: any = {
        status: ListingStatus.AVAILABLE,
    }

    if (q) {
        where.OR = [
            { title: { contains: q, mode: "insensitive" } },
            { author: { contains: q, mode: "insensitive" } },
            { courseCode: { contains: q, mode: "insensitive" } },
        ]
    }

    if (category) {
        where.categoryId = category
    }

    if (condition) {
        where.condition = condition as Condition
    }

    if (location) {
        where.locationId = location
    }

    const listings = await prisma.bookListing.findMany({
        where,
        include: {
            category: true,
            location: true,
            images: true,
        },
        orderBy: { createdAt: "desc" },
        take: 20, // Simple pagination limit for now
    })

    const categories = await prisma.category.findMany()
    const locations = await prisma.campusLocation.findMany()

    return (
        <div className="container py-8">
            <div className="mb-8 space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">Browse Books</h1>
                <p className="text-muted-foreground">
                    Find textbooks and course materials from other students.
                </p>
                <SearchFilters
                    categories={categories}
                    locations={locations}
                    initialValues={params}
                />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {listings.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        No books found matching your criteria.
                    </div>
                ) : (
                    listings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                    ))
                )}
            </div>
        </div>
    )
}
