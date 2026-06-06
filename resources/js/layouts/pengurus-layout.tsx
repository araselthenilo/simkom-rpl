import { Head } from '@inertiajs/react';
import Footer from '@/components/pengurus/footer';
import Sidepanel from '@/components/pengurus/sidepanel';
import TopNavBar from '@/components/pengurus/top-nav-bar';

export default function PengurusLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <Head title="Dashboard" />
            <Sidepanel />
            <div className="pl-64 flex-1 flex flex-col">
                <TopNavBar />
                <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                    <div className="flex-grow">
                        {children}
                    </div>
                    <div className="w-full max-w-container-max mx-auto px-margin-desktop">
                        <Footer />
                    </div>
                </main>
            </div>
        </div>
    );
}