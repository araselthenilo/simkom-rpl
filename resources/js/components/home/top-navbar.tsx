import { Head, Link, router, usePage } from '@inertiajs/react';
import { Bell, LogOut, Menu, Settings, X } from 'lucide-react';
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
import { logout, home } from '@/routes';
import { index as kegiatanIndex } from '@/routes/kegiatan';
import { index as organisasiIndex } from '@/routes/organisasi';
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const lastScrollY = useRef(0);
    const count = notificationsCount;

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [url]);

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
                            SIMKOM ITB STIKOM Bali
                        </span>
                    </div>

                    <div className="hidden gap-unit-lg md:flex">
                        <Link
                            className={isHome ? activeClass : inactiveClass}
                            href={home()}
                        >
                            Beranda
                        </Link>
                        <Link
                            className={isKegiatan ? activeClass : inactiveClass}
                            href={kegiatanIndex()}
                        >
                            Kegiatan
                        </Link>
                        <Link
                            className={
                                isOrganisasi ? activeClass : inactiveClass
                            }
                            href={organisasiIndex()}
                        >
                            Organisasi
                        </Link>
                    </div>

                    <div className="ml-6 flex items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="group flex cursor-pointer items-center gap-2.5 rounded-full border border-transparent p-0.5 text-left transition-all duration-200 hover:bg-surface-container-low focus:outline-none sm:border-outline-variant sm:bg-surface-container-lowest sm:pr-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-primary-fixed transition-transform duration-200 group-hover:scale-105">
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
                                    </div>
                                    <div className="hidden flex-col justify-center sm:flex">
                                        <span className="max-w-[140px] truncate text-body-sm leading-tight font-semibold text-on-surface">
                                            {auth.user?.name}
                                        </span>
                                        <span className="mt-0.5 text-[10px] leading-tight font-medium text-on-surface-variant">
                                            {auth.user?.role}
                                        </span>
                                    </div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuItem asChild>
                                    <Link
                                        className="block w-full cursor-pointer"
                                        href={edit.url({
                                            query: { from: 'student' },
                                        })}
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
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="text-primary md:hidden p-1.5 rounded-lg hover:bg-surface-container-low"
                            aria-label="Open menu"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-300 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed top-0 right-0 z-50 flex h-full w-64 flex-col bg-surface p-unit-md text-on-surface shadow-lg dark:bg-surface-container transition-transform duration-300 ease-in-out md:hidden ${
                    isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="relative mb-unit-xl flex items-center justify-between px-4 py-2 border-b border-outline-variant">
                    <span className="font-headline-sm text-title-medium font-bold text-primary">
                        Menu
                    </span>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="rounded-md p-1.5 text-on-surface-variant hover:bg-surface-container-low"
                        aria-label="Close menu"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <nav className="flex flex-col space-y-4 px-4">
                    <Link
                        className={`font-body-md text-body-md font-semibold transition-colors duration-200 ${
                            isHome ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                        }`}
                        href={home()}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Beranda
                    </Link>
                    <Link
                        className={`font-body-md text-body-md font-semibold transition-colors duration-200 ${
                            isKegiatan ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                        }`}
                        href={kegiatanIndex()}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Kegiatan
                    </Link>
                    <Link
                        className={`font-body-md text-body-md font-semibold transition-colors duration-200 ${
                            isOrganisasi ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                        }`}
                        href={organisasiIndex()}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Organisasi
                    </Link>
                </nav>
            </div>
        </>
    );
}
