import { router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Upload,
    Download,
    Trash2,
    Image,
    FileText,
    CheckCircle2,
    AlertCircle,
    Clock,
    MessageSquare,
    Check,
    Plus,
    X,
    Eye,
    Info,
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
    foto_kegiatan: FotoKegiatan[];
    catatan_revisi: CatatanRevisi[];
}

interface Props {
    kegiatan: Activity;
    dokumentasi: Dokumentasi | null;
}

export default function DokumentasiKegiatanPage({
    kegiatan,
    dokumentasi,
}: Props) {
    const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    // Form for documents
    const { data, setData, post, processing, errors, reset } = useForm({
        dokumen_proposal: null as File | null,
        dokumen_lpj: null as File | null,
    });

    // Handle document form submit
    const handleSubmitDocs = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/pengurus/kegiatan/${kegiatan.id_kegiatan}/dokumentasi`, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                alert('Dokumen berhasil disimpan.');
            },
            onError: (err) => {
                const message = Object.values(err).join('\n');
                alert(message || 'Terjadi kesalahan saat mengunggah dokumen.');
            },
        });
    };

    // Handle single photo upload
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran foto maksimal 5 MB!');
            return;
        }

        setUploadingPhoto(true);
        const formData = new FormData();
        formData.append('foto', file);

        router.post(
            `/pengurus/kegiatan/${kegiatan.id_kegiatan}/dokumentasi/foto`,
            formData,
            {
                forceFormData: true,
                onSuccess: () => {
                    setUploadingPhoto(false);
                    // Reset file input
                    e.target.value = '';
                },
                onError: (err) => {
                    setUploadingPhoto(false);
                    const message = Object.values(err).join('\n');
                    alert(message || 'Gagal mengunggah foto.');
                },
            },
        );
    };

    // Handle photo delete
    const handleDeletePhoto = (idFoto: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus foto ini?')) {
            router.delete(
                `/pengurus/kegiatan/${kegiatan.id_kegiatan}/dokumentasi/foto/${idFoto}`,
                {
                    onSuccess: () => {
                        if (previewPhoto) setPreviewPhoto(null);
                    },
                    onError: (err) => {
                        const message = Object.values(err).join('\n');
                        alert(message || 'Gagal menghapus foto.');
                    },
                },
            );
        }
    };

    // Handle resolve revision note
    const handleTindaklanjut = (idCatatan: number) => {
        if (confirm('Tandai catatan revisi ini telah ditindaklanjuti?')) {
            router.post(
                `/pengurus/kegiatan/${kegiatan.id_kegiatan}/dokumentasi/revisi/${idCatatan}/tindaklanjut`,
                {},
                {
                    onError: (err) => {
                        const message = Object.values(err).join('\n');
                        alert(message || 'Gagal menindaklanjuti catatan.');
                    },
                },
            );
        }
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

    const getFileName = (urlPath: string | null) => {
        if (!urlPath) return '';
        const parts = urlPath.split('/');
        return parts[parts.length - 1];
    };

    const isPdf = (urlPath: string | null) => {
        if (!urlPath) return false;
        const cleanPath = urlPath.split('?')[0];
        return cleanPath.toLowerCase().endsWith('.pdf');
    };

    return (
        <main className="mx-auto w-full max-w-container-max animate-in space-y-gutter p-margin-desktop duration-200 fade-in">
            {/* Header & Back Button */}
            <header className="mb-unit-xl flex flex-col items-start gap-2">
                <button
                    onClick={() => router.get('/pengurus/kegiatan')}
                    className="group inline-flex cursor-pointer items-center gap-2 font-label-lg text-primary transition-all hover:opacity-80 focus:outline-none"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Kembali ke Manajemen Kegiatan
                </button>

                <div className="mt-2 flex flex-wrap items-center gap-3">
                    <h2 className="font-headline-lg text-headline-lg text-primary">
                        Dokumentasi: {kegiatan.nama_kegiatan}
                    </h2>
                    <span className="rounded border border-primary/10 bg-primary-fixed px-2.5 py-1 text-xs font-semibold text-primary">
                        {kegiatan.jenis_kegiatan}
                    </span>
                    {dokumentasi && (
                        <span
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                                dokumentasi.status_dokumentasi === 'Diterima'
                                    ? 'bg-green-100 text-green-700'
                                    : dokumentasi.status_dokumentasi ===
                                        'Butuh Revisi'
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-blue-100 text-blue-700'
                            }`}
                        >
                            {dokumentasi.status_dokumentasi === 'Diterima' && (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                            )}
                            {dokumentasi.status_dokumentasi ===
                                'Butuh Revisi' && (
                                <AlertCircle className="h-3.5 w-3.5" />
                            )}
                            {dokumentasi.status_dokumentasi === 'Diproses' && (
                                <Clock className="h-3.5 w-3.5" />
                            )}
                            Status: {dokumentasi.status_dokumentasi}
                        </span>
                    )}
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
            </header>

            {/* Quick Status Info for Missing Docs */}
            {!dokumentasi && (
                <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4 text-blue-800 shadow-xs">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                    <div>
                        <h4 className="text-sm font-bold">
                            Dokumentasi Belum Dibuat
                        </h4>
                        <p className="mt-0.5 text-xs opacity-90">
                            Silakan unggah dokumen proposal kegiatan Anda
                            terlebih dahulu untuk membuat dokumentasi kegiatan
                            baru. Setelah proposal berhasil diunggah, Anda dapat
                            mengunggah foto dokumentasi kegiatan.
                        </p>
                    </div>
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-gutter lg:grid-cols-3">
                {/* Left Columns - Form & Files (Span 2) */}
                <div className="space-y-gutter lg:col-span-2">
                    {/* Proposal and LPJ Card */}
                    <Card className="rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-sm">
                        <h3 className="mb-6 flex items-center gap-2 font-headline-sm font-bold text-primary">
                            <FileText className="h-5 w-5 text-primary" />
                            Dokumen Pertanggungjawaban
                        </h3>

                        <form onSubmit={handleSubmitDocs} className="space-y-6">
                            {/* Proposal File */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-primary">
                                    Dokumen Proposal *
                                    {dokumentasi?.dokumen_proposal && (
                                        <span className="ml-2 text-[11px] font-normal text-green-700">
                                            (Sudah Diunggah)
                                        </span>
                                    )}
                                </label>

                                {dokumentasi?.dokumen_proposal && (
                                    <div className="mb-2 space-y-2">
                                        <div className="flex items-center justify-between rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-xs transition-all hover:bg-surface-container-high">
                                            <span className="max-w-md truncate font-medium text-on-surface-variant">
                                                {getFileName(
                                                    dokumentasi.dokumen_proposal,
                                                )}
                                            </span>
                                            <a
                                                href={
                                                    dokumentasi.dokumen_proposal
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 font-bold text-primary hover:underline"
                                            >
                                                <Download className="h-3.5 w-3.5" />
                                                Unduh
                                            </a>
                                        </div>
                                        {isPdf(dokumentasi.dokumen_proposal) ? (
                                            <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low shadow-inner">
                                                <iframe
                                                    src={`${dokumentasi.dokumen_proposal}#toolbar=0&navpanes=0`}
                                                    className="h-[1000px] w-full border-none"
                                                    title="Proposal PDF Preview"
                                                />
                                            </div>
                                        ) : (
                                            <p className="px-1 text-[11px] text-on-surface-variant/70 italic">
                                                * Preview hanya tersedia untuk
                                                file PDF. Silakan unduh untuk
                                                melihat dokumen Word.
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="relative flex items-center justify-center rounded-lg border-2 border-dashed border-outline-variant bg-background/50 p-4 transition-all hover:border-primary">
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) =>
                                            setData(
                                                'dokumen_proposal',
                                                e.target.files?.[0] || null,
                                            )
                                        }
                                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                    />
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-8 w-8 text-on-surface-variant/40" />
                                        <div className="text-xs text-on-surface-variant">
                                            <span className="font-semibold text-primary">
                                                Pilih berkas
                                            </span>{' '}
                                            atau seret kemari
                                        </div>
                                        <p className="text-[10px] text-on-surface-variant/60">
                                            PDF, DOC, DOCX (Maks. 10 MB)
                                        </p>
                                    </div>
                                </div>
                                {data.dokumen_proposal && (
                                    <p className="text-xs font-medium text-primary">
                                        Berkas terpilih:{' '}
                                        {data.dokumen_proposal.name}
                                    </p>
                                )}
                                {errors.dokumen_proposal && (
                                    <p className="text-xs text-error">
                                        {errors.dokumen_proposal}
                                    </p>
                                )}
                            </div>

                            {/* LPJ File */}
                            <div className="space-y-2 border-t border-outline-variant/40 pt-4">
                                <label className="block text-sm font-semibold text-primary">
                                    Dokumen LPJ (Laporan Pertanggungjawaban)
                                    {dokumentasi?.dokumen_lpj && (
                                        <span className="ml-2 text-[11px] font-normal text-green-700">
                                            (Sudah Diunggah)
                                        </span>
                                    )}
                                </label>

                                {dokumentasi?.dokumen_lpj && (
                                    <div className="mb-2 space-y-2">
                                        <div className="flex items-center justify-between rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-xs transition-all hover:bg-surface-container-high">
                                            <span className="max-w-md truncate font-medium text-on-surface-variant">
                                                {getFileName(
                                                    dokumentasi.dokumen_lpj,
                                                )}
                                            </span>
                                            <a
                                                href={dokumentasi.dokumen_lpj}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 font-bold text-primary hover:underline"
                                            >
                                                <Download className="h-3.5 w-3.5" />
                                                Unduh
                                            </a>
                                        </div>
                                        {isPdf(dokumentasi.dokumen_lpj) ? (
                                            <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low shadow-inner">
                                                <iframe
                                                    src={`${dokumentasi.dokumen_lpj}#toolbar=0&navpanes=0`}
                                                    className="h-[1000px] w-full border-none"
                                                    title="LPJ PDF Preview"
                                                />
                                            </div>
                                        ) : (
                                            <p className="px-1 text-[11px] text-on-surface-variant/70 italic">
                                                * Preview hanya tersedia untuk
                                                file PDF. Silakan unduh untuk
                                                melihat dokumen Word.
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="relative flex items-center justify-center rounded-lg border-2 border-dashed border-outline-variant bg-background/50 p-4 transition-all hover:border-primary">
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) =>
                                            setData(
                                                'dokumen_lpj',
                                                e.target.files?.[0] || null,
                                            )
                                        }
                                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                    />
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-8 w-8 text-on-surface-variant/40" />
                                        <div className="text-xs text-on-surface-variant">
                                            <span className="font-semibold text-primary">
                                                Pilih berkas
                                            </span>{' '}
                                            atau seret kemari
                                        </div>
                                        <p className="text-[10px] text-on-surface-variant/60">
                                            PDF, DOC, DOCX (Maks. 10 MB)
                                        </p>
                                    </div>
                                </div>
                                {data.dokumen_lpj && (
                                    <p className="text-xs font-medium text-primary">
                                        Berkas terpilih: {data.dokumen_lpj.name}
                                    </p>
                                )}
                                {errors.dokumen_lpj && (
                                    <p className="text-xs text-error">
                                        {errors.dokumen_lpj}
                                    </p>
                                )}
                            </div>

                            {/* Evaluation Report (Petugas only upload, Staff View Only) */}
                            {dokumentasi?.hasil_evaluasi && (
                                <div className="space-y-2 rounded-lg border border-outline-variant bg-surface-container-low p-4">
                                    <h4 className="flex items-center gap-1 text-xs font-bold text-primary">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-green-700" />
                                        Hasil Evaluasi Kegiatan dari Petugas
                                    </h4>
                                    <div className="flex items-center justify-between pt-1 text-xs">
                                        <span className="max-w-sm truncate text-on-surface-variant">
                                            {getFileName(
                                                dokumentasi.hasil_evaluasi,
                                            )}
                                        </span>
                                        <a
                                            href={dokumentasi.hasil_evaluasi}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 font-bold text-primary hover:underline"
                                        >
                                            <Download className="h-3.5 w-3.5" />
                                            Unduh Evaluasi
                                        </a>
                                    </div>
                                    {isPdf(dokumentasi.hasil_evaluasi) ? (
                                        <div className="mt-2 overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low shadow-inner">
                                            <iframe
                                                src={`${dokumentasi.hasil_evaluasi}#toolbar=0&navpanes=0`}
                                                className="h-[1000px] w-full border-none"
                                                title="Evaluasi PDF Preview"
                                            />
                                        </div>
                                    ) : (
                                        <p className="mt-1 px-1 text-[11px] text-on-surface-variant/70 italic">
                                            * Preview hanya tersedia untuk file
                                            PDF. Silakan unduh untuk melihat
                                            dokumen Word.
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Form submit button */}
                            <div className="flex justify-end gap-2 border-t border-outline-variant/40 pt-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="cursor-pointer bg-primary text-on-primary hover:opacity-95"
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    {processing
                                        ? 'Menyimpan...'
                                        : 'Simpan Dokumen'}
                                </Button>
                            </div>
                        </form>
                    </Card>

                    {/* Photos Gallery Card */}
                    <Card className="rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-sm">
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="flex items-center gap-2 font-headline-sm font-bold text-primary">
                                <Image className="h-5 w-5 text-primary" />
                                Foto Dokumentasi Kegiatan
                            </h3>

                            {dokumentasi && (
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="photo-upload-input"
                                        onChange={handlePhotoUpload}
                                        disabled={uploadingPhoto}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="photo-upload-input"
                                        className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary shadow-sm transition-all hover:opacity-90 active:scale-95 ${
                                            uploadingPhoto
                                                ? 'pointer-events-none opacity-50'
                                                : ''
                                        }`}
                                    >
                                        <Plus className="h-4 w-4" />
                                        {uploadingPhoto
                                            ? 'Mengunggah...'
                                            : 'Unggah Foto'}
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Image Grid / Placeholders */}
                        {dokumentasi ? (
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
                                                    className="rounded-lg bg-white/20 p-1.5 text-white transition-colors hover:bg-white/40"
                                                    title="Lihat Penuh"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeletePhoto(
                                                            foto.id_foto,
                                                        )
                                                    }
                                                    className="rounded-lg bg-red-600/20 p-1.5 text-white transition-colors hover:bg-red-600/80"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-lg border border-outline-variant bg-surface-container-low py-10 text-center text-on-surface-variant/60">
                                    <Image className="mx-auto mb-2 h-12 w-12 opacity-35" />
                                    <p className="text-sm font-medium">
                                        Belum ada foto dokumentasi
                                    </p>
                                    <p className="mt-1 text-xs">
                                        Unggah foto kegiatan yang sudah selesai
                                        dilaksanakan.
                                    </p>
                                </div>
                            )
                        ) : (
                            <div className="rounded-lg border border-outline-variant bg-surface-container-low py-10 text-center text-on-surface-variant/60">
                                <Image className="mx-auto mb-2 h-12 w-12 opacity-30" />
                                <p className="text-sm font-medium text-on-surface-variant/70">
                                    Galeri Foto Belum Aktif
                                </p>
                                <p className="mt-1 text-xs">
                                    Silakan unggah berkas proposal di atas
                                    terlebih dahulu untuk mengaktifkan
                                    pengunggahan foto kegiatan.
                                </p>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right Column - Revision Notes (Span 1) */}
                <div className="space-y-gutter">
                    <Card className="flex h-full flex-col rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-sm">
                        <h3 className="mb-6 flex items-center gap-2 font-headline-sm font-bold text-primary">
                            <MessageSquare className="h-5 w-5 text-primary" />
                            Catatan Revisi & Evaluasi
                        </h3>

                        {dokumentasi &&
                        dokumentasi.catatan_revisi.length > 0 ? (
                            <div className="max-h-[600px] flex-1 space-y-4 overflow-y-auto pr-2">
                                {dokumentasi.catatan_revisi.map((catatan) => (
                                    <div
                                        key={catatan.id_catatan}
                                        className={`space-y-3 rounded-lg border p-4 shadow-2xs transition-all ${
                                            catatan.status_tindaklanjut
                                                ? 'border-green-200 bg-green-50/20'
                                                : 'border-red-200 bg-red-50/20'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <span className="block text-xs font-bold text-primary">
                                                    {catatan.nama_petugas}
                                                </span>
                                                <span className="mt-0.5 block text-[10px] text-on-surface-variant/60">
                                                    {formatDate(
                                                        catatan.created_at,
                                                    )}
                                                </span>
                                            </div>

                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                    catatan.status_tindaklanjut
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}
                                            >
                                                {catatan.status_tindaklanjut
                                                    ? 'Selesai'
                                                    : 'Revisi'}
                                            </span>
                                        </div>

                                        <p className="text-xs leading-relaxed whitespace-pre-line text-on-background">
                                            {catatan.isi_catatan}
                                        </p>

                                        {/* Action if unresolved */}
                                        {!catatan.status_tindaklanjut && (
                                            <div className="flex justify-end pt-1">
                                                <Button
                                                    onClick={() =>
                                                        handleTindaklanjut(
                                                            catatan.id_catatan,
                                                        )
                                                    }
                                                    variant="outline"
                                                    size="xs"
                                                    className="h-7 cursor-pointer border border-green-600 px-2.5 text-[11px] text-green-700 hover:bg-green-50"
                                                >
                                                    <Check className="mr-1 h-3.5 w-3.5" />
                                                    Tindaklanjuti
                                                </Button>
                                            </div>
                                        )}

                                        {catatan.status_tindaklanjut &&
                                            catatan.waktu_ditindaklanjuti && (
                                                <div className="flex items-center gap-1 border-t border-green-200/40 pt-2 text-[10px] text-green-700 italic">
                                                    <CheckCircle2 className="inline h-3 w-3" />
                                                    Ditindaklanjuti pada:{' '}
                                                    {formatDate(
                                                        catatan.waktu_ditindaklanjuti,
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-1 flex-col items-center justify-center py-12 text-center text-on-surface-variant/60">
                                <MessageSquare className="mb-2 h-12 w-12 opacity-35" />
                                <p className="text-sm font-medium">
                                    Tidak ada catatan revisi
                                </p>
                                <p className="mt-1 text-xs">
                                    Evaluasi atau masukan dari pembina & admin
                                    akan muncul di sini.
                                </p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {/* Photo lightbox modal */}
            {previewPhoto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs transition-opacity duration-200">
                    <button
                        onClick={() => setPreviewPhoto(null)}
                        className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 hover:text-primary"
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
        </main>
    );
}
