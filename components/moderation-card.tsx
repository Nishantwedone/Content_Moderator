
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Check, X, AlertTriangle, User, Calendar, Clock } from "lucide-react"

interface Post {
    id: string
    title: string
    content: string | null
    imageUrl: string | null
    status: string
    createdAt: Date | string
    moderationLogs: { reason: string | null, createdAt: Date | string }[]
    user: { name: string | null, email: string | null, image: string | null }
}

export function ModerationCard({ post }: { post: Post }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleAction(action: "APPROVE" | "REJECT") {
        setLoading(true)
        try {
            const res = await fetch("/api/moderation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId: post.id, action }),
            })

            if (!res.ok) throw new Error("Failed to update status")

            toast.success(`Post ${action === "APPROVE" ? "approved" : "rejected"}`)
            router.refresh()
        } catch (error) {
            toast.error("Error updating post status")
        } finally {
            setLoading(false)
        }
    }

    const reason = post.moderationLogs[0]?.reason || "Flagged by AI"
    // Heuristic for severity color based on keywords (simple version)
    const isSevere = reason.toLowerCase().includes("hate") || reason.toLowerCase().includes("violence") || reason.toLowerCase().includes("nsfw");
    const severityColor = isSevere ? "bg-rose-100 text-rose-800 border-rose-200" : "bg-amber-100 text-amber-800 border-amber-200";
    const iconColor = isSevere ? "text-rose-500" : "text-amber-500";

    // Format date safely
    // Fix hydration mismatch by rendering date only on client
    const [dateStr, setDateStr] = useState<string>("")
    useEffect(() => {
        setDateStr(new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }))
    }, [post.createdAt])

    return (
        <Card className="flex flex-col h-full overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            {/* Image Preview */}
            {post.imageUrl && (
                <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-900">
                    <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                    <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm border-none">
                            Image
                        </Badge>
                    </div>
                </div>
            )}

            <CardHeader className="p-4 pb-2 space-y-2">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-lg leading-tight line-clamp-2" title={post.title}>
                        {post.title}
                    </h3>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="truncate max-w-[100px]">{post.user.name || "Anonymous"}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{dateStr || "Loading..."}</span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-2 flex-grow space-y-4">
                {post.content && (
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md text-sm text-slate-700 dark:text-slate-300 line-clamp-4 leading-relaxed">
                        {post.content}
                    </div>
                )}

                <div className={`p-3 rounded-md border flex gap-3 ${severityColor}`}>
                    <AlertTriangle className={`h-5 w-5 flex-shrink-0 ${iconColor} mt-0.5`} />
                    <div className="text-xs">
                        <span className="font-bold block mb-0.5">Flagged Reason</span>
                        {reason}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-3 mt-auto">
                <Button
                    variant="outline"
                    onClick={() => handleAction("REJECT")}
                    disabled={loading}
                    className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 dark:border-rose-900/30 dark:hover:bg-rose-900/20"
                >
                    <X className="mr-2 h-4 w-4" />
                    Reject
                </Button>
                <Button
                    onClick={() => handleAction("APPROVE")}
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-emerald-500/20"
                >
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                </Button>
            </CardFooter>
        </Card>
    )
}
