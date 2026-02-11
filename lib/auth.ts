
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/db"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: '/login',
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "admin@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const bcrypt = require("bcryptjs")

                // Check if user exists
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (user) {
                    // User exists: Verify password
                    if (!user.password) {
                        throw new Error("Account exists via social login. Please sign in with Google/GitHub.")
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password)

                    if (!isValid) {
                        return null // Invalid password
                    }

                    return user
                } else {
                    // User does not exist.
                    // DO NOT create user here. Return null (Authentication Failed)
                    // The user must register via the /register page first.
                    return null
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (session.user && token) {
                session.user.id = token.id
                session.user.role = token.role
            }
            return session
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id
                token.role = user.role
            }

            // If session update is triggered from client
            if (trigger === "update" && session?.role) {
                token.role = session.role
            }

            // Always fetch fresh role from DB to ensure sync
            // This is slightly less efficient but ensures correctness for this use case
            if (token.id) {
                const freshUser = await prisma.user.findUnique({
                    where: { id: token.id },
                    select: { role: true }
                })
                if (freshUser) {
                    token.role = freshUser.role
                }
            }

            return token
        }
    },
}
