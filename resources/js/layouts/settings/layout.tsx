import { Link, usePage } from '@inertiajs/react';
import { Palette, Shield, User } from 'lucide-react';
import { useState, type PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import HomeLayout from '@/layouts/home-layout';
import AdminLayout from '@/layouts/admin-layout';
import PengurusLayout from '@/layouts/pengurus-layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { Auth, NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: User,
    },
    {
        title: 'Security',
        href: editSecurity(),
        icon: Shield,
    },
    {
        title: 'Appearance',
        href: editAppearance(),
        icon: Palette,
    },
];

type PageProps = {
    auth: Auth;
    [key: string]: any;
};

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const { auth } = usePage<PageProps>().props;

    // Detect if the user came from the staff panel or the student portal
    const [layoutContext] = useState<'student' | 'staff'>(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const fromParam = urlParams.get('from');
            if (fromParam === 'staff') {
                sessionStorage.setItem('settings_layout_context', 'staff');
                return 'staff';
            } else if (fromParam === 'student') {
                sessionStorage.setItem('settings_layout_context', 'student');
                return 'student';
            }
            const cached = sessionStorage.getItem('settings_layout_context');
            if (cached === 'staff' || cached === 'student') {
                return cached;
            }
        }
        // Default context
        if (auth.user?.role === 'Admin Kemahasiswaan') {
            return 'staff';
        }
        return 'student';
    });

    const content = (
        <div className="mx-auto max-w-container-max px-margin-desktop py-10">
            <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm animate-in fade-in duration-300">
                <Heading
                    title="Settings"
                    description="Manage your profile and account settings"
                />

                <div className="mt-6 flex flex-col lg:flex-row lg:space-x-12">
                    <aside className="w-full max-w-xl lg:w-48">
                        <nav
                            className="flex flex-col space-y-1 space-x-0"
                            aria-label="Settings"
                        >
                            {sidebarNavItems.map((item, index) => (
                                <Button
                                    key={`${toUrl(item.href)}-${index}`}
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                    className={cn(
                                        'w-full cursor-pointer justify-start transition-all duration-200 hover:bg-surface-container-low',
                                        {
                                            'bg-muted font-semibold':
                                                isCurrentOrParentUrl(
                                                    item.href,
                                                ),
                                        },
                                    )}
                                >
                                    <Link href={`${toUrl(item.href)}?from=${layoutContext}`}>
                                        {item.icon && (
                                            <item.icon className="mr-2 h-4 w-4" />
                                        )}
                                        {item.title}
                                    </Link>
                                </Button>
                            ))}
                        </nav>
                    </aside>

                    <Separator className="my-6 lg:hidden" />

                    <div className="flex-1 md:max-w-2xl">
                        <section className="max-w-xl space-y-12">
                            {children}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );

    if (layoutContext === 'student') {
        return <HomeLayout>{content}</HomeLayout>;
    }

    if (auth.user?.role === 'Admin Kemahasiswaan') {
        return <AdminLayout>{content}</AdminLayout>;
    }

    if (auth.user?.role === 'Mahasiswa') {
        if (layoutContext === 'staff') {
            return <PengurusLayout>{content}</PengurusLayout>;
        }
        return <HomeLayout>{content}</HomeLayout>;
    }

    return <HomeLayout>{content}</HomeLayout>;
}
