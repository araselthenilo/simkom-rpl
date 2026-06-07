import ManajemenKegiatan from '@/components/admin/manajemen-kegiatan';

interface Activity {
    id_kegiatan: number;
    id_profil: number;
    username_petugas: string | null;
    nama_kegiatan: string;
    jenis_kegiatan: 'Seminar' | 'Pelatihan' | 'Lomba' | 'Pengabdian Masyarakat';
    deskripsi_kegiatan: string;
    biaya_pendaftaran: number;
    tanggal_pelaksanaan: string;
    lokasi_kegiatan: string;
    kuota_peserta: number;
    status_kegiatan:
        | 'Mendatang'
        | 'Sedang berlangsung'
        | 'Selesai'
        | 'Dibatalkan';
    alasan_pembatalan: string | null;
    profil_organisasi?: {
        id_profil: number;
        id_organisasi: number;
        periode_kepengurusan: string;
        organisasi?: {
            id_organisasi: number;
            nama_organisasi: string;
        };
    };
}

interface ProfilOrganisasi {
    id_profil: number;
    id_organisasi: number;
    periode_kepengurusan: string;
    status_aktif: boolean;
    organisasi?: {
        id_organisasi: number;
        nama_organisasi: string;
    };
}

export default function ManajemenKegiatanPage({
    initialActivities = [],
    profilList = [],
}: {
    initialActivities?: Activity[];
    profilList?: ProfilOrganisasi[];
}) {
    return (
        <ManajemenKegiatan
            initialActivities={initialActivities}
            profilList={profilList}
        />
    );
}

