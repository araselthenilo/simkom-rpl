import { Link } from '@inertiajs/react';
import type {
    LucideIcon
} from 'lucide-react';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Coins,
    BarChart3,
    Database,
    User,
    LogOut,
    Building2
} from 'lucide-react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { logout } from '@/routes';
import {
    dashboard as adminDashboard,
    organisasi as adminOrganisasi
} from '@/routes/admin';
import { keuangan, kegiatan } from '@/routes/pengurus';

interface NavItem {
    title: string;
    href: any;
    icon: LucideIcon;
}

export default function Sidepanel() {
    const { isCurrentUrl } = useCurrentUrl();

    const menuItems: NavItem[] = [
        { title: 'Dashboard', href: adminDashboard(), icon: LayoutDashboard },
        { title: 'Organisasi', href: adminOrganisasi(), icon: Building2 },
        { title: 'Kegiatan', href: kegiatan(), icon: Calendar },
        { title: 'Keuangan', href: keuangan(), icon: Coins },
        { title: 'Laporan', href: '/laporan', icon: BarChart3 },
        { title: 'Master Data', href: '/master-data', icon: Database },
    ];

    const bottomItems: NavItem[] = [
        { title: 'Profil Saya', href: '/profile', icon: User },
    ];

    return (
        <aside
            className="fixed left-0 top-0 h-full w-64 bg-primary dark:bg-primary-container text-on-primary shadow-lg flex flex-col p-unit-md z-50">
            <div className="mb-unit-xl px-4 py-2">
                <h1 className="font-headline-sm text-headline-sm font-bold text-on-primary">Admin Panel</h1>
                <p className="font-label-md text-label-md text-on-primary/70">SIMKOM STIKOM Bali</p>
            </div>

            <nav className="flex-1 space-y-unit-sm custom-scrollbar overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = isCurrentUrl(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                ? 'bg-secondary-container text-on-secondary-container border-l-4 border-secondary'
                                : 'text-on-primary/80 hover:text-on-primary hover:bg-on-primary/10'
                                }`}
                        >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <span className="font-label-lg text-label-lg">{item.title}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-unit-md border-t border-on-primary/10 space-y-unit-sm">
                {bottomItems.map((item) => {
                    const isActive = isCurrentUrl(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                ? 'bg-secondary-container text-on-secondary-container border-l-4 border-secondary'
                                : 'text-on-primary/80 hover:text-on-primary hover:bg-on-primary/10'
                                }`}
                        >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <span className="font-label-lg text-label-lg">{item.title}</span>
                        </Link>
                    );
                })}

                <Link
                    href={logout()}
                    method="post"
                    as="button"
                    className="flex w-full items-center gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:shadow-[0_0_15px_rgba(239,68,68,0.25)] border border-transparent hover:border-red-500/20 px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer text-left"
                >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    <span className="font-label-lg text-label-lg">Keluar</span>
                </Link>
            </div>
        </aside>
    );
}
