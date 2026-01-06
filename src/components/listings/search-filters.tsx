"use client"

import { useRouter, usePathname } from "@/i18n/routing"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Condition } from "@prisma/client"
import { useState } from "react"
import { Search, MapPin, Tag, Filter } from "lucide-react"
import { useTranslations } from "next-intl"

interface SearchFiltersProps {
    categories: { id: string; name: string }[]
    locations: { id: string; name: string }[]
    initialValues?: {
        q?: string
        category?: string
        condition?: string
        location?: string
    }
}

export function SearchFilters({ categories, locations, initialValues = {} }: SearchFiltersProps) {
    const router = useRouter()
    const pathname = usePathname()
    const t = useTranslations("BrowsePage")

    const [query, setQuery] = useState(initialValues.q || "")
    const [category, setCategory] = useState(initialValues.category || "all")
    const [condition, setCondition] = useState(initialValues.condition || "all")
    const [location, setLocation] = useState(initialValues.location || "all")

    function onSearch() {
        const params = new URLSearchParams()
        if (query) params.set("q", query)
        if (category && category !== "all") params.set("category", category)
        if (condition && condition !== "all") params.set("condition", condition)
        if (location && location !== "all") params.set("location", location)

        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-5">
                <div className="md:col-span-2 lg:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
                    <Input
                        placeholder={t("searchPlaceholder")}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onSearch()}
                        className="pl-10 h-12 bg-background/50 border-border/40 focus:ring-primary/20 transition-smooth rtl:pl-3 rtl:pr-10"
                    />
                </div>

                <div className="relative">
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="h-12 bg-background/50 border-border/40">
                            <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder={t("categoryPlaceholder")} />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t("categoryPlaceholder")}</SelectItem>
                            {categories.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                    {c.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="relative">
                    <Select value={condition} onValueChange={setCondition}>
                        <SelectTrigger className="h-12 bg-background/50 border-border/40">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder={t("conditionPlaceholder")} />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t("conditionPlaceholder")}</SelectItem>
                            {Object.values(Condition).map((c) => (
                                <SelectItem key={c} value={c}>
                                    {useTranslations("NewListing")(`conditions.${c}`)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-2">
                    <Select value={location} onValueChange={setLocation}>
                        <SelectTrigger className="h-12 bg-background/50 border-border/40 flex-1">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder={t("locationPlaceholder")} />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t("anyLocation")}</SelectItem>
                            {locations.map((l) => (
                                <SelectItem key={l.id} value={l.id}>
                                    {l.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={onSearch} className="h-12 px-6 glow">
                        {t("filterButton")}
                    </Button>
                </div>
            </div>
        </div>
    )
}
