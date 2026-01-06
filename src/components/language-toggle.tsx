"use client"

import * as React from "react"
import { Languages, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLocale } from "next-intl"
import { useRouter, usePathname } from "@/i18n/routing"

export function LanguageToggle() {
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    const switchLanguage = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-primary/10 transition-smooth">
                    <Languages className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Toggle language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass border-border/40">
                <DropdownMenuItem
                    onClick={() => switchLanguage("en")}
                    className="flex items-center justify-between gap-2 cursor-pointer"
                >
                    <span>English</span>
                    {locale === "en" && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => switchLanguage("ar")}
                    className="flex items-center justify-between gap-2 cursor-pointer"
                >
                    <span>العربية</span>
                    {locale === "ar" && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
