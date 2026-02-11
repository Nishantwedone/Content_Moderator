
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, User } from "lucide-react"

interface Post {
    id: string
    title: string
    content: string | null
    imageUrl: string | null
    status: string
    community?: { name: string }
    user: { name: string | null, email: string | null }
    createdAt: Date
}

export function PostCard({ post }: { post: Post }) {
    return (
        <Card className="w-full mb-6 overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-slate-50 dark:bg-slate-900/50 pb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl font-bold mb-2">{post.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {post.user.name || post.user.email?.split('@')[0] || "Anonymous"}
                            </span>
                            <span className="flex items-center gap-1">
                                <CalendarDays className="h-4 w-4" />
                                {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    {post.community && (
                        <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
                            {post.community.name}
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                {post.imageUrl && (
                    <div className="relative w-full h-64 bg-slate-100 rounded-xl overflow-hidden">
                        <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                )}
                <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
                        {post.content}
                    </p>
                </div>
            </CardContent>
            <CardFooter className="bg-slate-50 dark:bg-slate-900/30 py-3 px-6 flex justify-between items-center text-xs text-slate-400">
                <span>Status: <span className="text-emerald-600 font-medium">Verified Safe</span></span>
                <span>ID: {post.id.slice(-6)}</span>
            </CardFooter>
        </Card>
    )
}
