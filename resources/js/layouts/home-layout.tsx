import Footer from '@/components/home/footer';
import TopNavbar from '@/components/home/top-navbar';

export default function HomeLayout({
    title = '',
    description = '',
    children,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <>
            <TopNavbar />
            <main>{children}</main>
            <Footer />
        </>
    );
}
