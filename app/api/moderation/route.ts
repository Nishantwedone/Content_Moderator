
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import * as z from "zod"

const actionSchema = z.object({
    postId: z.string(),
    action: z.enum(["APPROVE", "REJECT"]),
})

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "MODERATOR" && session.user.role !== "ADMIN")) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const json = await req.json()
        const { postId, action } = actionSchema.parse(json)

        const status = action === "APPROVE" ? "APPROVED" : "REJECTED"

        await prisma.post.update({
            where: { id: postId },
            data: { status },
        })

        await prisma.moderationLog.create({
            data: {
                action: action, // "APPROVE" or "REJECT" stored as action? Schema has specific strings?
                // Let's store "APPROVED" or "REJECTED"
                // action: status,
                moderatorId: session.user.id,
                postId: postId,
                reason: "Manual Review",
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return new NextResponse("Error", { status: 500 })
    }
}
