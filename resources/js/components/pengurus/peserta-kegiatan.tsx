import { router } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Search,
    MapPin,
    CheckCircle2,
    Users,
    Info,
    DollarSign,
    ChevronLeft,
    ChevronRight,
    Eye,
    X,
    Phone,
    FileText,
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
    created_at?: string;
    updated_at?: string;
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

export default function PesertaKegiatan({
    kegiatan,
    pesertaList = [],
    role = 'pengurus',
}: {
    kegiatan: Activity;
    pesertaList?: Peserta[];
    role?: 'admin' | 'pengurus';
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activePeserta, setActivePeserta] = useState<Peserta | null>(null);
    const [isProofModalOpen, setIsProofModalOpen] = useState(false);

    // Format Rupiah
    const formatRupiah = (value: number) => {
        if (value === 0) {
            return 'Gratis';
        }

        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        })
            .format(value)
            .replace('IDR', 'Rp');
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) {
            return '-';
        }

        try {
            const date = new Date(dateStr);

            return new Intl.DateTimeFormat('id-ID', {
                dateStyle: 'medium',
                timeStyle: 'short',
            }).format(date);
        } catch {
            return dateStr;
        }
    };

    // Filters and search logic
    const filteredPeserta = pesertaList.filter((peserta) => {
        const query = searchQuery.toLowerCase();
        const nama = peserta.mahasiswa?.nama_lengkap?.toLowerCase() || '';
        const nim = peserta.nim?.toLowerCase() || '';
        const prodi = peserta.mahasiswa?.program_studi?.toLowerCase() || '';

        return (
            nama.includes(query) || nim.includes(query) || prodi.includes(query)
        );
    });

    // Calculations
    const totalJoined = pesertaList.length;
    const isPaidEvent = kegiatan.biaya_pendaftaran > 0;

    // Count paid registrations (those with transaction proof)
    const paidCount = pesertaList.filter((p) => {
        const tx = p.transaksi_keuangan || p.transaksiKeuangan;

        return !!tx;
    }).length;

    const remainingCapacity = Math.max(0, kegiatan.kuota_peserta - totalJoined);

    // Open Payment Proof Modal
    const openProofModal = (peserta: Peserta) => {
        setActivePeserta(peserta);
        setIsProofModalOpen(true);
    };

    // Helper to get correct storage url
    const getProofUrl = (path?: string) => {
        if (!path) {
            return '';
        }

        if (
            path.startsWith('http://') ||
            path.startsWith('https://') ||
            path.startsWith('/')
        ) {
            return path;
        }

        return `/storage/${path}`;
    };

    return (
        <main className="mx-auto w-full max-w-container-max animate-in space-y-gutter p-margin-desktop duration-200 fade-in">
            {/* Header & Back Button */}
            <header className="mb-unit-xl flex flex-col items-start justify-between gap-unit-md md:flex-row md:items-center">
                <div className="flex flex-col gap-2">
                    <button
                        onClick={() =>
                            router.get(
                                role === 'admin'
                                    ? '/admin/kegiatan'
                                    : '/pengurus/kegiatan',
                            )
                        }
                        className="group inline-flex cursor-pointer items-center gap-2 font-label-lg text-primary transition-all hover:opacity-80 focus:outline-none"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Kembali ke Manajemen Kegiatan
                    </button>

                    <div className="mt-2 flex flex-wrap items-center gap-3">
                        <h2 className="font-headline-lg text-headline-lg text-primary">
                            {kegiatan.nama_kegiatan}
                        </h2>
                        <span className="rounded border border-primary/10 bg-primary-fixed px-2.5 py-1 text-xs font-semibold text-primary">
                            {kegiatan.jenis_kegiatan}
                        </span>
                        <span
                            className={`flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-semibold ${
                                kegiatan.status_kegiatan === 'Selesai'
                                    ? 'bg-green-100 text-green-700'
                                    : kegiatan.status_kegiatan ===
                                        'Sedang berlangsung'
                                      ? 'bg-amber-100 text-amber-800'
                                      : kegiatan.status_kegiatan === 'Mendatang'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-red-100 text-red-700'
                            }`}
                        >
                            {kegiatan.status_kegiatan}
                        </span>
                    </div>

                    <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 font-body-md text-body-md text-on-surface-variant">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-primary/60" />
                            {kegiatan.tanggal_pelaksanaan}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-error/60" />
                            {kegiatan.lokasi_kegiatan}
                        </span>
                    </p>
                </div>
            </header>

            {/* Metrics Grid */}
            <div className="mb-unit-xl grid grid-cols-1 gap-gutter md:grid-cols-3">
                <Card className="flex h-32 flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-[0px_2px_4px_rgba(26,54,93,0.05)] ring-0">
                    <div className="flex items-start justify-between">
                        <span className="font-label-md text-primary/70">
                            Total Pendaftar
                        </span>
                        <Users className="h-5 w-5 text-primary/40" />
                    </div>
                    <div className="flex items-baseline gap-2 font-headline-md text-headline-md font-bold text-primary">
                        {totalJoined}
                        <span className="text-sm font-normal text-on-surface-variant">
                            dari {kegiatan.kuota_peserta} Kuota
                        </span>
                    </div>
                </Card>

                {isPaidEvent ? (
                    <Card className="flex h-32 flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-[0px_2px_4px_rgba(26,54,93,0.05)] ring-0">
                        <div className="flex items-start justify-between">
                            <span className="font-label-md text-green-700">
                                Pembayaran Terverifikasi
                            </span>
                            <CheckCircle2 className="h-5 w-5 text-green-700/40" />
                        </div>
                        <div className="font-headline-md text-headline-md font-bold text-green-700">
                            {paidCount}{' '}
                            <span className="text-sm font-normal text-on-surface-variant">
                                Peserta
                            </span>
                        </div>
                    </Card>
                ) : (
                    <Card className="flex h-32 flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-[0px_2px_4px_rgba(26,54,93,0.05)] ring-0">
                        <div className="flex items-start justify-between">
                            <span className="font-label-md text-secondary">
                                Tipe Pendaftaran
                            </span>
                            <DollarSign className="h-5 w-5 text-secondary/40" />
                        </div>
                        <div className="font-headline-md text-headline-md font-bold text-secondary">
                            Gratis
                        </div>
                    </Card>
                )}

                <Card className="flex h-32 flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-[0px_2px_4px_rgba(26,54,93,0.05)] ring-0">
                    <div className="flex items-start justify-between">
                        <span className="font-label-md text-tertiary">
                            Sisa Kuota
                        </span>
                        <Info className="h-5 w-5 text-tertiary/40" />
                    </div>
                    <div className="font-headline-md text-headline-md font-bold text-tertiary">
                        {remainingCapacity}{' '}
                        <span className="text-sm font-normal text-on-surface-variant">
                            Orang
                        </span>
                    </div>
                </Card>
            </div>

            {/* Filter and Search Bar */}
            <div className="mb-unit-lg flex flex-col items-center justify-between gap-unit-md rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-md shadow-[0px_2px_4px_rgba(26,54,93,0.05)] sm:flex-row">
                <h3 className="font-headline-sm font-semibold text-primary">
                    Daftar Peserta
                </h3>

                {/* Search Input */}
                <div className="relative w-full sm:w-80">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                    <input
                        className="w-full rounded-lg border border-outline-variant bg-background py-2 pr-4 pl-10 font-body-sm text-on-background transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Cari nama, NIM, atau prodi..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Participants Table */}
            <Card className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-[0px_2px_4px_rgba(26,54,93,0.05)] ring-0">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-outline-variant bg-surface-container-low">
                                <th className="px-unit-lg py-4 font-label-lg tracking-wider text-primary uppercase">
                                    Mahasiswa
                                </th>
                                <th className="px-unit-lg py-4 font-label-lg tracking-wider text-primary uppercase">
                                    Program Studi
                                </th>
                                <th className="px-unit-lg py-4 font-label-lg tracking-wider text-primary uppercase">
                                    Kontak
                                </th>
                                <th className="px-unit-lg py-4 font-label-lg tracking-wider text-primary uppercase">
                                    Waktu Daftar
                                </th>
                                {isPaidEvent && (
                                    <th className="px-unit-lg py-4 text-right font-label-lg tracking-wider text-primary uppercase">
                                        Bukti Bayar
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/50">
                            {filteredPeserta.map((peserta) => {
                                const tx =
                                    peserta.transaksi_keuangan ||
                                    peserta.transaksiKeuangan;

                                return (
                                    <tr
                                        key={peserta.id_peserta}
                                        className="group transition-colors hover:bg-primary/[0.02]"
                                    >
                                        {/* Name & NIM */}
                                        <td className="px-unit-lg py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-body-md font-semibold text-primary">
                                                    {peserta.mahasiswa
                                                        ?.nama_lengkap ||
                                                        'Tidak Diketahui'}
                                                </span>
                                                <span className="text-[12px] font-medium text-on-surface-variant/70">
                                                    NIM: {peserta.nim}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Program Studi */}
                                        <td className="px-unit-lg py-4">
                                            <span className="font-body-sm text-on-surface-variant">
                                                {peserta.mahasiswa
                                                    ?.program_studi || '-'}
                                            </span>
                                        </td>

                                        {/* Contact */}
                                        <td className="px-unit-lg py-4">
                                            <div className="flex items-center gap-1.5 font-body-sm text-on-surface-variant">
                                                <Phone className="h-3.5 w-3.5 text-primary/60" />
                                                <span>
                                                    {peserta.mahasiswa
                                                        ?.nomor_telepon || '-'}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Joined Time */}
                                        <td className="px-unit-lg py-4">
                                            <span className="font-body-sm text-on-surface-variant">
                                                {formatDate(peserta.created_at)}
                                            </span>
                                        </td>

                                        {/* Proof Action */}
                                        {isPaidEvent && (
                                            <td className="px-unit-lg py-4 text-right">
                                                {tx ? (
                                                    <Button
                                                        onClick={() =>
                                                            openProofModal(
                                                                peserta,
                                                            )
                                                        }
                                                        variant="outline"
                                                        size="sm"
                                                        className="cursor-pointer gap-1.5 rounded-lg border border-primary text-xs text-primary hover:bg-primary/5"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                        Lihat Bukti
                                                    </Button>
                                                ) : (
                                                    <span className="text-xs font-medium text-error italic">
                                                        Belum ada bukti
                                                    </span>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                            {filteredPeserta.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={isPaidEvent ? 5 : 4}
                                        className="px-unit-lg py-12 text-center font-body-md text-on-surface-variant"
                                    >
                                        Tidak ada peserta yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Simple layout) */}
                <div className="flex flex-col items-center justify-between gap-unit-md border-t border-outline-variant bg-surface-container-low px-unit-lg py-4 md:flex-row">
                    <span className="font-body-sm text-on-surface-variant">
                        Menampilkan 1-{filteredPeserta.length} dari{' '}
                        {filteredPeserta.length} data
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            className="cursor-pointer rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-highest disabled:opacity-30"
                            disabled
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button className="h-8 w-8 cursor-pointer rounded-lg bg-primary font-label-md text-on-primary">
                            1
                        </button>
                        <button
                            className="cursor-pointer rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-highest disabled:opacity-30"
                            disabled
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </Card>

            {/* Payment Proof Modal */}
            {isProofModalOpen &&
                activePeserta &&
                (() => {
                    const tx =
                        activePeserta.transaksi_keuangan ||
                        activePeserta.transaksiKeuangan;

                    return tx ? (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            {/* Backdrop overlay */}
                            <div
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                                onClick={() => setIsProofModalOpen(false)}
                            ></div>

                            {/* Modal Card */}
                            <div className="relative z-10 w-full max-w-2xl animate-in rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-2xl duration-200 zoom-in-95 fade-in">
                                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-unit-sm">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-primary" />
                                        <h3 className="font-headline-sm font-bold text-primary">
                                            Bukti Pembayaran Kegiatan
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setIsProofModalOpen(false)
                                        }
                                        className="cursor-pointer p-1 text-on-surface-variant transition-colors hover:text-primary"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="mt-6 grid grid-cols-1 gap-unit-lg md:grid-cols-2">
                                    {/* Left Pane - Detail Information */}
                                    <div className="space-y-4">
                                        <div>
                                            <span className="block text-[11px] font-semibold tracking-wider text-primary/70 uppercase">
                                                Nama Peserta
                                            </span>
                                            <span className="font-body-md font-bold text-primary">
                                                {activePeserta.mahasiswa
                                                    ?.nama_lengkap || '-'}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="block text-[11px] font-semibold tracking-wider text-primary/70 uppercase">
                                                    NIM
                                                </span>
                                                <span className="font-body-sm text-on-background">
                                                    {activePeserta.nim}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="block text-[11px] font-semibold tracking-wider text-primary/70 uppercase">
                                                    ID Transaksi
                                                </span>
                                                <span className="font-body-sm font-mono text-on-background">
                                                    #{tx.id_transaksi}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-3 border-t border-outline-variant/40 pt-4">
                                            <div>
                                                <span className="block text-[11px] font-semibold tracking-wider text-primary/70 uppercase">
                                                    Nominal Transaksi
                                                </span>
                                                <span className="font-headline-sm font-bold text-green-700">
                                                    {formatRupiah(
                                                        Number(
                                                            tx.nominal_transaksi,
                                                        ),
                                                    )}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="block text-[11px] font-semibold tracking-wider text-primary/70 uppercase">
                                                    Tanggal Transaksi
                                                </span>
                                                <span className="font-body-sm text-on-surface-variant">
                                                    {formatDate(
                                                        tx.tanggal_transaksi ||
                                                            tx.created_at,
                                                    )}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="block text-[11px] font-semibold tracking-wider text-primary/70 uppercase">
                                                    Sumber/Tujuan
                                                </span>
                                                <span className="font-body-sm text-on-surface-variant italic">
                                                    {tx.sumber_tujuan_transaksi ||
                                                        '-'}
                                                </span>
                                            </div>
                                        </div>

                                        {tx.catatan_koreksi && (
                                            <div className="mt-2 rounded-lg border border-error-container/40 bg-error-container/20 p-3">
                                                <span className="mb-1 block text-[11px] font-bold text-error uppercase">
                                                    Catatan Koreksi
                                                </span>
                                                <p className="text-xs text-error">
                                                    {tx.catatan_koreksi}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Pane - Receipt Image */}
                                    <div className="flex h-[300px] flex-col items-center justify-center overflow-hidden rounded-lg border border-outline-variant/60 bg-surface-container-low p-2">
                                        {tx.foto_bukti_transaksi ? (
                                            <a
                                                href={getProofUrl(
                                                    tx.foto_bukti_transaksi,
                                                )}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group relative flex h-full w-full cursor-zoom-in items-center justify-center"
                                                title="Klik untuk membuka di tab baru"
                                            >
                                                <img
                                                    src={getProofUrl(
                                                        tx.foto_bukti_transaksi,
                                                    )}
                                                    alt="Bukti Pendaftaran"
                                                    className="max-h-full max-w-full rounded object-contain transition-all duration-300 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center rounded bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                                                    <span className="flex items-center gap-1 rounded-lg bg-primary/80 px-3 py-1.5 font-label-md text-xs text-white shadow-md">
                                                        <Eye className="h-3.5 w-3.5" />
                                                        Buka Gambar Penuh
                                                    </span>
                                                </div>
                                            </a>
                                        ) : (
                                            <div className="p-6 text-center text-on-surface-variant/60">
                                                <FileText className="mx-auto mb-2 h-12 w-12 opacity-30" />
                                                <p className="text-sm font-medium">
                                                    Gambar bukti transfer tidak
                                                    ditemukan
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end gap-2 border-t border-outline-variant/60 pt-4">
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            setIsProofModalOpen(false)
                                        }
                                        className="cursor-pointer bg-primary text-on-primary hover:opacity-90"
                                    >
                                        Tutup Detail
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : null;
                })()}
        </main>
    );
}
