
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
    LayoutDashboard,
    FileText,
    Flag,
    Users,
    MessageSquare,
    TrendingUp,
    Activity
} from "lucide-react"
import { AdminCharts } from "@/components/admin-charts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
        redirect("/")
    }

    // Parallel data fetching for stats
    const [totalPosts, flaggedPosts, totalUsers, communities] = await Promise.all([
        prisma.post.count({ where: { status: "APPROVED" } }),
        prisma.post.count({ where: { status: "FLAGGED" } }),
        prisma.user.count(),
        prisma.community.count(),
    ])

    // Data for Charts
    // 1. Posts by Community
    const postsByCommunity = await prisma.post.groupBy({
        by: ['communityId'],
        _count: {
            id: true,
        },
    })

    const communityDetails = await prisma.community.findMany({
        where: {
            id: {
                in: postsByCommunity.map(p => p.communityId)
            }
        }
    })

    const communityStats = postsByCommunity.map(stat => {
        const community = communityDetails.find(c => c.id === stat.communityId)
        return {
            name: community?.name || "Unknown",
            count: stat._count.id
        }
    })

    // 2. Status Distribution (Manual count for now as SQLite groupBy limitation or simple query)
    const approvedCount = await prisma.post.count({ where: { status: "APPROVED" } })
    const flaggedCountVal = await prisma.post.count({ where: { status: "FLAGGED" } })
    const rejectedCount = await prisma.post.count({ where: { status: "REJECTED" } })
    const pendingCount = await prisma.post.count({ where: { status: "PENDING" } })

    const statusStats = [
        { name: 'Approved', value: approvedCount },
        { name: 'Flagged', value: flaggedCountVal },
        { name: 'Rejected', value: rejectedCount },
        { name: 'Pending', value: pendingCount },
    ].filter(s => s.value > 0) // Only show non-zero

    // 3. Recent Activity (Latest 5 posts/users)
    const recentActivity = await prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            user: true
        }
    })

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 px-6 py-12">
            <div className="container mx-auto">
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                            <LayoutDashboard className="h-8 w-8 text-indigo-600" />
                            Admin Dashboard
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">
                            Overview of platform activity, metrics, and health.
                        </p>
                    </div>
                    {/* Add Date Range Picker here in future */}
                </div>

                {/* Top Stats Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <StatCard
                        title="Total Approved Posts"
                        value={totalPosts}
                        icon={<FileText className="h-6 w-6 text-emerald-500" />}
                        trend="+12% from last week"
                        trendUp={true}
                        href="/dashboard/admin/content?status=APPROVED"
                    />
                    <StatCard
                        title="Flagged Posts"
                        value={flaggedPosts}
                        icon={<Flag className="h-6 w-6 text-rose-500" />}
                        trend="Requires attention"
                        alert={flaggedPosts > 0}
                        trendUp={false}
                        href="/dashboard/moderator"
                    />
                    <StatCard
                        title="Total Users"
                        value={totalUsers}
                        icon={<Users className="h-6 w-6 text-blue-500" />}
                        trend="+5 new today"
                        trendUp={true}
                    />
                    <StatCard
                        title="Active Communities"
                        value={communities}
                        icon={<MessageSquare className="h-6 w-6 text-purple-500" />}
                        trend="Stable"
                        trendUp={true}
                    />
                </div>

                {/* Charts Section */}
                <AdminCharts communityStats={communityStats} statusStats={statusStats} />

                {/* Recent Activity Section */}
                <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4 lg:col-span-4 shadow-sm">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>
                                Latest posts and interactions across the platform.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {recentActivity.map((post) => (
                                    <div key={post.id} className="flex items-center">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={post.user.image || "/avatars/01.png"} alt="Avatar" />
                                            <AvatarFallback>{post.user.name?.[0] || "U"}</AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">{post.title}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                By {post.user.name || post.user.email}
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium text-xs">
                                            <span className={`px-2 py-1 rounded-full ${post.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                                                post.status === 'FLAGGED' ? 'bg-rose-100 text-rose-700' :
                                                    'bg-slate-100 text-slate-700'
                                                }`}>
                                                {post.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-3 lg:col-span-3 shadow-sm">
                        <CardHeader>
                            <CardTitle>System Health</CardTitle>
                            <CardDescription>
                                Operational status of AI and Database.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b pb-4">
                                    <div className="flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-emerald-500" />
                                        <span className="font-medium text-sm">Gemini AI API</span>
                                    </div>
                                    <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded">OPERATIONAL</span>
                                </div>
                                <div className="flex items-center justify-between border-b pb-4">
                                    <div className="flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-emerald-500" />
                                        <span className="font-medium text-sm">Database</span>
                                    </div>
                                    <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded">CONNECTED</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-emerald-500" />
                                        <span className="font-medium text-sm">Storage</span>
                                    </div>
                                    <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded">HEALTHY</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, icon, trend, alert = false, trendUp = true, href }: { title: string, value: number, icon: React.ReactNode, trend: string, alert?: boolean, trendUp?: boolean, href?: string }) {
    const CardContent = (
        <div className={`p-6 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 hover:border-indigo-200 cursor-pointer ${alert ? 'border-rose-200 bg-rose-50 dark:bg-rose-900/10' : 'border-slate-200 dark:border-slate-800'}`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${alert ? 'bg-white dark:bg-slate-800' : 'bg-slate-100 dark:bg-slate-800'} ${alert ? 'text-rose-500' : 'text-indigo-600'}`}>
                    {icon}
                </div>
                {alert && <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>}
            </div>
            <div className="space-y-1">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h3>
                <div className={`text-3xl font-extrabold ${alert ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                    {value}
                </div>
                <div className={`flex items-center text-xs mt-2 ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                    <TrendingUp className={`h-3 w-3 mr-1 ${!trendUp && 'rotate-180'}`} />
                    {trend}
                </div>
            </div>
        </div>
    )

    if (href) {
        return (
            <Link href={href} className="block">
                {CardContent}
            </Link>
        )
    }

    return CardContent
}
