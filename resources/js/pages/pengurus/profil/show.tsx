import { Head } from '@inertiajs/react';
import ProfilDetail from '@/components/pengurus/profil-detail';

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

interface LatestProposal {
    id_pengajuan: number;
    periode_kepengurusan: string;
    status_pengajuan: 'Diproses' | 'Diterima' | 'Ditolak';
    created_at: string;
}

interface Props {
    profil: Profil;
    organisasi: Organisasi;
    latestProposal: LatestProposal | null;
}

export default function ShowProfilOrganisasiPage({
    profil,
    organisasi,
    latestProposal,
}: Props) {
    return (
        <>
            <Head title={`Profil ${organisasi.nama_organisasi}`} />
            <ProfilDetail
                profil={profil}
                organisasi={organisasi}
                latestProposal={latestProposal}
            />
        </>
    );
}
