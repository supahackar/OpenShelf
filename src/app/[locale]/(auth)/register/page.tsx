import { Metadata } from "next"
import { Link } from "@/i18n/routing"
import { ChevronLeft, BookOpen } from "lucide-react"

import { UserRegisterForm } from "@/components/auth/register-form"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getTranslations } from "next-intl/server"

export const metadata: Metadata = {
    title: "Create an account | OpenShelf",
    description: "Create an account to get started",
}

export default async function RegisterPage() {
    const t = await getTranslations("Auth.register")
    const common = await getTranslations("Common")

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background/50">
            {/* Background Gradients */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-[10%] right-[10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute bottom-[10%] left-[10%] h-[40%] w-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
            </div>

            <Link
                href="/"
                className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "absolute left-4 top-4 md:left-8 md:top-8 gap-2 hover:bg-primary/10 transition-smooth"
                )}
            >
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                {(await getTranslations("Auth.login"))("back")}
            </Link>

            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] px-4">
                <div className="glass p-8 rounded-3xl shadow-2xl shadow-primary/10 space-y-6">
                    <div className="flex flex-col space-y-2 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight gradient-text">
                            {t("title")}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {t("subtitle")}
                        </p>
                    </div>

                    <UserRegisterForm />

                    <p className="text-center text-sm text-muted-foreground">
                        <Link
                            href="/login"
                            className="hover:text-primary underline underline-offset-4 transition-colors"
                        >
                            {t("haveAccount")} {common("login")}
                        </Link>
                    </p>
                </div>

                <p className="px-8 text-center text-xs text-muted-foreground/60">
                    {t("terms")}{" "}
                    <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                        {common("terms")}
                    </Link>{" "}
                    {t("and")}{" "}
                    <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                        {common("privacy")}
                    </Link>
                    .
                </p>
            </div>
        </div>
    )
}
