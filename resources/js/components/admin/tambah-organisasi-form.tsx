import { useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Building2, Upload, Save, HelpCircle } from 'lucide-react';
import React, { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';

export default function TambahOrganisasiForm() {
    const { data, setData, post, processing, errors } = useForm({
        nama_organisasi: '',
        status_aktif: true,
        periode_kepengurusan: '',
        logo_organisasi: null as File | null,
        deskripsi_organisasi: '',
        visi_organisasi: '',
        misi_organisasi: '',
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(null);

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
            setLogoPreview(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/organisasi');
    };

    return (
        <div className="p-margin-desktop max-w-3xl mx-auto w-full space-y-6">
            {/* Header / Breadcrumb navigation */}
            <div className="flex items-center justify-between">
                <Link
                    href="/admin/dashboard"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80 transition-opacity decoration-none"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Dashboard
                </Link>
            </div>

            {/* Form Card */}
            <div className="bg-surface rounded-xl border border-outline-variant shadow-md overflow-hidden">
                <div className="px-6 py-5 border-b border-outline-variant/60 bg-surface-container-low flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-primary-fixed text-primary">
                        <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                            Tambah Organisasi (UKM) Baru
                        </h2>
                        <p className="font-label-md text-label-md text-on-surface-variant/80 mt-0.5">
                            Formulir pendaftaran unit kegiatan mahasiswa beserta profil periode kepengurusan perdana.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Nama Organisasi */}
                    <div>
                        <label htmlFor="nama_organisasi" className="block text-sm font-semibold text-primary mb-1">
                            Nama Organisasi (UKM) <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="nama_organisasi"
                            type="text"
                            required
                            className="w-full px-3 py-2 bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                            placeholder="Contoh: UKM Computer Club STIKOM"
                            value={data.nama_organisasi}
                            onChange={(e) => setData('nama_organisasi', e.target.value)}
                        />
                        <InputError message={errors.nama_organisasi} className="mt-1.5" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Periode Kepengurusan */}
                        <div>
                            <label htmlFor="periode_kepengurusan" className="block text-sm font-semibold text-primary mb-1">
                                Periode Kepengurusan <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="periode_kepengurusan"
                                type="text"
                                required
                                className="w-full px-3 py-2 bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                placeholder="Contoh: 2026/2027"
                                value={data.periode_kepengurusan}
                                onChange={(e) => setData('periode_kepengurusan', e.target.value)}
                            />
                            <p className="text-xs text-on-surface-variant/70 mt-1">
                                Format: Tahun/Tahun (9 karakter, misal: 2026/2027)
                            </p>
                            <InputError message={errors.periode_kepengurusan} className="mt-1.5" />
                        </div>

                        {/* Status Aktif */}
                        <div>
                            <label className="block text-sm font-semibold text-primary mb-1">
                                Status Organisasi <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center space-x-3 p-2 border border-outline-variant rounded-lg bg-surface-container-low h-[42px]">
                                <input
                                    id="status_aktif"
                                    type="checkbox"
                                    className="h-4.5 w-4.5 text-primary border-outline-variant rounded focus:ring-primary cursor-pointer"
                                    checked={data.status_aktif}
                                    onChange={(e) => setData('status_aktif', e.target.checked)}
                                />
                                <label htmlFor="status_aktif" className="text-sm font-semibold text-primary cursor-pointer select-none">
                                    Aktif dan Dapat Mengajukan Kegiatan
                                </label>
                            </div>
                            <InputError message={errors.status_aktif} className="mt-1.5" />
                        </div>
                    </div>

                    {/* Logo Organisasi */}
                    <div>
                        <label className="block text-sm font-semibold text-primary mb-1">
                            Logo Organisasi <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                            {/* File Selector Box */}
                            <div className="md:col-span-3">
                                <label className="flex flex-col items-center justify-center border-2 border-dashed border-outline-variant rounded-lg p-6 bg-surface-container-low hover:bg-surface-container-high cursor-pointer transition-colors group">
                                    <Upload className="h-8 w-8 text-on-surface-variant/70 group-hover:text-primary transition-colors mb-2" />
                                    <span className="text-sm font-semibold text-primary">Pilih File Logo</span>
                                    <span className="text-xs text-on-surface-variant/70 mt-1">
                                        Format: PNG, JPG, JPEG, atau WEBP (Maksimal 2MB)
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
                            <div className="md:col-span-1 flex flex-col items-center justify-center">
                                <div className="h-28 w-28 border border-outline-variant rounded-lg bg-background flex items-center justify-center overflow-hidden shadow-inner p-2">
                                    {logoPreview ? (
                                        <img
                                            src={logoPreview}
                                            alt="Logo Preview"
                                            className="h-full w-full object-contain"
                                        />
                                    ) : (
                                        <span className="text-xs text-on-surface-variant/50 text-center font-semibold">
                                            Belum Ada Preview
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <InputError message={errors.logo_organisasi} className="mt-1.5" />
                    </div>

                    {/* Deskripsi Organisasi */}
                    <div>
                        <label htmlFor="deskripsi_organisasi" className="block text-sm font-semibold text-primary mb-1">
                            Deskripsi Organisasi <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="deskripsi_organisasi"
                            required
                            rows={4}
                            className="w-full px-3 py-2 bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none"
                            placeholder="Deskripsikan profil umum dan tujuan didirikannya organisasi ini..."
                            value={data.deskripsi_organisasi}
                            onChange={(e) => setData('deskripsi_organisasi', e.target.value)}
                        />
                        <InputError message={errors.deskripsi_organisasi} className="mt-1.5" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Visi Organisasi */}
                        <div>
                            <label htmlFor="visi_organisasi" className="block text-sm font-semibold text-primary mb-1">
                                Visi Organisasi <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="visi_organisasi"
                                required
                                rows={3}
                                className="w-full px-3 py-2 bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none"
                                placeholder="Tuliskan visi utama organisasi..."
                                value={data.visi_organisasi}
                                onChange={(e) => setData('visi_organisasi', e.target.value)}
                            />
                            <InputError message={errors.visi_organisasi} className="mt-1.5" />
                        </div>

                        {/* Misi Organisasi */}
                        <div>
                            <label htmlFor="misi_organisasi" className="block text-sm font-semibold text-primary mb-1">
                                Misi Organisasi <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="misi_organisasi"
                                required
                                rows={3}
                                className="w-full px-3 py-2 bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none"
                                placeholder="Tuliskan misi organisasi (gunakan baris baru jika lebih dari satu)..."
                                value={data.misi_organisasi}
                                onChange={(e) => setData('misi_organisasi', e.target.value)}
                            />
                            <InputError message={errors.misi_organisasi} className="mt-1.5" />
                        </div>
                    </div>

                    {/* Submit and Cancel Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/60">
                        <Link
                            href="/admin/dashboard"
                            className="inline-flex items-center justify-center border border-outline text-on-surface-variant font-label-lg px-6 py-2.5 h-auto rounded-lg hover:bg-surface-variant transition-all cursor-pointer decoration-none font-semibold text-sm"
                        >
                            Batal
                        </Link>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-primary text-on-primary px-6 py-2.5 h-auto rounded-lg font-label-lg flex items-center justify-center gap-2 shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none font-semibold text-sm"
                        >
                            <Save className="h-[18px] w-[18px]" />
                            {processing ? 'Menyimpan...' : 'Simpan Organisasi'}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Informational Panel */}
            <div className="bg-secondary-container/20 border border-secondary/20 rounded-xl p-4 flex gap-3">
                <HelpCircle className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <div className="text-sm">
                    <span className="font-semibold text-on-secondary-container">Informasi:</span>{' '}
                    <span className="text-on-surface-variant">
                        Penambahan organisasi ini akan secara otomatis mendaftarkan profil kepengurusan pertama.
                        Pastikan data nama organisasi dan logo yang diunggah sudah sesuai dengan keputusan resmi Kemahasiswaan.
                    </span>
                </div>
            </div>
        </div>
    );
}
