import Footer from '@/components/home/footer';
import TopNavbar from '@/components/home/top-navbar';
import { useFlashToast } from '@/hooks/use-flash-toast';

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

    return (
        <>
            <TopNavbar />
            <main>{children}</main>
            <Footer />
        </>
    );
}
