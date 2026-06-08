import { useForm } from '@inertiajs/react';
import {
    Wallet,
    PlusCircle,
    TrendingUp,
    Search,
    Filter,
    ArrowUp,
    ArrowDown,
    Receipt,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    UploadCloud,
    FileText,
    Coins,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

interface ManajemenKeuanganProps {
    transactions?: Transaction[];
    activities?: ActivityOption[];
    stats?: Stats;
}

export default function ManajemenKeuangan({
    transactions = [],
    activities = [],
    stats,
}: ManajemenKeuanganProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [selectedKegiatanId, setSelectedKegiatanId] = useState<string>('all');
    const [selectedJenis, setSelectedJenis] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('newest');
    const [selectedStatsActivityId, setSelectedStatsActivityId] = useState<string>('all');

    // Dynamic stats computation based on selected activity for stats
    const computedStats = React.useMemo(() => {
        if (selectedStatsActivityId === 'all' && stats) {
            return {
                totalSaldo: stats.total_saldo,
                totalPemasukan: stats.total_pemasukan,
                totalPengeluaran: stats.total_pengeluaran,
            };
        }

        const filtered = transactions.filter((t) => {
            return selectedStatsActivityId === 'all' || t.id_kegiatan === parseInt(selectedStatsActivityId, 10);
        });

        const totalPemasukan = filtered
            .filter((t) => t.jenis_transaksi === 'Pemasukan')
            .reduce((sum, t) => sum + t.nominal_transaksi, 0);

        const totalPengeluaran = filtered
            .filter((t) => t.jenis_transaksi === 'Pengeluaran')
            .reduce((sum, t) => sum + t.nominal_transaksi, 0);

        const totalSaldo = totalPemasukan - totalPengeluaran;

        return {
            totalSaldo,
            totalPemasukan,
            totalPengeluaran,
        };
    }, [transactions, selectedStatsActivityId, stats]);

    // Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    // Form Hook
    const { data, setData, post, put, processing, errors, reset } = useForm({
        id_kegiatan: '',
        jenis_transaksi: 'Pemasukan' as 'Pemasukan' | 'Pengeluaran',
        nominal_transaksi: '',
        tanggal_transaksi: new Date().toISOString().split('T')[0],
        sumber_tujuan_transaksi: '',
        foto_bukti_transaksi: null as File | null,
        catatan_koreksi: '',
    });

    // Check query parameter to trigger modal on load
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        if (params.get('create') === 'true' || params.get('id_kegiatan')) {
            const kid = params.get('id_kegiatan');

            if (kid) {
                setData('id_kegiatan', kid);
            }

            setTimeout(() => {
                setIsCreateModalOpen(true);
            }, 0);

            // Clean up the URL query parameters
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Clean up file preview URL
    useEffect(() => {
        return () => {
            if (filePreview) {
                URL.revokeObjectURL(filePreview);
            }
        };
    }, [filePreview]);

    const handleFileChange = (file: File | null) => {
        if (!file) {
            setData('foto_bukti_transaksi', null);
            setFilePreview(null);

            return;
        }

        setData('foto_bukti_transaksi', file);

        if (filePreview) {
            URL.revokeObjectURL(filePreview);
        }

        if (file.type.startsWith('image/')) {
            setFilePreview(URL.createObjectURL(file));
        } else {
            setFilePreview(null);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) {
return '0 Bytes';
}

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleCloseModal = () => {
        setIsCreateModalOpen(false);
        setSelectedTransaction(null);
        reset();
        setFilePreview(null);
    };

    const handleKoreksi = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setData({
            id_kegiatan: transaction.id_kegiatan.toString(),
            jenis_transaksi: transaction.jenis_transaksi,
            nominal_transaksi: transaction.nominal_transaksi.toString(),
            tanggal_transaksi: transaction.tanggal_transaksi,
            sumber_tujuan_transaksi: transaction.sumber_tujuan_transaksi,
            foto_bukti_transaksi: null,
            catatan_koreksi: transaction.catatan_koreksi || '',
        });
        setIsCreateModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedTransaction) {
            put(`/pengurus/keuangan/${selectedTransaction.id_transaksi}`, {
                onSuccess: () => {
                    handleCloseModal();
                },
            });
        } else {
            post('/pengurus/keuangan/store', {
                forceFormData: true,
                onSuccess: () => {
                    handleCloseModal();
                },
            });
        }
    };

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        })
            .format(value)
            .replace('IDR', 'Rp');
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) {
return '';
}

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const parts = dateStr.split('-');

        if (parts.length === 3) {
            const day = parseInt(parts[2], 10);
            const monthIdx = parseInt(parts[1], 10) - 1;
            const year = parts[0];

            return `${day} ${months[monthIdx]} ${year}`;
        }

        const d = new Date(dateStr);

        if (isNaN(d.getTime())) {
return dateStr;
}

        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    };

    const formatTime = (timeStr?: string | null) => {
        if (!timeStr) {
return '--:-- WITA';
}

        const d = new Date(timeStr);

        if (isNaN(d.getTime())) {
return '';
}

        const pad = (n: number) => n.toString().padStart(2, '0');

        return `${pad(d.getHours())}:${pad(d.getMinutes())} WITA`;
    };

    const filteredTransactions = transactions
        .filter((t) => {
            const query = searchQuery.toLowerCase();
            const purpose = (t.sumber_tujuan_transaksi || '').toLowerCase();
            const invoice = (t.foto_bukti_transaksi || '').toLowerCase();
            const kegiatanName = (t.kegiatan?.nama_kegiatan || '').toLowerCase();
            const matchesQuery = purpose.includes(query) || invoice.includes(query) || kegiatanName.includes(query);

            const matchesKegiatan =
                selectedKegiatanId === 'all' ||
                t.id_kegiatan === parseInt(selectedKegiatanId, 10);

            const matchesJenis =
                selectedJenis === 'all' ||
                t.jenis_transaksi.toLowerCase() === selectedJenis.toLowerCase();

            return matchesQuery && matchesKegiatan && matchesJenis;
        })
        .sort((a, b) => {
            const dateA = new Date(a.tanggal_transaksi).getTime();
            const dateB = new Date(b.tanggal_transaksi).getTime();

            if (sortBy === 'newest') {
                if (dateA !== dateB) {
return dateB - dateA;
}

                return b.id_transaksi - a.id_transaksi;
            } else {
                if (dateA !== dateB) {
return dateA - dateB;
}

                return a.id_transaksi - b.id_transaksi;
            }
        });

    const totalStatsAmount = computedStats.totalPemasukan + computedStats.totalPengeluaran;
    const pemasukanPercent = totalStatsAmount > 0 ? (computedStats.totalPemasukan / totalStatsAmount) * 100 : 0;
    const pengeluaranPercent = totalStatsAmount > 0 ? (computedStats.totalPengeluaran / totalStatsAmount) * 100 : 0;

    let financialStatus = 'Seimbang';

    if (computedStats.totalSaldo > 0) {
        financialStatus = 'Sehat & Stabil';
    } else if (computedStats.totalSaldo < 0) {
        financialStatus = 'Defisit (Evaluasi)';
    }

    return (
        <div className="mx-auto w-full max-w-container-max space-y-gutter p-margin-desktop">
            {/* Header Section */}
            <section className="flex flex-col items-start justify-between gap-gutter md:flex-row md:items-center">
                <div className="space-y-unit-xs">
                    <h2 className="font-headline-lg text-headline-lg text-primary">
                        Manajemen Buku Kas
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        Lacak dan kelola semua mutasi keuangan organisasi.
                    </p>
                </div>
                <div className="flex w-full flex-col items-stretch gap-gutter sm:flex-row sm:items-center md:w-auto">
                    <Card className="flex items-center gap-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 px-unit-lg shadow-sm ring-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container/20 text-on-secondary-container">
                            <Wallet className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-label-md text-label-md text-on-surface-variant">
                                Total Saldo Saat Ini
                            </p>
                            <p className="font-headline-sm text-headline-sm font-bold text-primary">
                                {formatRupiah(computedStats.totalSaldo)}
                            </p>
                        </div>
                    </Card>
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex h-auto cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3 font-label-lg text-label-lg !text-on-primary transition-all duration-100 hover:bg-primary/95 hover:shadow-lg active:scale-95"
                    >
                        <PlusCircle className="h-5 w-5" />
                        Catat Transaksi
                    </Button>
                </div>
            </section>

            {/* Stats Filter Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-sm text-primary">Filter Statistik Kegiatan</span>
                </div>
                <select
                    value={selectedStatsActivityId}
                    onChange={(e) => setSelectedStatsActivityId(e.target.value)}
                    className="w-full sm:w-72 cursor-pointer rounded-lg border border-outline-variant/50 bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                    <option value="all">Semua Kegiatan (Total)</option>
                    {activities.map((act) => (
                        <option key={act.id_kegiatan} value={act.id_kegiatan}>
                            {act.nama_kegiatan}
                        </option>
                    ))}
                </select>
            </div>

            {/* Stats Bento Grid */}
            <section className="grid grid-cols-1 gap-unit-lg md:grid-cols-4">
                <Card className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-unit-lg shadow-sm ring-0 md:col-span-1">
                    <p className="mb-1 font-label-md text-label-md tracking-wider text-on-surface-variant uppercase">
                        Total Pemasukan
                    </p>
                    <p className="font-headline-md text-headline-md font-bold text-green-600">
                        + {formatRupiah(computedStats.totalPemasukan)}
                    </p>
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-green-100 dark:bg-green-950">
                        <div className="h-full bg-green-500" style={{ width: `${pemasukanPercent}%` }} />
                    </div>
                </Card>
                <Card className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-unit-lg shadow-sm ring-0 md:col-span-1">
                    <p className="mb-1 font-label-md text-label-md tracking-wider text-on-surface-variant uppercase">
                        Total Pengeluaran
                    </p>
                    <p className="font-headline-md text-headline-md font-bold text-error">
                        - {formatRupiah(computedStats.totalPengeluaran)}
                    </p>
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-red-100 dark:bg-red-950">
                        <div className="h-full bg-error" style={{ width: `${pengeluaranPercent}%` }} />
                    </div>
                </Card>
                <Card className="group relative overflow-hidden rounded-xl border-none bg-primary p-unit-lg shadow-lg ring-0 md:col-span-2">
                    <div className="relative z-10 flex h-full items-center justify-between">
                        <div>
                            <p className="mb-1 font-label-md text-label-md text-on-primary/60">
                                Status Keuangan
                            </p>
                            <p className="font-headline-md text-headline-md font-bold text-on-primary">
                                {financialStatus}
                            </p>
                        </div>
                        <TrendingUp className="h-16 w-16 text-white/20 transition-transform group-hover:scale-110" />
                    </div>
                    {/* Abstract visual effect */}
                    <div className="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-secondary-container/10 blur-2xl" />
                </Card>
            </section>

            {/* Table Container */}
            <Card className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm ring-0">
                <div className="flex flex-col items-stretch justify-between gap-4 border-b border-outline-variant/30 bg-surface-container-low/30 px-unit-lg py-4 sm:flex-row sm:items-center">
                    <h3 className="font-headline-sm text-headline-sm text-primary">
                        Riwayat Mutasi Kas
                    </h3>
                    <div className="flex gap-2">
                        <div className="relative flex-1 sm:flex-none">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                            <input
                                className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-lowest py-2 pr-4 pl-10 text-body-sm outline-none focus:ring-2 focus:ring-primary/20 sm:w-64"
                                placeholder="Cari mutasi..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button
                            variant={isFilterVisible ? 'default' : 'outline'}
                            onClick={() => setIsFilterVisible(!isFilterVisible)}
                            className="group h-auto cursor-pointer rounded-lg border border-outline-variant/50 p-2 shadow-none transition-colors hover:bg-surface-container-low"
                        >
                            <Filter className={`h-5 w-5 ${isFilterVisible ? 'text-white group-hover:text-primary' : 'text-primary'}`} />
                        </Button>
                    </div>
                </div>
                {isFilterVisible && (
                    <div className="grid grid-cols-1 gap-4 border-b border-outline-variant/30 bg-surface-container-low/20 px-unit-lg py-4 sm:grid-cols-3">
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-primary">
                                Filter Kegiatan
                            </label>
                            <select
                                value={selectedKegiatanId}
                                onChange={(e) => setSelectedKegiatanId(e.target.value)}
                                className="w-full cursor-pointer rounded-lg border border-outline-variant/50 bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="all">Semua Kegiatan</option>
                                {activities.map((act) => (
                                    <option key={act.id_kegiatan} value={act.id_kegiatan}>
                                        {act.nama_kegiatan}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-primary">
                                Jenis Transaksi
                            </label>
                            <select
                                value={selectedJenis}
                                onChange={(e) => setSelectedJenis(e.target.value)}
                                className="w-full cursor-pointer rounded-lg border border-outline-variant/50 bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="all">Semua Jenis</option>
                                <option value="pemasukan">Pemasukan</option>
                                <option value="pengeluaran">Pengeluaran</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-primary">
                                Urutkan Tanggal
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full cursor-pointer rounded-lg border border-outline-variant/50 bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="newest">Terbaru (Terbaru ke Terlama)</option>
                                <option value="oldest">Terlama (Terlama ke Terbaru)</option>
                            </select>
                        </div>
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-outline-variant/30 bg-surface-container-lowest">
                                <th className="px-unit-lg py-4 font-label-lg text-label-lg tracking-wider text-on-surface-variant uppercase">
                                    Tanggal
                                </th>
                                <th className="px-unit-lg py-4 font-label-lg text-label-lg tracking-wider text-on-surface-variant uppercase">
                                    Jenis
                                </th>
                                <th className="px-unit-lg py-4 font-label-lg text-label-lg tracking-wider text-on-surface-variant uppercase">
                                    Nominal
                                </th>
                                <th className="px-unit-lg py-4 font-label-lg text-label-lg tracking-wider text-on-surface-variant uppercase">
                                    Keperluan
                                </th>
                                <th className="px-unit-lg py-4 font-label-lg text-label-lg tracking-wider text-on-surface-variant uppercase">
                                    Kegiatan
                                </th>
                                <th className="px-unit-lg py-4 font-label-lg text-label-lg tracking-wider text-on-surface-variant uppercase">
                                    Bukti Nota
                                </th>
                                <th className="px-unit-lg py-4 text-right font-label-lg text-label-lg tracking-wider text-on-surface-variant uppercase">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/20">
                            {filteredTransactions.map((transaction) => (
                                <tr
                                    key={transaction.id_transaksi}
                                    className="transition-colors hover:bg-surface-container-low/20"
                                >
                                    <td className="px-unit-lg py-4">
                                        <p className="font-body-md text-body-md font-medium">
                                            {formatDate(transaction.tanggal_transaksi)}
                                        </p>
                                        <p className="font-label-md text-label-md text-on-surface-variant">
                                            {formatTime(transaction.created_at)}
                                        </p>
                                    </td>
                                    <td className="px-unit-lg py-4">
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-label-md font-bold ${transaction.jenis_transaksi.toLowerCase() === 'pemasukan'
                                                ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-400'
                                                : 'border-red-200 bg-red-50 text-error dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400'
                                                }`}
                                        >
                                            {transaction.jenis_transaksi.toLowerCase() === 'pemasukan' ? (
                                                <ArrowUp className="h-3.5 w-3.5" />
                                            ) : (
                                                <ArrowDown className="h-3.5 w-3.5" />
                                            )}
                                            {transaction.jenis_transaksi}
                                        </span>
                                    </td>
                                    <td
                                        className={`px-unit-lg py-4 font-headline-sm font-semibold ${transaction.jenis_transaksi.toLowerCase() === 'pemasukan'
                                            ? 'text-green-700 dark:text-green-400'
                                            : 'text-error'
                                            }`}
                                    >
                                        {formatRupiah(transaction.nominal_transaksi)}
                                    </td>
                                    <td
                                        className="max-w-xs truncate px-unit-lg py-4 font-body-md text-body-md"
                                        title={transaction.sumber_tujuan_transaksi}
                                    >
                                        {transaction.sumber_tujuan_transaksi}
                                    </td>
                                    <td
                                        className="max-w-xs truncate px-unit-lg py-4 font-body-md text-body-md font-medium text-primary"
                                        title={transaction.kegiatan?.nama_kegiatan || '-'}
                                    >
                                        {transaction.kegiatan?.nama_kegiatan || '-'}
                                    </td>
                                    <td className="px-unit-lg py-4">
                                        {transaction.foto_bukti_transaksi ? (
                                            <Button
                                                variant="link"
                                                className="flex h-auto cursor-pointer items-center gap-2 p-0 font-label-lg text-label-lg text-primary shadow-none hover:text-primary/80"
                                                onClick={() => transaction.foto_bukti_transaksi && window.open(transaction.foto_bukti_transaksi, '_blank')}
                                            >
                                                <Receipt className="h-4 w-4" />
                                                {transaction.foto_bukti_transaksi.split('/').pop()}
                                            </Button>
                                        ) : (
                                            <span className="font-body-md text-body-md text-on-surface-variant">Tidak ada</span>
                                        )}
                                    </td>
                                    <td className="px-unit-lg py-4 text-right">
                                        <Button
                                            onClick={() => handleKoreksi(transaction)}
                                            className="h-auto cursor-pointer rounded-lg border-none bg-surface-container-low px-4 py-2 font-label-lg text-label-lg text-primary shadow-none transition-all hover:bg-primary hover:text-on-primary"
                                        >
                                            Koreksi
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {filteredTransactions.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-unit-lg py-8 text-center font-body-md text-on-surface-variant"
                                    >
                                        Tidak ada transaksi yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Table Footer */}
                <div className="flex flex-col items-center justify-between gap-unit-md border-t border-outline-variant/30 px-unit-lg py-4 text-on-surface-variant md:flex-row">
                    <p className="font-body-sm text-body-sm">
                        Menampilkan {filteredTransactions.length > 0 ? 1 : 0}-{filteredTransactions.length} dari {transactions.length} transaksi
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            className="h-auto cursor-pointer rounded-lg p-2 shadow-none hover:bg-surface-container-low disabled:opacity-30"
                            disabled
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex items-center gap-1">
                            <Button className="h-8 h-auto w-8 cursor-pointer rounded-lg bg-primary p-0 font-label-lg text-label-lg !text-on-primary">
                                1
                            </Button>
                        </div>
                        <Button
                            variant="ghost"
                            className="h-auto cursor-pointer rounded-lg p-2 shadow-none hover:bg-surface-container-low"
                            disabled
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Create Transaction Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
                        onClick={handleCloseModal}
                    ></div>
                    <div className="relative z-10 w-full max-w-xl animate-in rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-xl duration-150 fade-in-50 zoom-in-95 max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-unit-sm">
                            <h3 className="font-headline-sm font-bold text-primary flex items-center gap-2">
                                <Coins className="h-5 w-5" />
                                {selectedTransaction ? 'Koreksi Transaksi' : 'Catat Transaksi Baru'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="cursor-pointer text-xl font-bold text-on-surface-variant hover:text-primary"
                            >
                                ×
                            </button>
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className="mt-4 space-y-4"
                        >
                            {/* Kegiatan Dropdown */}
                            <div className="space-y-1">
                                <Label htmlFor="id_kegiatan" className="text-primary font-semibold text-xs">
                                    Kegiatan Terkait *
                                </Label>
                                <select
                                    id="id_kegiatan"
                                    value={data.id_kegiatan}
                                    onChange={(e) => setData('id_kegiatan', e.target.value)}
                                    className="w-full cursor-pointer rounded-lg border border-outline-variant bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                    required
                                >
                                    <option value="">-- Pilih Kegiatan --</option>
                                    {activities.map((act) => (
                                        <option key={act.id_kegiatan} value={act.id_kegiatan}>
                                            {act.nama_kegiatan}
                                        </option>
                                    ))}
                                </select>
                                {errors.id_kegiatan && (
                                    <p className="text-xs text-error flex items-center gap-1 font-medium mt-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.id_kegiatan}
                                    </p>
                                )}
                            </div>

                            {/* Jenis Transaksi */}
                            <div className="space-y-1">
                                <Label className="text-primary font-semibold text-xs">
                                    Jenis Transaksi *
                                </Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setData('jenis_transaksi', 'Pemasukan')}
                                        className={`flex items-center justify-center gap-2 rounded-lg border-2 py-2.5 font-semibold text-xs transition-all duration-200 cursor-pointer ${data.jenis_transaksi === 'Pemasukan'
                                            ? 'border-green-500 bg-green-50/50 text-green-700 dark:border-green-600 dark:bg-green-950/20 dark:text-green-400 shadow-sm'
                                            : 'border-outline-variant/60 hover:bg-surface-container-low text-on-surface-variant'
                                            }`}
                                    >
                                        <ArrowUp className={`h-4 w-4 ${data.jenis_transaksi === 'Pemasukan' ? 'text-green-600 dark:text-green-400' : 'text-on-surface-variant/40'}`} />
                                        Pemasukan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('jenis_transaksi', 'Pengeluaran')}
                                        className={`flex items-center justify-center gap-2 rounded-lg border-2 py-2.5 font-semibold text-xs transition-all duration-200 cursor-pointer ${data.jenis_transaksi === 'Pengeluaran'
                                            ? 'border-red-500 bg-red-50/50 text-error dark:border-red-600 dark:bg-red-950/20 dark:text-red-400 shadow-sm'
                                            : 'border-outline-variant/60 hover:bg-surface-container-low text-on-surface-variant'
                                            }`}
                                    >
                                        <ArrowDown className={`h-4 w-4 ${data.jenis_transaksi === 'Pengeluaran' ? 'text-error dark:text-red-400' : 'text-on-surface-variant/40'}`} />
                                        Pengeluaran
                                    </button>
                                </div>
                                {errors.jenis_transaksi && (
                                    <p className="text-xs text-error flex items-center gap-1 font-medium mt-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.jenis_transaksi}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {/* Nominal */}
                                <div className="space-y-1">
                                    <Label htmlFor="nominal_transaksi" className="text-primary font-semibold text-xs">
                                        Nominal Transaksi *
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-xs font-semibold text-on-surface-variant/70">
                                            Rp
                                        </span>
                                        <Input
                                            id="nominal_transaksi"
                                            type="number"
                                            min="0"
                                            placeholder="Contoh: 150000"
                                            className="pl-8 h-9 text-sm"
                                            value={data.nominal_transaksi}
                                            onChange={(e) => setData('nominal_transaksi', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] px-1 text-on-surface-variant/70">
                                        <span>Preview:</span>
                                        <span className="font-semibold text-primary">{formatRupiah(data.nominal_transaksi ? Number(data.nominal_transaksi) : 0)}</span>
                                    </div>
                                    {errors.nominal_transaksi && (
                                        <p className="text-xs text-error flex items-center gap-1 font-medium mt-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.nominal_transaksi}
                                        </p>
                                    )}
                                </div>

                                {/* Tanggal */}
                                <div className="space-y-1">
                                    <Label htmlFor="tanggal_transaksi" className="text-primary font-semibold text-xs">
                                        Tanggal Transaksi *
                                    </Label>
                                    <Input
                                        id="tanggal_transaksi"
                                        type="date"
                                        className="h-9 text-sm cursor-pointer"
                                        value={data.tanggal_transaksi}
                                        onChange={(e) => setData('tanggal_transaksi', e.target.value)}
                                        required
                                    />
                                    {errors.tanggal_transaksi && (
                                        <p className="text-xs text-error flex items-center gap-1 font-medium mt-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.tanggal_transaksi}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Sumber / Tujuan */}
                            <div className="space-y-1">
                                <Label htmlFor="sumber_tujuan_transaksi" className="text-primary font-semibold text-xs">
                                    Sumber / Tujuan Transaksi *
                                </Label>
                                <Input
                                    id="sumber_tujuan_transaksi"
                                    type="text"
                                    placeholder="Contoh: Sponsor Tokopedia, Pembelian Atribut Panitia"
                                    className="h-9 text-sm"
                                    value={data.sumber_tujuan_transaksi}
                                    onChange={(e) => setData('sumber_tujuan_transaksi', e.target.value)}
                                    maxLength={200}
                                    required
                                />
                                {errors.sumber_tujuan_transaksi && (
                                    <p className="text-xs text-error flex items-center gap-1 font-medium mt-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.sumber_tujuan_transaksi}
                                    </p>
                                )}
                            </div>

                            {/* Foto Bukti */}
                            <div className="space-y-1">
                                <Label className="text-primary font-semibold text-xs">
                                    Foto Bukti Transaksi (Nota / Kwitansi) {selectedTransaction ? '' : '*'}
                                </Label>
                                <div
                                    onDragEnter={handleDrag}
                                    onDragOver={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById('receipt-input-modal')?.click()}
                                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 transition-all cursor-pointer ${dragActive
                                        ? 'border-primary bg-primary/5'
                                        : 'border-outline-variant/60 hover:bg-surface-container-low'
                                        } ${(data.foto_bukti_transaksi || selectedTransaction?.foto_bukti_transaksi) ? 'bg-surface-container-low/30' : ''}`}
                                >
                                    <input
                                        id="receipt-input-modal"
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,application/pdf"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                                    />

                                    {!data.foto_bukti_transaksi && !selectedTransaction?.foto_bukti_transaksi ? (
                                        <div className="text-center space-y-1">
                                            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <UploadCloud className="h-4 w-4" />
                                            </div>
                                            <p className="text-xs font-semibold text-center">
                                                Drag & drop nota di sini atau klik untuk memilih
                                            </p>
                                            <p className="text-[10px] text-on-surface-variant/70 text-center">
                                                JPG, PNG, PDF maks 5MB
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="w-full flex items-center gap-3 text-left">
                                            {filePreview ? (
                                                <div className="relative h-10 w-10 overflow-hidden rounded-md border border-outline-variant bg-surface-container-low">
                                                    <img
                                                        src={filePreview}
                                                        alt="Receipt preview"
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            ) : selectedTransaction?.foto_bukti_transaksi ? (
                                                <div className="relative h-10 w-10 overflow-hidden rounded-md border border-outline-variant bg-surface-container-low">
                                                    {selectedTransaction.foto_bukti_transaksi.endsWith('.pdf') ? (
                                                        <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                                                            <FileText className="h-5 w-5" />
                                                        </div>
                                                    ) : (
                                                        <img
                                                            src={selectedTransaction.foto_bukti_transaksi}
                                                            alt="Receipt preview"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-primary truncate">
                                                    {data.foto_bukti_transaksi 
                                                        ? data.foto_bukti_transaksi.name 
                                                        : selectedTransaction?.foto_bukti_transaksi?.split('/').pop() || 'Bukti Transaksi'}
                                                </p>
                                                <p className="text-[10px] text-on-surface-variant">
                                                    {data.foto_bukti_transaksi 
                                                        ? formatBytes(data.foto_bukti_transaksi.size) 
                                                        : 'Menggunakan file saat ini (klik untuk mengganti)'}
                                                </p>
                                            </div>
                                            {data.foto_bukti_transaksi && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    className="h-auto p-1.5 hover:bg-error-container hover:text-error text-xs"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleFileChange(null);
                                                    }}
                                                >
                                                    Hapus
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {errors.foto_bukti_transaksi && (
                                    <p className="text-xs text-error flex items-center gap-1 font-medium mt-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.foto_bukti_transaksi}
                                    </p>
                                )}
                            </div>

                            {/* Catatan Koreksi */}
                            <div className="space-y-1">
                                <Label htmlFor="catatan_koreksi" className="text-primary font-semibold text-xs">
                                    Catatan / Keterangan Tambahan <span className="text-on-surface-variant/60 font-normal">(Opsional)</span>
                                </Label>
                                <textarea
                                    id="catatan_koreksi"
                                    placeholder="Tuliskan catatan tambahan mengenai rincian transaksi..."
                                    rows={2}
                                    className="w-full rounded-lg border border-outline-variant bg-background px-3 py-1.5 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                    value={data.catatan_koreksi}
                                    onChange={(e) => setData('catatan_koreksi', e.target.value)}
                                    maxLength={500}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/30">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCloseModal}
                                    className="px-4 cursor-pointer h-9 text-xs"
                                    disabled={processing}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    className="px-4 cursor-pointer h-9 text-xs font-semibold"
                                    disabled={processing}
                                >
                                    {processing 
                                        ? 'Menyimpan...' 
                                        : selectedTransaction 
                                            ? 'Simpan Perubahan' 
                                            : 'Simpan Transaksi'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
