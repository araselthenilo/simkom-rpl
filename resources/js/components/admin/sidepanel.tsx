import { Link } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Coins,
    BarChart3,
    Database,
    User,
    LogOut,
    Building2,
    FileText,
    FileImage,
    X,
} from 'lucide-react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { logout } from '@/routes';
import admin from '@/routes/admin';

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

    const menuItems: NavItem[] = [
        { title: 'Dashboard', href: admin.dashboard(), icon: LayoutDashboard },
        { title: 'Organisasi', href: admin.organisasi(), icon: Building2 },
        { title: 'Pengurus', href: admin.pengurus.index(), icon: Users },
        {
            title: 'Pengajuan Profil',
            href: admin.pengajuanProfil.index().url,
            icon: FileText,
        },
        {
            title: 'Dokumentasi Kegiatan',
            href: admin.dokumentasiKegiatan.index().url,
            icon: FileImage,
        },
        { title: 'Kegiatan', href: admin.kegiatan.index(), icon: Calendar },
        { title: 'Keuangan', href: admin.keuangan.index(), icon: Coins },
        { title: 'Laporan', href: admin.laporan.index(), icon: BarChart3 },
    ];

    const bottomItems: NavItem[] = [
        { title: 'Profil Saya', href: profileEdit(), icon: User },
    ];

    return (
        <aside
            className={`fixed top-0 left-0 z-50 flex h-full w-64 flex-col bg-primary p-unit-md text-on-primary shadow-lg transition-transform duration-300 ease-in-out md:translate-x-0 dark:bg-primary-container ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className="relative mb-unit-xl px-4 py-2">
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 rounded-md p-1.5 text-on-primary/70 hover:bg-on-primary/10 hover:text-on-primary md:hidden"
                    aria-label="Close menu"
                >
                    <X className="h-5 w-5" />
                </button>
                <h1 className="font-headline-sm text-headline-sm font-bold text-on-primary">
                    Admin Panel
                </h1>
                <p className="font-label-md text-label-md text-on-primary/70">
                    SIMKOM STIKOM Bali
                </p>
            </div>

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
