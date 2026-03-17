"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
interface NavItem {
    name: string
    url: string
    icon: LucideIcon
}

interface NavBarProps {
    items: NavItem[]
    className?: string
    onItemClick?: (item: NavItem) => void
}

export function NavBar({ items, className, onItemClick }: NavBarProps) {
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
                    <img src="/logo-withoutbg.png" alt="Logo" className="h-6 w-auto dark:invert-0 brightness-0 dark:brightness-100 opacity-90" style={{ height: '24px', width: 'auto' }} />
                </Link>
                {items.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.name

                    return (
                        <Link
                            key={item.name}
                            href={item.url}
                            onClick={(e) => {
                                if (item.url.startsWith('#')) {
                                    e.preventDefault();
                                    if (onItemClick) {
                                        onItemClick(item);
                                    }
                                }
                                if (item.url !== '#logout') {
                                    setActiveTab(item.name)
                                }
                            }}
                            className={cn(
                                "relative cursor-pointer text-xs sm:text-sm font-bold px-4 sm:px-6 py-2 rounded-full transition-all duration-300",
                                "text-text-muted hover:text-text-main hover:bg-text-main/5",
                                isActive && "text-text-main",
                            )}
                        >
                            <span className="hidden md:inline">{item.name}</span>
                            <span className="md:hidden">
                                <Icon size={16} strokeWidth={2.5} />
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="lamp"
                                    className="absolute inset-0 w-full bg-text-main/8 rounded-full -z-10"
                                    initial={false}
                                    transition={{
                                        type: "spring",
                                        stiffness: 350,
                                        damping: 35,
                                    }}
                                />
                            )}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
