
"use client"

import Link from "next/link"
import * as React from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { RoleSwitchDialog } from "@/components/role-switch-dialog"
import {
    ShieldCheck,
    PlusCircle,
    LayoutDashboard,
    ShieldAlert,
    Newspaper,
    LogOut,
    Menu,
    X
} from "lucide-react"

export function Navbar() {
    const { data: session } = useSession()
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-indigo-600 text-white p-1.5 rounded-lg group-hover:bg-indigo-700 transition-colors">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                        ContentModerator
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    {session ? (
                        <>
                            <Link href="/feed" className={`flex items-center gap-2 text-sm font-medium transition-colors ${pathname === '/feed' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}>
                                <Newspaper className="h-4 w-4" />
                                Feed
                            </Link>

                            <Link href="/new">
                                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-indigo-500/20">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    New Post
                                </Button>
                            </Link>

                            {(session.user.role === "MODERATOR" || session.user.role === "ADMIN") && (
                                <Link href="/dashboard/moderator">
                                    <Button variant="ghost" size="sm" className={`flex items-center gap-2 ${pathname.includes('/moderator') ? 'text-rose-600 bg-rose-50' : 'text-slate-600 hover:text-rose-600'}`}>
                                        <ShieldAlert className="h-4 w-4" />
                                        Mod Queue
                                    </Button>
                                </Link>
                            )}

                            {session.user.role === "ADMIN" && (
                                <Link href="/dashboard/admin">
                                    <Button variant="ghost" size="sm" className={`flex items-center gap-2 ${pathname.includes('/admin') ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-indigo-600'}`}>
                                        <LayoutDashboard className="h-4 w-4" />
                                        Admin
                                    </Button>
                                </Link>
                            )}

                            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>

                            <div className="flex items-center gap-3">
                                <RoleSwitchDialog />
                                <div className="text-right hidden lg:block">
                                    <p className="text-xs font-medium text-slate-900 dark:text-white">
                                        {session.user.name || session.user.email?.split('@')[0]}
                                    </p>
                                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                                        {session.user.role}
                                    </p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => signOut()} className="text-slate-400 hover:text-rose-600">
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex gap-2">
                            <Link href="/register">
                                <Button variant="ghost">Register</Button>
                            </Link>
                            <Link href="/api/auth/signin">
                                <Button>Sign In</Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-4 shadow-lg absolute w-full left-0 top-16 z-40">
                    {session ? (
                        <>
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">
                                        {session.user.name || session.user.email?.split('@')[0]}
                                    </p>
                                    <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                                        {session.user.role}
                                    </p>
                                </div>
                                <div className="scale-90 origin-right">
                                    <RoleSwitchDialog />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Link href="/feed" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium transition-colors ${pathname === '/feed' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>
                                    <Newspaper className="h-5 w-5" />
                                    Feed
                                </Link>

                                <Link href="/new" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                                    <PlusCircle className="h-5 w-5" />
                                    New Post
                                </Link>

                                {(session.user.role === "MODERATOR" || session.user.role === "ADMIN") && (
                                    <Link href="/dashboard/moderator" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium transition-colors ${pathname.includes('/moderator') ? 'bg-rose-50 text-rose-600' : 'text-slate-600 hover:bg-slate-50'}`}>
                                        <ShieldAlert className="h-5 w-5" />
                                        Mod Queue
                                    </Link>
                                )}

                                {session.user.role === "ADMIN" && (
                                    <Link href="/dashboard/admin" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium transition-colors ${pathname.includes('/admin') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>
                                        <LayoutDashboard className="h-5 w-5" />
                                        Admin Dashboard
                                    </Link>
                                )}
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                <Button variant="ghost" className="w-full justify-start text-slate-500 hover:text-rose-600 px-2" onClick={() => signOut()}>
                                    <LogOut className="mr-2 h-5 w-5" />
                                    Sign Out
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-3">
                            <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block">
                                <Button variant="ghost" className="w-full justify-start">Register</Button>
                            </Link>
                            <Link href="/api/auth/signin" onClick={() => setMobileMenuOpen(false)} className="block">
                                <Button className="w-full">Sign In</Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    )
}
