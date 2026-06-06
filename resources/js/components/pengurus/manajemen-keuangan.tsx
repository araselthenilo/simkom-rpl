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
    ChevronRight
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
            purpose: 'Sponsorship Acara Seminar IT Nasional 2024 - PT Digital Solusi',
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
            purpose: 'Iuran Anggota Tahunan Gelombang I Tahun Akademik 2024/2025',
            invoice: 'iuran_batch1.xlsx',
        }
    ];

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value).replace('IDR', 'Rp');
    };

    const filteredTransactions = transactions.filter(t =>
        t.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.invoice.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-margin-desktop max-w-container-max mx-auto w-full space-y-gutter">
            {/* Header Section */}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-gutter">
                <div className="space-y-unit-xs">
                    <h2 className="font-headline-lg text-headline-lg text-primary">Manajemen Buku Kas</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        Lacak dan kelola semua mutasi keuangan organisasi.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-gutter w-full md:w-auto">
                    <Card className="bg-surface-container-lowest p-4 px-unit-lg rounded-xl shadow-sm border border-outline-variant/30 flex items-center gap-4 ring-0">
                        <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center text-on-secondary-container">
                            <Wallet className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-label-md text-label-md text-on-surface-variant">Total Saldo Saat Ini</p>
                            <p className="font-headline-sm text-headline-sm text-primary font-bold">Rp 45.750.000</p>
                        </div>
                    </Card>
                    <Button className="flex items-center gap-2 bg-primary !text-on-primary px-6 py-3 h-auto rounded-lg font-label-lg text-label-lg hover:shadow-lg hover:bg-primary/95 transition-all active:scale-95 duration-100 cursor-pointer">
                        <PlusCircle className="h-5 w-5" />
                        Catat Transaksi
                    </Button>
                </div>
            </section>

            {/* Stats Bento Grid */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-unit-lg">
                <Card className="md:col-span-1 bg-surface-container-lowest p-unit-lg rounded-xl shadow-sm border border-outline-variant/30 ring-0">
                    <p className="font-label-md text-label-md text-on-surface-variant mb-1 uppercase tracking-wider">Bulan Ini</p>
                    <p className="font-headline-md text-headline-md text-green-600 font-bold">+ Rp 12.500k</p>
                    <div className="mt-2 h-1 w-full bg-green-100 dark:bg-green-950 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[65%]" />
                    </div>
                </Card>
                <Card className="md:col-span-1 bg-surface-container-lowest p-unit-lg rounded-xl shadow-sm border border-outline-variant/30 ring-0">
                    <p className="font-label-md text-label-md text-on-surface-variant mb-1 uppercase tracking-wider">Pengeluaran</p>
                    <p className="font-headline-md text-headline-md text-error font-bold">- Rp 4.200k</p>
                    <div className="mt-2 h-1 w-full bg-red-100 dark:bg-red-950 rounded-full overflow-hidden">
                        <div className="h-full bg-error w-[30%]" />
                    </div>
                </Card>
                <Card className="md:col-span-2 bg-primary p-unit-lg rounded-xl shadow-lg relative overflow-hidden group border-none ring-0">
                    <div className="relative z-10 flex justify-between items-center h-full">
                        <div>
                            <p className="font-label-md text-label-md text-on-primary/60 mb-1">Status Keuangan</p>
                            <p className="font-headline-md text-headline-md text-on-primary font-bold">Sehat &amp; Stabil</p>
                        </div>
                        <TrendingUp className="text-white/20 h-16 w-16 group-hover:scale-110 transition-transform" />
                    </div>
                    {/* Abstract visual effect */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                </Card>
            </section>

            {/* Table Container */}
            <Card className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden ring-0">
                <div className="px-unit-lg py-4 border-b border-outline-variant/30 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-surface-container-low/30">
                    <h3 className="font-headline-sm text-headline-sm text-primary">Riwayat Mutasi Kas</h3>
                    <div className="flex gap-2">
                        <div className="relative flex-1 sm:flex-none">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant h-4 w-4" />
                            <input
                                className="pl-10 pr-4 py-2 border border-outline-variant/50 rounded-lg text-body-sm focus:ring-2 focus:ring-primary/20 outline-none w-full sm:w-64 bg-surface-container-lowest"
                                placeholder="Cari mutasi..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="p-2 border border-outline-variant/50 rounded-lg hover:bg-surface-container-low transition-colors h-auto cursor-pointer shadow-none">
                            <Filter className="h-5 w-5 text-on-surface-variant" />
                        </Button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-lowest border-b border-outline-variant/30">
                                <th className="px-unit-lg py-4 font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Tanggal</th>
                                <th className="px-unit-lg py-4 font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Jenis</th>
                                <th className="px-unit-lg py-4 font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Nominal</th>
                                <th className="px-unit-lg py-4 font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Keperluan</th>
                                <th className="px-unit-lg py-4 font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Bukti Nota</th>
                                <th className="px-unit-lg py-4 font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/20">
                            {filteredTransactions.map((transaction, idx) => (
                                <tr key={idx} className="hover:bg-surface-container-low/20 transition-colors">
                                    <td className="px-unit-lg py-4">
                                        <p className="font-body-md text-body-md font-medium">{transaction.date}</p>
                                        <p className="font-label-md text-label-md text-on-surface-variant">{transaction.time}</p>
                                    </td>
                                    <td className="px-unit-lg py-4">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-label-md font-bold border ${transaction.type === 'pemasukan'
                                                ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-900/50'
                                                : 'bg-red-50 text-error border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50'
                                            }`}>
                                            {transaction.type === 'pemasukan' ? (
                                                <ArrowUp className="h-3.5 w-3.5" />
                                            ) : (
                                                <ArrowDown className="h-3.5 w-3.5" />
                                            )}
                                            {transaction.type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
                                        </span>
                                    </td>
                                    <td className={`px-unit-lg py-4 font-headline-sm font-semibold ${transaction.type === 'pemasukan' ? 'text-green-700 dark:text-green-400' : 'text-error'
                                        }`}>
                                        {formatRupiah(transaction.nominal)}
                                    </td>
                                    <td className="px-unit-lg py-4 font-body-md text-body-md max-w-xs truncate" title={transaction.purpose}>
                                        {transaction.purpose}
                                    </td>
                                    <td className="px-unit-lg py-4">
                                        <Button variant="link" className="flex items-center gap-2 text-primary hover:text-primary/80 font-label-lg text-label-lg p-0 h-auto cursor-pointer shadow-none">
                                            <Receipt className="h-4 w-4" />
                                            {transaction.invoice}
                                        </Button>
                                    </td>
                                    <td className="px-unit-lg py-4 text-right">
                                        <Button className="bg-surface-container-low text-primary px-4 py-2 rounded-lg font-label-lg text-label-lg hover:bg-primary hover:text-on-primary transition-all cursor-pointer border-none shadow-none h-auto">
                                            Koreksi
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {filteredTransactions.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-unit-lg py-8 text-center text-on-surface-variant font-body-md">
                                        Tidak ada transaksi yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Table Footer */}
                <div className="px-unit-lg py-4 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-unit-md text-on-surface-variant">
                    <p className="font-body-sm text-body-sm">Menampilkan 1-4 dari 128 transaksi</p>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" className="p-2 rounded-lg hover:bg-surface-container-low disabled:opacity-30 h-auto cursor-pointer shadow-none" disabled>
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex items-center gap-1">
                            <Button className="w-8 h-8 p-0 rounded-lg bg-primary !text-on-primary font-label-lg text-label-lg h-auto cursor-pointer">1</Button>
                            <Button variant="ghost" className="w-8 h-8 p-0 rounded-lg hover:bg-surface-container-low font-label-lg text-label-lg h-auto cursor-pointer shadow-none">2</Button>
                            <Button variant="ghost" className="w-8 h-8 p-0 rounded-lg hover:bg-surface-container-low font-label-lg text-label-lg h-auto cursor-pointer shadow-none">3</Button>
                            <span className="px-2">...</span>
                            <Button variant="ghost" className="w-8 h-8 p-0 rounded-lg hover:bg-surface-container-low font-label-lg text-label-lg h-auto cursor-pointer shadow-none">32</Button>
                        </div>
                        <Button variant="ghost" className="p-2 rounded-lg hover:bg-surface-container-low h-auto cursor-pointer shadow-none">
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}