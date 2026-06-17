import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    X,
    FileText,
    User,
    Calendar,
    Award,
    AlertCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import admin from '@/routes/admin';

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
    pengurus_organisasi?: any;
    pengurusOrganisasi?: any;
    pengguna_petugas?: any;
    penggunaPetugas?: any;
}

interface ProfilOrganisasi {
    id_profil: number;
    id_organisasi: number;
    periode_kepengurusan: string;
    logo_organisasi: string;
    deskripsi_organisasi: string;
    visi_organisasi: string;
    misi_organisasi: string;
    status_aktif: boolean;
}

interface ShowProps {
    submission: Submission;
    activeProfil: ProfilOrganisasi | null;
}

export default function PengajuanProfilShow({
    submission,
    activeProfil,
}: ShowProps) {
    const [processing, setProcessing] = useState(false);

    const pengurus =
        submission.pengurusOrganisasi || submission.pengurus_organisasi;
    const anggota = pengurus?.anggotaOrganisasi || pengurus?.anggota_organisasi;
    const mahasiswa = anggota?.mahasiswa;
    const petugas = submission.penggunaPetugas || submission.pengguna_petugas;

    const staffName = mahasiswa?.nama_lengkap || 'Tidak diketahui';
    const staffNim = mahasiswa?.nim || '-';

    // Derive academic year (angkatan) from NIM
    const getStaffYear = (nim?: string) => {
        if (!nim || nim === '-') {
            return '-';
        }

        const prefix = nim.substring(0, 2);

        return '20' + prefix;
    };
    const staffYear = getStaffYear(mahasiswa?.nim);

    const handleAccept = () => {
        if (
            confirm(
                'Apakah Anda yakin ingin menyetujui pengajuan profil ini? Perubahan akan langsung diterapkan pada profil aktif organisasi.',
            )
        ) {
            setProcessing(true);
            router.post(
                admin.pengajuanProfil.accept(submission.id_pengajuan).url,
                {},
                {
                    onFinish: () => setProcessing(false),
                },
            );
        }
    };

    const handleReject = () => {
        if (confirm('Apakah Anda yakin ingin menolak pengajuan profil ini?')) {
            setProcessing(true);
            router.post(
                admin.pengajuanProfil.reject(submission.id_pengajuan).url,
                {},
                {
                    onFinish: () => setProcessing(false),
                },
            );
        }
    };

    // Checking differences
    const isLogoChanged = activeProfil
        ? activeProfil.logo_organisasi !== submission.logo_organisasi
        : true;
    const isDescChanged = activeProfil
        ? activeProfil.deskripsi_organisasi !== submission.deskripsi_organisasi
        : true;
    const isVisiChanged = activeProfil
        ? activeProfil.visi_organisasi !== submission.visi_organisasi
        : true;
    const isMisiChanged = activeProfil
        ? activeProfil.misi_organisasi !== submission.misi_organisasi
        : true;

    const getStatusText = (status: Submission['status_pengajuan']) => {
        switch (status) {
            case 'Diproses':
                return 'Menunggu Persetujuan';
            case 'Diterima':
                return 'Telah Disetujui';
            case 'Ditolak':
                return 'Telah Ditolak';
            default:
                return status;
        }
    };

    const getStatusBadgeColor = (status: Submission['status_pengajuan']) => {
        switch (status) {
            case 'Diproses':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'Diterima':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Ditolak':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatLogoUrl = (logo: string) => {
        if (!logo) {
            return null;
        }

        return logo.startsWith('http') || logo.startsWith('data:')
            ? logo
            : `/storage/${logo}`;
    };

    return (
        <>
            <Head
                title={`Review Pengajuan - ${submission.organisasi?.nama_organisasi}`}
            />
            <main className="mx-auto w-full max-w-container-max space-y-gutter p-margin-desktop">
                {/* Header Back & Action panel */}
                <div className="flex flex-col gap-unit-md md:flex-row md:items-center md:justify-between">
                    <Link
                        href={admin.pengajuanProfil.index().url}
                        className="decoration-none flex w-fit items-center gap-2 font-label-lg text-on-surface-variant transition-colors hover:text-primary"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Kembali ke Antrean
                    </Link>

                    {submission.status_pengajuan === 'Diproses' && (
                        <div className="flex gap-3">
                            <button
                                onClick={handleReject}
                                disabled={processing}
                                className="flex cursor-pointer items-center gap-2 rounded-lg border border-red-300 bg-white px-5 py-2.5 font-label-lg font-semibold text-red-600 transition-all hover:bg-red-50 disabled:opacity-50"
                            >
                                <X className="h-5 w-5" />
                                Tolak Pengajuan
                            </button>
                            <button
                                onClick={handleAccept}
                                disabled={processing}
                                className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-label-lg font-semibold text-on-primary shadow-md transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
                            >
                                <Check className="h-5 w-5" />
                                Setujui Pengajuan
                            </button>
                        </div>
                    )}
                </div>

                {/* Submitter & Proposal Status Info */}
                <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
                    <div className="col-span-1 rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-sm md:col-span-2">
                        <div className="flex items-start gap-4">
                            <div className="shrink-0 rounded-full bg-primary/10 p-3 text-primary">
                                <Award className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-headline-sm text-headline-sm text-primary">
                                    {submission.organisasi?.nama_organisasi ||
                                        'Organisasi'}
                                </h3>
                                <p className="font-body-md text-on-surface-variant">
                                    Pengajuan perubahan profil organisasi untuk
                                    Periode Kepengurusan{' '}
                                    <span className="font-semibold text-foreground">
                                        {submission.periode_kepengurusan}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Metadata grid */}
                        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-outline-variant/50 pt-6 sm:grid-cols-3">
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-semibold tracking-wider text-on-surface-variant uppercase">
                                    Nama Pengaju (Staff)
                                </span>
                                <span className="flex items-center gap-1.5 font-body-md font-semibold text-foreground">
                                    <User className="h-4 w-4 text-primary" />
                                    {staffName}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-semibold tracking-wider text-on-surface-variant uppercase">
                                    NIM & Angkatan
                                </span>
                                <span className="font-body-md font-medium text-foreground">
                                    {staffNim}{' '}
                                    {staffYear !== '-' &&
                                        `(Angkatan ${staffYear})`}
                                </span>
                            </div>
                            <div className="col-span-2 flex flex-col gap-1 sm:col-span-1">
                                <span className="text-[11px] font-semibold tracking-wider text-on-surface-variant uppercase">
                                    Tanggal Diajukan
                                </span>
                                <span className="flex items-center gap-1.5 font-body-md font-medium text-foreground">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    {new Date(
                                        submission.created_at,
                                    ).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}{' '}
                                    WIB
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 flex flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-sm">
                        <div className="space-y-3">
                            <span className="block text-[11px] font-semibold tracking-wider text-on-surface-variant uppercase">
                                Status Pengajuan
                            </span>
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-label-lg font-bold ${getStatusBadgeColor(submission.status_pengajuan)}`}
                            >
                                <span className="h-2 w-2 rounded-full bg-current" />
                                {getStatusText(submission.status_pengajuan)}
                            </span>
                        </div>

                        {submission.status_pengajuan !== 'Diproses' && (
                            <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-outline-variant/60 bg-surface-container-low p-3.5 text-on-surface-variant">
                                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                <div className="text-[12px] leading-relaxed">
                                    <p className="font-semibold text-foreground">
                                        Diproses Oleh Petugas
                                    </p>
                                    <p className="mt-0.5">
                                        Email: {petugas?.email || '-'}
                                    </p>
                                    <p>
                                        Username:{' '}
                                        {submission.username_petugas || '-'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Side-by-side comparison */}
                <div className="grid grid-cols-1 gap-gutter lg:grid-cols-2">
                    {/* Active Profile */}
                    <div className="rounded-xl border border-outline-variant bg-surface shadow-sm">
                        <div className="border-b border-outline-variant bg-surface-container-low px-unit-lg py-4">
                            <h4 className="font-headline-sm text-headline-sm text-on-surface">
                                Profil Aktif Saat Ini
                            </h4>
                        </div>

                        {!activeProfil ? (
                            <div className="p-8 text-center font-body-md text-on-surface-variant">
                                Belum memiliki profil aktif untuk periode
                                kepengurusan ini.
                            </div>
                        ) : (
                            <div className="space-y-6 p-unit-lg">
                                {/* Logo */}
                                <div className="space-y-2">
                                    <h5 className="font-label-lg text-label-lg tracking-wide text-on-surface-variant uppercase">
                                        Logo Organisasi
                                    </h5>
                                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-surface">
                                        <img
                                            src={
                                                formatLogoUrl(
                                                    activeProfil.logo_organisasi,
                                                ) || ''
                                            }
                                            alt="Current Logo"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Deskripsi */}
                                <div className="space-y-2 border-t border-outline-variant/30 pt-4">
                                    <h5 className="font-label-lg text-label-lg tracking-wide text-on-surface-variant uppercase">
                                        Deskripsi Organisasi
                                    </h5>
                                    <p className="font-body-md leading-relaxed whitespace-pre-line text-on-surface">
                                        {activeProfil.deskripsi_organisasi}
                                    </p>
                                </div>

                                {/* Visi */}
                                <div className="space-y-2 border-t border-outline-variant/30 pt-4">
                                    <h5 className="font-label-lg text-label-lg tracking-wide text-on-surface-variant uppercase">
                                        Visi Organisasi
                                    </h5>
                                    <p className="font-body-md leading-relaxed whitespace-pre-line text-on-surface">
                                        {activeProfil.visi_organisasi}
                                    </p>
                                </div>

                                {/* Misi */}
                                <div className="space-y-2 border-t border-outline-variant/30 pt-4">
                                    <h5 className="font-label-lg text-label-lg tracking-wide text-on-surface-variant uppercase">
                                        Misi Organisasi
                                    </h5>
                                    <p className="font-body-md leading-relaxed whitespace-pre-line text-on-surface">
                                        {activeProfil.misi_organisasi}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Proposed changes */}
                    <div className="rounded-xl border border-outline-variant bg-surface shadow-sm">
                        <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low px-unit-lg py-4">
                            <h4 className="font-headline-sm text-headline-sm text-on-surface">
                                Usulan Perubahan Profil
                            </h4>
                            <span className="rounded-full bg-primary-container px-3 py-1 font-label-md text-label-md font-semibold text-on-primary-container">
                                Proposal Baru
                            </span>
                        </div>

                        <div className="space-y-6 p-unit-lg">
                            {/* Logo */}
                            <div
                                className={`-m-3 space-y-2 rounded-lg p-3 transition-colors ${isLogoChanged ? 'border border-dashed border-green-200 bg-green-50/70 dark:bg-green-950/20' : ''}`}
                            >
                                <div className="flex items-center justify-between">
                                    <h5 className="font-label-lg text-label-lg tracking-wide text-on-surface-variant uppercase">
                                        Logo Organisasi
                                    </h5>
                                    {isLogoChanged && (
                                        <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                                            Diubah
                                        </span>
                                    )}
                                </div>
                                <div
                                    className={`flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border bg-surface ${isLogoChanged ? 'border-green-500 ring-2 ring-green-500/20' : 'border-outline-variant'}`}
                                >
                                    <img
                                        src={
                                            formatLogoUrl(
                                                submission.logo_organisasi,
                                            ) || ''
                                        }
                                        alt="Proposed Logo"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div
                                className={`-m-3 space-y-2 rounded-lg border-t border-outline-variant/30 p-3 pt-4 transition-colors ${isDescChanged ? 'border border-dashed border-green-200 bg-green-50/70 dark:bg-green-950/20' : ''}`}
                            >
                                <div className="flex items-center justify-between">
                                    <h5 className="font-label-lg text-label-lg tracking-wide text-on-surface-variant uppercase">
                                        Deskripsi Organisasi
                                    </h5>
                                    {isDescChanged && (
                                        <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                                            Diubah
                                        </span>
                                    )}
                                </div>
                                <p className="font-body-md leading-relaxed whitespace-pre-line text-on-surface">
                                    {submission.deskripsi_organisasi}
                                </p>
                            </div>

                            {/* Visi */}
                            <div
                                className={`-m-3 space-y-2 rounded-lg border-t border-outline-variant/30 p-3 pt-4 transition-colors ${isVisiChanged ? 'border border-dashed border-green-200 bg-green-50/70 dark:bg-green-950/20' : ''}`}
                            >
                                <div className="flex items-center justify-between">
                                    <h5 className="font-label-lg text-label-lg tracking-wide text-on-surface-variant uppercase">
                                        Visi Organisasi
                                    </h5>
                                    {isVisiChanged && (
                                        <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                                            Diubah
                                        </span>
                                    )}
                                </div>
                                <p className="font-body-md leading-relaxed whitespace-pre-line text-on-surface">
                                    {submission.visi_organisasi}
                                </p>
                            </div>

                            {/* Misi */}
                            <div
                                className={`-m-3 space-y-2 rounded-lg border-t border-outline-variant/30 p-3 pt-4 transition-colors ${isMisiChanged ? 'border border-dashed border-green-200 bg-green-50/70 dark:bg-green-950/20' : ''}`}
                            >
                                <div className="flex items-center justify-between">
                                    <h5 className="font-label-lg text-label-lg tracking-wide text-on-surface-variant uppercase">
                                        Misi Organisasi
                                    </h5>
                                    {isMisiChanged && (
                                        <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                                            Diubah
                                        </span>
                                    )}
                                </div>
                                <p className="font-body-md leading-relaxed whitespace-pre-line text-on-surface">
                                    {submission.misi_organisasi}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
