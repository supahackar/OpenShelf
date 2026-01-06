import { prisma } from "@/lib/prisma"
import { ListingCard } from "@/components/listings/listing-card"
import { SearchFilters } from "@/components/listings/search-filters"
import { Search } from "lucide-react"
import { getTranslations } from "next-intl/server"

export default async function BrowsePage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; category?: string; condition?: string; location?: string }>
}) {
    const t = await getTranslations("BrowsePage")

    return (
        <div className="container py-12 px-4 md:px-8">
            <div className="flex flex-col gap-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight gradient-text">
                        {t("title")}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        {t("description")}
                    </p>
                </div>

                <div className="glass p-6 rounded-3xl border-border/40 shadow-xl">
                    <BrowseFilters searchParams={searchParams} />
                </div>

                <BrowseList searchParams={searchParams} />
            </div>
        </div>
    )
}

async function BrowseFilters({ searchParams }: { searchParams: Promise<any> }) {
    const params = await searchParams
    const categories = await prisma.category.findMany()
    const locations = await prisma.campusLocation.findMany()

    return (
        <SearchFilters
            categories={categories}
            locations={locations}
            initialValues={params}
        />
    )
}

async function BrowseList({ searchParams }: { searchParams: Promise<any> }) {
    const params = await searchParams
    const t = await getTranslations("BrowsePage")

    const listings = await prisma.bookListing.findMany({
        where: {
            status: "AVAILABLE",
            ...(params.q && {
                OR: [
                    { title: { contains: params.q, mode: "insensitive" } },
                    { author: { contains: params.q, mode: "insensitive" } },
                    { courseCode: { contains: params.q, mode: "insensitive" } },
                ],
            }),
            ...(params.category && params.category !== "all" && { categoryId: params.category }),
            ...(params.condition && params.condition !== "all" && { condition: params.condition as any }),
            ...(params.location && params.location !== "all" && { locationId: params.location }),
        },
        include: {
            category: true,
            location: true,
            donor: true,
            images: true,
        },
        orderBy: { createdAt: "desc" },
    })

    if (listings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center glass rounded-3xl border-border/40">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Search className="h-10 w-10 text-primary/40" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{t("noResults")}</h3>
                <p className="text-muted-foreground max-w-xs">
                    {t("noResultsDesc")}
                </p>
            </div>
        )
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
            ))}
        </div>
    )
}
