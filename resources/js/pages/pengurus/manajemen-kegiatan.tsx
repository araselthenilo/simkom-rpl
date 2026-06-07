import ManajemenKegiatan from '@/components/pengurus/manajemen-kegiatan';

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
}

export default function ManajemenKegiatanPage({
    initialActivities = [],
}: {
    initialActivities?: Activity[];
}) {
    return <ManajemenKegiatan initialActivities={initialActivities} />;
}
