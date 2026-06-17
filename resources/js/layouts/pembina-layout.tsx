import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Footer from '@/components/pembina/footer';
import Sidepanel from '@/components/pembina/sidepanel';
import TopNavBar from '@/components/pembina/top-nav-bar';
import { useFlashToast } from '@/hooks/use-flash-toast';

export default function PembinaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    useFlashToast();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { url } = usePage();

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [url]);

    return (
        <div className="flex min-h-screen flex-col">
            <Head title="Dashboard" />
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-300 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <Sidepanel
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            <div className="flex flex-1 flex-col pl-0 transition-all duration-300 ease-in-out md:pl-64">
                <TopNavBar
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                />
                <main className="custom-scrollbar flex flex-1 flex-col overflow-y-auto">
                    <div className="flex-grow">{children}</div>
                    <div className="mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop">
                        <Footer />
                    </div>
                </main>
            </div>
        </div>
    );
}
