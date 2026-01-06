import { Link } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"

export async function Footer() {
    const t = await getTranslations("Common")
    const year = new Date().getFullYear()

    return (
        <footer className="border-t border-border/40 bg-card/30 backdrop-blur-md">
            <div className="container py-8 md:py-12">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-4">
                        <Link href="/" className="text-xl font-bold tracking-tight hover:text-primary transition-colors">
                            Open<span className="text-primary text-glow">Shelf</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {t("footer.description")}
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">{t("footer.links")}</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/browse" className="hover:text-primary transition-colors">{t("footer.browse")}</Link></li>
                            <li><Link href="/dashboard" className="hover:text-primary transition-colors">{t("footer.dashboard")}</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition-colors">{t("about")}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">{t("footer.support")}</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary transition-colors">{t("footer.help")}</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition-colors">{t("footer.privacy")}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">{t("footer.contact")}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {t("footer.contactText")}
                        </p>
                    </div>
                </div>
                <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
                    <p>© {year} OpenShelf. {t("footer.rights")}</p>
                </div>
            </div>
        </footer>
    )
}
