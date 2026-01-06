"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { createRequest } from "@/lib/actions/requests"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

interface RequestButtonProps {
    listingId: string
    donorId: string
    currentUserId?: string
    isRequested?: boolean
}

export function RequestButton({ listingId, donorId, currentUserId, isRequested }: RequestButtonProps) {
    const router = useRouter()
    const t = useTranslations("BookDetails")
    const authT = useTranslations("Auth")

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(t("requestModal.placeholder"))

    if (!currentUserId) {
        return (
            <Button onClick={() => router.push("/login")}>
                {authT("login.title")}
            </Button>
        )
    }

    if (currentUserId === donorId) {
        return (
            <Button variant="secondary" disabled>
                {t("yourListing")}
            </Button>
        )
    }

    if (isRequested) {
        return (
            <Button variant="secondary" disabled>
                {t("alreadyRequested")}
            </Button>
        )
    }

    async function onRequest() {
        setLoading(true)
        const res = await createRequest(listingId, message)
        setLoading(false)

        if (res.error) {
            alert(res.error)
        } else {
            setOpen(false)
            router.refresh()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="lg">{t("request")}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("requestModal.title")}</DialogTitle>
                    <DialogDescription>
                        {t("requestModal.description")}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t("requestModal.placeholder")}
                        className="min-h-[100px]"
                    />
                </div>
                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                        {t("requestModal.cancel") || "Cancel"}
                    </Button>
                    <Button onClick={onRequest} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin rtl:mr-0 rtl:ml-2" />}
                        {t("requestModal.submit")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
