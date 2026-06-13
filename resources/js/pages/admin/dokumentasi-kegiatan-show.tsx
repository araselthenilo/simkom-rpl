import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    X,
    FileText,
    Calendar,
    AlertCircle,
    FileImage,
    Download,
    ChevronLeft,
    ChevronRight,
    MessageSquare,
    Info,
    MapPin,
    Building2,
    Clock,
    FileUp,
    Eye,
    Image,
} from 'lucide-react';
import React, { useState } from 'react';
import admin from '@/routes/admin';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Activity {
    id_kegiatan: number;
    nama_kegiatan: string;
    jenis_kegiatan: string;
    tanggal_pelaksanaan: string;
    lokasi_kegiatan: string;
    profil_organisasi?: {
        organisasi?: {
            nama_organisasi: string;
        };
    };
    profilOrganisasi?: {
        organisasi?: {
            nama_organisasi: string;
        };
    };
}

interface FotoKegiatan {
    id_foto: number;
    url: string;
}

interface CatatanRevisi {
    id_catatan: number;
    isi_catatan: string;
    username_petugas: string;
    nama_petugas: string;
    status_tindaklanjut: boolean;
    waktu_ditindaklanjuti: string | null;
    created_at: string;
}

interface Dokumentasi {
    id_dokumentasi: number;
    id_kegiatan: number;
    dokumen_proposal: string | null;
    dokumen_lpj: string | null;
    hasil_evaluasi: string | null;
    status_dokumentasi: 'Diproses' | 'Butuh Revisi' | 'Diterima';
    created_at: string;
    updated_at: string;
    kegiatan: Activity;
    foto_kegiatan: FotoKegiatan[];
    catatan_revisi: CatatanRevisi[];
}

interface Props {
    dokumentasi: Dokumentasi;
}

