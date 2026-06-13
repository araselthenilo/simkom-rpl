import { Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    Calendar,
    Phone,
    User,
    AlertCircle,
    Award,
    Target,
    Edit,
    Plus,
    Trash2,
    Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import pembina from '@/routes/pembina';

interface Pembina {
    id_pembinaan?: number;
    nip_pembina: string;
    username: string;
    nama_lengkap: string;
    nomor_telepon: string;
}

interface Profil {
    id_profil: number;
    id_organisasi: number;
    periode_kepengurusan: string;
    logo_organisasi: string;
    deskripsi_organisasi: string;
    visi_organisasi: string;
    misi_organisasi: string;
    status_aktif: boolean;
    created_at: string;
    updated_at: string;
    pembina?: Pembina[];
}

interface RiwayatProfilProps {
    organisasi: {
        id_organisasi: number;
        nama_organisasi: string;
        status_aktif: boolean;
    };
    profils?: Profil[];
    allPembina?: Pembina[];
}

export default function RiwayatProfil({
    organisasi,
    profils = [],
    allPembina = [],
}: RiwayatProfilProps) {
    const [expandedDescriptions, setExpandedDescriptions] = useState<
        Record<number, boolean>
    >({});

    const toggleDescription = (id: number) => {
        setExpandedDescriptions((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <main className="mx-auto flex w-full max-w-container-max flex-col gap-gutter p-margin-desktop">
            {/* Header / Breadcrumb */}
            <header className="flex flex-col gap-4">
                <Link
                    href={pembina.organisasi()}
                    className="decoration-none inline-flex cursor-pointer items-center gap-2 font-label-lg font-semibold text-primary transition-colors hover:text-primary/80"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Manajemen Organisasi
                </Link>

                <div className="mt-2 flex flex-col items-start justify-between gap-unit-md border-b border-outline-variant pb-6 md:flex-row md:items-end">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-3">
                            <h2 className="font-headline-lg text-headline-lg text-primary">
                                Riwayat Profil & Pembina
                            </h2>
                            <span
                                className={`flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold ${
                                    organisasi.status_aktif
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                }`}
                            >
                                <span
                                    className={`h-1.5 w-1.5 rounded-full ${organisasi.status_aktif ? 'bg-green-700' : 'bg-red-700'}`}
                                />
                                {organisasi.status_aktif
                                    ? 'Organisasi Aktif'
                                    : 'Organisasi Nonaktif'}
                            </span>
                            <span className="flex w-fit items-center gap-1.5 rounded-full bg-primary-fixed px-3 py-1 text-[12px] font-semibold text-primary">
                                {profils.length} Periode Terdaftar
                            </span>
                        </div>
                        <p className="flex items-center gap-2 font-body-md text-on-surface-variant">
                            <Building2 className="h-4 w-4 text-primary/60" />
                            {organisasi.nama_organisasi} (ID:{' '}
                            {organisasi.id_organisasi})
                        </p>
                        <p className="max-w-4xl font-body-sm leading-relaxed text-on-surface-variant/80">
                            Halaman ini menyajikan rekam jejak profil, visi,
                            misi, serta pembina yang mendampingi{' '}
                            <strong>{organisasi.nama_organisasi}</strong> dari
                            periode ke periode kepengurusan.
                        </p>
                    </div>

                    <div className="mt-2 shrink-0 md:mt-0">
                        <Link
                            href={pembina.profilOrganisasi.create(
                                organisasi.id_organisasi,
                            )}
                            className="decoration-none inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary shadow-sm transition-all hover:opacity-90 active:scale-95"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Profil Baru
                        </Link>
                    </div>
                </div>
            </header>

            {/* Timeline View - 100% width */}
            <div className="flex w-full flex-col gap-6">
                {profils.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-xl py-16 text-center shadow-[0px_2px_4px_rgba(26,54,93,0.05)]">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-outline-variant bg-surface-container-low text-on-surface-variant/60">
                            <Building2 className="h-8 w-8" />
                        </div>
                        <h4 className="mb-2 font-headline-sm font-semibold text-primary">
                            Belum Ada Riwayat Profil
                        </h4>
                        <p className="max-w-md font-body-md text-on-surface-variant">
                            Organisasi ini belum memiliki profil yang terdaftar
                            di dalam sistem untuk periode kepengurusan manapun.
                        </p>
                    </div>
                ) : (
                    /* Timeline cards */
                    <div className="relative ml-6 flex flex-col gap-8 border-l-2 border-primary/20 pl-10">
                        {profils.map((profil) => {
                            const hasLogo = !!profil.logo_organisasi;
                            const logoUrl = hasLogo
                                ? `/storage/${profil.logo_organisasi}`
                                : null;
                            const isExpanded =
                                !!expandedDescriptions[profil.id_profil];
                            const desc = profil.deskripsi_organisasi || '';
                            const isLong = desc.length > 250;
                            const displayText =
                                isLong && !isExpanded
                                    ? `${desc.substring(0, 250)}...`
                                    : desc;

                            return (
                                <div
                                    key={profil.id_profil}
                                    className="group relative"
                                >
                                    <Card className="rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-[0px_2px_4px_rgba(26,54,93,0.05)] ring-0 transition-all duration-300 hover:shadow-[0px_8px_16px_rgba(26,54,93,0.08)]">
                                        {/* Card Header: Period & Status */}
                                        <div className="flex flex-col items-start justify-between gap-3 pb-4 sm:flex-row sm:items-center">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-5 w-5 text-primary/70" />
                                                <span className="font-headline-sm font-bold text-primary">
                                                    Periode Kepengurusan{' '}
                                                    {
                                                        profil.periode_kepengurusan
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold ${
                                                        profil.status_aktif
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                    }`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${profil.status_aktif ? 'bg-green-700' : 'bg-red-700'}`}
                                                    />
                                                    {profil.status_aktif
                                                        ? 'Profil Aktif'
                                                        : 'Profil Nonaktif'}
                                                </span>
                                                <Link
                                                    href={pembina.profilOrganisasi.pengurus(
                                                        profil.id_profil,
                                                    )}
                                                    className="hover:bg-surface-variant decoration-none inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-outline px-3 py-1 text-xs font-semibold text-primary transition-colors"
                                                >
                                                    <Users className="h-3.5 w-3.5" />
                                                    Lihat Pengurus
                                                </Link>
                                                <Link
                                                    href={pembina.profilOrganisasi.edit(
                                                        profil.id_profil,
                                                    )}
                                                    className="hover:bg-surface-variant decoration-none inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-outline px-3 py-1 text-xs font-semibold text-primary transition-colors"
                                                >
                                                    <Edit className="h-3.5 w-3.5" />
                                                    Edit Profil
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Card Body Grid */}
                                        <div className="grid grid-cols-1 gap-unit-xl lg:grid-cols-12">
                                            {/* Left Profile Details (Col span 8) */}
                                            <div className="flex flex-col gap-4 lg:col-span-8">
                                                <div className="flex items-start gap-4">
                                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-outline-variant bg-surface shadow-sm">
                                                        {logoUrl ? (
                                                            <img
                                                                src={logoUrl}
                                                                alt={`${organisasi.nama_organisasi} logo`}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <Building2 className="h-8 w-8 text-primary/60" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <h4 className="font-label-lg font-bold text-primary">
                                                            Deskripsi Organisasi
                                                        </h4>
                                                        <p className="font-body-md leading-relaxed text-on-surface-variant">
                                                            {displayText}
                                                        </p>
                                                        {isLong && (
                                                            <button
                                                                onClick={() =>
                                                                    toggleDescription(
                                                                        profil.id_profil,
                                                                    )
                                                                }
                                                                className="mt-1 cursor-pointer border-none bg-transparent p-0 text-xs font-semibold text-primary hover:underline focus:outline-none"
                                                            >
                                                                {isExpanded
                                                                    ? 'Sembunyikan'
                                                                    : 'Lihat Selengkapnya'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Visi & Misi */}
                                                <div className="grid grid-cols-1 gap-unit-md pt-4 md:grid-cols-2">
                                                    {/* Visi */}
                                                    <div className="flex flex-col gap-2 rounded-xl border border-outline-variant/40 bg-surface-container-low p-unit-md">
                                                        <div className="flex items-center gap-2 font-label-lg font-bold text-primary">
                                                            <Target className="h-4 w-4 text-primary/80" />
                                                            Visi
                                                        </div>
                                                        <p className="font-body-sm leading-relaxed text-on-surface-variant">
                                                            {
                                                                profil.visi_organisasi
                                                            }
                                                        </p>
                                                    </div>

                                                    {/* Misi */}
                                                    <div className="flex flex-col gap-2 rounded-xl border border-outline-variant/40 bg-surface-container-low p-unit-md">
                                                        <div className="flex items-center gap-2 font-label-lg font-bold text-primary">
                                                            <Award className="h-4 w-4 text-primary/80" />
                                                            Misi
                                                        </div>
                                                        <p className="font-body-sm leading-relaxed whitespace-pre-line text-on-surface-variant">
                                                            {
                                                                profil.misi_organisasi
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Pembina Section (Col span 4) */}
                                            <div className="flex flex-col gap-4 pt-6 lg:col-span-4">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="flex items-center gap-2 font-label-lg font-bold text-primary">
                                                        <User className="h-4 w-4 text-primary/80" />
                                                        Pembina Organisasi
                                                    </h4>
                                                </div>

                                                {profil.pembina &&
                                                profil.pembina.length > 0 ? (
                                                    <div className="flex flex-col gap-3">
                                                        {profil.pembina.map(
                                                            (p) => (
                                                                <div
                                                                    key={
                                                                        p.nip_pembina
                                                                    }
                                                                    className="group/pembina relative flex flex-col gap-2 rounded-xl border border-outline-variant/50 bg-surface-container-low p-unit-md transition-colors hover:bg-surface-container-high"
                                                                >
                                                                    <div className="flex items-start justify-between gap-2">
                                                                        <div>
                                                                            <p className="font-body-md font-semibold text-primary">
                                                                                {
                                                                                    p.nama_lengkap
                                                                                }
                                                                            </p>
                                                                            <p className="text-[11px] text-on-surface-variant/70">
                                                                                NIP:{' '}
                                                                                {
                                                                                    p.nip_pembina
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    {p.nomor_telepon ? (
                                                                        <a
                                                                            href={`tel:${p.nomor_telepon}`}
                                                                            className="decoration-none inline-flex w-fit cursor-pointer items-center gap-1.5 pt-1 text-xs font-semibold text-primary hover:underline"
                                                                        >
                                                                            <Phone className="h-3.5 w-3.5" />
                                                                            {
                                                                                p.nomor_telepon
                                                                            }
                                                                        </a>
                                                                    ) : (
                                                                        <p className="pt-1 text-xs text-on-surface-variant/50 italic">
                                                                            Tidak
                                                                            ada
                                                                            nomor
                                                                            telepon
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-unit-md text-amber-800 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-300">
                                                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                                                        <p className="font-body-sm">
                                                            Tidak ada Pembina
                                                            yang ditugaskan
                                                            untuk periode
                                                            kepengurusan ini.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>


        </main>
    );
}
