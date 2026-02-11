
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import * as z from "zod"
import { analyzeContent } from "@/lib/gemini"

export const maxDuration = 30; // Allow up to 30 seconds for AI analysis

const postSchema = z.object({
    title: z.string().min(2),
    content: z.string().optional(),
    imageUrl: z.string().url().optional().or(z.literal("")),
    communityId: z.string(),
})

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { user } = session
        const json = await req.json()
        const body = postSchema.parse(json)


        // AI Moderation Analysis
        const analysis = await analyzeContent(body.title, body.content || null, body.imageUrl || null);

        // Determine status based on AI decision
        // If AI rejects it, we set it to FLAGGED so a human moderator can review it manually to confirm.
        const status = analysis.status === "REJECTED" ? "FLAGGED" : analysis.status;

        const post = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                imageUrl: body.imageUrl,
                communityId: body.communityId,
                userId: session.user.id,
                status: status,
            },
        })

        // Log the AI decision
        await prisma.moderationLog.create({
            data: {
                action: status,
                reason: analysis.reason,
                postId: post.id,
                moderatorId: undefined, // System/AI action
            }
        })

        return NextResponse.json(post)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 422 })
        }

        return new NextResponse(null, { status: 500 })
    }
}
