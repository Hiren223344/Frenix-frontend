"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

interface NavItem {
    name: string
    url: string
    icon: LucideIcon
}

interface NavBarProps {
    items: NavItem[]
    className?: string
}

export function NavBar({ items, className }: NavBarProps) {
    const pathname = usePathname()
    const [activeTab, setActiveTab] = useState(items[0].name)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const activeItem = items.find(item =>
            item.url === pathname || (item.url !== '/' && pathname.startsWith(item.url))
        )
        if (activeItem) {
            setActiveTab(activeItem.name)
        }
    }, [pathname, items])

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <div
            className={cn(
                "fixed bottom-10 sm:top-5 left-1/2 -translate-x-1/2 z-[100] mb-6 sm:pt-6 w-fit h-fit",
                className,
            )}
        >
            <div className="flex items-center gap-3 bg-bg-card/50 border border-border/40 backdrop-blur-2xl py-1.5 px-2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.2)]" style={{ minWidth: 'fit-content' }}>
                <Link href="/" className="ml-2 mr-4 flex items-center shrink-0">
                    <img src="/Logo-withoutbg.png" alt="Logo" className="h-6 w-auto dark:invert-0 brightness-0 dark:brightness-100 opacity-90" style={{ height: '24px', width: 'auto' }} />
                </Link>
                {items.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.name

                    return (
                        <Link
                            key={item.name}
                            href={item.url}
                            onClick={(e) => {
                                if (item.url === '#logout') {
                                    e.preventDefault();
                                    signOut({ callbackUrl: '/' });
                                } else {
                                    setActiveTab(item.name)
                                }
                            }}
                            className={cn(
                                "relative cursor-pointer text-sm sm:text-base font-bold px-6 sm:px-8 py-2.5 rounded-full transition-all duration-300",
                                "text-text-muted hover:text-text-main hover:bg-text-main/5",
                                isActive && "text-text-main",
                            )}
                        >
                            <span className="hidden md:inline">{item.name}</span>
                            <span className="md:hidden">
                                <Icon size={18} strokeWidth={2.5} />
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="lamp"
                                    className="absolute inset-0 w-full bg-text-main/10 rounded-full -z-10"
                                    initial={false}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                    }}
                                >
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full shadow-[0_0_20px_var(--primary)]">
                                        <div className="absolute w-12 h-6 bg-primary/30 rounded-full blur-md -top-2 -left-2" />
                                        <div className="absolute w-8 h-6 bg-primary/30 rounded-full blur-md -top-1" />
                                        <div className="absolute w-4 h-4 bg-primary/30 rounded-full blur-sm top-0 left-2" />
                                    </div>
                                </motion.div>
                            )}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
