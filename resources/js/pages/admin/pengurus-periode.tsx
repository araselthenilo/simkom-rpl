import { Head, usePage } from '@inertiajs/react';
import PengurusPeriode from '@/components/admin/pengurus-periode';

interface Mahasiswa {
    nim: string;
    nama_lengkap: string;
    program_studi: string;
    nomor_telepon: string | null;
}

interface AnggotaOrganisasi {
    id_keanggotaan: number;
    id_organisasi: number;
    nim: string;
    mahasiswa?: Mahasiswa;
}

interface Pengurus {
    id_pengurus: number;
    id_profil: number;
    id_keanggotaan: number;
    jabatan: string;
    status_aktif: boolean;
    anggota_organisasi?: AnggotaOrganisasi;
}

interface Organisasi {
    id_organisasi: number;
    nama_organisasi: string;
    status_aktif: boolean;
}

interface ProfilOrganisasi {
    id_profil: number;
    id_organisasi: number;
    periode_kepengurusan: string;
    logo_organisasi: string | null;
    deskripsi_organisasi: string;
    status_aktif: boolean;
    organisasi?: Organisasi;
    pengurus_organisasi?: Pengurus[];
}

interface PageProps {
    profilOrganisasi: ProfilOrganisasi;
    [key: string]: any;
}

export default function PengurusPeriodePage() {
    const { profilOrganisasi } = usePage<PageProps>().props;

    const orgName = profilOrganisasi?.organisasi?.nama_organisasi || '';
    const period = profilOrganisasi?.periode_kepengurusan || '';

    return (
        <>
            <Head title={`Pengurus Periode ${period} - ${orgName}`} />
            <PengurusPeriode profilOrganisasi={profilOrganisasi} />
        </>
    );
}
