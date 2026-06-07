import PesertaKegiatan from '@/components/pengurus/peserta-kegiatan';

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

interface Mahasiswa {
    nim: string;
    nama_lengkap: string;
    program_studi: string;
    nomor_telepon: string;
}

interface TransaksiKeuangan {
    id_transaksi: number;
    jenis_transaksi: 'Pemasukan' | 'Pengeluaran';
    nominal_transaksi: number;
    tanggal_transaksi: string;
    sumber_tujuan_transaksi: string;
    foto_bukti_transaksi: string;
    catatan_koreksi: string | null;
}

interface Peserta {
    id_peserta: number;
    nim: string;
    id_kegiatan: number;
    id_transaksi: number | null;
    created_at: string;
    updated_at: string;
    mahasiswa: Mahasiswa;
    transaksi_keuangan?: TransaksiKeuangan | null;
    transaksiKeuangan?: TransaksiKeuangan | null;
}

interface Props {
    kegiatan: Activity;
    pesertaList: Peserta[];
}

export default function PesertaKegiatanPage({
    kegiatan,
    pesertaList = [],
}: Props) {
    return <PesertaKegiatan kegiatan={kegiatan} pesertaList={pesertaList} />;
}
