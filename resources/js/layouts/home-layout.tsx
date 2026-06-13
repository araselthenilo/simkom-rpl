import Footer from '@/components/home/footer';
import TopNavbar from '@/components/home/top-navbar';
import { useFlashToast } from '@/hooks/use-flash-toast';

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    useFlashToast();

    return (
        <div className="flex min-h-screen flex-col">
            <TopNavbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
