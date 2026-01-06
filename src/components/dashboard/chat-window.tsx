"use client"

import { Message, User } from "@prisma/client"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sendMessage } from "@/lib/actions/messages"
import { cn } from "@/lib/utils"
import { Loader2, Send } from "lucide-react"

import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

interface ChatWindowProps {
    conversationId: string
    initialMessages: (Message & { sender: User })[]
    currentUserId: string
}

export function ChatWindow({ conversationId, initialMessages, currentUserId }: ChatWindowProps) {
    const t = useTranslations("Messages")
    const [messages, setMessages] = useState(initialMessages)
    const [inputValue, setInputValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    const router = useRouter()

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    // Update local state when props change (from router.refresh)
    useEffect(() => {
        setMessages(initialMessages)
    }, [initialMessages])

    // Simple polling for new messages (every 5 seconds)
    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh()
        }, 5000)
        return () => clearInterval(interval)
    }, [router])

    async function onSend() {
        if (!inputValue.trim()) return
        setIsLoading(true)

        // Optimistic update
        const tempId = Date.now().toString()
        const newMessage = {
            id: tempId,
            content: inputValue,
            senderId: currentUserId,
            conversationId,
            createdAt: new Date(),
            read: false,
            sender: { id: currentUserId } as User // Partial user
        }

        setMessages(prev => [...prev, newMessage as any])
        setInputValue("")

        await sendMessage(conversationId, inputValue)
        setIsLoading(false)
    }

    return (
        <div className="flex h-[calc(100vh-200px)] flex-col rounded-lg border">
            <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
                <div className="space-y-4">
                    {messages.map((msg) => {
                        const isMe = msg.senderId === currentUserId
                        return (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                                    isMe
                                        ? "ml-auto bg-primary text-primary-foreground rtl:ml-0 rtl:mr-auto"
                                        : "bg-muted"
                                )}
                            >
                                {msg.content}
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="border-t p-4">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        onSend()
                    }}
                    className="flex items-center gap-2"
                >
                    <Input
                        placeholder={t("placeholder")}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 rtl:rotate-180" />}
                        <span className="sr-only">{t("send")}</span>
                    </Button>
                </form>
            </div>
        </div>
    )
}
