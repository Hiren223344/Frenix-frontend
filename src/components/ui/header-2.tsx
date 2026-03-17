'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';
import { UserDropdown } from '@/components/ui/user-dropdown';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icon } from '@iconify/react';

export interface HeaderLink {
    label: string;
    href: string;
}

export interface HeaderProps {
    links?: HeaderLink[];
    user?: any;
    onSignOut?: () => void;
}

export function Header({ links, user, onSignOut }: HeaderProps) {
    const [open, setOpen] = React.useState(false);
    const scrolled = useScroll(10);
    const pathname = usePathname();

    const userData = user ? {
        name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User",
        username: user?.email || "@frenix_user",
        avatar: user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`,
        initials: (user?.user_metadata?.full_name?.[0] || user?.email?.[0] || "U").toUpperCase(),
    } : null;

    const defaultLinks: HeaderLink[] = [
        { label: 'Features', href: '#' },
        { label: 'Pricing', href: '/billing' },
        { label: 'About', href: '#' },
    ];

    const navLinks = links ?? defaultLinks;

    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    // Close mobile menu on route change
    React.useEffect(() => {
        setOpen(false);
    }, [pathname]);

    return (
        <header
            className={cn(
                'fixed top-0 left-1/2 -translate-x-1/2 z-[100] mx-auto transition-all duration-500 ease-in-out',
                scrolled && !open
                    ? 'top-4 w-[92%] md:max-w-[50%] rounded-2xl border border-border/40 shadow-[0_8px_30px_rgba(0,0,0,0.15)] bg-glass/90'
                    : 'top-0 w-full md:max-w-[75%] border-b border-white/5 bg-transparent',
            )}
            style={{
                backdropFilter: scrolled || open ? 'blur(20px) saturate(180%)' : 'none',
                WebkitBackdropFilter: scrolled || open ? 'blur(20px) saturate(180%)' : 'none',
            }}
        >
            <nav
                className="flex w-full items-center justify-between"
                style={{
                    height: scrolled && !open ? '44px' : '60px',
                    padding: scrolled && !open ? '0 12px' : '0 20px',
                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                <Link href="/" className="shrink-0">
                    <FrenixLogo />
                </Link>
                <div className="hidden items-center gap-0.5 md:flex">
                    {navLinks.map((link, i) => (
                        <Link
                            key={i}
                            className={cn(
                                buttonVariants({ variant: 'ghost', size: 'sm' }),
                                'text-xs font-semibold h-8 px-3',
                                pathname === link.href && 'bg-accent',
                            )}
                            href={link.href}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="flex items-center gap-0.5 ml-2 mr-1 p-0.5 rounded-[10px] bg-white/[0.03] border border-white/5 shadow-inner">
                        <Link
                            href="/docs"
                            className={cn(
                                "hidden md:block px-3 py-1.5 rounded-md text-[11px] font-bold transition-all",
                                pathname.startsWith('/docs') ? "bg-white/10 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Docs
                        </Link>
                        <Link
                            href="/playground"
                            className={cn(
                                "hidden md:block px-3 py-1.5 rounded-md text-[11px] font-bold transition-all",
                                pathname.startsWith('/playground') ? "bg-white/10 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Playground
                        </Link>
                    </div>
                    <div className="mx-1.5 h-4 w-px bg-border/60" />
                    {user ? (
                        <UserDropdown user={user} onSignOut={onSignOut} />
                    ) : (
                        <>
                            <Link href="/signin">
                                <Button variant="outline" size="sm" className="text-xs h-8 px-3">Sign In</Button>
                            </Link>
                            <Link href="/signin">
                                <Button size="sm" className="text-xs h-8 px-3 ml-1">Get Started</Button>
                            </Link>
                        </>
                    )}
                </div>
                <Button size="icon" variant="ghost" onClick={() => setOpen(!open)} className="md:hidden h-9 w-9 -mr-2">
                    <MenuToggleIcon open={open} className="size-5" duration={300} />
                </Button>
            </nav>

            {/* Mobile menu overlay */}
            <div
                className={cn(
                    'fixed inset-0 z-[-1] md:hidden transition-all duration-300',
                    open ? 'bg-black/80 backdrop-blur-md pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
                )}
                onClick={() => setOpen(false)}
            />

            {/* Mobile menu content */}
            <div
                className={cn(
                    'fixed top-[60px] left-0 right-0 z-[90] flex flex-col md:hidden transition-all duration-500 ease-in-out',
                    open ? 'translate-y-0 opacity-100 visible' : '-translate-y-10 opacity-0 invisible',
                )}
                style={{
                    background: 'rgba(10, 10, 10, 0.98)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                }}
            >
                <div className="flex flex-col p-6 gap-6 max-h-[85vh] overflow-y-auto">
                    {userData && (
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                            <Avatar className="size-12 border border-white/10">
                                <AvatarImage src={userData.avatar} />
                                <AvatarFallback>{userData.initials}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-base truncate">{userData.name}</h3>
                                <p className="text-[11px] text-muted-foreground truncate uppercase tracking-widest font-black opacity-60">{userData.username}</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-3 px-4">Navigation</p>
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                className={cn(
                                    'flex items-center rounded-xl px-4 py-3 text-[15px] font-bold transition-all',
                                    pathname === link.href ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
                                )}
                                href={link.href}
                                onClick={() => setOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {user && (
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-3 px-4">Workspace</p>
                            {[
                                { icon: 'solar:widget-line-duotone', label: 'Dashboard', href: '/dashboard' },
                                { icon: 'solar:key-line-duotone', label: 'API Keys', href: '/api-keys' },
                                { icon: 'solar:card-line-duotone', label: 'Billing', href: '/billing' },
                                { icon: 'solar:user-circle-line-duotone', label: 'Account', href: '/account' },
                            ].map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        'flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-bold transition-all',
                                        pathname === item.href ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
                                    )}
                                >
                                    <Icon icon={item.icon} className="size-5 opacity-60" />
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="mt-4 pt-6 border-t border-white/5 flex flex-col gap-3">
                        {user ? (
                            <Button
                                variant="destructive"
                                className="w-full h-12 rounded-xl font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border-none"
                                onClick={() => { setOpen(false); onSignOut?.(); }}
                            >
                                <Icon icon="solar:logout-2-bold-duotone" className="mr-2 size-5" /> Sign Out
                            </Button>
                        ) : (
                            <>
                                <Link href="/signin" onClick={() => setOpen(false)}>
                                    <Button variant="outline" className="w-full h-12 rounded-xl font-bold bg-white/5 border-white/10 hover:bg-white/10">Sign In</Button>
                                </Link>
                                <Link href="/signin" onClick={() => setOpen(false)}>
                                    <Button className="w-full h-12 rounded-xl font-bold bg-primary text-primary-foreground hover:opacity-90">Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export const FrenixLogo = (props: React.ComponentProps<'div'>) => (
    <div {...props} className={cn('flex items-center gap-2', props.className)}>
        <img
            src="/logo-withoutbg.png"
            alt="Frenix"
            className="h-5 w-auto dark:invert-0 brightness-0 dark:brightness-100 opacity-90"
        />
        <span className="text-sm font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
            Frenix
        </span>
    </div>
);
