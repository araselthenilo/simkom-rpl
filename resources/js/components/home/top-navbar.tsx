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
    const { url, component } = usePage();
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

    const isHome = url === '/home' || component === 'home';
    const isOrganisasi =
        url.startsWith('/organisasi') || component.startsWith('organisasi/');
    const isKegiatan =
        url.startsWith('/kegiatan') || component.startsWith('kegiatan/');

    const activeClass =
        'border-b-2 border-primary pb-1 font-body-md text-body-md font-bold text-primary';
    const inactiveClass =
        'font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary';

    return (
        <>
            <Head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap"
                    rel="stylesheet"
                />
            </Head>
            <header
                className={`sticky top-0 z-40 w-full border-b border-outline-variant bg-surface shadow-sm transition-transform duration-300 ease-out dark:bg-surface-dim ${
                    isHidden ? '-translate-y-full' : 'translate-y-0'
                }`}
            >
                <div className="mx-auto flex h-16 w-full max-w-container-max items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-unit-md">
                        <span className="font-headline-md text-headline-md font-bold text-primary">
                            ITB SIMKOM STIKOM Bali
                        </span>
                    </div>

                    <div className="hidden gap-unit-lg md:flex">
                        <Link
                            className={isHome ? activeClass : inactiveClass}
                            href="/home"
                        >
                            Beranda
                        </Link>
                        <Link
                            className={isKegiatan ? activeClass : inactiveClass}
                            href="/kegiatan"
                        >
                            Kegiatan
                        </Link>
                        <Link
                            className={
                                isOrganisasi ? activeClass : inactiveClass
                            }
                            href="/organisasi"
                        >
                            Organisasi
                        </Link>
                    </div>

                    <div className="ml-6 flex items-center gap-4">
                        <button className="relative rounded-full p-2 transition-all duration-100 hover:bg-surface-container-low active:scale-95">
                            <Bell className="h-6 w-6 text-primary" />
                            {count > 0 && (
                                <span className="absolute top-2 right-2 inline-flex translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full border-2 border-surface bg-error px-1.5 py-0.5 text-[10px] leading-none font-bold text-on-error">
                                    {count > 99 ? '99+' : count}
                                </span>
                            )}
                        </button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="bg-primary-fixed flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-outline-variant transition-transform duration-200 hover:scale-105 focus:outline-none active:scale-95">
                                    {auth.user?.avatar ? (
                                        <img
                                            src={auth.user.avatar}
                                            alt="User Profile Avatar"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-sm font-semibold text-primary">
                                            {initials}
                                        </span>
                                    )}
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
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem variant="destructive" asChild>
                                    <Link
                                        className="block w-full cursor-pointer"
                                        href={logout()}
                                        method="post"
                                        as="button"
                                        onClick={handleLogout}
                                        data-test="logout-button"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
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
