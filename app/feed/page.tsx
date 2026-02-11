
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { PostCard } from "@/components/post-card"
import { Newspaper, Search } from "lucide-react"

export default async function FeedPage() {
    const session = await getServerSession(authOptions)

    // Optional: Require login to see feed? User didn't specify, but usually yes for a community app.
    if (!session) {
        redirect("/api/auth/signin")
    }

    const posts = await prisma.post.findMany({
        where: {
            status: "APPROVED",
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
            community: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            createdAt: "desc",
        },
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-950 px-6 py-12">
            <div className="container mx-auto max-w-3xl">
                <div className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3 justify-center md:justify-start">
                            <Newspaper className="h-8 w-8 text-indigo-600" />
                            Community Feed
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">
                            Explore the latest posts from our safe and moderated community.
                        </p>
                    </div>
                    {/* Placeholder for future search/filter */}
                    {/* <div className="mt-4 md:mt-0 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input type="text" placeholder="Search posts..." className="pl-10 pr-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div> */}
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl border-dashed">
                        <p className="text-slate-500">No posts yet. Be the first to share something!</p>
                    </div>
                ) : (
                    <div>
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
