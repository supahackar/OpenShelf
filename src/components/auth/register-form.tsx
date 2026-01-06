"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { signIn } from "next-auth/react"
import { useRouter } from "@/i18n/routing"
import { Loader2, User, Mail, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { registerUser } from "@/lib/actions/auth"
import { useTranslations } from "next-intl"

const createFormSchema = (t: any) => z.object({
    name: z.string().min(2, {
        message: t("errors.name"),
    }),
    email: z.string().email({
        message: t("errors.email"),
    }),
    password: z.string().min(6, {
        message: t("errors.password"),
    }),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserRegisterForm({ className, ...props }: UserAuthFormProps) {
    const router = useRouter()
    const t = useTranslations("Auth.register")
    const common = useTranslations("Common")
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const formSchema = React.useMemo(() => createFormSchema(t), [t])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        const res = await registerUser(values)

        if (res.error) {
            setIsLoading(false)
            // In a real app, use a toast here
            alert(res.error)
            return
        }

        const result = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        })

        setIsLoading(false)

        if (result?.error) {
            console.error(result.error)
            alert(t("errors.signIn"))
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
                        <Label className="sr-only" htmlFor="name">
                            {common("name")}
                        </Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
                            <Input
                                id="name"
                                placeholder={common("name")}
                                type="text"
                                autoCapitalize="words"
                                autoComplete="name"
                                autoCorrect="off"
                                disabled={isLoading}
                                className="pl-10 rtl:pl-3 rtl:pr-10 h-12 bg-background/50 border-border/40 focus:ring-primary/20 transition-smooth"
                                {...form.register("name")}
                            />
                        </div>
                        {form.formState.errors.name && (
                            <p className="text-xs text-destructive font-medium ml-1">
                                {form.formState.errors.name.message}
                            </p>
                        )}
                    </div>
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
                                disabled={isLoading}
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
                                autoComplete="new-password"
                                disabled={isLoading}
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
                    <Button disabled={isLoading} className="h-12 text-base font-semibold glow">
                        {isLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {common("register")}
                    </Button>
                </div>
            </form>
        </div>
    )
}
