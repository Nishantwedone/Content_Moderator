
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, User, MessageSquare } from "lucide-react"

interface PageProps {
    searchParams: {
        status?: string
    }
}

export default async function AdminContentPage({ searchParams }: PageProps) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
        redirect("/")
    }

    const status = (searchParams.status || "APPROVED").toUpperCase()

    // Validate status to prevent invalid queries
    const validStatuses = ["APPROVED", "FLAGGED", "REJECTED", "PENDING"]
    const filterStatus = validStatuses.includes(status) ? status : "APPROVED"

    const posts = await prisma.post.findMany({
        where: {
            status: filterStatus
        },
        include: {
            user: true,
            community: true
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 md:px-8 py-12">
            <div className="container mx-auto max-w-5xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            {filterStatus.charAt(0) + filterStatus.slice(1).toLowerCase()} Posts
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">
                            Viewing all content with status: <span className="font-bold">{filterStatus}</span>
                        </p>
                    </div>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed">
                        <p className="text-slate-500 text-lg">No posts found with this status.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {posts.map((post) => (
                            <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                {post.imageUrl && (
                                    <div className="h-48 w-full bg-slate-100 dark:bg-slate-900 relative">
                                        <img
                                            src={post.imageUrl}
                                            alt={post.title}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                )}
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <Badge variant="secondary" className="mb-2">
                                                {post.community.name}
                                            </Badge>
                                            <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {post.content && (
                                        <p className="text-slate-600 dark:text-slate-300 line-clamp-3 text-sm mb-4">
                                            {post.content}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between text-xs text-slate-500 border-t pt-4 mt-2">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={post.user.image || ""} />
                                                <AvatarFallback>{post.user.name?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <span>{post.user.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
