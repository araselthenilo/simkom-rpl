import ManajemenKeuangan from '@/components/admin/manajemen-keuangan';

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
        profil_organisasi?: {
            id_profil: number;
            organisasi?: {
                id_organisasi: number;
                nama_organisasi: string;
            };
        };
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

interface OrganisasiOption {
    id_organisasi: number;
    nama_organisasi: string;
}

interface ManajemenKeuanganPageProps {
    transactions?: Transaction[];
    activities?: ActivityOption[];
    organisasiList?: OrganisasiOption[];
    stats?: Stats;
}

export default function ManajemenKeuanganPage({
    transactions,
    activities,
    organisasiList,
    stats,
}: ManajemenKeuanganPageProps) {
    return (
        <ManajemenKeuangan
            transactions={transactions}
            activities={activities}
            organisasiList={organisasiList}
            stats={stats}
        />
    );
}
