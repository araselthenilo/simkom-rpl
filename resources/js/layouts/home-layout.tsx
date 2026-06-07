import Footer from '@/components/home/footer';
import TopNavbar from '@/components/home/top-navbar';
import { useFlashToast } from '@/hooks/use-flash-toast';
import { usePage, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';
import { User, Shield, Palette } from 'lucide-react';

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

export default function HomeLayout({
    title = '',
    description = '',
    children,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
}) {
    useFlashToast();
    const { component } = usePage();
    const { isCurrentOrParentUrl } = useCurrentUrl();

    const isSettingsPage = component.startsWith('settings/');

    return (
        <>
            <TopNavbar />
            <main>
                {isSettingsPage ? (
                    <div className="mx-auto max-w-container-max px-margin-desktop py-10">
                        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
                            <Heading
                                title="Settings"
                                description="Manage your profile and account settings"
                            />

                            <div className="flex flex-col lg:flex-row lg:space-x-12 mt-6">
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
                                                    'w-full justify-start cursor-pointer hover:bg-surface-container-low transition-all duration-200',
                                                    {
                                                        'bg-muted font-semibold': isCurrentOrParentUrl(item.href),
                                                    }
                                                )}
                                            >
                                                <Link href={item.href}>
                                                    {item.icon && (
                                                        <item.icon className="h-4 w-4 mr-2" />
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
                ) : (
                    children
                )}
            </main>
            <Footer />
        </>
    );
}
