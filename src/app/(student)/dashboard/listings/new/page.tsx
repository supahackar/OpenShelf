import { prisma } from "@/lib/prisma"
import { CreateListingForm } from "@/components/listings/create-listing-form"

export default async function NewListingPage() {
    const categories = await prisma.category.findMany()
    const locations = await prisma.campusLocation.findMany()

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Create a Listing</h3>
                <p className="text-sm text-muted-foreground">
                    Fill in the details about the book you want to donate.
                </p>
            </div>
            <CreateListingForm categories={categories} locations={locations} />
        </div>
    )
}
