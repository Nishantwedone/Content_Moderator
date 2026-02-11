
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const general = await prisma.community.upsert({
        where: { slug: 'general' },
        update: {},
        create: {
            name: 'General',
            slug: 'general',
            description: 'General discussion for everyone.',
        },
    })

    const adults = await prisma.community.upsert({
        where: { slug: 'adults-only' },
        update: {},
        create: {
            name: 'Adults Only (18+)',
            slug: 'adults-only',
            description: 'Content suitable only for adults over 18.',
        },
    })

    const children = await prisma.community.upsert({
        where: { slug: 'children' },
        update: {},
        create: {
            name: 'Children (Under 18)',
            slug: 'children',
            description: 'Safe content suitable for children.',
        },
    })

    console.log({ general, adults, children })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
