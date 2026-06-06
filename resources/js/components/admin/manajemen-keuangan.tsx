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
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Transaction {
    date: string;
    time: string;
    type: 'pemasukan' | 'pengeluaran';
    nominal: number;
    purpose: string;
    invoice: string;
}

export default function ManajemenKeuangan() {
    const [searchQuery, setSearchQuery] = useState('');

    const transactions: Transaction[] = [
        {
            date: '15 Okt 2024',
            time: '14:20 WITA',
            type: 'pemasukan',
            nominal: 5000000,
            purpose:
                'Sponsorship Acara Seminar IT Nasional 2024 - PT Digital Solusi',
            invoice: 'nota_552.pdf',
        },
        {
            date: '12 Okt 2024',
            time: '09:15 WITA',
            type: 'pengeluaran',
            nominal: 1250000,
            purpose: 'Pembelian ATK dan Konsumsi Rapat Koordinasi Bulanan',
            invoice: 'nota_551.jpg',
        },
        {
            date: '08 Okt 2024',
            time: '16:45 WITA',
            type: 'pengeluaran',
            nominal: 3000000,
            purpose: 'DP Sewa Aula untuk Kegiatan Pengabdian Masyarakat',
            invoice: 'nota_550.pdf',
        },
        {
            date: '05 Okt 2024',
            time: '10:00 WITA',
            type: 'pemasukan',
            nominal: 7500000,
            purpose:
                'Iuran Anggota Tahunan Gelombang I Tahun Akademik 2024/2025',
            invoice: 'iuran_batch1.xlsx',
        },
    ];

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        })
            .format(value)
            .replace('IDR', 'Rp');
    };

    const filteredTransactions = transactions.filter(
        (t) =>
            t.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.invoice.toLowerCase().includes(searchQuery.toLowerCase()),
    );

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
                                Rp 45.750.000
                            </p>
                        </div>
                    </Card>
                    <Button className="flex h-auto cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3 font-label-lg text-label-lg !text-on-primary transition-all duration-100 hover:bg-primary/95 hover:shadow-lg active:scale-95">
                        <PlusCircle className="h-5 w-5" />
                        Catat Transaksi
                    </Button>
                </div>
            </section>

            {/* Stats Bento Grid */}
            <section className="grid grid-cols-1 gap-unit-lg md:grid-cols-4">
                <Card className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-unit-lg shadow-sm ring-0 md:col-span-1">
                    <p className="mb-1 font-label-md text-label-md tracking-wider text-on-surface-variant uppercase">
                        Bulan Ini
                    </p>
                    <p className="font-headline-md text-headline-md font-bold text-green-600">
                        + Rp 12.500k
                    </p>
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-green-100 dark:bg-green-950">
                        <div className="h-full w-[65%] bg-green-500" />
                    </div>
                </Card>
                <Card className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-unit-lg shadow-sm ring-0 md:col-span-1">
                    <p className="mb-1 font-label-md text-label-md tracking-wider text-on-surface-variant uppercase">
                        Pengeluaran
                    </p>
                    <p className="font-headline-md text-headline-md font-bold text-error">
                        - Rp 4.200k
                    </p>
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-red-100 dark:bg-red-950">
                        <div className="h-full w-[30%] bg-error" />
                    </div>
                </Card>
                <Card className="group relative overflow-hidden rounded-xl border-none bg-primary p-unit-lg shadow-lg ring-0 md:col-span-2">
                    <div className="relative z-10 flex h-full items-center justify-between">
                        <div>
                            <p className="mb-1 font-label-md text-label-md text-on-primary/60">
                                Status Keuangan
                            </p>
                            <p className="font-headline-md text-headline-md font-bold text-on-primary">
                                Sehat &amp; Stabil
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
                            variant="outline"
                            className="h-auto cursor-pointer rounded-lg border border-outline-variant/50 p-2 shadow-none transition-colors hover:bg-surface-container-low"
                        >
                            <Filter className="h-5 w-5 text-on-surface-variant" />
                        </Button>
                    </div>
                </div>
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
                                    Bukti Nota
                                </th>
                                <th className="px-unit-lg py-4 text-right font-label-lg text-label-lg tracking-wider text-on-surface-variant uppercase">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/20">
                            {filteredTransactions.map((transaction, idx) => (
                                <tr
                                    key={idx}
                                    className="transition-colors hover:bg-surface-container-low/20"
                                >
                                    <td className="px-unit-lg py-4">
                                        <p className="font-body-md text-body-md font-medium">
                                            {transaction.date}
                                        </p>
                                        <p className="font-label-md text-label-md text-on-surface-variant">
                                            {transaction.time}
                                        </p>
                                    </td>
                                    <td className="px-unit-lg py-4">
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-label-md font-bold ${
                                                transaction.type === 'pemasukan'
                                                    ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-400'
                                                    : 'border-red-200 bg-red-50 text-error dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400'
                                            }`}
                                        >
                                            {transaction.type ===
                                            'pemasukan' ? (
                                                <ArrowUp className="h-3.5 w-3.5" />
                                            ) : (
                                                <ArrowDown className="h-3.5 w-3.5" />
                                            )}
                                            {transaction.type === 'pemasukan'
                                                ? 'Pemasukan'
                                                : 'Pengeluaran'}
                                        </span>
                                    </td>
                                    <td
                                        className={`px-unit-lg py-4 font-headline-sm font-semibold ${
                                            transaction.type === 'pemasukan'
                                                ? 'text-green-700 dark:text-green-400'
                                                : 'text-error'
                                        }`}
                                    >
                                        {formatRupiah(transaction.nominal)}
                                    </td>
                                    <td
                                        className="max-w-xs truncate px-unit-lg py-4 font-body-md text-body-md"
                                        title={transaction.purpose}
                                    >
                                        {transaction.purpose}
                                    </td>
                                    <td className="px-unit-lg py-4">
                                        <Button
                                            variant="link"
                                            className="flex h-auto cursor-pointer items-center gap-2 p-0 font-label-lg text-label-lg text-primary shadow-none hover:text-primary/80"
                                        >
                                            <Receipt className="h-4 w-4" />
                                            {transaction.invoice}
                                        </Button>
                                    </td>
                                    <td className="px-unit-lg py-4 text-right">
                                        <Button className="h-auto cursor-pointer rounded-lg border-none bg-surface-container-low px-4 py-2 font-label-lg text-label-lg text-primary shadow-none transition-all hover:bg-primary hover:text-on-primary">
                                            Koreksi
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {filteredTransactions.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
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
                        Menampilkan 1-4 dari 128 transaksi
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
                            <Button
                                variant="ghost"
                                className="h-8 h-auto w-8 cursor-pointer rounded-lg p-0 font-label-lg text-label-lg shadow-none hover:bg-surface-container-low"
                            >
                                2
                            </Button>
                            <Button
                                variant="ghost"
                                className="h-8 h-auto w-8 cursor-pointer rounded-lg p-0 font-label-lg text-label-lg shadow-none hover:bg-surface-container-low"
                            >
                                3
                            </Button>
                            <span className="px-2">...</span>
                            <Button
                                variant="ghost"
                                className="h-8 h-auto w-8 cursor-pointer rounded-lg p-0 font-label-lg text-label-lg shadow-none hover:bg-surface-container-low"
                            >
                                32
                            </Button>
                        </div>
                        <Button
                            variant="ghost"
                            className="h-auto cursor-pointer rounded-lg p-2 shadow-none hover:bg-surface-container-low"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
