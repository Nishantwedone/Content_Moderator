import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, email, password } = body;

        console.log("Register API Hit:", { name, email, hasPassword: !!password });

        if (!email || !password || !name) {
            return new NextResponse("Missing fields: " + JSON.stringify(body), { status: 400 })
        }

        const exists = await prisma.user.findUnique({
            where: {
                email,
            },
        })

        if (exists) {
            return new NextResponse("User with this email already exists", { status: 409 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "ADMIN",
            },
        })

        return NextResponse.json(user)
    } catch (error: any) {
        console.error("REGISTRATION_CRITICAL_ERROR", error)
        return new NextResponse("Internal Error: " + error.message, { status: 500 })
    }
}
