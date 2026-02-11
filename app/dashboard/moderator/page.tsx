
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { ModerationCard } from "@/components/moderation-card"
import { ShieldAlert, CheckCircle2, Clock, XCircle, CheckCircle } from "lucide-react"

export default async function ModeratorDashboard() {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "MODERATOR" && session.user.role !== "ADMIN")) {
        redirect("/")
    }

    // Get Pending Posts
    const flaggedPosts = await prisma.post.findMany({
        where: {
            status: "FLAGGED",
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                },
            },
            moderationLogs: {
                orderBy: { createdAt: "desc" },
                take: 1,
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    })

    // Basic Stats for Today (Approximated for MVP)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [approvedToday, rejectedToday] = await Promise.all([
        prisma.post.count({
            where: {
                status: "APPROVED",
                updatedAt: { gte: today }
            }
        }),
        prisma.post.count({
            where: {
                status: "REJECTED",
                updatedAt: { gte: today }
            }
        })
    ]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 md:px-8 py-12">
            <div className="container mx-auto max-w-7xl">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                        <ShieldAlert className="h-8 w-8 text-indigo-600" />
                        Moderation Queue
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Review and manage content flagged by the AI safety system.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                                <Clock className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Review</span>
                        </div>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">{flaggedPosts.length}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                <CheckCircle className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Approved Today</span>
                        </div>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">{approvedToday}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                                <XCircle className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Rejected Today</span>
                        </div>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">{rejectedToday}</span>
                    </div>
                </div>

                {/* Filters / Sort (Placeholder for future) */}

                {/* Content Grid */}
                {flaggedPosts.length === 0 ? (
                    <div className="text-center py-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl border-dashed">
                        <div className="inline-flex items-center justify-center p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-full mb-6 ring-8 ring-emerald-50/50 dark:ring-emerald-900/10">
                            <CheckCircle2 className="h-16 w-16 text-emerald-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">All Caught Up!</h3>
                        <p className="text-slate-500 max-w-md mx-auto text-lg">
                            There are no flagged posts requiring your attention right now. Great job keeping the community safe.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 items-start">
                        {flaggedPosts.map((post) => (
                            <ModerationCard
                                key={post.id}
                                post={{
                                    ...post,
                                    createdAt: post.createdAt.toISOString(),
                                    moderationLogs: post.moderationLogs.map(log => ({
                                        ...log,
                                        createdAt: log.createdAt.toISOString()
                                    }))
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
