import { Head, Link, router, usePage } from '@inertiajs/react';
import { Bell, LogOut, Menu, Settings } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';

export default function TopNavbar({
    notificationsCount = 0,
}: {
    notificationsCount?: number;
}) {
    const { auth } = usePage().props;
    const getInitials = useInitials();
    const cleanup = useMobileNavigation();
    const [isHidden, setIsHidden] = useState(false);
    const lastScrollY = useRef(0);
    const count = notificationsCount;

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    const initials = auth.user ? getInitials(auth.user.name) : 'U';

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (Math.abs(currentScrollY - lastScrollY.current) < 10) {
                return;
            }

            setIsHidden(
                currentScrollY > lastScrollY.current && currentScrollY > 50,
            );
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap"
                    rel="stylesheet"
                />
            </Head>
            <header
                className={`sticky top-0 z-50 w-full transform border-b border-outline-variant bg-surface shadow-sm transition-transform duration-300 ease-out dark:border-outline dark:bg-surface-dim ${
                    isHidden ? '-translate-y-full' : 'translate-y-0'
                }`}
            >
                <div className="mx-auto flex h-16 w-full max-w-container-max items-center justify-between px-4 md:px-margin-desktop">
                    <div className="flex min-w-0 items-center gap-unit-md">
                        <span className="dark:text-primary-fixed text-title-md truncate font-bold text-primary md:text-headline-md">
                            SIMKOM ITB STIKOM Bali
                        </span>
                    </div>

                    <nav className="hidden items-center gap-8 md:flex">
                        <a
                            className="border-b-2 border-primary pb-1 font-body-md text-body-md font-bold text-primary"
                            href="#"
                        >
                            Beranda
                        </a>
                        <a
                            className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary"
                            href="#"
                        >
                            Organisasi
                        </a>
                        <a
                            className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary"
                            href="#"
                        >
                            Profil
                        </a>
                    </nav>

                    {/* Added shrink-0 to prevent the actions container from compressing */}
                    <div className="flex shrink-0 items-center gap-2 sm:gap-unit-lg">
                        <button className="group relative cursor-pointer rounded-full p-2 text-primary transition-all hover:bg-primary hover:text-on-primary active:scale-95">
                            <Bell />
                            {count > 0 && (
                                <span className="absolute top-3 right-3 inline-flex translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-red-600 px-1.5 py-0.5 text-xs leading-none font-bold text-red-100 group-hover:hidden">
                                    {count > 99 ? '99+' : count}
                                </span>
                            )}
                        </button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-outline-variant bg-primary-container text-sm font-semibold text-on-primary-container transition-transform duration-200 hover:scale-105 focus:outline-none active:scale-95">
                                    {initials}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuItem asChild>
                                    <Link
                                        className="block w-full cursor-pointer"
                                        href={edit()}
                                        prefetch
                                        onClick={cleanup}
                                    >
                                        <Settings className="mr-2" />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem variant="destructive" asChild>
                                    <Link
                                        className="block w-full cursor-pointer"
                                        href={logout()}
                                        as="button"
                                        onClick={handleLogout}
                                        data-test="logout-button"
                                    >
                                        <LogOut className="mr-2" />
                                        Log out
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <button className="text-primary md:hidden">
                            <Menu />
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
}