export default function DokumentasiKegiatanShow({ dokumentasi }: Props) {
    const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
    const [actionType, setActionType] = useState<'approve' | 'revisi' | null>(
        null,
    );

    // Form helper using Inertia useForm
    const { data, setData, post, processing, errors, reset } = useForm({
        status_dokumentasi: '' as 'Diproses' | 'Butuh Revisi' | 'Diterima' | '',
        hasil_evaluasi: null as File | null,
        isi_catatan: '',
    });

    const orgName =
        dokumentasi.kegiatan?.profil_organisasi?.organisasi?.nama_organisasi ||
        dokumentasi.kegiatan?.profilOrganisasi?.organisasi?.nama_organisasi ||
        'Organisasi';

    const getFileName = (urlPath: string | null) => {
        if (!urlPath) return '';
        const cleanPath = urlPath.split('?')[0];
        const parts = cleanPath.split('/');
        return parts[parts.length - 1];
    };

    const isPdf = (urlPath: string | null) => {
        if (!urlPath) return false;
        const cleanPath = urlPath.split('?')[0];
        return cleanPath.toLowerCase().endsWith('.pdf');
    };

    const handleOpenAction = (type: 'approve' | 'revisi') => {
        setActionType(type);
        reset();
        setData((prev) => ({
            ...prev,
            status_dokumentasi:
                type === 'approve' ? 'Diterima' : 'Butuh Revisi',
        }));
    };

    const handleCancelAction = () => {
        setActionType(null);
        reset();
    };

    const handleSubmitAction = (e: React.FormEvent) => {
        e.preventDefault();

        post(
            `/admin/dokumentasi-kegiatan/${dokumentasi.id_dokumentasi}/update-status`,
            {
                forceFormData: true,
                onSuccess: () => {
                    setActionType(null);
                    reset();
                },
                onError: (err) => {
                    const message = Object.values(err).join('\n');
                    alert(
                        message || 'Terjadi kesalahan saat memperbarui status.',
                    );
                },
            },
        );
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '-';
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

    const getStatusText = (status: Dokumentasi['status_dokumentasi']) => {
        switch (status) {
            case 'Diproses':
                return 'Menunggu Verifikasi';
            case 'Diterima':
                return 'Telah Disetujui';
            case 'Butuh Revisi':
                return 'Butuh Revisi';
            default:
                return status;
        }
    };

    const getStatusBadgeColor = (status: Dokumentasi['status_dokumentasi']) => {
        switch (status) {
            case 'Diproses':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'Diterima':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Butuh Revisi':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <>
            <Head
                title={`Review Dokumentasi - ${dokumentasi.kegiatan?.nama_kegiatan}`}
            />
            <main className="mx-auto w-full max-w-container-max space-y-gutter p-margin-desktop">
                {/* Header & Back Button */}
                <div className="flex flex-col gap-unit-md md:flex-row md:items-center md:justify-between">
                    <Link
                        href={admin.dokumentasiKegiatan.index().url}
                        className="decoration-none flex w-fit items-center gap-2 font-label-lg text-on-surface-variant transition-colors hover:text-primary"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Kembali ke Antrean
                    </Link>

                    {dokumentasi.status_dokumentasi === 'Diproses' &&
                        !actionType && (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleOpenAction('revisi')}
                                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-red-300 bg-white px-5 py-2.5 font-label-lg font-semibold text-red-600 transition-all hover:bg-red-50"
                                >
                                    <X className="h-5 w-5" />
                                    Minta Revisi
                                </button>
                                <button
                                    onClick={() => handleOpenAction('approve')}
                                    className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-label-lg font-semibold text-on-primary shadow-md transition-all hover:opacity-90 active:scale-95"
                                >
                                    <Check className="h-5 w-5" />
                                    Setujui Dokumentasi
                                </button>
                            </div>
                        )}
                </div>

                {/* Submitter & Activity General Info */}
                <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
                    <div className="col-span-1 rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-sm md:col-span-2">
                        <div className="flex items-start gap-4">
                            <div className="shrink-0 rounded-full bg-primary/10 p-3 text-primary">
                                <FileImage className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-headline-sm text-headline-sm text-primary">
                                    Dokumentasi:{' '}
                                    {dokumentasi.kegiatan?.nama_kegiatan}
                                </h3>
                                <p className="flex items-center gap-1.5 font-body-md text-on-surface-variant">
                                    <Building2 className="h-4 w-4 text-primary" />
                                    UKM:{' '}
                                    <span className="font-semibold text-foreground">
                                        {orgName}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Metadata grid */}
                        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-outline-variant/50 pt-6 sm:grid-cols-3">
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-semibold tracking-wider text-on-surface-variant uppercase">
                                    Jenis Kegiatan
                                </span>
                                <span className="font-body-md font-semibold text-foreground">
                                    {dokumentasi.kegiatan?.jenis_kegiatan}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-semibold tracking-wider text-on-surface-variant uppercase">
                                    Lokasi Pelaksanaan
                                </span>
                                <span className="flex items-center gap-1.5 font-body-md font-medium text-foreground">
                                    <MapPin className="h-4 w-4 text-error" />
                                    {dokumentasi.kegiatan?.lokasi_kegiatan}
                                </span>
                            </div>
                            <div className="col-span-2 flex flex-col gap-1 sm:col-span-1">
                                <span className="text-[11px] font-semibold tracking-wider text-on-surface-variant uppercase">
                                    Tanggal Pelaksanaan
                                </span>
                                <span className="flex items-center gap-1.5 font-body-md font-medium text-foreground">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    {formatDate(
                                        dokumentasi.kegiatan
                                            ?.tanggal_pelaksanaan,
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 flex flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-sm">
                        <div className="space-y-3">
                            <span className="block text-[11px] font-semibold tracking-wider text-on-surface-variant uppercase">
                                Status Dokumentasi
                            </span>
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-label-lg font-bold ${getStatusBadgeColor(dokumentasi.status_dokumentasi)}`}
                            >
                                <span className="h-2 w-2 rounded-full bg-current" />
                                {getStatusText(dokumentasi.status_dokumentasi)}
                            </span>
                            {dokumentasi.status_dokumentasi ===
                                'Butuh Revisi' &&
                                !actionType && (
                                    <button
                                        onClick={() =>
                                            handleOpenAction('approve')
                                        }
                                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-label-lg font-semibold text-on-primary shadow-sm transition-all hover:opacity-90 active:scale-95"
                                    >
                                        <Check className="h-4 w-4" />
                                        Setujui Dokumentasi
                                    </button>
                                )}
                        </div>

                        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-outline-variant/60 bg-surface-container-low p-3.5 text-on-surface-variant">
                            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                            <div className="text-[12px] leading-relaxed">
                                <p className="font-semibold text-foreground">
                                    Informasi Verifikasi
                                </p>
                                <p className="mt-0.5">
                                    Diterima oleh sistem:{' '}
                                    {formatDate(dokumentasi.created_at)}
                                </p>
                                <p>
                                    Terakhir diperbarui:{' '}
                                    {formatDate(dokumentasi.updated_at)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inline Action Forms */}
                {actionType && (
                    <Card className="animate-in rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-md duration-300 slide-in-from-top">
                        <h4 className="mb-4 flex items-center gap-2 font-headline-sm text-headline-sm text-primary">
                            {actionType === 'approve' ? (
                                <>
                                    <Check className="h-5 w-5 text-green-700" />
                                    Setujui Dokumentasi Kegiatan
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                    Minta Revisi Dokumentasi
                                </>
                            )}
                        </h4>

                        <form
                            onSubmit={handleSubmitAction}
                            className="space-y-4"
                        >
                            {actionType === 'approve' ? (
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-primary">
                                        Hasil Evaluasi Kegiatan (Opsional -
                                        PDF/DOC/DOCX)
                                    </label>
                                    <div className="relative flex items-center justify-center rounded-lg border-2 border-dashed border-outline-variant bg-background/50 p-4 transition-all hover:border-primary">
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) =>
                                                setData(
                                                    'hasil_evaluasi',
                                                    e.target.files?.[0] || null,
                                                )
                                            }
                                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                        />
                                        <div className="space-y-1 text-center">
                                            <FileUp className="mx-auto h-8 w-8 text-on-surface-variant/40" />
                                            <div className="text-xs text-on-surface-variant">
                                                <span className="font-semibold text-primary">
                                                    Pilih berkas evaluasi
                                                </span>{' '}
                                                atau seret kemari
                                            </div>
                                            <p className="text-[10px] text-on-surface-variant/60">
                                                PDF, DOC, DOCX (Maks. 10 MB)
                                            </p>
                                        </div>
                                    </div>
                                    {data.hasil_evaluasi && (
                                        <p className="text-xs font-medium text-primary">
                                            Berkas terpilih:{' '}
                                            {data.hasil_evaluasi.name}
                                        </p>
                                    )}
                                    {errors.hasil_evaluasi && (
                                        <p className="text-xs text-error">
                                            {errors.hasil_evaluasi}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-primary">
                                        Catatan Masukan / Detail Bagian yang
                                        Harus Direvisi *
                                    </label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={data.isi_catatan}
                                        onChange={(e) =>
                                            setData(
                                                'isi_catatan',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Tulis instruksi revisi secara spesifik (misal: 'Foto kegiatan kurang jelas, LPJ belum ada tanda tangan pembina, dll.')"
                                        className="w-full rounded-lg border border-outline-variant bg-surface p-3 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                                    />
                                    {errors.isi_catatan && (
                                        <p className="text-xs text-error">
                                            {errors.isi_catatan}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-end gap-3 border-t border-outline-variant/30 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancelAction}
                                    disabled={processing}
                                    className="cursor-pointer"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className={`cursor-pointer ${actionType === 'approve' ? 'bg-primary text-on-primary' : 'bg-red-600 text-white hover:bg-red-700'}`}
                                >
                                    {processing
                                        ? 'Memproses...'
                                        : actionType === 'approve'
                                          ? 'Konfirmasi Setuju'
                                          : 'Kirim Catatan Revisi'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}

                {/* Documentation Files Render/Previews & Photo Gallery */}
                <div className="grid grid-cols-1 gap-gutter lg:grid-cols-3">
                    {/* Left side (Span 2) - Document Previews */}
                    <div className="space-y-gutter lg:col-span-2">
                        {/* Proposal Document Preview */}
                        <Card className="rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-sm">
                            <h4 className="mb-4 flex items-center justify-between font-headline-sm font-bold text-primary">
                                <span className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Preview Dokumen Proposal
                                </span>
                                {dokumentasi.dokumen_proposal && (
                                    <a
                                        href={dokumentasi.dokumen_proposal}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="decoration-none flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        Unduh
                                    </a>
                                )}
                            </h4>

                            {dokumentasi.dokumen_proposal ? (
                                isPdf(dokumentasi.dokumen_proposal) ? (
                                    <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low shadow-inner">
                                        <iframe
                                            src={`${dokumentasi.dokumen_proposal}#toolbar=0&navpanes=0`}
                                            className="h-[1000px] w-full border-none"
                                            title="Proposal PDF Preview"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between rounded-lg border border-outline-variant bg-surface-container-low px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-8 w-8 shrink-0 text-primary" />
                                            <div>
                                                <p className="max-w-xs truncate text-sm font-semibold text-foreground sm:max-w-md">
                                                    {getFileName(
                                                        dokumentasi.dokumen_proposal,
                                                    )}
                                                </p>
                                                <p className="text-xs text-on-surface-variant">
                                                    Dokumen Word (Gunakan tombol
                                                    unduh untuk melihat)
                                                </p>
                                            </div>
                                        </div>
                                        <a
                                            href={dokumentasi.dokumen_proposal}
                                            download
                                            className="decoration-none flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-on-primary hover:bg-primary-container"
                                        >
                                            <Download className="h-4 w-4" />
                                            Unduh
                                        </a>
                                    </div>
                                )
                            ) : (
                                <div className="rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-low p-8 text-center text-on-surface-variant">
                                    <AlertCircle className="mx-auto mb-2 h-10 w-10 text-on-surface-variant/30" />
                                    <p className="text-sm font-semibold">
                                        Proposal tidak ditemukan
                                    </p>
                                    <p className="mt-1 text-xs text-on-surface-variant/80">
                                        Pengurus UKM belum mengunggah dokumen
                                        proposal untuk kegiatan ini.
                                    </p>
                                </div>
                            )}
                        </Card>

                        {/* LPJ Document Preview */}
                        <Card className="rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-sm">
                            <h4 className="mb-4 flex items-center justify-between font-headline-sm font-bold text-primary">
                                <span className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Preview Laporan Pertanggungjawaban (LPJ)
                                </span>
                                {dokumentasi.dokumen_lpj && (
                                    <a
                                        href={dokumentasi.dokumen_lpj}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="decoration-none flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        Unduh
                                    </a>
                                )}
                            </h4>

                            {dokumentasi.dokumen_lpj ? (
                                isPdf(dokumentasi.dokumen_lpj) ? (
                                    <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low shadow-inner">
                                        <iframe
                                            src={`${dokumentasi.dokumen_lpj}#toolbar=0&navpanes=0`}
                                            className="h-[1000px] w-full border-none"
                                            title="LPJ PDF Preview"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between rounded-lg border border-outline-variant bg-surface-container-low px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-8 w-8 shrink-0 text-primary" />
                                            <div>
                                                <p className="max-w-xs truncate text-sm font-semibold text-foreground sm:max-w-md">
                                                    {getFileName(
                                                        dokumentasi.dokumen_lpj,
                                                    )}
                                                </p>
                                                <p className="text-xs text-on-surface-variant">
                                                    Dokumen Word (Gunakan tombol
                                                    unduh untuk melihat)
                                                </p>
                                            </div>
                                        </div>
                                        <a
                                            href={dokumentasi.dokumen_lpj}
                                            download
                                            className="decoration-none flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-on-primary hover:bg-primary-container"
                                        >
                                            <Download className="h-4 w-4" />
                                            Unduh
                                        </a>
                                    </div>
                                )
                            ) : (
                                <div className="rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-low p-8 text-center text-on-surface-variant">
                                    <AlertCircle className="mx-auto mb-2 h-10 w-10 text-on-surface-variant/30" />
                                    <p className="text-sm font-semibold">
                                        Laporan Pertanggungjawaban (LPJ) belum
                                        diunggah
                                    </p>
                                    <p className="mt-1 text-xs text-on-surface-variant/80">
                                        Pengurus UKM belum mengunggah dokumen
                                        LPJ untuk kegiatan ini.
                                    </p>
                                </div>
                            )}
                        </Card>

                        {/* Evaluation Report (Optional) */}
                        {dokumentasi.hasil_evaluasi && (
                            <Card className="rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-sm">
                                <h4 className="mb-4 flex items-center justify-between font-headline-sm font-bold text-primary">
                                    <span className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-green-700" />
                                        Hasil Evaluasi Kegiatan (Dari Petugas)
                                    </span>
                                    <a
                                        href={dokumentasi.hasil_evaluasi}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="decoration-none flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        Unduh
                                    </a>
                                </h4>

                                {isPdf(dokumentasi.hasil_evaluasi) ? (
                                    <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low shadow-inner">
                                        <iframe
                                            src={`${dokumentasi.hasil_evaluasi}#toolbar=0&navpanes=0`}
                                            className="h-[1000px] w-full border-none"
                                            title="Evaluasi PDF Preview"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between rounded-lg border border-outline-variant bg-surface-container-low px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-8 w-8 shrink-0 text-primary" />
                                            <div>
                                                <p className="max-w-xs truncate text-sm font-semibold text-foreground sm:max-w-md">
                                                    {getFileName(
                                                        dokumentasi.hasil_evaluasi,
                                                    )}
                                                </p>
                                                <p className="text-xs text-on-surface-variant">
                                                    Dokumen Word (Gunakan tombol
                                                    unduh untuk melihat)
                                                </p>
                                            </div>
                                        </div>
                                        <a
                                            href={dokumentasi.hasil_evaluasi}
                                            download
                                            className="decoration-none flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-on-primary hover:bg-primary-container"
                                        >
                                            <Download className="h-4 w-4" />
                                            Unduh
                                        </a>
                                    </div>
                                )}
                            </Card>
                        )}

                        {/* Photo Gallery Grid */}
                        <Card className="rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-sm">
                            <h4 className="mb-4 flex items-center gap-2 font-headline-sm font-bold text-primary">
                                <Image className="h-5 w-5 text-primary" />
                                Foto Dokumentasi Kegiatan
                            </h4>

                            {dokumentasi.foto_kegiatan &&
                            dokumentasi.foto_kegiatan.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                    {dokumentasi.foto_kegiatan.map((foto) => (
                                        <div
                                            key={foto.id_foto}
                                            className="group relative aspect-square overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low shadow-xs"
                                        >
                                            <img
                                                src={foto.url}
                                                alt="Dokumentasi Kegiatan"
                                                className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                                            />
                                            {/* Hover action overlay */}
                                            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                                <button
                                                    onClick={() =>
                                                        setPreviewPhoto(
                                                            foto.url,
                                                        )
                                                    }
                                                    className="cursor-pointer rounded-lg bg-white/20 p-1.5 text-white transition-colors hover:bg-white/40"
                                                    title="Lihat Penuh"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-lg border border-outline-variant bg-surface-container-low py-12 text-center text-on-surface-variant/60">
                                    <Image className="mx-auto mb-2 h-12 w-12 opacity-35" />
                                    <p className="text-sm font-semibold">
                                        Tidak ada foto dokumentasi
                                    </p>
                                    <p className="mt-1 px-4 text-xs">
                                        Pengurus UKM belum mengunggah foto-foto
                                        kegiatan.
                                    </p>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Right side (Span 1) - Revision History (Exclusively) */}
                    <div className="space-y-gutter">
                        {/* Revision History */}
                        <Card className="rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-sm">
                            <h4 className="mb-4 flex items-center gap-2 font-headline-sm font-bold text-primary">
                                <MessageSquare className="h-5 w-5 text-primary" />
                                Catatan Revisi & Evaluasi
                            </h4>

                            {dokumentasi.catatan_revisi &&
                            dokumentasi.catatan_revisi.length > 0 ? (
                                <div className="max-h-[600px] space-y-4 overflow-y-auto pr-1">
                                    {dokumentasi.catatan_revisi.map(
                                        (catatan) => (
                                            <div
                                                key={catatan.id_catatan}
                                                className={`space-y-2 rounded-lg border p-4 shadow-2xs transition-all ${
                                                    catatan.status_tindaklanjut
                                                        ? 'border-green-200 bg-green-50/20'
                                                        : 'border-red-200 bg-red-50/20'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <span className="block text-xs font-bold text-primary">
                                                            {
                                                                catatan.nama_petugas
                                                            }
                                                        </span>
                                                        <span className="mt-0.5 block text-[10px] text-on-surface-variant/60">
                                                            {formatDate(
                                                                catatan.created_at,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                                                            catatan.status_tindaklanjut
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-red-100 text-red-700'
                                                        }`}
                                                    >
                                                        {catatan.status_tindaklanjut
                                                            ? 'Tindak Lanjut'
                                                            : 'Menunggu'}
                                                    </span>
                                                </div>

                                                <p className="text-xs leading-relaxed whitespace-pre-line text-on-background">
                                                    {catatan.isi_catatan}
                                                </p>

                                                {catatan.status_tindaklanjut &&
                                                    catatan.waktu_ditindaklanjuti && (
                                                        <div className="border-t border-green-200/40 pt-2 text-[10px] text-green-700 italic">
                                                            Ditindaklanjuti
                                                            pada:{' '}
                                                            {formatDate(
                                                                catatan.waktu_ditindaklanjuti,
                                                            )}
                                                        </div>
                                                    )}
                                            </div>
                                        ),
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center text-on-surface-variant/60">
                                    <MessageSquare className="mb-2 h-10 w-10 opacity-35" />
                                    <p className="text-sm font-semibold">
                                        Tidak ada catatan revisi
                                    </p>
                                    <p className="mt-1 text-xs">
                                        Belum ada catatan perbaikan yang
                                        dikeluarkan untuk dokumentasi ini.
                                    </p>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </main>

            {/* Photo lightbox modal */}
            {previewPhoto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs transition-opacity duration-200">
                    <button
                        onClick={() => setPreviewPhoto(null)}
                        className="absolute top-4 right-4 cursor-pointer rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 hover:text-primary"
                    >
                        <X className="h-6 w-6" />
                    </button>
                    <div className="flex max-h-[90vh] max-w-4xl items-center justify-center overflow-hidden rounded-lg">
                        <img
                            src={previewPhoto}
                            alt="Dokumentasi Penuh"
                            className="max-h-[85vh] max-w-full rounded object-contain"
                        />
                    </div>
                </div>
            )}
        </>
    );
}
