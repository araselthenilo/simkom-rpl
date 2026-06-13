import { useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Building2, Upload, Save, HelpCircle } from 'lucide-react';
import React, { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
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

interface ProposeProfilFormProps {
    profil: Profil;
    organisasi: Organisasi;
}

export default function ProposeProfilForm({
    profil,
    organisasi,
}: ProposeProfilFormProps) {
    const { data, setData, post, processing, errors } = useForm({
        deskripsi_organisasi: profil.deskripsi_organisasi || '',
        visi_organisasi: profil.visi_organisasi || '',
        misi_organisasi: profil.misi_organisasi || '',
        logo_organisasi: null as File | null,
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(
        profil.logo_organisasi ? `/storage/${profil.logo_organisasi}` : null,
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setData('logo_organisasi', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setData('logo_organisasi', null);
            setLogoPreview(
                profil.logo_organisasi
                    ? `/storage/${profil.logo_organisasi}`
                    : null,
            );
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(pengurusRoute.profil.propose().url);
    };

    return (
        <div className="animate-fade-in mx-auto w-full max-w-3xl space-y-6 p-margin-desktop">
            {/* Navigation back */}
            <div className="flex items-center justify-between">
                <Link
                    href={pengurusRoute.profil()}
                    className="decoration-none inline-flex items-center gap-2 text-sm font-semibold text-primary transition-opacity hover:opacity-80"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Detail Profil
                </Link>
            </div>

            {/* Form Card */}
            <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-md">
                <div className="flex items-center gap-3 border-b border-outline-variant/60 bg-surface-container-low px-6 py-5">
                    <div className="rounded-lg bg-primary-fixed p-2.5 text-primary">
                        <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="font-headline-sm text-headline-sm font-bold text-primary">
                            Proposalkan Perubahan Profil
                        </h2>
                        <p className="mt-0.5 font-label-md text-label-md text-on-surface-variant/80">
                            Ajukan pembaruan data profil organisasi Anda untuk
                            divalidasi.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 p-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Nama Organisasi - READ ONLY */}
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-primary">
                                Nama Organisasi (UKM)
                            </label>
                            <input
                                type="text"
                                disabled
                                className="w-full cursor-not-allowed rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-sm font-medium text-on-surface-variant"
                                value={organisasi.nama_organisasi}
                            />
                        </div>

                        {/* Periode Kepengurusan - READ ONLY */}
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-primary">
                                Periode Kepengurusan
                            </label>
                            <input
                                type="text"
                                disabled
                                className="w-full cursor-not-allowed rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-sm font-medium text-on-surface-variant"
                                value={profil.periode_kepengurusan}
                            />
                            <p className="mt-1 text-[11px] font-semibold text-on-surface-variant/70">
                                Anda hanya dapat mengajukan usulan untuk periode
                                aktif saat ini.
                            </p>
                        </div>
                    </div>

                    {/* Logo Organisasi */}
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-primary">
                            Logo Organisasi
                        </label>
                        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
                            {/* File Selector Box */}
                            <div className="md:col-span-3">
                                <label className="group flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-low p-6 transition-colors hover:bg-surface-container-high">
                                    <Upload className="mb-2 h-8 w-8 text-on-surface-variant/70 transition-colors group-hover:text-primary" />
                                    <span className="text-sm font-semibold text-primary">
                                        Pilih File Logo Baru
                                    </span>
                                    <span className="mt-1 text-xs text-on-surface-variant/70">
                                        Format: PNG, JPG, JPEG, atau WEBP
                                        (Maksimal 2MB)
                                    </span>
                                    <span className="mt-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                                        Biarkan kosong jika tidak ingin mengubah
                                        logo
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg, image/webp"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>

                            {/* Image Preview Box */}
                            <div className="flex flex-col items-center justify-center md:col-span-1">
                                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-lg border border-outline-variant bg-background p-2 shadow-inner">
                                    {logoPreview ? (
                                        <img
                                            src={logoPreview}
                                            alt="Logo Preview"
                                            className="h-full w-full object-contain"
                                        />
                                    ) : (
                                        <span className="text-center text-xs font-semibold text-on-surface-variant/50">
                                            Belum Ada Preview
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <InputError
                            message={errors.logo_organisasi}
                            className="mt-1.5"
                        />
                    </div>

                    {/* Deskripsi Organisasi */}
                    <div>
                        <label
                            htmlFor="deskripsi_organisasi"
                            className="mb-1 block text-sm font-semibold text-primary"
                        >
                            Deskripsi Organisasi{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="deskripsi_organisasi"
                            required
                            rows={4}
                            className="w-full resize-none rounded-lg border border-outline-variant bg-background px-3 py-2 text-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            placeholder="Deskripsikan profil umum dan tujuan didirikannya organisasi ini..."
                            value={data.deskripsi_organisasi}
                            onChange={(e) =>
                                setData('deskripsi_organisasi', e.target.value)
                            }
                        />
                        <InputError
                            message={errors.deskripsi_organisasi}
                            className="mt-1.5"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Visi Organisasi */}
                        <div>
                            <label
                                htmlFor="visi_organisasi"
                                className="mb-1 block text-sm font-semibold text-primary"
                            >
                                Visi Organisasi{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="visi_organisasi"
                                required
                                rows={3}
                                className="w-full resize-none rounded-lg border border-outline-variant bg-background px-3 py-2 text-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                placeholder="Tuliskan visi utama organisasi..."
                                value={data.visi_organisasi}
                                onChange={(e) =>
                                    setData('visi_organisasi', e.target.value)
                                }
                            />
                            <InputError
                                message={errors.visi_organisasi}
                                className="mt-1.5"
                            />
                        </div>

                        {/* Misi Organisasi */}
                        <div>
                            <label
                                htmlFor="misi_organisasi"
                                className="mb-1 block text-sm font-semibold text-primary"
                            >
                                Misi Organisasi{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="misi_organisasi"
                                required
                                rows={3}
                                className="w-full resize-none rounded-lg border border-outline-variant bg-background px-3 py-2 text-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                placeholder="Tuliskan misi organisasi..."
                                value={data.misi_organisasi}
                                onChange={(e) =>
                                    setData('misi_organisasi', e.target.value)
                                }
                            />
                            <InputError
                                message={errors.misi_organisasi}
                                className="mt-1.5"
                            />
                        </div>
                    </div>

                    {/* Submit and Cancel Buttons */}
                    <div className="flex justify-end gap-3 border-t border-outline-variant/60 pt-4">
                        <Link
                            href={pengurusRoute.profil()}
                            className="hover:bg-surface-variant decoration-none inline-flex h-auto cursor-pointer items-center justify-center rounded-lg border border-outline px-6 py-2.5 font-label-lg text-sm font-semibold text-on-surface-variant transition-all"
                        >
                            Batal
                        </Link>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="flex h-auto cursor-pointer items-center justify-center gap-2 rounded-lg border-none bg-primary px-6 py-2.5 font-label-lg text-sm font-semibold text-on-primary shadow-sm transition-all hover:opacity-90 active:scale-95"
                        >
                            <Save className="h-[18px] w-[18px]" />
                            {processing ? 'Mengirim...' : 'Kirim Pengajuan'}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Informational Panel */}
            <div className="flex gap-3 rounded-xl border border-secondary/20 bg-secondary-container/20 p-4">
                <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                <div className="text-sm">
                    <span className="font-semibold text-on-secondary-container">
                        Penting:
                    </span>{' '}
                    <span className="text-on-surface-variant">
                        Pengajuan Anda akan tersimpan sebagai draft usulan
                        permohonan baru. Petugas Kemahasiswaan akan memeriksa,
                        memverifikasi kesesuaian data, dan menyetujuinya sebelum
                        profil baru ini aktif secara publik.
                    </span>
                </div>
            </div>
        </div>
    );
}
