"use client"

import { BookListing, ListingStatus } from "@prisma/client"
import { format } from "date-fns"
import { MoreHorizontal, Trash, Eye, CheckCircle } from "lucide-react"
import { Link } from "@/i18n/routing"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteListing, updateListingStatus } from "@/lib/actions/listings"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"

interface ListingItemProps {
    listing: BookListing
}

export function ListingItem({ listing }: ListingItemProps) {
    const t = useTranslations("MyListings")
    const [isLoading, setIsLoading] = useState(false)

    async function onDelete() {
        if (!confirm(t("confirmations.delete"))) return
        setIsLoading(true)
        await deleteListing(listing.id)
        setIsLoading(false)
    }

    async function onMarkHandedOver() {
        setIsLoading(true)
        await updateListingStatus(listing.id, ListingStatus.HANDED_OVER)
        setIsLoading(false)
    }

    return (
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="grid gap-1">
                <div className="font-semibold">
                    <Link href={`/book/${listing.id}`} className="hover:underline">
                        {listing.title}
                    </Link>
                </div>
                <div className="text-sm text-muted-foreground">
                    {listing.author} • {format(new Date(listing.createdAt), "MMM d, yyyy")}
                </div>
                <div>
                    <Badge variant={listing.status === "AVAILABLE" ? "default" : "secondary"}>
                        {t(`status.${listing.status}`)}
                    </Badge>
                </div>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">{t("actions.openMenu")}</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <Link href={`/book/${listing.id}`}>
                        <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4 rtl:mr-0 rtl:ml-2" />
                            {t("actions.view")}
                        </DropdownMenuItem>
                    </Link>
                    {listing.status !== "HANDED_OVER" && (
                        <DropdownMenuItem onClick={onMarkHandedOver} disabled={isLoading}>
                            <CheckCircle className="mr-2 h-4 w-4 rtl:mr-0 rtl:ml-2" />
                            {t("actions.markHandedOver")}
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={onDelete} className="text-red-600" disabled={isLoading}>
                        <Trash className="mr-2 h-4 w-4 rtl:mr-0 rtl:ml-2" />
                        {t("actions.delete")}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
