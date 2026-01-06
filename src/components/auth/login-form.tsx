"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { signIn } from "next-auth/react"
import { useRouter } from "@/i18n/routing"
import { Loader2, Mail, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

const createFormSchema = (t: any) => z.object({
    email: z.string().email({
        message: t("errors.email"),
    }),
    password: z.string().min(6, {
        message: t("errors.password"),
    }),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const router = useRouter()
    const t = useTranslations("Auth.login")
    const common = useTranslations("Common")
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false)

    const formSchema = React.useMemo(() => createFormSchema(t), [t])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        const result = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        })

        setIsLoading(false)

        if (result?.error) {
            console.error(result.error)
            // In a real app, use a toast here
            alert(t("errors.invalid"))
        } else {
            router.push("/dashboard")
            router.refresh()
        }
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label className="sr-only" htmlFor="email">
                            {common("email")}
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
                            <Input
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                disabled={isLoading || isGoogleLoading}
                                className="pl-10 rtl:pl-3 rtl:pr-10 h-12 bg-background/50 border-border/40 focus:ring-primary/20 transition-smooth"
                                {...form.register("email")}
                            />
                        </div>
                        {form.formState.errors.email && (
                            <p className="text-xs text-destructive font-medium ml-1">
                                {form.formState.errors.email.message}
                            </p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label className="sr-only" htmlFor="password">
                            {common("password")}
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
                            <Input
                                id="password"
                                placeholder="••••••••"
                                type="password"
                                autoCapitalize="none"
                                autoComplete="current-password"
                                disabled={isLoading || isGoogleLoading}
                                className="pl-10 rtl:pl-3 rtl:pr-10 h-12 bg-background/50 border-border/40 focus:ring-primary/20 transition-smooth"
                                {...form.register("password")}
                            />
                        </div>
                        {form.formState.errors.password && (
                            <p className="text-xs text-destructive font-medium ml-1">
                                {form.formState.errors.password.message}
                            </p>
                        )}
                    </div>
                    <Button disabled={isLoading || isGoogleLoading} className="h-12 text-base font-semibold glow">
                        {isLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {common("login")}
                    </Button>
                </div>
            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/40" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-transparent px-2 text-muted-foreground font-medium">
                        {t("orContinueWith")}
                    </span>
                </div>
            </div>
            <Button
                variant="outline"
                type="button"
                className="h-12 bg-background/50 border-border/40 hover:bg-primary/5 hover:text-primary transition-smooth"
                disabled={isLoading || isGoogleLoading}
                onClick={() => {
                    setIsGoogleLoading(true)
                    signIn("google", { callbackUrl: "/dashboard" })
                }}
            >
                {isGoogleLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                )}
                {t("google")}
            </Button>
        </div>
    )
}
