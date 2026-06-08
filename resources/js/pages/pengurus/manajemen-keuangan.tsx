import ManajemenKeuangan from '@/components/pengurus/manajemen-keuangan';

interface Transaction {
    id_transaksi: number;
    id_kegiatan: number;
    jenis_transaksi: 'Pemasukan' | 'Pengeluaran';
    nominal_transaksi: number;
    tanggal_transaksi: string;
    sumber_tujuan_transaksi: string;
    foto_bukti_transaksi: string | null;
    catatan_koreksi: string | null;
    created_at: string | null;
    kegiatan: {
        id_kegiatan: number;
        nama_kegiatan: string;
    } | null;
}

interface Stats {
    total_saldo: number;
    total_pemasukan: number;
    total_pengeluaran: number;
}

interface ActivityOption {
    id_kegiatan: number;
    nama_kegiatan: string;
}

interface ManajemenKeuanganPageProps {
    transactions?: Transaction[];
    activities?: ActivityOption[];
    stats?: Stats;
}

export default function ManajemenKeuanganPage({ transactions, activities, stats }: ManajemenKeuanganPageProps) {
    return <ManajemenKeuangan transactions={transactions} activities={activities} stats={stats} />;
}
