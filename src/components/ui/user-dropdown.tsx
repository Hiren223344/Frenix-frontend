'use client';

import * as React from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react";

const MENU_ITEMS = {
    status: [
        { value: "focus", icon: "solar:emoji-funny-circle-line-duotone", label: "Focus" },
        { value: "offline", icon: "solar:moon-sleep-line-duotone", label: "Appear Offline" }
    ],
    navigation: [
        { icon: "solar:widget-line-duotone", label: "Dashboard", href: "/dashboard" },
        { icon: "solar:key-line-duotone", label: "API Keys", href: "/api-keys" },
        { icon: "solar:card-line-duotone", label: "Billing", href: "/billing" },
    ],
    profile: [
        { icon: "solar:user-circle-line-duotone", label: "Account Portal", href: "/user-profile" },
        { icon: "solar:bell-line-duotone", label: "Notifications", href: "#" }
    ],
    account: [
        { icon: "solar:logout-2-bold-duotone", label: "Log out", action: "logout" }
    ]
};

export const UserDropdown = ({
    user,
    onSignOut
}: {
    user: any;
    onSignOut?: () => void;
}) => {
    const { openUserProfile } = useClerk();
    const router = useRouter();
    const [selectedStatus, setSelectedStatus] = React.useState("online");

    const userData = {
        name: user?.fullName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || "User",
        username: user?.username || user?.emailAddresses?.[0]?.emailAddress || "@frenix_user",
        avatar: user?.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`,
        initials: (user?.firstName?.[0] || user?.lastName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0] || "U").toUpperCase(),
        status: selectedStatus
    };

    const handleAction = (href?: string, action?: string) => {
        console.log('Action triggered:', action, href);
        if (action === 'logout') {
            onSignOut?.();
        } else if (href) {
            router.push(href);
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            online: "text-green-600 bg-green-100 border-green-300 dark:text-green-400 dark:bg-green-900/30 dark:border-green-500/50",
            offline: "text-gray-600 bg-gray-100 border-gray-300 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-600",
            focus: "text-blue-600 bg-blue-100 border-blue-300 dark:text-blue-400 dark:bg-blue-900/30 dark:border-blue-500/50"
        };
        return colors[status.toLowerCase()] || colors.online;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer size-8 border border-white/20 hover:scale-105 transition-transform">
                    <AvatarImage src={userData.avatar} alt={userData.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{userData.initials}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="no-scrollbar w-[280px] rounded-2xl bg-popover/80 backdrop-blur-xl border-border/50 p-2 shadow-2xl" align="end">
                <div className="flex items-center gap-3 p-2 mb-2 bg-accent/50 rounded-xl border border-border/50">
                    <Avatar className="size-10 border border-white/10">
                        <AvatarImage src={userData.avatar} alt={userData.name} />
                        <AvatarFallback>{userData.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm truncate text-foreground">{userData.name}</h3>
                        <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-semiboldOpacity">{userData.username}</p>
                    </div>
                    <Badge className={`${getStatusColor(userData.status)} border-[0.5px] text-[10px] px-1.5 h-5 rounded-md capitalize font-bold`}>
                        {userData.status}
                    </Badge>
                </div>

                <DropdownMenuGroup className="space-y-0.5">
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="rounded-lg hover:bg-accent focus:bg-accent cursor-pointer px-3 py-2 text-sm font-medium transition-colors">
                            <span className="flex items-center gap-2">
                                <Icon icon="solar:smile-circle-line-duotone" className="size-5 text-muted-foreground" />
                                Update status
                            </span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent className="bg-popover/90 backdrop-blur-lg border-border/50 rounded-xl p-1">
                                <DropdownMenuRadioGroup value={selectedStatus} onValueChange={setSelectedStatus}>
                                    {MENU_ITEMS.status.map((status) => (
                                        <DropdownMenuRadioItem className="gap-2 rounded-lg py-2 cursor-pointer" key={status.value} value={status.value}>
                                            <Icon icon={status.icon} className="size-5 text-muted-foreground" />
                                            {status.label}
                                        </DropdownMenuRadioItem>
                                    ))}
                                    <DropdownMenuRadioItem className="gap-2 rounded-lg py-2 cursor-pointer" value="online">
                                        <Icon icon="solar:bolt-line-duotone" className="size-5 text-green-500" />
                                        Online
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-2 bg-border/50" />

                <DropdownMenuGroup className="space-y-0.5">
                    {MENU_ITEMS.navigation.map((item, i) => (
                        <DropdownMenuItem
                            key={i}
                            className="rounded-lg hover:bg-accent focus:bg-accent cursor-pointer px-3 py-2 text-sm font-medium transition-colors"
                            onClick={() => handleAction(item.href)}
                        >
                            <span className="flex items-center gap-2">
                                <Icon icon={item.icon} className="size-5 text-muted-foreground" />
                                {item.label}
                            </span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-2 bg-border/50" />

                <DropdownMenuGroup className="space-y-0.5">
                    {MENU_ITEMS.profile.map((item, i) => (
                        <DropdownMenuItem
                            key={i}
                            className="rounded-lg hover:bg-accent focus:bg-accent cursor-pointer px-3 py-2 text-sm font-medium transition-colors"
                            onClick={() => handleAction(item.href)}
                        >
                            <span className="flex items-center gap-2">
                                <Icon icon={item.icon} className="size-5 text-muted-foreground" />
                                {item.label}
                            </span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-2 bg-border/50" />

                <DropdownMenuGroup>
                    {MENU_ITEMS.account.map((item, i) => (
                        <DropdownMenuItem
                            key={i}
                            className="rounded-lg hover:bg-destructive/10 focus:bg-destructive/10 text-destructive cursor-pointer px-3 py-2 text-sm font-bold transition-colors"
                            onClick={() => handleAction(undefined, item.action)}
                        >
                            <span className="flex items-center gap-2">
                                <Icon icon={item.icon} className="size-5" />
                                {item.label}
                            </span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserDropdown;
