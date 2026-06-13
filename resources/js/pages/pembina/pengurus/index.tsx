import { Head, usePage } from '@inertiajs/react';
import PengurusManagement from '@/components/pembina/pengurus-management';

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
    profil_organisasi?: any[];
}

interface Pengurus {
    id_pengurus: number;
    id_profil: number;
    id_keanggotaan: number;
    jabatan: string;
    status_aktif: boolean;
    anggota_organisasi?: AnggotaOrganisasi;
    profil_organisasi?: any;
}

interface PageProps {
    organisasiList: Organisasi[];
    anggotaList: AnggotaOrganisasi[];
    pengurusList: Pengurus[];
    [key: string]: any;
}

export default function PengurusIndexPage() {
    const {
        organisasiList = [],
        anggotaList = [],
        pengurusList = [],
    } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Manajemen Pengurus Organisasi" />
            <PengurusManagement
                organisasiList={organisasiList}
                anggotaList={anggotaList}
                pengurusList={pengurusList}
            />
        </>
    );
}
