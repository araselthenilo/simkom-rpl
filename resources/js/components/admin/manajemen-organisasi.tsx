import { Link, router } from '@inertiajs/react';
import {
    Building2,
    Search,
    ChevronLeft,
    ChevronRight,
    PlusCircle,
    Power,
    Trash2,
    Eye,
    Users,
    CheckCircle2,
    XCircle,
    HelpCircle,
    ArrowRight
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import admin from '@/routes/admin';

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

interface Organisasi {
    id_organisasi: number;
    nama_organisasi: string;
    status_aktif: boolean;
    created_at: string;
    updated_at: string;
    anggota_organisasi_count?: number;
    profil_organisasi: ProfilOrganisasi[];
}

interface ManajemenOrganisasiProps {
    organisasi?: Organisasi[];
}

export default function ManajemenOrganisasi({ organisasi = [] }: ManajemenOrganisasiProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'Semua' | 'Aktif' | 'Nonaktif'>('Semua');

    // Metrics calculations
    const totalOrganisasi = organisasi.length;
    const totalActive = organisasi.filter(o => o.status_aktif).length;
    const totalInactive = organisasi.filter(o => !o.status_aktif).length;

    // Filter organizations list
    const filteredOrganisasi = organisasi.filter(org => {
        const matchesSearch = org.nama_organisasi.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = activeTab === 'Semua'
            ? true
            : activeTab === 'Aktif'
                ? org.status_aktif
                : !org.status_aktif;

        return matchesSearch && matchesStatus;
    });

    const handleToggleStatus = (id: number, currentStatus: boolean, name: string) => {
        const actionText = currentStatus ? 'menonaktifkan' : 'mengaktifkan';
        if (confirm(`Apakah Anda yakin ingin ${actionText} organisasi "${name}"?`)) {
            router.patch(`/admin/organisasi/${id}/toggle`, {}, {
                preserveScroll: true
            });
        }
    };

    const handleDeleteOrganisasi = (id: number, name: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus/menonaktifkan organisasi "${name}"? Tindakan ini menggunakan Soft Delete.`)) {
            router.delete(`/admin/organisasi/${id}`, {
                preserveScroll: true
            });
        }
    };

    return (
        <main className="p-margin-desktop max-w-container-max mx-auto w-full space-y-gutter">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-unit-md mb-unit-xl">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary">Manajemen Organisasi</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                        Kelola unit kegiatan mahasiswa (UKM) aktif, profil pengurus, dan status operasional.
                    </p>
                </div>
                <div className="flex gap-unit-sm w-full md:w-auto">
                    <Link
                        href={admin.organisasi.create()}
                        className="bg-primary text-on-primary px-6 py-3 h-auto rounded-lg font-label-lg flex items-center justify-center gap-2 shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none w-full md:w-auto decoration-none font-semibold"
                    >
                        <PlusCircle className="h-[18px] w-[18px]" />
                        Tambah UKM Baru
                    </Link>
                </div>
            </header>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-unit-xl">
                <Card className="bg-surface-container-lowest p-unit-lg rounded-xl shadow-[0px_2px_4px_rgba(26,54,93,0.05)] border border-outline-variant flex flex-col justify-between h-32 ring-0">
                    <div className="flex justify-between items-start">
                        <span className="text-primary/70 font-label-md">Total Organisasi (UKM)</span>
                        <Building2 className="text-primary/40 h-5 w-5" />
                    </div>
                    <div className="font-headline-md text-headline-md text-primary font-bold">
                        {totalOrganisasi}
                    </div>
                </Card>
                <Card className="bg-surface-container-lowest p-unit-lg rounded-xl shadow-[0px_2px_4px_rgba(26,54,93,0.05)] border border-outline-variant flex flex-col justify-between h-32 ring-0">
                    <div className="flex justify-between items-start">
                        <span className="text-green-700 font-label-md">Organisasi Aktif</span>
                        <CheckCircle2 className="text-green-700/40 h-5 w-5" />
                    </div>
                    <div className="font-headline-md text-headline-md text-green-700 font-bold">
                        {totalActive}
                    </div>
                </Card>
                <Card className="bg-surface-container-lowest p-unit-lg rounded-xl shadow-[0px_2px_4px_rgba(26,54,93,0.05)] border border-outline-variant flex flex-col justify-between h-32 ring-0">
                    <div className="flex justify-between items-start">
                        <span className="text-error font-label-md">Organisasi Nonaktif</span>
                        <XCircle className="text-error/40 h-5 w-5" />
                    </div>
                    <div className="font-headline-md text-headline-md text-error font-bold">
                        {totalInactive}
                    </div>
                </Card>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-surface-container-lowest rounded-xl shadow-[0px_2px_4px_rgba(26,54,93,0.05)] border border-outline-variant p-unit-md mb-unit-lg flex flex-col sm:flex-row justify-between items-center gap-unit-md">
                {/* Status Tab Filters */}
                <div className="flex p-1 bg-surface-container-low rounded-lg w-full sm:w-auto overflow-x-auto">
                    {(['Semua', 'Aktif', 'Nonaktif'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-md font-label-lg transition-all text-nowrap cursor-pointer ${activeTab === tab
                                ? 'bg-white shadow-sm text-primary font-semibold'
                                : 'text-on-surface-variant hover:text-primary'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant h-4 w-4" />
                    <input
                        className="w-full pl-10 pr-4 py-2 bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-sm text-on-background"
                        placeholder="Cari nama organisasi..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Organizations Table */}
            <Card className="bg-surface-container-lowest rounded-xl shadow-[0px_2px_4px_rgba(26,54,93,0.05)] border border-outline-variant overflow-hidden ring-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low border-b border-outline-variant">
                                <th className="px-unit-lg py-4 font-label-lg text-primary uppercase tracking-wider">Logo & Nama UKM</th>
                                <th className="px-unit-lg py-4 font-label-lg text-primary uppercase tracking-wider">Periode Aktif</th>
                                <th className="px-unit-lg py-4 font-label-lg text-primary uppercase tracking-wider">Anggota Terdaftar</th>
                                <th className="px-unit-lg py-4 font-label-lg text-primary uppercase tracking-wider">Status Operasional</th>
                                <th className="px-unit-lg py-4 font-label-lg text-primary uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/50">
                            {filteredOrganisasi.map((org) => {
                                const latestProfile = org.profil_organisasi?.[0];
                                const hasLogo = !!latestProfile?.logo_organisasi;
                                const logoUrl = hasLogo ? `/storage/${latestProfile.logo_organisasi}` : null;
                                const period = latestProfile?.periode_kepengurusan || 'Belum diatur';

                                return (
                                    <tr key={org.id_organisasi} className="hover:bg-primary/[0.02] transition-colors group">
                                        {/* Name & Logo */}
                                        <td className="px-unit-lg py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full border border-outline-variant bg-surface flex items-center justify-center overflow-hidden shrink-0">
                                                    {logoUrl ? (
                                                        <img
                                                            src={logoUrl}
                                                            alt={`${org.nama_organisasi} logo`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Building2 className="h-5 w-5 text-primary/60" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <Link
                                                        href={admin.organisasi.profil(org.id_organisasi)}
                                                        className="font-body-md font-semibold text-primary hover:underline decoration-none"
                                                    >
                                                        {org.nama_organisasi}
                                                    </Link>
                                                    <span className="text-[11px] text-on-surface-variant/70">
                                                        ID: {org.id_organisasi}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Period */}
                                        <td className="px-unit-lg py-4 font-body-sm text-on-surface-variant">
                                            {period}
                                        </td>

                                        {/* Registered Members count */}
                                        <td className="px-unit-lg py-4">
                                            <div className="flex items-center gap-1.5 font-body-sm text-on-surface-variant">
                                                <Users className="h-4 w-4 text-primary/60" />
                                                <span>{org.anggota_organisasi_count ?? 0} Anggota</span>
                                            </div>
                                        </td>

                                        {/* Active Status Badge */}
                                        <td className="px-unit-lg py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-[12px] font-semibold flex items-center gap-1.5 w-fit ${org.status_aktif
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full ${org.status_aktif ? 'bg-green-700' : 'bg-red-700'}`} />
                                                {org.status_aktif ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-unit-lg py-4 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                {/* View Profile History */}
                                                <Link
                                                    href={admin.organisasi.profil(org.id_organisasi)}
                                                    className="p-2 text-primary hover:bg-primary-fixed rounded-lg transition-colors cursor-pointer display-inline-block"
                                                    title="Lihat Riwayat Profil & Pembina"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>

                                                {/* Toggle status */}
                                                <button
                                                    onClick={() => handleToggleStatus(org.id_organisasi, org.status_aktif, org.nama_organisasi)}
                                                    className={`p-2 rounded-lg transition-colors cursor-pointer ${org.status_aktif
                                                        ? 'text-amber-600 hover:bg-amber-50'
                                                        : 'text-green-700 hover:bg-green-50'
                                                    }`}
                                                    title={org.status_aktif ? 'Nonaktifkan UKM' : 'Aktifkan UKM'}
                                                >
                                                    <Power className="h-4 w-4" />
                                                </button>

                                                {/* Delete button (Soft Delete) */}
                                                <button
                                                    onClick={() => handleDeleteOrganisasi(org.id_organisasi, org.nama_organisasi)}
                                                    className="p-2 text-error hover:bg-error-container rounded-lg transition-colors cursor-pointer"
                                                    title="Hapus / Soft Delete UKM"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredOrganisasi.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-unit-lg py-8 text-center text-on-surface-variant font-body-md">
                                        Tidak ada organisasi yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-unit-lg py-4 bg-surface-container-low border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-unit-md">
                    <span className="font-body-sm text-on-surface-variant">
                        Menampilkan 1-{filteredOrganisasi.length} dari {filteredOrganisasi.length} data
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            className="p-2 rounded-lg hover:bg-surface-container-highest transition-colors text-on-surface-variant disabled:opacity-30 cursor-pointer"
                            disabled
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-label-md cursor-pointer">1</button>
                        <button
                            className="p-2 rounded-lg hover:bg-surface-container-highest transition-colors text-on-surface-variant disabled:opacity-30 cursor-pointer"
                            disabled
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </Card>

            {/* Guide & Informational Section */}
            <div className="mt-unit-xl grid grid-cols-1 md:grid-cols-3 gap-gutter">
                <div className="md:col-span-2 relative overflow-hidden bg-primary text-on-primary p-unit-xl rounded-xl shadow-lg">
                    <div className="relative z-10 max-w-md">
                        <h3 className="font-headline-md text-headline-md mb-2">Panduan Administrasi UKM</h3>
                        <p className="font-body-md opacity-80 mb-6 font-normal">
                            Menonaktifkan organisasi akan membatasi pengurus dalam mengajukan kegiatan baru. Soft delete digunakan agar data historis laporan keuangan dan administrasi lama tetap tersimpan dengan baik di sistem.
                        </p>
                        <a className="inline-flex items-center gap-2 font-label-lg text-secondary-fixed hover:underline decoration-none" href="#">
                            Lihat SOP Tata Kelola Organisasi
                            <ArrowRight className="h-[18px] w-[18px]" />
                        </a>
                    </div>
                    <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20"></div>
                    <div className="absolute right-12 bottom-0 w-32 h-32 bg-white/5 rounded-full mb-8"></div>
                </div>
                <div className="bg-surface-container-lowest p-unit-lg rounded-xl shadow-[0px_2px_4px_rgba(26,54,93,0.05)] border border-outline-variant flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center mb-4 text-primary">
                        <HelpCircle className="h-10 w-10" />
                    </div>
                    <h4 className="font-headline-sm text-primary mb-2">Butuh Bantuan?</h4>
                    <p className="font-body-sm text-on-surface-variant mb-4">
                        Hubungi Biro Kemahasiswaan jika ada pergantian struktur organisasi besar yang memerlukan penyesuaian database manual.
                    </p>
                    <button className="w-full border-2 border-primary text-primary font-label-lg py-2 rounded-lg hover:bg-primary-fixed transition-colors cursor-pointer font-semibold">
                        Kontak Support
                    </button>
                </div>
            </div>
        </main>
    );
}
