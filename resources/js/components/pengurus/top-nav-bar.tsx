import { Link, router, usePage } from '@inertiajs/react';
import { Bell, LogOut, Settings, ChevronDown, Check, Menu } from 'lucide-react';
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
import { switchOrganisasi, profil } from '@/routes/pengurus';
import { edit } from '@/routes/profile';

export default function TopNavBar({ onMenuClick }: { onMenuClick?: () => void }) {
    const { auth, active_organization, staff_organizations } =
        usePage<any>().props;
    const getInitials = useInitials();
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    const initials = auth.user ? getInitials(auth.user.name) : 'U';
    const displayRole = active_organization?.jabatan || auth.user?.role;

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center border-b border-outline-variant bg-surface shadow-sm dark:bg-surface-dim">
            <div className="flex w-full items-center justify-between px-margin-mobile md:px-margin-desktop">
                <div className="flex items-center gap-unit-md overflow-hidden">
                    <button
                        onClick={onMenuClick}
                        className="mr-1 rounded-lg p-1.5 text-on-surface hover:bg-surface-container-low md:hidden"
                        aria-label="Toggle Menu"
                    >
                        <Menu className="h-5 w-5 flex-shrink-0" />
                    </button>
                    {active_organization ? (
                        <div className="flex items-center gap-2 overflow-hidden sm:gap-3">
                            <div className="flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-outline-variant/50 bg-surface-container-high">
                                {active_organization.logo_organisasi ? (
                                    <img
                                        src={`/storage/${active_organization.logo_organisasi}`}
                                        alt={`${active_organization.nama_organisasi} Logo`}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-xs sm:text-sm font-bold text-primary">
                                        {active_organization.nama_organisasi
                                            .substring(0, 2)
                                            .toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <span className="truncate font-headline-md text-headline-sm md:text-headline-md font-bold text-primary">
                                {active_organization.nama_organisasi}
                            </span>
                        </div>
                    ) : (
                        <span className="truncate font-headline-md text-headline-sm md:text-headline-md font-bold text-primary">
                            SIMKOM STIKOM Bali
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-unit-lg">
                    <div className="hidden gap-unit-lg md:flex">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary focus:outline-none">
                                    Organisasi
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="start">
                                {staff_organizations &&
                                staff_organizations.length > 0 ? (
                                    staff_organizations.map((org: any) => (
                                        <DropdownMenuItem
                                            key={org.id_organisasi}
                                            asChild
                                        >
                                            <Link
                                                href={switchOrganisasi(
                                                    org.id_organisasi,
                                                )}
                                                className="flex w-full cursor-pointer items-center justify-between gap-2"
                                            >
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center overflow-hidden rounded border border-outline-variant/30 bg-surface-container-high">
                                                        {org.logo_organisasi ? (
                                                            <img
                                                                src={`/storage/${org.logo_organisasi}`}
                                                                alt=""
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-[10px] font-bold text-primary">
                                                                {org.nama_organisasi
                                                                    .substring(
                                                                        0,
                                                                        2,
                                                                    )
                                                                    .toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="truncate font-body-sm">
                                                        {org.nama_organisasi}
                                                    </span>
                                                </div>
                                                {active_organization?.id_organisasi ===
                                                    org.id_organisasi && (
                                                    <Check className="h-4 w-4 flex-shrink-0 text-primary" />
                                                )}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))
                                ) : (
                                    <div className="px-2 py-1.5 text-xs text-on-surface-variant italic">
                                        Tidak ada organisasi
                                    </div>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Link
                            className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary"
                            href={profil()}
                        >
                            Profil Organisasi
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
                                            {displayRole}
                                        </span>
                                    </div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuItem asChild>
                                    <Link
                                        className="block w-full cursor-pointer"
                                        href={edit.url({
                                            query: { from: 'staff' },
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
                    </div>
                </div>
            </div>
        </header>
    );
}
