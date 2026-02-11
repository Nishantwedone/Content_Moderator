
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import * as z from "zod"

const promoteSchema = z.object({
    secretKey: z.string(),
    role: z.enum(["ADMIN", "MODERATOR"]),
})

const ADMIN_SECRET = process.env.ADMIN_SECRET || "admin-secret" // Default for demo

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const json = await req.json()
        const { secretKey, role } = promoteSchema.parse(json)

        if (secretKey !== ADMIN_SECRET) {
            return new NextResponse("Invalid Secret Key", { status: 403 })
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: { role },
        })

        return NextResponse.json({ success: true, role: updatedUser.role })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse("Invalid request data", { status: 422 })
        }
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
