import { Head, usePage } from '@inertiajs/react';
import StaffManagement from '@/components/pengurus/staff-management';

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
    status_aktif: boolean;
}

interface Pengurus {
    id_pengurus: number;
    id_profil: number;
    id_keanggotaan: number;
    jabatan: string;
    status_aktif: boolean;
    anggota_organisasi?: AnggotaOrganisasi;
}

interface PageProps {
    pengurusList: Pengurus[];
    anggotaList: AnggotaOrganisasi[];
    organisasi: Organisasi;
    profil: ProfilOrganisasi;
    [key: string]: any;
}

export default function StaffIndexPage() {
    const { pengurusList = [], anggotaList = [], organisasi, profil } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Rekan Kerja Pengurus" />
            <StaffManagement
                pengurusList={pengurusList}
                anggotaList={anggotaList}
                organisasi={organisasi}
                profil={profil}
            />
        </>
    );
}
