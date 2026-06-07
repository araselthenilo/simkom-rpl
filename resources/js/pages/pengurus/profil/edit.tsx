import { Head } from '@inertiajs/react';
import ProposeProfilForm from '@/components/pengurus/propose-profil-form';

interface Profil {
    id_profil: number;
    id_organisasi: number;
    periode_kepengurusan: string;
    logo_organisasi: string;
    deskripsi_organisasi: string;
    visi_organisasi: string;
    misi_organisasi: string;
    status_aktif: boolean;
}

interface Organisasi {
    id_organisasi: number;
    nama_organisasi: string;
}

interface Props {
    profil: Profil;
    organisasi: Organisasi;
}

export default function EditProfilOrganisasiPage({
    profil,
    organisasi,
}: Props) {
    return (
        <>
            <Head
                title={`Ajukan Perubahan Profil - ${organisasi.nama_organisasi}`}
            />
            <ProposeProfilForm profil={profil} organisasi={organisasi} />
        </>
    );
}
