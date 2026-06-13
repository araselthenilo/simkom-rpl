import { Link, usePage, useForm } from '@inertiajs/react';
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
    Upload,
    Users2,
    Calendar,
    Receipt,
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    daftar as organisasiDaftar,
    pengurus as organisasiPengurus,
    kegiatan as organisasiKegiatan,
    keuangan as organisasiKeuangan,
} from '@/routes/organisasi';
import pengurusRoute from '@/routes/pengurus';

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
    const mahasiswaInfo = auth?.user?.profil_pengguna;
    const [isOpen, setIsOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        id_organisasi: organisasi.id_organisasi,
        foto_ktm: null as File | null,
    });

    const [ktmPreview, setKtmPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setData('foto_ktm', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setKtmPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setData('foto_ktm', null);
            setKtmPreview(null);
        }
    };

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        post(organisasiDaftar().url, {
            onSuccess: () => {
                setIsOpen(false);
                reset('foto_ktm');
                setKtmPreview(null);
            },
        });
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
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {isReadOnly && (
                        <>
                            <Link
                                href={
                                    organisasiKeuangan(organisasi.id_organisasi)
                                        .url
                                }
                            >
                                <Button
                                    variant="outline"
                                    className="flex h-auto cursor-pointer items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-6 py-3 font-label-lg text-primary shadow-sm transition-all hover:bg-primary/5 active:scale-95"
                                >
                                    <Receipt className="h-[18px] w-[18px]" />
                                    Lihat Keuangan
                                </Button>
                            </Link>
                            <Link
                                href={
                                    organisasiKegiatan(organisasi.id_organisasi)
                                        .url
                                }
                            >
                                <Button
                                    variant="outline"
                                    className="flex h-auto cursor-pointer items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-6 py-3 font-label-lg text-primary shadow-sm transition-all hover:bg-primary/5 active:scale-95"
                                >
                                    <Calendar className="h-[18px] w-[18px]" />
                                    Lihat Kegiatan
                                </Button>
                            </Link>
                            <Link
                                href={
                                    organisasiPengurus(organisasi.id_organisasi)
                                        .url
                                }
                            >
                                <Button
                                    variant="outline"
                                    className="flex h-auto cursor-pointer items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-6 py-3 font-label-lg text-primary shadow-sm transition-all hover:bg-primary/5 active:scale-95"
                                >
                                    <Users2 className="h-[18px] w-[18px]" />
                                    Lihat Pengurus
                                </Button>
                            </Link>
                        </>
                    )}
                    {!isReadOnly ? (
                        <Link href={pengurusRoute.profil.edit()}>
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
                            onClick={() => setIsOpen(true)}
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

            {/* Registration Dialog */}
            <Dialog
                open={isOpen}
                onOpenChange={(open) => {
                    setIsOpen(open);

                    if (!open) {
                        reset('foto_ktm');
                        setKtmPreview(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-headline-sm font-bold text-primary">
                            Pendaftaran Anggota
                        </DialogTitle>
                        <DialogDescription>
                            Silakan lengkapi pendaftaran untuk bergabung dengan{' '}
                            <strong>{organisasi.nama_organisasi}</strong>.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleJoin} className="space-y-5">
                        {/* Auto-filled Student Metadata to Reduce Redundancy */}
                        <div className="space-y-3 rounded-xl border border-secondary/20 bg-secondary-container/10 p-4">
                            <div className="flex items-center gap-2 text-xs font-semibold text-secondary">
                                <span className="flex h-2 w-2 rounded-full bg-secondary"></span>
                                Data Mahasiswa Terverifikasi (Auto-fill)
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <span className="block text-on-surface-variant/70">
                                        NIM
                                    </span>
                                    <span className="font-semibold text-foreground">
                                        {mahasiswaInfo?.nim || '-'}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-on-surface-variant/70">
                                        Nama Lengkap
                                    </span>
                                    <span className="font-semibold text-foreground">
                                        {mahasiswaInfo?.nama_lengkap || '-'}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-on-surface-variant/70">
                                        Program Studi
                                    </span>
                                    <span className="font-semibold text-foreground">
                                        {mahasiswaInfo?.program_studi || '-'}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-on-surface-variant/70">
                                        Nomor Telepon
                                    </span>
                                    <span className="font-semibold text-foreground">
                                        {mahasiswaInfo?.nomor_telepon || '-'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Foto KTM Upload */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-primary">
                                Foto Kartu Tanda Mahasiswa (KTM){' '}
                                <span className="text-red-500">*</span>
                            </label>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                                <div className="sm:col-span-3">
                                    <label className="group flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-low p-4 transition-colors hover:bg-surface-container-high">
                                        <Upload className="mb-2 h-6 w-6 text-on-surface-variant/70 transition-colors group-hover:text-primary" />
                                        <span className="text-xs font-semibold text-primary">
                                            Pilih Foto KTM
                                        </span>
                                        <span className="mt-1 text-center text-[10px] text-on-surface-variant/70">
                                            PNG, JPG, JPEG, atau WEBP (Maksimal
                                            2MB)
                                        </span>
                                        <input
                                            type="file"
                                            required
                                            accept="image/png, image/jpeg, image/jpg, image/webp"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                </div>

                                <div className="flex items-center justify-center sm:col-span-1">
                                    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border border-outline-variant bg-background p-1 shadow-inner">
                                        {ktmPreview ? (
                                            <img
                                                src={ktmPreview}
                                                alt="KTM Preview"
                                                className="h-full w-full rounded object-contain"
                                            />
                                        ) : (
                                            <span className="text-center text-[10px] font-semibold text-on-surface-variant/50">
                                                No Preview
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {errors.foto_ktm && (
                                <p className="text-xs font-medium text-error">
                                    {errors.foto_ktm}
                                </p>
                            )}
                            {errors.id_organisasi && (
                                <p className="text-xs font-medium text-error">
                                    {errors.id_organisasi}
                                </p>
                            )}
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                className="w-full sm:w-auto"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing || !data.foto_ktm}
                                className="w-full bg-primary text-on-primary sm:w-auto"
                            >
                                {processing
                                    ? 'Mengirim...'
                                    : 'Kirim Pendaftaran'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </main>
    );
}
