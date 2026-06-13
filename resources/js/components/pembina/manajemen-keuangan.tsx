import {
    Wallet,
    TrendingUp,
    Search,
    Filter,
    ArrowUp,
    ArrowDown,
    Receipt,
    ChevronLeft,
    ChevronRight,
    Eye,
    Building2,
    Coins,
    FileText,
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { router } from '@inertiajs/react';

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

interface ManajemenKeuanganProps {
    transactions?: Transaction[];
    activities?: ActivityOption[];
    organisasiList?: OrganisasiOption[];
    stats?: Stats;
}

// Modal for viewing transaction detail (read-only)
interface DetailModalProps {
    transaction: Transaction;
    onClose: () => void;
}

function TransactionDetailModal({ transaction, onClose }: DetailModalProps) {
    const formatRupiah = (value: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        })
            .format(value)
            .replace('IDR', 'Rp');

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'Mei',
            'Jun',
            'Jul',
            'Agu',
            'Sep',
            'Okt',
            'Nov',
            'Des',
        ];
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const day = parseInt(parts[2], 10);
            const monthIdx = parseInt(parts[1], 10) - 1;
            return `${day} ${months[monthIdx]} ${parts[0]}`;
        }
        const d = new Date(dateStr);
        return isNaN(d.getTime())
            ? dateStr
            : `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    };

    const isPemasukan =
        transaction.jenis_transaksi.toLowerCase() === 'pemasukan';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-xs"
                onClick={onClose}
            />
            <div className="custom-scrollbar relative z-10 max-h-[90vh] w-full max-w-md animate-in overflow-y-auto rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-xl duration-150 fade-in-50 zoom-in-95">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-unit-sm">
                    <h3 className="flex items-center gap-2 font-headline-sm font-bold text-primary">
                        <Coins className="h-5 w-5" />
                        Detail Transaksi
                    </h3>
                    <button
                        onClick={onClose}
                        className="cursor-pointer text-xl font-bold text-on-surface-variant hover:text-primary"
                    >
                        ×
                    </button>
                </div>

                <div className="mt-4 space-y-4">
                    {/* Jenis badge */}
                    <div className="flex items-center justify-between">
                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-bold ${
                                isPemasukan
                                    ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-400'
                                    : 'border-red-200 bg-red-50 text-error dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400'
                            }`}
                        >
                            {isPemasukan ? (
                                <ArrowUp className="h-4 w-4" />
                            ) : (
                                <ArrowDown className="h-4 w-4" />
                            )}
                            {transaction.jenis_transaksi}
                        </span>
                        <span
                            className={`text-xl font-bold ${isPemasukan ? 'text-green-700 dark:text-green-400' : 'text-error'}`}
                        >
                            {isPemasukan ? '+' : '-'}{' '}
                            {formatRupiah(transaction.nominal_transaksi)}
                        </span>
                    </div>

                    {/* Details grid */}
                    <div className="divide-y divide-outline-variant/20 rounded-lg border border-outline-variant/30 bg-surface-container-low/30">
                        <div className="flex items-start justify-between gap-4 px-4 py-3">
                            <span className="text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
                                Tanggal
                            </span>
                            <span className="text-right text-sm font-medium">
                                {formatDate(transaction.tanggal_transaksi)}
                            </span>
                        </div>
                        <div className="flex items-start justify-between gap-4 px-4 py-3">
                            <span className="text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
                                Sumber / Tujuan
                            </span>
                            <span className="max-w-[60%] text-right text-sm">
                                {transaction.sumber_tujuan_transaksi}
                            </span>
                        </div>
                        <div className="flex items-start justify-between gap-4 px-4 py-3">
                            <span className="text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
                                Kegiatan
                            </span>
                            <span className="max-w-[60%] text-right text-sm font-medium text-primary">
                                {transaction.kegiatan?.nama_kegiatan || '-'}
                            </span>
                        </div>
                        <div className="flex items-start justify-between gap-4 px-4 py-3">
                            <span className="text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
                                Organisasi
                            </span>
                            <span className="max-w-[60%] text-right text-sm font-medium">
                                {transaction.kegiatan?.profil_organisasi
                                    ?.organisasi?.nama_organisasi || '-'}
                            </span>
                        </div>
                        {transaction.catatan_koreksi && (
                            <div className="flex items-start justify-between gap-4 px-4 py-3">
                                <span className="text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
                                    Catatan
                                </span>
                                <span className="max-w-[60%] text-right text-sm">
                                    {transaction.catatan_koreksi}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Bukti Nota */}
                    {transaction.foto_bukti_transaksi && (
                        <div className="space-y-2">
                            <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                                Bukti Nota
                            </p>
                            <Button
                                variant="outline"
                                className="flex h-auto cursor-pointer items-center gap-2 rounded-lg border border-outline-variant/50 px-4 py-2 text-sm text-primary"
                                onClick={() =>
                                    transaction.foto_bukti_transaksi &&
                                    window.open(
                                        transaction.foto_bukti_transaksi,
                                        '_blank',
                                    )
                                }
                            >
                                <Receipt className="h-4 w-4" />
                                {transaction.foto_bukti_transaksi
                                    .split('/')
                                    .pop()}
                            </Button>
                        </div>
                    )}

                    {/* Close */}
                    <div className="flex justify-end border-t border-outline-variant/30 pt-3">
                        <Button
                            type="button"
                            onClick={onClose}
                            className="h-9 cursor-pointer px-6 text-xs font-semibold"
                        >
                            Tutup
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ManajemenKeuangan({
    transactions = [],
    activities = [],
    organisasiList = [],
    stats,
}: ManajemenKeuanganProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [selectedKegiatanId, setSelectedKegiatanId] = useState<string>('all');
    const [selectedOrganisasiId, setSelectedOrganisasiId] =
        useState<string>('all');
    const [selectedJenis, setSelectedJenis] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('newest');
    const [selectedStatsOrganisasiId, setSelectedStatsOrganisasiId] =
        useState<string>('all');
    const [selectedTransaction, setSelectedTransaction] =
        useState<Transaction | null>(null);

    // Report states
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportFormat, setReportFormat] = useState<'pdf' | 'excel'>('pdf');
    const [targetOrganisasiId, setTargetOrganisasiId] = useState<string>('');

    const handleCreateReport = (e: React.FormEvent) => {
        e.preventDefault();
        const orgId = selectedOrganisasiId !== 'all' ? selectedOrganisasiId : targetOrganisasiId;

        if (!orgId) {
            alert('Silakan pilih organisasi terlebih dahulu.');
            return;
        }

        router.post('/pembina/laporan/generate', {
            id_organisasi: parseInt(orgId, 10),
            format: reportFormat,
            filter_organisasi_id: selectedOrganisasiId,
            id_kegiatan: selectedKegiatanId,
            jenis_transaksi: selectedJenis,
            search: searchQuery,
            sort_by: sortBy,
        }, {
            onSuccess: () => {
                setIsReportModalOpen(false);
            }
        });
    };

    // Dynamic stats computation based on selected organisasi
    const computedStats = React.useMemo(() => {
        if (selectedStatsOrganisasiId === 'all' && stats) {
            return {
                totalSaldo: stats.total_saldo,
                totalPemasukan: stats.total_pemasukan,
                totalPengeluaran: stats.total_pengeluaran,
            };
        }

        const filtered = transactions.filter((t) => {
            if (selectedStatsOrganisasiId === 'all') return true;
            return (
                t.kegiatan?.profil_organisasi?.organisasi?.id_organisasi ===
                parseInt(selectedStatsOrganisasiId, 10)
            );
        });

        const totalPemasukan = filtered
            .filter((t) => t.jenis_transaksi === 'Pemasukan')
            .reduce((sum, t) => sum + t.nominal_transaksi, 0);

        const totalPengeluaran = filtered
            .filter((t) => t.jenis_transaksi === 'Pengeluaran')
            .reduce((sum, t) => sum + t.nominal_transaksi, 0);

        return {
            totalSaldo: totalPemasukan - totalPengeluaran,
            totalPemasukan,
            totalPengeluaran,
        };
    }, [transactions, selectedStatsOrganisasiId, stats]);

    const formatRupiah = (value: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        })
            .format(value)
            .replace('IDR', 'Rp');

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'Mei',
            'Jun',
            'Jul',
            'Agu',
            'Sep',
            'Okt',
            'Nov',
            'Des',
        ];
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const day = parseInt(parts[2], 10);
            const monthIdx = parseInt(parts[1], 10) - 1;
            return `${day} ${months[monthIdx]} ${parts[0]}`;
        }
        const d = new Date(dateStr);
        return isNaN(d.getTime())
            ? dateStr
            : `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    };

    const formatTime = (timeStr?: string | null) => {
        if (!timeStr) return '--:-- WITA';
        const d = new Date(timeStr);
        if (isNaN(d.getTime())) return '';
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${pad(d.getHours())}:${pad(d.getMinutes())} WITA`;
    };

    const filteredTransactions = transactions
        .filter((t) => {
            const query = searchQuery.toLowerCase();
            const purpose = (t.sumber_tujuan_transaksi || '').toLowerCase();
            const kegiatanName = (
                t.kegiatan?.nama_kegiatan || ''
            ).toLowerCase();
            const orgName = (
                t.kegiatan?.profil_organisasi?.organisasi?.nama_organisasi || ''
            ).toLowerCase();
            const matchesQuery =
                purpose.includes(query) ||
                kegiatanName.includes(query) ||
                orgName.includes(query);

            const matchesKegiatan =
                selectedKegiatanId === 'all' ||
                t.id_kegiatan === parseInt(selectedKegiatanId, 10);

            const matchesOrganisasi =
                selectedOrganisasiId === 'all' ||
                t.kegiatan?.profil_organisasi?.organisasi?.id_organisasi ===
                    parseInt(selectedOrganisasiId, 10);

            const matchesJenis =
                selectedJenis === 'all' ||
                t.jenis_transaksi.toLowerCase() === selectedJenis.toLowerCase();

            return (
                matchesQuery &&
                matchesKegiatan &&
                matchesOrganisasi &&
                matchesJenis
            );
        })
        .sort((a, b) => {
            const dateA = new Date(a.tanggal_transaksi).getTime();
            const dateB = new Date(b.tanggal_transaksi).getTime();

            if (sortBy === 'newest') {
                if (dateA !== dateB) return dateB - dateA;
                return b.id_transaksi - a.id_transaksi;
            } else {
                if (dateA !== dateB) return dateA - dateB;
                return a.id_transaksi - b.id_transaksi;
            }
        });

    const totalStatsAmount =
        computedStats.totalPemasukan + computedStats.totalPengeluaran;
    const pemasukanPercent =
        totalStatsAmount > 0
            ? (computedStats.totalPemasukan / totalStatsAmount) * 100
            : 0;
    const pengeluaranPercent =
        totalStatsAmount > 0
            ? (computedStats.totalPengeluaran / totalStatsAmount) * 100
            : 0;

    let financialStatus = 'Seimbang';
    if (computedStats.totalSaldo > 0) financialStatus = 'Sehat & Stabil';
    else if (computedStats.totalSaldo < 0)
        financialStatus = 'Defisit (Evaluasi)';

    return (
        <div className="mx-auto w-full max-w-container-max space-y-gutter p-margin-desktop">
            {/* Header Section */}
            <section className="flex flex-col items-start justify-between gap-gutter md:flex-row md:items-center">
                <div className="space-y-unit-xs">
                    <h2 className="font-headline-lg text-headline-lg text-primary">
                        Manajemen Buku Kas
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        Pantau seluruh mutasi keuangan semua organisasi
                        kemahasiswaan.
                    </p>
                </div>
                <div className="flex w-full flex-col items-stretch gap-gutter sm:flex-row sm:items-center md:w-auto">
                    <Card className="flex items-center gap-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 px-unit-lg shadow-sm ring-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container/20 text-on-secondary-container">
                            <Wallet className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-label-md text-label-md text-on-surface-variant">
                                Total Saldo Keseluruhan
                            </p>
                            <p className="font-headline-sm text-headline-sm font-bold text-primary">
                                {formatRupiah(computedStats.totalSaldo)}
                            </p>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Stats Filter Section */}
            <div className="flex flex-col justify-between gap-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold text-primary">
                        Filter Statistik per Organisasi
                    </span>
                </div>
                <select
                    value={selectedStatsOrganisasiId}
                    onChange={(e) =>
                        setSelectedStatsOrganisasiId(e.target.value)
                    }
                    className="w-full cursor-pointer rounded-lg border border-outline-variant/50 bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-72"
                >
                    <option value="all">Semua Organisasi (Total)</option>
                    {organisasiList.map((org) => (
                        <option
                            key={org.id_organisasi}
                            value={org.id_organisasi}
                        >
                            {org.nama_organisasi}
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
                        <div
                            className="h-full bg-green-500"
                            style={{ width: `${pemasukanPercent}%` }}
                        />
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
                        <div
                            className="h-full bg-error"
                            style={{ width: `${pengeluaranPercent}%` }}
                        />
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
                    <div className="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-secondary-container/10 blur-2xl" />
                </Card>
            </section>

            {/* Table Container */}
            <Card className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm ring-0">
                <div className="flex flex-col items-stretch justify-between gap-4 border-b border-outline-variant/30 bg-surface-container-low/30 px-unit-lg py-4 sm:flex-row sm:items-center">
                    <h3 className="font-headline-sm text-headline-sm text-primary">
                        Riwayat Mutasi Kas — Semua Organisasi
                    </h3>
                    <div className="flex gap-2">
                        <div className="relative flex-1 sm:flex-none">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                            <input
                                className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-lowest py-2 pr-4 pl-10 text-body-sm outline-none focus:ring-2 focus:ring-primary/20 sm:w-64"
                                placeholder="Cari mutasi, kegiatan, organisasi..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button
                            variant={isFilterVisible ? 'default' : 'outline'}
                            onClick={() => setIsFilterVisible(!isFilterVisible)}
                            className="group h-auto cursor-pointer rounded-lg border border-outline-variant/50 p-2 shadow-none transition-colors hover:bg-surface-container-low"
                            title="Tampilkan Filter"
                        >
                            <Filter
                                className={`h-5 w-5 ${isFilterVisible ? 'text-white group-hover:text-primary' : 'text-primary'}`}
                            />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (selectedOrganisasiId !== 'all') {
                                    setTargetOrganisasiId(selectedOrganisasiId);
                                } else {
                                    setTargetOrganisasiId('');
                                }
                                setIsReportModalOpen(true);
                            }}
                            className="flex h-auto cursor-pointer items-center gap-2 rounded-lg border border-outline-variant/50 px-3 py-2 text-sm text-primary shadow-none hover:bg-surface-container-low"
                            title="Buat Laporan"
                        >
                            <FileText className="h-5 w-5" />
                            <span className="hidden sm:inline">Buat Laporan</span>
                        </Button>
                    </div>
                </div>

                {isFilterVisible && (
                    <div className="grid grid-cols-1 gap-4 border-b border-outline-variant/30 bg-surface-container-low/20 px-unit-lg py-4 sm:grid-cols-4">
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-primary">
                                Filter Organisasi
                            </label>
                            <select
                                value={selectedOrganisasiId}
                                onChange={(e) =>
                                    setSelectedOrganisasiId(e.target.value)
                                }
                                className="w-full cursor-pointer rounded-lg border border-outline-variant/50 bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="all">Semua Organisasi</option>
                                {organisasiList.map((org) => (
                                    <option
                                        key={org.id_organisasi}
                                        value={org.id_organisasi}
                                    >
                                        {org.nama_organisasi}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-primary">
                                Filter Kegiatan
                            </label>
                            <select
                                value={selectedKegiatanId}
                                onChange={(e) =>
                                    setSelectedKegiatanId(e.target.value)
                                }
                                className="w-full cursor-pointer rounded-lg border border-outline-variant/50 bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="all">Semua Kegiatan</option>
                                {activities.map((act) => (
                                    <option
                                        key={act.id_kegiatan}
                                        value={act.id_kegiatan}
                                    >
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
                                onChange={(e) =>
                                    setSelectedJenis(e.target.value)
                                }
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
                                <option value="newest">
                                    Terbaru (Terbaru ke Terlama)
                                </option>
                                <option value="oldest">
                                    Terlama (Terlama ke Terbaru)
                                </option>
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
                                    Organisasi
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
                                            {formatDate(
                                                transaction.tanggal_transaksi,
                                            )}
                                        </p>
                                        <p className="font-label-md text-label-md text-on-surface-variant">
                                            {formatTime(transaction.created_at)}
                                        </p>
                                    </td>
                                    <td className="px-unit-lg py-4">
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-label-md font-bold ${
                                                transaction.jenis_transaksi.toLowerCase() ===
                                                'pemasukan'
                                                    ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-400'
                                                    : 'border-red-200 bg-red-50 text-error dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400'
                                            }`}
                                        >
                                            {transaction.jenis_transaksi.toLowerCase() ===
                                            'pemasukan' ? (
                                                <ArrowUp className="h-3.5 w-3.5" />
                                            ) : (
                                                <ArrowDown className="h-3.5 w-3.5" />
                                            )}
                                            {transaction.jenis_transaksi}
                                        </span>
                                    </td>
                                    <td
                                        className={`px-unit-lg py-4 font-headline-sm font-semibold ${
                                            transaction.jenis_transaksi.toLowerCase() ===
                                            'pemasukan'
                                                ? 'text-green-700 dark:text-green-400'
                                                : 'text-error'
                                        }`}
                                    >
                                        {formatRupiah(
                                            transaction.nominal_transaksi,
                                        )}
                                    </td>
                                    <td
                                        className="max-w-xs truncate px-unit-lg py-4 font-body-md text-body-md"
                                        title={
                                            transaction.sumber_tujuan_transaksi
                                        }
                                    >
                                        {transaction.sumber_tujuan_transaksi}
                                    </td>
                                    <td
                                        className="max-w-[180px] truncate px-unit-lg py-4 font-body-md text-body-md font-medium text-primary"
                                        title={
                                            transaction.kegiatan
                                                ?.nama_kegiatan || '-'
                                        }
                                    >
                                        {transaction.kegiatan?.nama_kegiatan ||
                                            '-'}
                                    </td>
                                    <td
                                        className="max-w-[160px] truncate px-unit-lg py-4 font-body-md text-body-md text-on-surface-variant"
                                        title={
                                            transaction.kegiatan
                                                ?.profil_organisasi?.organisasi
                                                ?.nama_organisasi || '-'
                                        }
                                    >
                                        {transaction.kegiatan?.profil_organisasi
                                            ?.organisasi?.nama_organisasi ||
                                            '-'}
                                    </td>
                                    <td className="px-unit-lg py-4">
                                        {transaction.foto_bukti_transaksi ? (
                                            <Button
                                                variant="link"
                                                className="flex h-auto cursor-pointer items-center gap-2 p-0 font-label-lg text-label-lg text-primary shadow-none hover:text-primary/80"
                                                onClick={() =>
                                                    transaction.foto_bukti_transaksi &&
                                                    window.open(
                                                        transaction.foto_bukti_transaksi,
                                                        '_blank',
                                                    )
                                                }
                                            >
                                                <Receipt className="h-4 w-4" />
                                                {transaction.foto_bukti_transaksi
                                                    .split('/')
                                                    .pop()}
                                            </Button>
                                        ) : (
                                            <span className="font-body-md text-body-md text-on-surface-variant">
                                                Tidak ada
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-unit-lg py-4 text-right">
                                        <Button
                                            onClick={() =>
                                                setSelectedTransaction(
                                                    transaction,
                                                )
                                            }
                                            className="flex h-auto cursor-pointer items-center gap-1.5 rounded-lg border-none bg-surface-container-low px-4 py-2 font-label-lg text-label-lg text-primary shadow-none transition-all hover:bg-primary hover:text-on-primary"
                                        >
                                            <Eye className="h-4 w-4" />
                                            Detail
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {filteredTransactions.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
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
                        Menampilkan {filteredTransactions.length > 0 ? 1 : 0}–
                        {filteredTransactions.length} dari {transactions.length}{' '}
                        transaksi
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

            {/* Detail Modal */}
            {selectedTransaction && (
                <TransactionDetailModal
                    transaction={selectedTransaction}
                    onClose={() => setSelectedTransaction(null)}
                />
            )}

            {/* Report Generation Modal */}
            {isReportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
                        onClick={() => setIsReportModalOpen(false)}
                    />
                    <form onSubmit={handleCreateReport} className="custom-scrollbar relative z-10 max-h-[90vh] w-full max-w-md animate-in overflow-y-auto rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-xl duration-150 fade-in-50 zoom-in-95">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-unit-sm">
                            <h3 className="flex items-center gap-2 font-headline-sm font-bold text-primary">
                                <FileText className="h-5 w-5" />
                                Buat Laporan Keuangan
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsReportModalOpen(false)}
                                className="cursor-pointer text-xl font-bold text-on-surface-variant hover:text-primary"
                            >
                                ×
                            </button>
                        </div>

                        <div className="mt-4 space-y-4">
                            <p className="text-sm text-on-surface-variant">
                                Laporan akan dibuat berdasarkan mutasi kas dengan filter yang aktif saat ini.
                            </p>

                            {/* Filter Preview */}
                            <div className="rounded-lg border border-outline-variant/30 bg-surface-container-low/30 p-3 text-xs space-y-1">
                                <p className="font-semibold text-primary">Preview Filter Aktif:</p>
                                <p><span className="text-on-surface-variant font-medium">Organisasi:</span> {selectedOrganisasiId === 'all' ? 'Semua Organisasi' : organisasiList.find(o => o.id_organisasi.toString() === selectedOrganisasiId)?.nama_organisasi}</p>
                                <p><span className="text-on-surface-variant font-medium">Kegiatan:</span> {selectedKegiatanId === 'all' ? 'Semua Kegiatan' : activities.find(a => a.id_kegiatan.toString() === selectedKegiatanId)?.nama_kegiatan}</p>
                                <p><span className="text-on-surface-variant font-medium">Jenis Transaksi:</span> {selectedJenis === 'all' ? 'Semua Jenis' : selectedJenis}</p>
                                {searchQuery && <p><span className="text-on-surface-variant font-medium">Pencarian:</span> "{searchQuery}"</p>}
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-3">
                                {/* Format */}
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-primary">
                                        Format Dokumen
                                    </label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                                            <input
                                                type="radio"
                                                name="reportFormat"
                                                checked={reportFormat === 'pdf'}
                                                onChange={() => setReportFormat('pdf')}
                                                className="h-4 w-4 accent-primary"
                                            />
                                            PDF (.pdf)
                                        </label>
                                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                                            <input
                                                type="radio"
                                                name="reportFormat"
                                                checked={reportFormat === 'excel'}
                                                onChange={() => setReportFormat('excel')}
                                                className="h-4 w-4 accent-primary"
                                            />
                                            Excel (.xlsx)
                                        </label>
                                    </div>
                                </div>

                                {/* Destination Organisasi */}
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-primary">
                                        Simpan Laporan Pada Arsip Organisasi
                                    </label>
                                    {selectedOrganisasiId !== 'all' ? (
                                        <div className="rounded-lg border border-outline-variant/50 bg-surface-container-low/50 px-3 py-2 text-sm text-on-surface-variant font-medium">
                                            {organisasiList.find(o => o.id_organisasi.toString() === selectedOrganisasiId)?.nama_organisasi}
                                        </div>
                                    ) : (
                                        <select
                                            required
                                            value={targetOrganisasiId}
                                            onChange={(e) => setTargetOrganisasiId(e.target.value)}
                                            className="w-full cursor-pointer rounded-lg border border-outline-variant/50 bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        >
                                            <option value="">-- Pilih Organisasi --</option>
                                            {organisasiList.map((org) => (
                                                <option key={org.id_organisasi} value={org.id_organisasi.toString()}>
                                                    {org.nama_organisasi}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-2 border-t border-outline-variant/30 pt-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsReportModalOpen(false)}
                                    className="h-9 cursor-pointer px-4 text-xs font-semibold"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    className="h-9 cursor-pointer px-6 text-xs font-semibold"
                                    disabled={selectedOrganisasiId === 'all' && !targetOrganisasiId}
                                >
                                    Buat & Simpan
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
