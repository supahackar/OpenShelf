"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { BookOpen } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { UserNav } from "@/components/layout/user-nav"
import { useSession } from "next-auth/react"

export function Navbar() {
    const { data: session } = useSession()
    const t = useTranslations("Common")

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 group transition-smooth">
                        <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-smooth">
                            <BookOpen className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-xl tracking-tight gradient-text">
                            {t("title")}
                        </span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link href="/browse" className="text-muted-foreground hover:text-primary transition-smooth">
                            {t("browse")}
                        </Link>
                        <Link href="/about" className="text-muted-foreground hover:text-primary transition-smooth">
                            {t("about")}
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 mr-2">
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>

                    {session ? (
                        <UserNav user={session.user} />
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href="/login">
                                <Button variant="ghost" size="sm" className="font-medium hover:bg-primary/10 transition-smooth">
                                    {t("login")}
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm" className="glow">{t("register")}</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
