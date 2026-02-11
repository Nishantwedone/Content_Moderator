
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { CreateCommunityForm } from "@/components/create-community-form"

export default async function CommunitiesPage() {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
        redirect("/")
    }

    const communities = await prisma.community.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { posts: true },
            },
        },
    })

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Communities</h1>
            </div>

            <div className="grid gap-8 md:grid-cols-[1fr_300px]">
                <div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Posts</TableHead>
                                <TableHead>Created At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {communities.map((community) => (
                                <TableRow key={community.id}>
                                    <TableCell className="font-medium">{community.name}</TableCell>
                                    <TableCell>{community.slug}</TableCell>
                                    <TableCell>{community._count.posts}</TableCell>
                                    <TableCell>{new Date(community.createdAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div>
                    <CreateCommunityForm />
                </div>
            </div>
        </div>
    )
}
