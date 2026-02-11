
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    const email = process.argv[2]
    const role = process.argv[3] // 'ADMIN' or 'MODERATOR'

    if (!email || !role) {
        console.error('Usage: npx ts-node prisma/promote.ts <email> <role>')
        process.exit(1)
    }

    const validRoles = ['ADMIN', 'MODERATOR', 'USER']
    if (!validRoles.includes(role)) {
        console.error(`Invalid role. Must be one of: ${validRoles.join(', ')}`)
        process.exit(1)
    }

    try {
        const user = await prisma.user.update({
            where: { email },
            data: { role },
        })
        console.log(`User ${email} promoted to ${role}`)
    } catch (e) {
        console.error(`User with email ${email} not found or error updating.`)
        console.error(e)
    }
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
