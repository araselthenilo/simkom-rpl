import { Head, usePage } from '@inertiajs/react';
import TambahProfilOrganisasiForm from '@/components/admin/tambah-profil-organisasi-form';

interface PageProps {
    organisasi: {
        id_organisasi: number;
        nama_organisasi: string;
    };
    [key: string]: any;
}

export default function TambahProfilOrganisasiPage() {
    const { organisasi } = usePage<PageProps>().props;

    return (
        <>
            <Head
                title={`Tambah Profil - ${organisasi?.nama_organisasi || ''}`}
            />
            <TambahProfilOrganisasiForm organisasi={organisasi} />
        </>
    );
}
