
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import * as z from "zod"

const communitySchema = z.object({
    name: z.string().min(2),
    slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric"),
    description: z.string().optional(),
})

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const json = await req.json()
        const body = communitySchema.parse(json)

        const community = await prisma.community.create({
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description,
            },
        })

        return NextResponse.json(community)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 422 })
        }

        // Check for unique constraint violation (slug/name)
        // Prisma error code P2002
        // @ts-ignore
        if (error.code === "P2002") {
            return new NextResponse("Community with this name or slug already exists", { status: 409 })
        }

        return new NextResponse(null, { status: 500 })
    }
}
