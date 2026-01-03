"use client"

import { useRouter, useSearchParams } from "next/navigation"
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

interface SearchFiltersProps {
    categories: { id: string; name: string }[]
    locations: { id: string; name: string }[]
}

export function SearchFilters({ categories, locations }: SearchFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [query, setQuery] = useState(searchParams.get("q") || "")
    const [category, setCategory] = useState(searchParams.get("category") || "all")
    const [condition, setCondition] = useState(searchParams.get("condition") || "all")
    const [location, setLocation] = useState(searchParams.get("location") || "all")

    function onSearch() {
        const params = new URLSearchParams()
        if (query) params.set("q", query)
        if (category && category !== "all") params.set("category", category)
        if (condition && condition !== "all") params.set("condition", condition)
        if (location && location !== "all") params.set("location", location)

        router.push(`/browse?${params.toString()}`)
    }

    return (
        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-5">
            <div className="md:col-span-2 lg:col-span-2">
                <Input
                    placeholder="Search by title, author..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onSearch()}
                />
            </div>
            <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                            {c.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger>
                    <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Any Condition</SelectItem>
                    {Object.values(Condition).map((c) => (
                        <SelectItem key={c} value={c}>
                            {c.replace("_", " ")}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <div className="flex gap-2">
                <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Any Location</SelectItem>
                        {locations.map((l) => (
                            <SelectItem key={l.id} value={l.id}>
                                {l.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button onClick={onSearch}>Search</Button>
            </div>
        </div>
    )
}
