import { Head, Link } from '@inertiajs/react';
import {
    Building2,
    Calendar,
    Search,
    ArrowLeft,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Receipt,
    Eye,
    FileText,
    AlertCircle,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { detail } from '@/routes/organisasi';

interface Organisasi {
    id_organisasi: number;
    nama_organisasi: string;
}

interface ProfilOrganisasi {
    id_profil: number;
    id_organisasi: number;
    logo_organisasi: string | null;
    periode_kepengurusan: string;
    status_aktif: boolean;
}

interface Kegiatan {
    id_kegiatan: number;
    nama_kegiatan: string;
}

interface Transaksi {
    id_transaksi: number;
    id_kegiatan: number;
    jenis_transaksi: 'Pemasukan' | 'Pengeluaran';
    nominal_transaksi: string | number;
    tanggal_transaksi: string;
    sumber_tujuan_transaksi: string;
    foto_bukti_transaksi: string;
    catatan_koreksi?: string | null;
    kegiatan?: Kegiatan;
}

interface KeuanganPageProps {
    organisasi: Organisasi;
    profil: ProfilOrganisasi | null;
    transaksiList: Transaksi[];
}

export default function KeuanganPage({
    organisasi,
    profil,
    transaksiList = [],
}: KeuanganPageProps) {
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<
        'all' | 'Pemasukan' | 'Pengeluaran'
    >('all');
    const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

    // Calculate Summary Metrics
    const { totalIncome, totalExpense, balance } = useMemo(() => {
        let income = 0;
        let expense = 0;

        transaksiList.forEach((t) => {
            const amount = Number(t.nominal_transaksi);

            if (t.jenis_transaksi === 'Pemasukan') {
                income += amount;
            } else {
                expense += amount;
            }
        });

        return {
            totalIncome: income,
            totalExpense: expense,
            balance: income - expense,
        };
    }, [transaksiList]);

    // Filtered transaction list
    const filteredTransactions = useMemo(() => {
        return transaksiList.filter((t) => {
            const matchesSearch =
                t.sumber_tujuan_transaksi
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                (t.kegiatan?.nama_kegiatan || '')
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesType =
                typeFilter === 'all' || t.jenis_transaksi === typeFilter;

            return matchesSearch && matchesType;
        });
    }, [transaksiList, search, typeFilter]);

    const formatRupiah = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <>
            <Head title={`Keuangan - ${organisasi.nama_organisasi}`} />
            <main className="animate-fade-in mx-auto w-full max-w-container-max space-y-gutter p-margin-desktop">
                {/* Back Link & Header */}
                <header className="mb-unit-xl flex flex-col gap-unit-md border-b border-outline-variant pb-6">
                    <Link
                        href={detail(organisasi.id_organisasi).url}
                        className="group flex w-fit items-center gap-2 font-label-md text-on-surface-variant transition-colors hover:text-primary"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Kembali ke Profil Organisasi
                    </Link>

                    <div className="mt-2 flex flex-col justify-between gap-unit-md sm:flex-row sm:items-end">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-outline-variant/50 bg-background p-1.5 shadow-sm">
                                {profil?.logo_organisasi ? (
                                    <img
                                        src={`/storage/${profil.logo_organisasi}`}
                                        alt={`${organisasi.nama_organisasi} Logo`}
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <Building2 className="h-8 w-8 text-primary/40" />
                                )}
                            </div>
                            <div>
                                <h1 className="font-headline-lg text-headline-lg font-bold text-foreground">
                                    Laporan Keuangan
                                </h1>
                                <p className="mt-0.5 font-body-md text-on-surface-variant">
                                    Transparansi Anggaran{' '}
                                    {organisasi.nama_organisasi}
                                </p>
                            </div>
                        </div>

                        {profil && (
                            <span className="w-fit rounded-full bg-secondary-container px-4 py-1.5 text-label-md font-semibold text-on-secondary-container">
                                Periode {profil.periode_kepengurusan}
                            </span>
                        )}
                    </div>
                </header>

                {/* Metrics Cards Dashboard */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <Card className="flex h-32 flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-sm">
                        <div className="flex items-start justify-between">
                            <span className="font-label-md font-semibold text-emerald-700 dark:text-emerald-400">
                                Total Pemasukan
                            </span>
                            <TrendingUp className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div className="font-headline-md text-headline-md font-bold text-emerald-700 dark:text-emerald-400">
                            {formatRupiah(totalIncome)}
                        </div>
                    </Card>

                    <Card className="flex h-32 flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-sm">
                        <div className="flex items-start justify-between">
                            <span className="font-label-md font-semibold text-red-700 dark:text-red-400">
                                Total Pengeluaran
                            </span>
                            <TrendingDown className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="font-headline-md text-headline-md font-bold text-red-700 dark:text-red-400">
                            {formatRupiah(totalExpense)}
                        </div>
                    </Card>

                    <Card className="flex h-32 flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-sm">
                        <div className="flex items-start justify-between">
                            <span className="font-label-md font-semibold text-primary">
                                Saldo Akhir
                            </span>
                            <DollarSign className="h-5 w-5 text-primary" />
                        </div>
                        <div className="font-headline-md text-headline-md font-bold text-primary">
                            {formatRupiah(balance)}
                        </div>
                    </Card>
                </div>

                {/* Filters & Search Bar */}
                <div className="flex flex-col items-center justify-between gap-unit-md rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-md shadow-sm sm:flex-row">
                    <div className="flex w-full items-center gap-1 overflow-x-auto rounded-lg border border-outline-variant bg-surface-container-low p-1 sm:w-auto">
                        <button
                            onClick={() => setTypeFilter('all')}
                            className={`cursor-pointer rounded-md px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                                typeFilter === 'all'
                                    ? 'bg-white text-primary shadow-sm'
                                    : 'border-none bg-transparent text-on-surface-variant hover:text-primary'
                            }`}
                        >
                            Semua ({transaksiList.length})
                        </button>
                        <button
                            onClick={() => setTypeFilter('Pemasukan')}
                            className={`cursor-pointer rounded-md px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                                typeFilter === 'Pemasukan'
                                    ? 'bg-white text-emerald-700 shadow-sm'
                                    : 'border-none bg-transparent text-on-surface-variant hover:text-emerald-700'
                            }`}
                        >
                            Pemasukan (
                            {
                                transaksiList.filter(
                                    (t) => t.jenis_transaksi === 'Pemasukan',
                                ).length
                            }
                            )
                        </button>
                        <button
                            onClick={() => setTypeFilter('Pengeluaran')}
                            className={`cursor-pointer rounded-md px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                                typeFilter === 'Pengeluaran'
                                    ? 'bg-white text-red-700 shadow-sm'
                                    : 'border-none bg-transparent text-on-surface-variant hover:text-red-700'
                            }`}
                        >
                            Pengeluaran (
                            {
                                transaksiList.filter(
                                    (t) => t.jenis_transaksi === 'Pengeluaran',
                                ).length
                            }
                            )
                        </button>
                    </div>

                    <div className="relative w-full sm:w-80">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                        <input
                            className="w-full rounded-lg border border-outline-variant bg-background py-2 pr-4 pl-10 font-body-sm text-on-background transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            placeholder="Cari sumber/tujuan atau kegiatan..."
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table View */}
                <Card className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
                    {filteredTransactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <Receipt className="mb-4 h-12 w-12 text-on-surface-variant/40" />
                            <h3 className="font-headline-sm text-headline-sm font-semibold text-foreground">
                                Tidak Ada Transaksi
                            </h3>
                            <p className="mx-auto mt-2 max-w-sm font-body-md text-on-surface-variant/80">
                                {search
                                    ? 'Tidak ada transaksi keuangan yang cocok dengan pencarian Anda.'
                                    : 'Belum ada riwayat transaksi keuangan yang tercatat.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-outline-variant bg-surface-container-low text-xs font-semibold tracking-wider text-primary uppercase">
                                        <th className="px-6 py-4">Tanggal</th>
                                        <th className="px-6 py-4">Kegiatan</th>
                                        <th className="px-6 py-4">
                                            Sumber / Penerima
                                        </th>
                                        <th className="px-6 py-4">Tipe</th>
                                        <th className="px-6 py-4">Nominal</th>
                                        <th className="px-6 py-4 text-center">
                                            Bukti
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/60 font-body-sm text-sm text-on-surface">
                                    {filteredTransactions.map((t) => {
                                        return (
                                            <tr
                                                key={t.id_transaksi}
                                                className="transition-colors hover:bg-surface-container-low/30"
                                            >
                                                <td className="px-6 py-4 font-medium text-foreground">
                                                    {formatDate(
                                                        t.tanggal_transaksi,
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-on-surface-variant">
                                                    {t.kegiatan
                                                        ?.nama_kegiatan || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-on-surface-variant">
                                                    {t.sumber_tujuan_transaksi}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                            t.jenis_transaksi ===
                                                            'Pemasukan'
                                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                                : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                                                        }`}
                                                    >
                                                        {t.jenis_transaksi}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-foreground">
                                                    <div className="flex flex-col">
                                                        <span
                                                            className={
                                                                t.jenis_transaksi ===
                                                                'Pemasukan'
                                                                    ? 'text-emerald-700 dark:text-emerald-400'
                                                                    : 'text-red-700 dark:text-red-400'
                                                            }
                                                        >
                                                            {t.jenis_transaksi ===
                                                            'Pemasukan'
                                                                ? '+'
                                                                : '-'}{' '}
                                                            {formatRupiah(
                                                                Number(
                                                                    t.nominal_transaksi,
                                                                ),
                                                            )}
                                                        </span>
                                                        {t.catatan_koreksi && (
                                                            <span
                                                                className="mt-0.5 flex max-w-[180px] items-center gap-1 text-[10px] font-normal text-amber-600 dark:text-amber-400"
                                                                title={
                                                                    t.catatan_koreksi
                                                                }
                                                            >
                                                                <AlertCircle className="h-3 w-3 shrink-0" />
                                                                Dikoreksi:{' '}
                                                                {
                                                                    t.catatan_koreksi
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {t.foto_bukti_transaksi ? (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-md px-3 font-semibold text-primary transition-all hover:bg-primary/5"
                                                            onClick={() =>
                                                                setSelectedReceipt(
                                                                    t.foto_bukti_transaksi,
                                                                )
                                                            }
                                                        >
                                                            <Eye className="h-3.5 w-3.5" />
                                                            Lihat
                                                        </Button>
                                                    ) : (
                                                        <span className="text-on-surface-variant/40 italic">
                                                            No receipt
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </main>

            {/* RECEIPT VIEW DIALOG */}
            <Dialog
                open={!!selectedReceipt}
                onOpenChange={(open) => !open && setSelectedReceipt(null)}
            >
                <DialogContent className="max-w-md rounded-2xl border border-outline-variant bg-surface-container-lowest p-6">
                    <DialogHeader>
                        <DialogTitle className="font-headline-sm text-headline-sm font-bold text-foreground">
                            Bukti Transaksi
                        </DialogTitle>
                        <DialogDescription className="text-body-sm text-on-surface-variant">
                            Dokumentasi bukti transfer / nota keuangan resmi.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedReceipt && (
                        <div className="flex flex-col items-center justify-center p-2">
                            <div className="w-full overflow-hidden rounded-xl border border-outline-variant/50 bg-surface-container-low p-2">
                                {selectedReceipt
                                    .toLowerCase()
                                    .endsWith('.pdf') ? (
                                    <div className="flex flex-col items-center justify-center py-10 text-center">
                                        <FileText className="mb-3 h-16 w-16 text-primary/70" />
                                        <p className="mb-4 text-sm font-semibold text-foreground">
                                            Dokumen Bukti Transfer (PDF)
                                        </p>
                                        <a
                                            href={selectedReceipt}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-label-md font-semibold text-on-primary hover:opacity-95"
                                        >
                                            Buka Dokumen PDF
                                        </a>
                                    </div>
                                ) : (
                                    <img
                                        src={selectedReceipt}
                                        alt="Bukti Transaksi"
                                        className="h-auto max-h-[350px] w-full rounded object-contain shadow-sm"
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => setSelectedReceipt(null)}
                        >
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
