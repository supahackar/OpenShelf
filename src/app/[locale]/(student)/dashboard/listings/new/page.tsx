import { prisma } from "@/lib/prisma"
import { CreateListingForm } from "@/components/listings/create-listing-form"
import { getTranslations } from "next-intl/server"

export default async function NewListingPage() {
    const categories = await prisma.category.findMany()
    const locations = await prisma.campusLocation.findMany()
    const t = await getTranslations("NewListing")

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">{t("title")}</h3>
                <p className="text-sm text-muted-foreground">
                    {t("description")}
                </p>
            </div>
            <CreateListingForm categories={categories} locations={locations} />
        </div>
    )
}
