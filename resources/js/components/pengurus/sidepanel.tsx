import { Link, usePage } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import {
    LayoutDashboard,
    Users,
    Users2,
    Calendar,
    Coins,
    LogOut,
    ArrowLeft,
    User,
    X,
    Building2,
    ChevronDown,
    ChevronUp,
    Check,
} from 'lucide-react';
import { useState } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { toUrl } from '@/lib/utils';
import { logout, pengurus, home } from '@/routes';
import {
    keuangan,
    anggota,
    kegiatan,
    switchOrganisasi,
    profil,
} from '@/routes/pengurus';
import staff from '@/routes/pengurus/staff';
import { edit as profileEdit } from '@/routes/profile';

interface NavItem {
    title: string;
    href: any;
    icon: LucideIcon;
}

export default function Sidepanel({
    isOpen,
    onClose,
}: {
    isOpen?: boolean;
    onClose?: () => void;
}) {
    const { isCurrentUrl } = useCurrentUrl();
    const { active_organization, staff_organizations } = usePage<any>().props;
    const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);

    const menuItems: NavItem[] = [
        { title: 'Dashboard', href: pengurus(), icon: LayoutDashboard },
        { title: 'Anggota', href: anggota(), icon: Users },
        { title: 'Pengurus', href: staff.index(), icon: Users2 },
        { title: 'Kegiatan', href: kegiatan(), icon: Calendar },
        { title: 'Keuangan', href: keuangan(), icon: Coins },
    ];

    const bottomItems: NavItem[] = [
        {
            title: 'Profil Saya',
            href: profileEdit({ query: { from: 'staff' } }),
            icon: User,
        },
        { title: 'Kembali ke Beranda', href: home(), icon: ArrowLeft },
    ];

    return (
        <aside
            className={`fixed top-0 left-0 z-50 flex h-full w-64 flex-col bg-primary p-unit-md text-on-primary shadow-lg transition-transform duration-300 ease-in-out md:translate-x-0 dark:bg-primary-container ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className="relative mb-unit-lg px-4 py-2">
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 rounded-md p-1.5 text-on-primary/70 hover:bg-on-primary/10 hover:text-on-primary md:hidden"
                    aria-label="Close menu"
                >
                    <X className="h-5 w-5" />
                </button>
                <h1 className="font-headline-sm text-headline-sm font-bold text-on-primary">
                    Staff Panel
                </h1>
                <p className="font-label-md text-label-md text-on-primary/70">
                    SIMKOM ITB STIKOM Bali
                </p>
            </div>

            {/* Mobile-only Organization Switcher and Profil Link */}
            {((staff_organizations && staff_organizations.length > 0) ||
                active_organization) && (
                <div className="mb-unit-md flex-shrink-0 border-b border-on-primary/10 px-4 pb-unit-md md:hidden">
                    <div className="flex flex-col gap-unit-sm">
                        <span className="text-[10px] font-bold tracking-wider text-on-primary/50 uppercase">
                            Organisasi
                        </span>

                        {/* Switcher Button */}
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setIsOrgDropdownOpen(!isOrgDropdownOpen)
                                }
                                className="flex w-full items-center justify-between gap-2 rounded-lg bg-on-primary/10 px-3 py-2 text-left text-on-primary transition-colors hover:bg-on-primary/15 focus:outline-none"
                            >
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center overflow-hidden rounded border border-on-primary/20 bg-on-primary/5">
                                        {active_organization?.logo_organisasi ? (
                                            <img
                                                src={`/storage/${active_organization.logo_organisasi}`}
                                                alt=""
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-[10px] font-bold text-on-primary">
                                                {active_organization
                                                    ? active_organization.nama_organisasi
                                                          .substring(0, 2)
                                                          .toUpperCase()
                                                    : 'Org'}
                                            </span>
                                        )}
                                    </div>
                                    <span className="truncate text-body-sm font-medium">
                                        {active_organization
                                            ? active_organization.nama_organisasi
                                            : 'Pilih Organisasi'}
                                    </span>
                                </div>
                                {isOrgDropdownOpen ? (
                                    <ChevronUp className="h-4 w-4 flex-shrink-0" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 flex-shrink-0" />
                                )}
                            </button>

                            {/* Dropdown Options */}
                            {isOrgDropdownOpen &&
                                staff_organizations &&
                                staff_organizations.length > 0 && (
                                    <div className="absolute right-0 left-0 z-50 mt-1 max-h-40 overflow-y-auto rounded-lg border border-on-primary/15 bg-primary p-1 shadow-xl">
                                        {staff_organizations.map((org: any) => (
                                            <Link
                                                key={org.id_organisasi}
                                                href={switchOrganisasi(
                                                    org.id_organisasi,
                                                )}
                                                className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-body-sm transition-colors hover:bg-on-primary/10 ${
                                                    active_organization?.id_organisasi ===
                                                    org.id_organisasi
                                                        ? 'bg-on-primary/10 font-semibold text-on-primary'
                                                        : 'text-on-primary/80'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center overflow-hidden rounded border border-on-primary/20 bg-on-primary/5">
                                                        {org.logo_organisasi ? (
                                                            <img
                                                                src={`/storage/${org.logo_organisasi}`}
                                                                alt=""
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-[9px] font-bold">
                                                                {org.nama_organisasi
                                                                    .substring(
                                                                        0,
                                                                        2,
                                                                    )
                                                                    .toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="truncate">
                                                        {org.nama_organisasi}
                                                    </span>
                                                </div>
                                                {active_organization?.id_organisasi ===
                                                    org.id_organisasi && (
                                                    <Check className="h-3.5 w-3.5 flex-shrink-0 text-on-primary" />
                                                )}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                        </div>

                        {/* Profil Organisasi Link */}
                        {active_organization && (
                            <Link
                                href={profil()}
                                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                                    isCurrentUrl(profil())
                                        ? 'border-l-4 border-secondary bg-secondary-container font-semibold text-on-secondary-container'
                                        : 'text-on-primary/80 hover:bg-on-primary/10 hover:text-on-primary'
                                }`}
                            >
                                <Building2 className="h-5 w-5 flex-shrink-0" />
                                <span className="font-label-lg text-label-lg">
                                    Profil Organisasi
                                </span>
                            </Link>
                        )}
                    </div>
                </div>
            )}

            <nav className="custom-scrollbar flex-1 space-y-unit-sm overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = isCurrentUrl(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                                isActive
                                    ? 'border-l-4 border-secondary bg-secondary-container text-on-secondary-container'
                                    : 'text-on-primary/80 hover:bg-on-primary/10 hover:text-on-primary'
                            }`}
                        >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <span className="font-label-lg text-label-lg">
                                {item.title}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto space-y-unit-sm border-t border-on-primary/10 pt-unit-md">
                {bottomItems.map((item) => {
                    const isActive = isCurrentUrl(
                        toUrl(item.href).split('?')[0],
                    );
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                                isActive
                                    ? 'border-l-4 border-secondary bg-secondary-container text-on-secondary-container'
                                    : 'text-on-primary/80 hover:bg-on-primary/10 hover:text-on-primary'
                            }`}
                        >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <span className="font-label-lg text-label-lg">
                                {item.title}
                            </span>
                        </Link>
                    );
                })}

                <Link
                    href={logout()}
                    method="post"
                    as="button"
                    className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-transparent px-4 py-3 text-left text-red-400 transition-all duration-300 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.25)]"
                >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    <span className="font-label-lg text-label-lg">Keluar</span>
                </Link>
            </div>
        </aside>
    );
}
