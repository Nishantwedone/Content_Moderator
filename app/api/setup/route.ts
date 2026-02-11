
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
    try {
        const communities = [
            { name: "Tech", slug: "tech", description: "Discuss specific technology." },
            { name: "Gaming", slug: "gaming", description: "Video games and industry news." },
            { name: "News", slug: "news", description: "Current events and breaking news." },
            { name: "Random", slug: "random", description: "Anything and everything." },
        ]

        for (const c of communities) {
            await prisma.community.upsert({
                where: { slug: c.slug },
                update: {},
                create: c,
            })
        }

        return NextResponse.json({ message: "Communities Created! Go back and invoke Create Post." })
    } catch (error) {
        return NextResponse.json({ error: "Failed to seed." }, { status: 500 })
    }
}
