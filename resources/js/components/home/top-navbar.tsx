import { Head } from '@inertiajs/react';
import { Bell, Menu } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function TopNavbar({
    notificationsCount = 0,
}: {
    notificationsCount?: number;
}) {
    const [isHidden, setIsHidden] = useState(false);
    const lastScrollY = useRef(0);
    const count = notificationsCount;

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

    return (
        <>
            <Head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap"
                    rel="stylesheet"
                />
            </Head>
            <header
                className={`sticky top-0 z-50 w-full transform border-b border-outline-variant bg-surface shadow-sm transition-transform duration-300 ease-out dark:border-outline dark:bg-surface-dim ${
                    isHidden ? '-translate-y-full' : 'translate-y-0'
                }`}
            >
                <div className="mx-auto flex h-16 w-full max-w-container-max items-center justify-between px-4 md:px-margin-desktop">
                    <div className="flex min-w-0 items-center gap-unit-md">
                        <span className="dark:text-primary-fixed text-title-md truncate font-bold text-primary md:text-headline-md">
                            SIMKOM ITB STIKOM Bali
                        </span>
                    </div>

                    <nav className="hidden items-center gap-8 md:flex">
                        <a
                            className="border-b-2 border-primary pb-1 font-body-md text-body-md font-bold text-primary"
                            href="#"
                        >
                            Beranda
                        </a>
                        <a
                            className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary"
                            href="#"
                        >
                            Organisasi
                        </a>
                        <a
                            className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary"
                            href="#"
                        >
                            Profil
                        </a>
                    </nav>

                    {/* Added shrink-0 to prevent the actions container from compressing */}
                    <div className="flex shrink-0 items-center gap-2 sm:gap-unit-lg">
                        <button className="group relative cursor-pointer rounded-full p-2 text-primary transition-all hover:bg-primary hover:text-on-primary active:scale-95">
                            <Bell />
                            {count > 0 && (
                                <span className="absolute top-3 right-3 inline-flex translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-red-600 px-1.5 py-0.5 text-xs leading-none font-bold text-red-100 group-hover:hidden">
                                    {count > 99 ? '99+' : count}
                                </span>
                            )}
                        </button>
                        <div className="h-10 w-10 overflow-hidden rounded-full border border-outline-variant">
                            <img
                                alt="User Profile Avatar"
                                className="h-full w-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWfe2W7lMso6eT2GVarQ48jLGdzbtOcfr2j9UcriGpf-cutBQ_E_bR5qwHpswsd2URt2GoKVNSMcVzoajAp7ts0gidDniu-nKH04sJH_xpm5wmMCWCuQ_jm72PJIdOCiMjEnu9BfO6kR8eozhTzQ-ENJSP69_WGXEaVljldtM5uMfNqL3NryO3u6PY0PMDuYZE06UtEKbwmgJQiPy-joGGVdHlCdv8M7GvS16gz8xTKWl7-T_wabL6_4hmoHSGGw3cVQCB1ciYtRM"
                            />
                        </div>
                        <button className="text-primary md:hidden">
                            <Menu />
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
}
