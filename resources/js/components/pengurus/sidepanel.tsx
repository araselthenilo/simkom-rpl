import { Link } from '@inertiajs/react';
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
} from 'lucide-react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { toUrl } from '@/lib/utils';
import { logout, pengurus, home } from '@/routes';
import { keuangan, anggota, kegiatan } from '@/routes/pengurus';
import staff from '@/routes/pengurus/staff';
import { edit as profileEdit } from '@/routes/profile';

interface NavItem {
    title: string;
    href: any;
    icon: LucideIcon;
}

export default function Sidepanel({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const { isCurrentUrl } = useCurrentUrl();

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
        <aside className={`fixed top-0 left-0 z-50 flex h-full w-64 flex-col bg-primary p-unit-md text-on-primary shadow-lg dark:bg-primary-container transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="relative mb-unit-xl px-4 py-2">
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
