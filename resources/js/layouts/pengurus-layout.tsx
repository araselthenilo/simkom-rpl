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
        <div className="flex min-h-screen flex-col">
            <Head title="Dashboard" />
            <Sidepanel />
            <div className="flex flex-1 flex-col pl-64">
                <TopNavBar />
                <main className="custom-scrollbar flex flex-1 flex-col overflow-y-auto">
                    <div className="flex-grow">{children}</div>
                    <div className="mx-auto w-full max-w-container-max px-margin-desktop">
                        <Footer />
                    </div>
                </main>
            </div>
        </div>
    );
}
