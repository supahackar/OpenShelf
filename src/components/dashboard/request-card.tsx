"use client"

import { Link } from "@/i18n/routing"
import { Request, BookListing, User, RequestStatus } from "@prisma/client"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, Check, X, Loader2 } from "lucide-react"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { updateRequestStatus } from "@/lib/actions/requests"

interface RequestCardProps {
    request: Request & {
        listing: BookListing
        requester: User
    }
    isDonor: boolean
}

export function RequestCard({ request, isDonor }: RequestCardProps) {
    const t = useTranslations("Requests")
    const [loading, setLoading] = useState<string | null>(null)

    const handleStatusUpdate = async (status: RequestStatus) => {
        setLoading(status)
        await updateRequestStatus(request.id, status)
        setLoading(null)
    }

    const statusColors = {
        PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        APPROVED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
        COMPLETED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        CANCELLED: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                        <CardTitle className="text-base font-bold">
                            {request.listing.title}
                        </CardTitle>
                    </div>
                    <Badge variant="outline" className={statusColors[request.status]}>
                        {request.status}
                    </Badge>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground">
                        {isDonor
                            ? t("requestedBy", { name: request.requester.name || "" })
                            : t("sent")} • {request.createdAt ? formatDistanceToNow(new Date(request.createdAt)) : ""}
                    </div>
                </CardContent>
                {isDonor && request.status === "PENDING" && (
                    <CardFooter className="flex gap-2 pt-2">
                        <Button
                            size="sm"
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => handleStatusUpdate("APPROVED")}
                            disabled={!!loading}
                        >
                            {loading === "APPROVED" ? <Loader2 className="h-4 w-4 animate-spin rtl:mr-0 rtl:ml-2" /> : <Check className="mr-2 h-4 w-4 rtl:mr-0 rtl:ml-2" />}
                            {t("approve")}
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            className="flex-1"
                            onClick={() => handleStatusUpdate("REJECTED")}
                            disabled={!!loading}
                        >
                            {loading === "REJECTED" ? <Loader2 className="h-4 w-4 animate-spin rtl:mr-0 rtl:ml-2" /> : <X className="mr-2 h-4 w-4 rtl:mr-0 rtl:ml-2" />}
                            {t("reject")}
                        </Button>
                    </CardFooter>
                )}
                {request.status === "APPROVED" && (
                    <CardFooter className="pt-2">
                        <Link href={`/dashboard/messages`} className="w-full">
                            <Button variant="outline" size="sm" className="w-full">
                                <MessageSquare className="mr-2 h-4 w-4 rtl:mr-0 rtl:ml-2" />
                                {t("message")}
                            </Button>
                        </Link>
                    </CardFooter>
                )}
            </Card>
        </motion.div>
    )
}
