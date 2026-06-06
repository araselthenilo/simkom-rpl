import { Link, router, usePage } from '@inertiajs/react';
import { Bell, LogOut, Settings } from 'lucide-react';
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

export default function TopNavBar() {
    const { auth } = usePage().props;
    const getInitials = useInitials();
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    const initials = auth.user ? getInitials(auth.user.name) : 'U';

    return (
        <header
            className="bg-surface dark:bg-surface-dim shadow-sm border-b border-outline-variant h-16 flex items-center sticky top-0 z-40">
            <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop">
                <div className="flex items-center gap-unit-md">
                    <span className="font-headline-md text-headline-md font-bold text-primary">SIMKOM STIKOM Bali</span>
                </div>
                <div className="flex items-center gap-unit-lg">
                    <div className="hidden md:flex gap-unit-lg">
                        <a className="text-primary font-bold border-b-2 border-primary pb-1 font-body-md text-body-md"
                            href="#">Beranda</a>
                        <a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md"
                            href="#">Organisasi</a>
                        <a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md"
                            href="#">Profil</a>
                    </div>
                    <div className="flex items-center gap-4 ml-6">
                        <button
                            className="relative p-2 hover:bg-surface-container-low rounded-full transition-all active:scale-95 duration-100 cursor-pointer">
                            <Bell className="text-primary h-6 w-6" />
                            <span
                                className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
                        </button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-outline-variant bg-primary-fixed overflow-hidden transition-transform duration-200 hover:scale-105 focus:outline-none active:scale-95">
                                    {auth.user?.avatar ? (
                                        <img
                                            src={auth.user.avatar}
                                            alt="User Profile Avatar"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-sm font-semibold text-primary">{initials}</span>
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
                    </div>
                </div>
            </div>
        </header>
    );
}