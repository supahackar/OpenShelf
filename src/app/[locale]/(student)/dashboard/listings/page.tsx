import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ListingItem } from "@/components/listings/listing-item"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { PlusCircle } from "lucide-react"
import { getTranslations } from "next-intl/server"

export default async function MyListingsPage() {
    const session = await auth()
    const t = await getTranslations("MyListings")

    if (!session?.user) return null

    const listings = await prisma.bookListing.findMany({
        where: { donorId: session.user.id },
        orderBy: { createdAt: "desc" },
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">{t("title")}</h3>
                    <p className="text-sm text-muted-foreground">
                        {t("description")}
                    </p>
                </div>
                <Link href="/dashboard/listings/new">
                    <Button size="sm" className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        {t("addNew")}
                    </Button>
                </Link>
            </div>
            <div className="space-y-4">
                {listings.length === 0 ? (
                    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                        <p className="text-sm text-muted-foreground">{t("noListings")}</p>
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
