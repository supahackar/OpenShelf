"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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

interface RequestButtonProps {
    listingId: string
    donorId: string
    currentUserId?: string
    isRequested?: boolean
}

export function RequestButton({ listingId, donorId, currentUserId, isRequested }: RequestButtonProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("Hi, I'm interested in this book. Is it still available?")

    if (!currentUserId) {
        return (
            <Button onClick={() => router.push("/login")}>
                Log in to Request
            </Button>
        )
    }

    if (currentUserId === donorId) {
        return (
            <Button variant="secondary" disabled>
                Your Listing
            </Button>
        )
    }

    if (isRequested) {
        return (
            <Button variant="secondary" disabled>
                Request Sent
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
                <Button size="lg">Request Book</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Request Book</DialogTitle>
                    <DialogDescription>
                        Send a message to the donor to arrange a pickup.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        className="min-h-[100px]"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={onRequest} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Request
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
