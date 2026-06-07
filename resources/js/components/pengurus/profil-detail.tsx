import { Link, router, usePage } from '@inertiajs/react';
import {
    Building2,
    FileEdit,
    Award,
    Eye,
    Target,
    AlertCircle,
    Clock,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Profil {
    id_profil: number;
    id_organisasi: number;
    periode_kepengurusan: string;
    logo_organisasi: string;
    deskripsi_organisasi: string;
    visi_organisasi: string;
    misi_organisasi: string;
    status_aktif: boolean;
}

interface Organisasi {
    id_organisasi: number;
    nama_organisasi: string;
}

interface LatestProposal {
    id_pengajuan: number;
    periode_kepengurusan: string;
    status_pengajuan: 'Diproses' | 'Diterima' | 'Ditolak';
    created_at: string;
}

interface ProfilDetailProps {
    profil: Profil;
    organisasi: Organisasi;
    latestProposal?: LatestProposal | null;
    isReadOnly?: boolean;
    statusKeanggotaan?: 'Diproses' | 'Ditolak' | 'Aktif' | 'Tidak Aktif' | null;
}

export default function ProfilDetail({
    profil,
    organisasi,
    latestProposal = null,
    isReadOnly = false,
    statusKeanggotaan = null,
}: ProfilDetailProps) {
    const { auth } = usePage<any>().props;
    const nim = auth?.user?.profilPengguna?.nim;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleJoin = () => {
        if (!nim) return;
        setIsSubmitting(true);
        router.post(
            '/organisasi/daftar',
            {
                id_organisasi: organisasi.id_organisasi,
                nim: nim,
            },
            {
                onFinish: () => setIsSubmitting(false),
            },
        );
    };
    return (
        <main className="animate-fade-in mx-auto w-full max-w-container-max space-y-gutter p-margin-desktop">
            {/* Header */}
            <header className="mb-unit-xl flex flex-col justify-between gap-unit-md sm:flex-row sm:items-end">
                <div>
                    <h2 className="font-headline-lg text-headline-lg font-bold text-primary">
                        Profil Organisasi
                    </h2>
                    <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
                        {isReadOnly
                            ? `Profil publik, visi, dan misi dari ${organisasi.nama_organisasi}.`
                            : `Kelola data profil, logo, visi, dan misi ${organisasi.nama_organisasi}.`}
                    </p>
                </div>
                <div>
                    {!isReadOnly ? (
                        <Link href="/pengurus/profil/edit">
                            <Button className="flex h-auto cursor-pointer items-center gap-2 rounded-lg border-none bg-primary px-6 py-3 font-label-lg text-on-primary shadow-md transition-all hover:opacity-90 active:scale-95">
                                <FileEdit className="h-[18px] w-[18px]" />
                                Ajukan Perubahan Profil
                            </Button>
                        </Link>
                    ) : statusKeanggotaan === 'Aktif' ? (
                        <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-6 py-3 font-label-lg text-green-700 dark:text-green-400">
                            <CheckCircle className="h-[18px] w-[18px] text-green-500" />
                            Anggota Aktif
                        </div>
                    ) : statusKeanggotaan === 'Diproses' ? (
                        <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-6 py-3 font-label-lg text-amber-700 dark:text-amber-400">
                            <Clock className="h-[18px] w-[18px] animate-pulse text-amber-500" />
                            Menunggu Persetujuan
                        </div>
                    ) : (
                        <Button
                            onClick={handleJoin}
                            disabled={isSubmitting}
                            className="flex h-auto cursor-pointer items-center gap-2 rounded-lg border-none bg-primary px-6 py-3 font-label-lg text-on-primary shadow-md transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
                        >
                            <CheckCircle className="h-[18px] w-[18px]" />
                            {statusKeanggotaan === 'Ditolak'
                                ? 'Daftar Kembali'
                                : 'Daftar Organisasi'}
                        </Button>
                    )}
                </div>
            </header>

            {/* Proposal Status Banner */}
            {!isReadOnly && latestProposal && (
                <div className="mb-unit-lg">
                    {latestProposal.status_pengajuan === 'Diproses' && (
                        <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-amber-800 dark:text-amber-300">
                            <Clock className="h-5 w-5 shrink-0 text-amber-500" />
                            <div className="text-sm">
                                <span className="font-bold">
                                    Pengajuan Perubahan Sedang Diproses:
                                </span>{' '}
                                Anda telah mengajukan perubahan profil untuk
                                periode {latestProposal.periode_kepengurusan}{' '}
                                pada{' '}
                                {new Date(
                                    latestProposal.created_at,
                                ).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                                . Menunggu persetujuan petugas.
                            </div>
                        </div>
                    )}
                    {latestProposal.status_pengajuan === 'Ditolak' && (
                        <div className="flex items-center gap-3 rounded-xl border border-error/20 bg-error/10 p-4 text-error">
                            <XCircle className="h-5 w-5 shrink-0" />
                            <div className="text-sm">
                                <span className="font-bold">
                                    Pengajuan Perubahan Ditolak:
                                </span>{' '}
                                Pengajuan perubahan profil Anda sebelumnya
                                ditolak oleh petugas. Anda dapat mengajukan
                                usulan baru dengan menekan tombol "Ajukan
                                Perubahan Profil".
                            </div>
                        </div>
                    )}
                    {latestProposal.status_pengajuan === 'Diterima' && (
                        <div className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-green-800 dark:text-green-300">
                            <CheckCircle className="h-5 w-5 shrink-0 text-green-500" />
                            <div className="text-sm">
                                <span className="font-bold">
                                    Pengajuan Perubahan Disetujui:
                                </span>{' '}
                                Pengajuan perubahan profil Anda telah disetujui
                                dan saat ini aktif.
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Profile Detail Card */}
            <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-[0px_4px_20px_rgba(26,54,93,0.05)]">
                {/* Banner Gradient */}
                <div className="relative h-40 bg-gradient-to-r from-primary/80 to-primary dark:from-primary-container dark:to-primary-container/80" />

                {/* Profile Header Overlay */}
                <div className="relative px-unit-xl pb-unit-xl">
                    <div className="-mt-12 mb-6 flex flex-col gap-unit-lg sm:flex-row sm:items-end">
                        {/* Logo Container */}
                        <div className="z-10 flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-surface bg-background p-2 shadow-lg">
                            {profil.logo_organisasi ? (
                                <img
                                    src={`/storage/${profil.logo_organisasi}`}
                                    alt={`${organisasi.nama_organisasi} Logo`}
                                    className="h-full w-full object-contain"
                                />
                            ) : (
                                <Building2 className="h-16 w-16 text-primary/40" />
                            )}
                        </div>

                        {/* Organization Titles */}
                        <div className="flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="font-headline-lg text-headline-lg font-bold text-foreground">
                                    {organisasi.nama_organisasi}
                                </h1>
                                <span className="rounded-full bg-secondary-container px-3 py-0.5 text-xs font-semibold text-on-secondary-container">
                                    Periode {profil.periode_kepengurusan}
                                </span>
                            </div>
                            <p className="flex items-center gap-1.5 font-body-md text-on-surface-variant">
                                <Award className="h-4 w-4 text-secondary" />{' '}
                                {isReadOnly
                                    ? 'Halaman Informasi Publik'
                                    : 'Staff Panel / Management'}
                            </p>
                        </div>
                    </div>

                    <hr className="my-6 border-outline-variant/50" />

                    {/* Content Columns */}
                    <div className="grid grid-cols-1 gap-gutter lg:grid-cols-3">
                        {/* Main Info Column */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Deskripsi */}
                            <div className="space-y-2">
                                <h3 className="font-headline-sm text-headline-sm font-bold text-foreground">
                                    Deskripsi Organisasi
                                </h3>
                                <p className="text-justify font-body-md leading-relaxed whitespace-pre-line text-foreground/90 dark:text-on-surface/90">
                                    {profil.deskripsi_organisasi ||
                                        'Tidak ada deskripsi organisasi.'}
                                </p>
                            </div>
                        </div>

                        {/* Vision and Mission Cards */}
                        <div className="space-y-6 lg:col-span-1">
                            {/* Visi */}
                            <div className="rounded-xl border border-outline-variant bg-surface-container-low p-5 shadow-none">
                                <div className="mb-3 flex items-center gap-3">
                                    <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                                        <Eye className="h-5 w-5" />
                                    </div>
                                    <h4 className="font-headline-sm text-headline-sm font-bold text-foreground">
                                        Visi
                                    </h4>
                                </div>
                                <p className="text-justify font-body-md leading-relaxed whitespace-pre-line text-foreground/90 dark:text-on-surface/90">
                                    {profil.visi_organisasi ||
                                        'Tidak ada visi.'}
                                </p>
                            </div>

                            {/* Misi */}
                            <div className="rounded-xl border border-outline-variant bg-surface-container-low p-5 shadow-none">
                                <div className="mb-3 flex items-center gap-3">
                                    <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                                        <Target className="h-5 w-5" />
                                    </div>
                                    <h4 className="font-headline-sm text-headline-sm font-bold text-foreground">
                                        Misi
                                    </h4>
                                </div>
                                <div className="text-justify font-body-md leading-relaxed whitespace-pre-line text-foreground/90 dark:text-on-surface/90">
                                    {profil.misi_organisasi ||
                                        'Tidak ada misi.'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Informational Panel */}
            {!isReadOnly && (
                <div className="flex gap-3 rounded-xl border border-secondary/20 bg-secondary-container/20 p-4">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                    <div className="text-sm">
                        <span className="font-semibold text-on-secondary-container">
                            Note:
                        </span>{' '}
                        <span className="text-on-surface-variant">
                            Informasi profil di atas adalah data publik yang
                            saat ini aktif. Semua perubahan yang Anda ajukan
                            harus disetujui terlebih dahulu oleh Petugas
                            Kemahasiswaan sebelum diterapkan secara publik.
                        </span>
                    </div>
                </div>
            )}
        </main>
    );
}
