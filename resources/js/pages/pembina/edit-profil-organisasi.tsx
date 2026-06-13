import { Head, usePage } from '@inertiajs/react';
import EditProfilOrganisasiForm from '@/components/pembina/edit-profil-organisasi-form';

interface PageProps {
    profilOrganisasi: any;
    [key: string]: any;
}

export default function EditProfilOrganisasiPage() {
    const { profilOrganisasi } = usePage<PageProps>().props;

    return (
        <>
            <Head
                title={`Edit Profil - ${profilOrganisasi.organisasi?.nama_organisasi || ''}`}
            />
            <EditProfilOrganisasiForm profilOrganisasi={profilOrganisasi} />
        </>
    );
}
