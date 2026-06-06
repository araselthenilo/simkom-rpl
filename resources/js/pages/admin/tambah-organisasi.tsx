import { Head } from '@inertiajs/react';
import TambahOrganisasiForm from '@/components/admin/tambah-organisasi-form';

export default function TambahOrganisasiPage() {
    return (
        <>
            <Head title="Tambah Organisasi Baru" />
            <TambahOrganisasiForm />
        </>
    );
}
