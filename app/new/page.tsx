
import { SubmitPostForm } from "@/components/submit-post-form"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PenLine } from "lucide-react"

export default async function NewPostPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/api/auth/signin")
    }

    const communities = await prisma.community.findMany({
        select: {
            id: true,
            name: true,
        },
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-950 px-6 py-20">
            <div className="container mx-auto max-w-3xl">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl mb-6">
                        <PenLine className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
                        Create a New Post
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Share your thoughts with the community. Our AI assistant helps keep things safe.
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl shadow-indigo-500/10">
                    <SubmitPostForm communities={communities} />
                </div>
            </div>
        </div>
    )
}
