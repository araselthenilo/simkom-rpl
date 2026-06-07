import {
    Download,
    Users,
    Hourglass,
    CheckCircle2,
    XCircle,
    Search,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    HelpCircle,
    IdCard,
} from 'lucide-react';
import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Member {
    id_keanggotaan: number;
    nim: string;
    name: string;
    major: string;
    status: 'Aktif' | 'Diproses' | 'Ditolak' | 'Tidak Aktif';
    initials: string;
    avatarColor: string;
}

export default function ManajemenAnggota({
    initialMembers = [],
    initialStats = { total: 0, pending: 0, active: 0, rejected: 0 },
}: {
    initialMembers?: Member[];
    initialStats?: {
        total: number;
        pending: number;
        active: number;
        rejected: number;
    };
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<
        'Semua' | 'Aktif' | 'Diproses' | 'Ditolak'
    >('Semua');

    const members = initialMembers;
    const stats = initialStats;

    const handleAccept = (id_keanggotaan: number) => {
        router.patch(
            `/pengurus/anggota/${id_keanggotaan}`,
            {
                status_keanggotaan: 'Aktif',
            },
            {
                preserveScroll: true,
            },
        );
    };

    const handleReject = (id_keanggotaan: number) => {
        const reason = prompt('Masukkan alasan penolakan:');
        if (reason === null) return;
        if (!reason.trim()) {
            alert('Alasan penolakan harus diisi.');
            return;
        }
        router.patch(
            `/pengurus/anggota/${id_keanggotaan}`,
            {
                status_keanggotaan: 'Ditolak',
                alasan_penolakan: reason,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const filteredMembers = members.filter((member) => {
        const matchesSearch =
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.nim.includes(searchQuery);

        if (activeTab === 'Semua') {
            return matchesSearch;
        }

        return matchesSearch && member.status === activeTab;
    });

    return (
        <main className="mx-auto w-full max-w-container-max space-y-gutter p-margin-desktop">
            {/* Header */}
            <header className="mb-unit-xl flex items-end justify-between">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary">
                        Manajemen Anggota
                    </h2>
                    <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
                        Kelola permohonan keanggotaan dan status mahasiswa
                        aktif.
                    </p>
                </div>
                <div className="flex gap-unit-sm">
                    <Button className="flex h-auto cursor-pointer items-center gap-2 rounded-lg border-none bg-primary px-6 py-3 font-label-lg text-on-primary shadow-sm transition-all hover:opacity-90 active:scale-95">
                        <Download className="h-[18px] w-[18px]" />
                        Export PDF
                    </Button>
                </div>
            </header>

            {/* Metrics Grid */}
            <div className="mb-unit-xl grid grid-cols-1 gap-gutter md:grid-cols-4">
                <Card className="flex h-32 flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-[0px_2px_4px_rgba(26,54,93,0.05)] ring-0">
                    <div className="flex items-start justify-between">
                        <span className="font-label-md text-primary/70">
                            Total Anggota
                        </span>
                        <Users className="h-5 w-5 text-primary/40" />
                    </div>
                    <div className="font-headline-md text-headline-md font-bold text-primary">
                        {stats.total.toLocaleString('id-ID')}
                    </div>
                </Card>
                <Card className="flex h-32 flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-[0px_2px_4px_rgba(26,54,93,0.05)] ring-0">
                    <div className="flex items-start justify-between">
                        <span className="font-label-md text-secondary">
                            Menunggu Proses
                        </span>
                        <Hourglass className="h-5 w-5 text-secondary/40" />
                    </div>
                    <div className="font-headline-md text-headline-md font-bold text-secondary">
                        {stats.pending}
                    </div>
                </Card>
                <Card className="flex h-32 flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-[0px_2px_4px_rgba(26,54,93,0.05)] ring-0">
                    <div className="flex items-start justify-between">
                        <span className="font-label-md text-green-700">
                            Aktif Semester Ini
                        </span>
                        <CheckCircle2 className="h-5 w-5 text-green-700/40" />
                    </div>
                    <div className="font-headline-md text-headline-md font-bold text-green-700">
                        {stats.active}
                    </div>
                </Card>
                <Card className="flex h-32 flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-[0px_2px_4px_rgba(26,54,93,0.05)] ring-0">
                    <div className="flex items-start justify-between">
                        <span className="font-label-md text-error">
                            Permohonan Ditolak
                        </span>
                        <XCircle className="h-5 w-5 text-error/40" />
                    </div>
                    <div className="font-headline-md text-headline-md font-bold text-error">
                        {stats.rejected}
                    </div>
                </Card>
            </div>

            {/* Filter and Search Bar */}
            <div className="mb-unit-lg flex flex-col items-center justify-between gap-unit-md rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-md shadow-[0px_2px_4px_rgba(26,54,93,0.05)] md:flex-row">
                <div className="flex w-full overflow-x-auto rounded-lg bg-surface-container-low p-1 md:w-auto">
                    {(['Semua', 'Aktif', 'Diproses', 'Ditolak'] as const).map(
                        (tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`rounded-md px-6 py-2 font-label-lg text-nowrap transition-all ${
                                    activeTab === tab
                                        ? 'bg-white font-semibold text-primary shadow-sm'
                                        : 'text-on-surface-variant hover:text-primary'
                                }`}
                            >
                                {tab}
                            </button>
                        ),
                    )}
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                    <input
                        className="w-full rounded-lg border border-outline-variant bg-background py-2 pr-4 pl-10 font-body-sm text-on-background transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Cari NIM atau Nama..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Members Table */}
            <Card className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-[0px_2px_4px_rgba(26,54,93,0.05)] ring-0">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-outline-variant bg-surface-container-low">
                                <th className="px-unit-lg py-4 font-label-lg tracking-wider text-primary uppercase">
                                    NIM
                                </th>
                                <th className="px-unit-lg py-4 font-label-lg tracking-wider text-primary uppercase">
                                    Nama Mahasiswa
                                </th>
                                <th className="px-unit-lg py-4 font-label-lg tracking-wider text-primary uppercase">
                                    Program Studi
                                </th>
                                <th className="px-unit-lg py-4 font-label-lg tracking-wider text-primary uppercase">
                                    Status
                                </th>
                                <th className="px-unit-lg py-4 text-right font-label-lg tracking-wider text-primary uppercase">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/50">
                            {filteredMembers.map((member) => (
                                <tr
                                    key={member.nim}
                                    className="transition-colors hover:bg-primary/[0.02]"
                                >
                                    <td className="px-unit-lg py-4 font-label-md text-on-background">
                                        {member.nim}
                                    </td>
                                    <td className="px-unit-lg py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`h-8 w-8 rounded-full ${member.avatarColor} flex items-center justify-center text-xs font-bold`}
                                            >
                                                {member.initials}
                                            </div>
                                            <span className="font-body-md font-medium text-on-background">
                                                {member.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-unit-lg py-4 font-body-sm text-on-surface-variant">
                                        {member.major}
                                    </td>
                                    <td className="px-unit-lg py-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-[12px] font-semibold ${
                                                member.status === 'Aktif'
                                                    ? 'bg-green-100 text-green-700'
                                                    : member.status ===
                                                        'Diproses'
                                                      ? 'bg-secondary-container text-on-secondary-container'
                                                      : 'bg-error-container text-error'
                                            }`}
                                        >
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="px-unit-lg py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                className="hover:bg-primary-fixed rounded-lg p-2 text-primary transition-colors"
                                                title="Lihat KTM"
                                            >
                                                <IdCard className="h-5 w-5" />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleAccept(
                                                        member.id_keanggotaan,
                                                    )
                                                }
                                                className={`rounded-lg p-2 transition-colors ${
                                                    member.status === 'Aktif'
                                                        ? 'cursor-not-allowed text-outline-variant'
                                                        : 'text-green-700 hover:bg-green-100'
                                                }`}
                                                disabled={
                                                    member.status === 'Aktif'
                                                }
                                                title="Terima"
                                            >
                                                <CheckCircle2 className="h-5 w-5" />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleReject(
                                                        member.id_keanggotaan,
                                                    )
                                                }
                                                className={`rounded-lg p-2 transition-colors ${
                                                    member.status === 'Ditolak'
                                                        ? 'cursor-not-allowed text-outline-variant'
                                                        : 'text-error hover:bg-error-container'
                                                }`}
                                                disabled={
                                                    member.status === 'Ditolak'
                                                }
                                                title="Tolak"
                                            >
                                                <XCircle className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredMembers.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-unit-lg py-8 text-center font-body-md text-on-surface-variant"
                                    >
                                        Tidak ada anggota yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col items-center justify-between gap-unit-md border-t border-outline-variant bg-surface-container-low px-unit-lg py-4 md:flex-row">
                    <span className="font-body-sm text-on-surface-variant">
                        Menampilkan 1-{filteredMembers.length} dari{' '}
                        {filteredMembers.length} data
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-highest disabled:opacity-30"
                            disabled
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button className="h-8 w-8 rounded-lg bg-primary font-label-md text-on-primary">
                            1
                        </button>
                        <button
                            className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-highest disabled:opacity-30"
                            disabled
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </Card>

            {/* Guide & Support Section */}
            <div className="mt-unit-xl grid grid-cols-1 gap-gutter md:grid-cols-3">
                <div className="relative overflow-hidden rounded-xl bg-primary p-unit-xl text-on-primary shadow-lg md:col-span-2">
                    <div className="relative z-10 max-w-md">
                        <h3 className="mb-2 font-headline-md text-headline-md">
                            Panduan Verifikasi
                        </h3>
                        <p className="mb-6 font-body-md opacity-80">
                            Pastikan Nama dan NIM yang tertera di form
                            pendaftaran sesuai dengan Kartu Tanda Mahasiswa
                            (KTM) yang diunggah sebelum menyetujui anggota baru.
                        </p>
                        <a
                            className="inline-flex items-center gap-2 font-label-lg text-secondary-fixed hover:underline"
                            href="#"
                        >
                            Lihat SOP Keanggotaan
                            <ArrowRight className="h-[18px] w-[18px]" />
                        </a>
                    </div>
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/5"></div>
                    <div className="absolute right-12 bottom-0 mb-8 h-32 w-32 rounded-full bg-white/5"></div>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg text-center shadow-[0px_2px_4px_rgba(26,54,93,0.05)]">
                    <div className="bg-primary-fixed mb-4 flex h-16 w-16 items-center justify-center rounded-full text-primary">
                        <HelpCircle className="h-10 w-10" />
                    </div>
                    <h4 className="mb-2 font-headline-sm text-primary">
                        Butuh Bantuan?
                    </h4>
                    <p className="mb-4 font-body-sm text-on-surface-variant">
                        Hubungi tim IT jika terjadi kendala pada sinkronisasi
                        data NIM.
                    </p>
                    <button className="hover:bg-primary-fixed w-full rounded-lg border-2 border-primary py-2 font-label-lg text-primary transition-colors">
                        Tiket Support
                    </button>
                </div>
            </div>
        </main>
    );
}
