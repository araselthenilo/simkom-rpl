import { Head, Link, usePage } from '@inertiajs/react';
import {
    Clock,
    FileText,
    ChevronLeft,
    ChevronRight,
    Inbox,
} from 'lucide-react';
import React, { useState } from 'react';
import pembina from '@/routes/pembina';

interface Submission {
    id_pengajuan: number;
    id_pengurus: number;
    username_petugas: string | null;
    periode_kepengurusan: string;
    logo_organisasi: string;
    deskripsi_organisasi: string;
    visi_organisasi: string;
    misi_organisasi: string;
    status_pengajuan: 'Diproses' | 'Diterima' | 'Ditolak';
    created_at: string;
    updated_at: string;
    organisasi?: {
        id_organisasi: number;
        nama_organisasi: string;
    };
}

interface PageProps {
    submissions: Submission[];
    [key: string]: any;
}

export default function PengajuanProfilIndex() {
    const { submissions = [] } = usePage<PageProps>().props;
    const [activeTab, setActiveTab] = useState<
        'Diproses' | 'Diterima' | 'Ditolak' | 'Semua'
    >('Diproses');

    const getRelativeTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) {
            return 'Baru saja';
        }

        if (diffMins < 60) {
            return `${diffMins} menit yang lalu`;
        }

        if (diffHours < 24) {
            return `${diffHours} jam yang lalu`;
        }

        if (diffDays === 1) {
            return 'Kemarin';
        }

        return `${diffDays} hari yang lalu`;
    };

    // Filter submissions
    const filteredSubmissions = submissions.filter((item) => {
        if (activeTab === 'Semua') {
            return true;
        }

        return item.status_pengajuan === activeTab;
    });

    const getStatusBadgeClass = (status: Submission['status_pengajuan']) => {
        switch (status) {
            case 'Diproses':
                return 'bg-amber-100 text-amber-700';
            case 'Diterima':
                return 'bg-green-100 text-green-700';
            case 'Ditolak':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <>
            <Head title="Antrean Pengajuan Profil" />
            <main className="mx-auto w-full max-w-container-max space-y-gutter p-margin-desktop">
                {/* Header */}
                <header className="mb-unit-xl">
                    <h2 className="font-headline-lg text-headline-lg text-primary">
                        Antrean Pengajuan Profil
                    </h2>
                    <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
                        Tinjau dan proses pengajuan perubahan profil organisasi
                        dari pengurus UKM.
                    </p>
                </header>

                {/* Filter and Tab Options */}
                <div className="flex flex-col items-center justify-between gap-unit-md rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-md shadow-[0px_2px_4px_rgba(26,54,93,0.05)] sm:flex-row">
                    <div className="flex w-full overflow-x-auto rounded-lg bg-surface-container-low p-1 sm:w-auto">
                        {(
                            [
                                'Diproses',
                                'Diterima',
                                'Ditolak',
                                'Semua',
                            ] as const
                        ).map((tab) => {
                            const count =
                                tab === 'Semua'
                                    ? submissions.length
                                    : submissions.filter(
                                          (s) => s.status_pengajuan === tab,
                                      ).length;

                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex cursor-pointer items-center gap-2 rounded-md px-6 py-2 font-label-lg text-nowrap transition-all ${
                                        activeTab === tab
                                            ? 'bg-white font-semibold text-primary shadow-sm'
                                            : 'text-on-surface-variant hover:text-primary'
                                    }`}
                                >
                                    <span>{tab}</span>
                                    <span
                                        className={`rounded-full px-1.5 py-0.5 text-[11px] ${
                                            activeTab === tab
                                                ? 'bg-primary/10 text-primary'
                                                : 'bg-on-surface-variant/10 text-on-surface-variant'
                                        }`}
                                    >
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Compact List container, matching dashboard style */}
                <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-[0px_2px_4px_rgba(26,54,93,0.05)]">
                    <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-unit-lg py-4">
                        <h4 className="flex items-center gap-2 font-headline-sm text-headline-sm text-primary">
                            <Clock className="h-5 w-5" />
                            Antrean Persetujuan - {activeTab}
                        </h4>
                        <span className="rounded-full bg-surface-container px-3 py-1 font-label-lg text-label-lg text-on-surface-variant">
                            {filteredSubmissions.length} Item
                        </span>
                    </div>
                    <div className="divide-y divide-outline-variant">
                        {filteredSubmissions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center text-on-surface-variant">
                                <Inbox className="mb-3 h-12 w-12 text-on-surface-variant/30" />
                                <p className="font-body-md text-[14px]">
                                    Tidak ada pengajuan profil dengan status "
                                    {activeTab}".
                                </p>
                            </div>
                        ) : (
                            filteredSubmissions.map((item) => (
                                <div
                                    key={item.id_pengajuan}
                                    className="group flex items-start gap-4 p-unit-lg transition-colors hover:bg-surface-container-low"
                                >
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-high">
                                        <FileText className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h5 className="flex items-center gap-2 font-label-lg text-label-lg font-semibold text-on-surface">
                                                    Pengajuan Profil Periode{' '}
                                                    {item.periode_kepengurusan}
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getStatusBadgeClass(item.status_pengajuan)}`}
                                                    >
                                                        {item.status_pengajuan}
                                                    </span>
                                                </h5>
                                                <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                                                    Diajukan oleh:{' '}
                                                    <span className="font-medium text-foreground">
                                                        {item.organisasi
                                                            ?.nama_organisasi ||
                                                            'Organisasi'}
                                                    </span>
                                                </p>
                                            </div>
                                            <span className="font-label-md text-label-md font-medium text-on-surface-variant">
                                                {getRelativeTime(
                                                    item.created_at,
                                                )}
                                            </span>
                                        </div>

                                        <div className="mt-3 flex gap-2">
                                            <Link
                                                href={
                                                    pembina.pengajuanProfil.show(
                                                        item.id_pengajuan,
                                                    ).url
                                                }
                                                className={`decoration-none cursor-pointer rounded-lg px-4 py-2 text-center font-label-md text-label-md transition-all duration-100 active:scale-95 ${
                                                    item.status_pengajuan ===
                                                    'Diproses'
                                                        ? 'bg-primary text-on-primary hover:bg-primary-container'
                                                        : 'hover:bg-surface-variant border border-outline text-on-surface-variant'
                                                }`}
                                            >
                                                {item.status_pengajuan ===
                                                'Diproses'
                                                    ? 'Review Sekarang'
                                                    : 'Lihat Detail'}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {/* Pagination Placeholder matching other admin pages */}
                    {filteredSubmissions.length > 0 && (
                        <div className="flex flex-col items-center justify-between gap-unit-md border-t border-outline-variant bg-surface-container-low px-unit-lg py-4 md:flex-row">
                            <span className="font-body-sm text-on-surface-variant">
                                Menampilkan 1-{filteredSubmissions.length} dari{' '}
                                {filteredSubmissions.length} data
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    className="cursor-pointer rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-highest disabled:opacity-30"
                                    disabled
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button className="h-8 w-8 cursor-pointer rounded-lg bg-primary font-label-md text-on-primary">
                                    1
                                </button>
                                <button
                                    className="cursor-pointer rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-highest disabled:opacity-30"
                                    disabled
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
