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
    ArrowRight,
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import pembina from '@/routes/pembina';

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

export default function ManajemenOrganisasi({
    organisasi = [],
}: ManajemenOrganisasiProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'Semua' | 'Aktif' | 'Nonaktif'>(
        'Semua',
    );

    // Metrics calculations
    const totalOrganisasi = organisasi.length;
    const totalActive = organisasi.filter((o) => o.status_aktif).length;
    const totalInactive = organisasi.filter((o) => !o.status_aktif).length;

    // Filter organizations list
    const filteredOrganisasi = organisasi.filter((org) => {
        const matchesSearch = org.nama_organisasi
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesStatus =
            activeTab === 'Semua'
                ? true
                : activeTab === 'Aktif'
                  ? org.status_aktif
                  : !org.status_aktif;

        return matchesSearch && matchesStatus;
    });

    return (
        <main className="mx-auto w-full max-w-container-max space-y-gutter p-margin-desktop">
            {/* Header */}
            <header className="mb-unit-xl flex flex-col items-start justify-between gap-unit-md md:flex-row md:items-end">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary">
                        Manajemen Organisasi
                    </h2>
                    <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
                        Kelola unit kegiatan mahasiswa (UKM) aktif, profil
                        pengurus, dan status operasional.
                    </p>
                </div>
                <div className="flex w-full gap-unit-sm md:w-auto"></div>
            </header>

            {/* Metrics Grid */}
            <div className="mb-unit-xl grid grid-cols-1 gap-gutter md:grid-cols-3">
                <Card className="flex h-32 flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-[0px_2px_4px_rgba(26,54,93,0.05)] ring-0">
                    <div className="flex items-start justify-between">
                        <span className="font-label-md text-primary/70">
                            Total Organisasi (UKM)
                        </span>
                        <Building2 className="h-5 w-5 text-primary/40" />
                    </div>
                    <div className="font-headline-md text-headline-md font-bold text-primary">
                        {totalOrganisasi}
                    </div>
                </Card>
                <Card className="flex h-32 flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-[0px_2px_4px_rgba(26,54,93,0.05)] ring-0">
                    <div className="flex items-start justify-between">
                        <span className="font-label-md text-green-700">
                            Organisasi Aktif
                        </span>
                        <CheckCircle2 className="h-5 w-5 text-green-700/40" />
                    </div>
                    <div className="font-headline-md text-headline-md font-bold text-green-700">
                        {totalActive}
                    </div>
                </Card>
                <Card className="flex h-32 flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-[0px_2px_4px_rgba(26,54,93,0.05)] ring-0">
                    <div className="flex items-start justify-between">
                        <span className="font-label-md text-error">
                            Organisasi Nonaktif
                        </span>
                        <XCircle className="h-5 w-5 text-error/40" />
                    </div>
                    <div className="font-headline-md text-headline-md font-bold text-error">
                        {totalInactive}
                    </div>
                </Card>
            </div>

            {/* Filter and Search Bar */}
            <div className="mb-unit-lg flex flex-col items-center justify-between gap-unit-md rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-md shadow-[0px_2px_4px_rgba(26,54,93,0.05)] sm:flex-row">
                {/* Status Tab Filters */}
                <div className="flex w-full overflow-x-auto rounded-lg bg-surface-container-low p-1 sm:w-auto">
                    {(['Semua', 'Aktif', 'Nonaktif'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`cursor-pointer rounded-md px-6 py-2 font-label-lg text-nowrap transition-all ${
                                activeTab === tab
                                    ? 'bg-white font-semibold text-primary shadow-sm'
                                    : 'text-on-surface-variant hover:text-primary'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-80">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                    <input
                        className="w-full rounded-lg border border-outline-variant bg-background py-2 pr-4 pl-10 font-body-sm text-on-background transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Cari nama organisasi..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Organizations Table */}
            <Card className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-[0px_2px_4px_rgba(26,54,93,0.05)] ring-0">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-outline-variant bg-surface-container-low">
                                <th className="px-unit-lg py-4 font-label-lg tracking-wider text-primary uppercase">
                                    Logo & Nama UKM
                                </th>
                                <th className="px-unit-lg py-4 font-label-lg tracking-wider text-primary uppercase">
                                    Periode Aktif
                                </th>
                                <th className="px-unit-lg py-4 font-label-lg tracking-wider text-primary uppercase">
                                    Anggota Terdaftar
                                </th>
                                <th className="px-unit-lg py-4 font-label-lg tracking-wider text-primary uppercase">
                                    Status Operasional
                                </th>
                                <th className="px-unit-lg py-4 text-right font-label-lg tracking-wider text-primary uppercase">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/50">
                            {filteredOrganisasi.map((org) => {
                                const latestProfile =
                                    org.profil_organisasi?.[0];
                                const hasLogo =
                                    !!latestProfile?.logo_organisasi;
                                const logoUrl = hasLogo
                                    ? `/storage/${latestProfile.logo_organisasi}`
                                    : null;
                                const period =
                                    latestProfile?.periode_kepengurusan ||
                                    'Belum diatur';

                                return (
                                    <tr
                                        key={org.id_organisasi}
                                        className="group transition-colors hover:bg-primary/[0.02]"
                                    >
                                        {/* Name & Logo */}
                                        <td className="px-unit-lg py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-surface">
                                                    {logoUrl ? (
                                                        <img
                                                            src={logoUrl}
                                                            alt={`${org.nama_organisasi} logo`}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <Building2 className="h-5 w-5 text-primary/60" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <Link
                                                        href={pembina.organisasi.profil(
                                                            org.id_organisasi,
                                                        )}
                                                        className="decoration-none font-body-md font-semibold text-primary hover:underline"
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
                                                <span>
                                                    {org.anggota_organisasi_count ??
                                                        0}{' '}
                                                    Anggota
                                                </span>
                                            </div>
                                        </td>

                                        {/* Active Status Badge */}
                                        <td className="px-unit-lg py-4">
                                            <span
                                                className={`flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold ${
                                                    org.status_aktif
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${org.status_aktif ? 'bg-green-700' : 'bg-red-700'}`}
                                                />
                                                {org.status_aktif
                                                    ? 'Aktif'
                                                    : 'Nonaktif'}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-unit-lg py-4 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                {/* View Profile History */}
                                                <Link
                                                    href={pembina.organisasi.profil(
                                                        org.id_organisasi,
                                                    )}
                                                    className="display-inline-block cursor-pointer rounded-lg p-2 text-primary transition-colors hover:bg-primary-fixed"
                                                    title="Lihat Riwayat Profil & Pembina"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredOrganisasi.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-unit-lg py-8 text-center font-body-md text-on-surface-variant"
                                    >
                                        Tidak ada organisasi yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col items-center justify-between gap-unit-md border-t border-outline-variant bg-surface-container-low px-unit-lg py-4 md:flex-row">
                    <span className="font-body-sm text-on-surface-variant">
                        Menampilkan 1-{filteredOrganisasi.length} dari{' '}
                        {filteredOrganisasi.length} data
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            className="cursor-pointer rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-highest disabled:opacity-30"
                            disabled
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button className="h-8 w-8 cursor-pointer rounded-lg bg-primary font-label-md text-on-primary">
                            1
                        </button>
                        <button
                            className="cursor-pointer rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-highest disabled:opacity-30"
                            disabled
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </Card>
        </main>
    );
}
