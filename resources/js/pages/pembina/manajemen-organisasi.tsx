import { Head, usePage } from '@inertiajs/react';
import ManajemenOrganisasi from '@/components/pembina/manajemen-organisasi';

interface PageProps {
    organisasi: any[];
    [key: string]: any;
}

export default function ManajemenOrganisasiPage() {
    const { organisasi } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Manajemen Organisasi" />
            <ManajemenOrganisasi organisasi={organisasi} />
        </>
    );
}
