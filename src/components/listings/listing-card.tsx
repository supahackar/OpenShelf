"use client"

import { Link } from "@/i18n/routing"
import Image from "next/image"
import { BookListing, Category, CampusLocation, ListingImage } from "@prisma/client"
import { formatDistanceToNow } from "date-fns"
import { MapPin, Book, Clock } from "lucide-react"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface ListingCardProps {
    listing: BookListing & {
        category: Category
        location: CampusLocation
        images: ListingImage[]
    }
}

export function ListingCard({ listing }: ListingCardProps) {
    const t = useTranslations("NewListing")
    const commonT = useTranslations("Common")

    const conditionColors: Record<string, string> = {
        NEW: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        LIKE_NEW: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        GOOD: "bg-sky-500/10 text-sky-500 border-sky-500/20",
        FAIR: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        POOR: "bg-red-500/10 text-red-500 border-red-500/20",
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <Link href={`/book/${listing.id}`}>
                <Card className="group h-full overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm transition-smooth hover:shadow-2xl hover:shadow-primary/10">
                    <div className="aspect-[4/5] relative w-full overflow-hidden bg-muted">
                        {listing.images[0]?.url ? (
                            <Image
                                src={listing.images[0].url}
                                alt={listing.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground/20">
                                <Book className="h-16 w-16" />
                            </div>
                        )}

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="absolute left-3 top-3 flex flex-col gap-2 rtl:left-auto rtl:right-3">
                            <Badge className="bg-primary/90 backdrop-blur-md border-none shadow-lg">
                                {listing.category.name}
                            </Badge>
                        </div>

                        {listing.status !== "AVAILABLE" && (
                            <div className="absolute right-3 top-3 rtl:right-auto rtl:left-3">
                                <Badge variant="secondary" className="bg-black/60 backdrop-blur-md text-white border-none">
                                    {listing.status.replace("_", " ")}
                                </Badge>
                            </div>
                        )}
                    </div>

                    <CardContent className="p-5 text-start">
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <h3 className="line-clamp-1 font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                                    {listing.title}
                                </h3>
                                <p className="line-clamp-1 text-sm text-muted-foreground font-medium">
                                    {listing.author}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Badge
                                    variant="outline"
                                    className={`text-[10px] uppercase tracking-wider font-bold ${conditionColors[listing.condition] || ""}`}
                                >
                                    {t(`conditions.${listing.condition}`)}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="px-5 pb-5 pt-0 text-xs text-muted-foreground">
                        <div className="flex w-full items-center justify-between border-t border-border/40 pt-4">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-primary" />
                                <span className="line-clamp-1 font-medium">{listing.location.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{formatDistanceToNow(new Date(listing.createdAt))}</span>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </Link>
        </motion.div>
    )
}
