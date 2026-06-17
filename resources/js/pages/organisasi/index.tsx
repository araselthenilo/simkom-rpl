import { Head, Link } from '@inertiajs/react';
import {
    Building2,
    Clock,
    ChevronRight,
    ChevronDown,
    Compass,
    XCircle,
} from 'lucide-react';
import React from 'react';
import OrganisasiSaya from '@/components/beranda/organisasi-saya';
import {
    detail,
    pengurus as organisasiPengurus,
    kegiatan as organisasiKegiatan,
    keuangan as organisasiKeuangan,
} from '@/routes/organisasi';

interface Organization {
    id: number;
    name: string;
    logo?: string;
    description?: string;
    tanggal_daftar?: string;
    status?: string | null;
}

interface IndexProps {
    followed: any[];
    applied: Organization[];
    joinable: Organization[];
}

export default function Index({ followed, applied, joinable }: IndexProps) {
    const [expandedOrgs, setExpandedOrgs] = React.useState<
        Record<number, boolean>
    >({});

    const toggleExpand = (id: number) => {
        setExpandedOrgs((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <>
            <Head title="Daftar Organisasi" />
            <main className="animate-fade-in w-full space-y-12 pb-16">
                {/* Hero / Header Section */}
                <div className="border-b border-outline-variant/30 bg-gradient-to-br from-primary/10 via-background to-background py-12 md:py-16">
                    <div className="mx-auto max-w-container-max px-margin-desktop">
                        <div className="flex flex-col gap-3 md:max-w-2xl">
                            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-label-md font-semibold text-primary">
                                <Compass className="h-4 w-4" /> Direktori Kampus
                            </span>
                            <h1 className="font-headline-lg text-headline-lg font-bold text-foreground">
                                Eksplorasi Organisasi
                            </h1>
                            <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
                                Temukan, ikuti, dan kembangkan minat bakat Anda
                                melalui berbagai Unit Kegiatan Mahasiswa (UKM)
                                dan Himpunan Mahasiswa di ITB SIMKOM STIKOM
                                Bali.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 1: Organisasi Saya (Followed / Joined) */}
                <OrganisasiSaya organizations={followed} />

                {/* Section 2: Pengajuan Keanggotaan (Applied / Pending) */}
                {applied.length > 0 && (
                    <section className="border-t border-outline-variant/40 py-8">
                        <div className="mx-auto max-w-container-max px-margin-desktop">
                            <div className="mb-6">
                                <h2 className="font-headline-md text-headline-md font-bold text-primary">
                                    Pengajuan Keanggotaan
                                </h2>
                                <p className="font-body-md text-on-surface-variant">
                                    Pendaftaran yang saat ini sedang menunggu
                                    persetujuan dari pengurus
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {applied.map((org) => (
                                    <div
                                        key={org.id}
                                        className="group flex flex-col justify-between rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
                                    >
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-container-high">
                                                    {org.logo ? (
                                                        <img
                                                            src={`/storage/${org.logo}`}
                                                            alt={`${org.name} Logo`}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <Building2 className="h-6 w-6 text-primary/60" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="truncate font-headline-sm text-headline-sm font-semibold text-foreground">
                                                        {org.name}
                                                    </h3>
                                                    <span className="text-label-sm mt-1 inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 font-medium text-amber-700 dark:text-amber-400">
                                                        <Clock className="h-3 w-3 animate-pulse" />{' '}
                                                        Diproses
                                                    </span>
                                                    <span className="text-label-xs mt-1 block text-on-surface-variant/80">
                                                        Diajukan:{' '}
                                                        {org.tanggal_daftar}
                                                    </span>
                                                </div>
                                            </div>

                                            {org.description && (
                                                <p className="line-clamp-2 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
                                                    {org.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-6 flex flex-col gap-3 border-t border-outline-variant/30 pt-4">
                                            <div className="flex items-center justify-between">
                                                <button
                                                    onClick={() =>
                                                        toggleExpand(org.id)
                                                    }
                                                    className="inline-flex cursor-pointer items-center gap-1 text-label-md font-semibold text-on-surface-variant transition-colors hover:text-primary"
                                                >
                                                    {expandedOrgs[org.id]
                                                        ? 'Sembunyikan Menu'
                                                        : 'Tampilkan Menu'}
                                                    <ChevronDown
                                                        className={`h-4 w-4 transition-transform duration-200 ${
                                                            expandedOrgs[org.id]
                                                                ? 'rotate-180'
                                                                : ''
                                                        }`}
                                                    />
                                                </button>
                                                <Link
                                                    href={detail(org.id)}
                                                    className="hover:text-primary-dim inline-flex items-center gap-1 text-label-md font-semibold text-primary transition-colors"
                                                >
                                                    Lihat Profil{' '}
                                                    <ChevronRight className="h-4 w-4" />
                                                </Link>
                                            </div>
                                            {expandedOrgs[org.id] && (
                                                <div className="animate-fade-in flex flex-wrap items-center gap-4 border-t border-dashed border-outline-variant/30 pt-3">
                                                    <Link
                                                        href={
                                                            organisasiKeuangan(
                                                                org.id,
                                                            ).url
                                                        }
                                                        className="hover:text-primary-dim inline-flex items-center gap-1 text-label-md font-semibold text-primary/80 transition-colors"
                                                    >
                                                        Lihat Keuangan
                                                    </Link>
                                                    <Link
                                                        href={
                                                            organisasiKegiatan(
                                                                org.id,
                                                            ).url
                                                        }
                                                        className="hover:text-primary-dim inline-flex items-center gap-1 text-label-md font-semibold text-primary/80 transition-colors"
                                                    >
                                                        Lihat Kegiatan
                                                    </Link>
                                                    <Link
                                                        href={
                                                            organisasiPengurus(
                                                                org.id,
                                                            ).url
                                                        }
                                                        className="hover:text-primary-dim inline-flex items-center gap-1 text-label-md font-semibold text-primary/80 transition-colors"
                                                    >
                                                        Lihat Pengurus
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Section 3: Organisasi yang Dapat Diikuti */}
                <section className="border-t border-outline-variant/40 py-8">
                    <div className="mx-auto max-w-container-max px-margin-desktop">
                        <div className="mb-6">
                            <h2 className="font-headline-md text-headline-md font-bold text-primary">
                                Organisasi yang Dapat Diikuti
                            </h2>
                            <p className="font-body-md text-on-surface-variant">
                                Temukan organisasi baru yang cocok dengan minat
                                dan bakat Anda
                            </p>
                        </div>

                        {joinable.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-outline-variant/60 bg-surface-container-low p-12 text-center">
                                <Building2 className="mx-auto h-12 w-12 text-on-surface-variant/50" />
                                <h3 className="mt-4 font-headline-sm text-headline-sm font-semibold text-foreground">
                                    Tidak Ada Organisasi Baru
                                </h3>
                                <p className="mx-auto mt-2 max-w-md font-body-md text-on-surface-variant/80">
                                    Anda telah mengikuti atau sedang mendaftar
                                    di semua organisasi aktif yang tersedia saat
                                    ini.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {joinable.map((org) => (
                                    <div
                                        key={org.id}
                                        className="group flex flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
                                    >
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-container-high">
                                                    {org.logo ? (
                                                        <img
                                                            src={`/storage/${org.logo}`}
                                                            alt={`${org.name} Logo`}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <Building2 className="h-6 w-6 text-primary/60" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="truncate font-headline-sm text-headline-sm font-semibold text-foreground">
                                                        {org.name}
                                                    </h3>
                                                    {org.status ===
                                                        'Ditolak' && (
                                                        <span className="text-label-sm mt-1 inline-flex items-center gap-1 rounded-full bg-error/10 px-2 py-0.5 font-medium text-error">
                                                            <XCircle className="h-3 w-3" />{' '}
                                                            Pendaftaran Ditolak
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {org.description ? (
                                                <p className="line-clamp-3 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
                                                    {org.description}
                                                </p>
                                            ) : (
                                                <p className="font-body-sm text-body-sm text-on-surface-variant/60 italic">
                                                    Tidak ada deskripsi
                                                    organisasi.
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-6 flex flex-col gap-3 border-t border-outline-variant/30 pt-4">
                                            <div className="flex items-center justify-between">
                                                <button
                                                    onClick={() =>
                                                        toggleExpand(org.id)
                                                    }
                                                    className="inline-flex cursor-pointer items-center gap-1 text-label-md font-semibold text-on-surface-variant transition-colors hover:text-primary"
                                                >
                                                    {expandedOrgs[org.id]
                                                        ? 'Sembunyikan Menu'
                                                        : 'Tampilkan Menu'}
                                                    <ChevronDown
                                                        className={`h-4 w-4 transition-transform duration-200 ${
                                                            expandedOrgs[org.id]
                                                                ? 'rotate-180'
                                                                : ''
                                                        }`}
                                                    />
                                                </button>
                                                <Link
                                                    href={detail(org.id)}
                                                    className="hover:text-primary-dim inline-flex items-center gap-1 text-label-md font-semibold text-primary transition-colors"
                                                >
                                                    Lihat Profil{' '}
                                                    <ChevronRight className="h-4 w-4" />
                                                </Link>
                                            </div>
                                            {expandedOrgs[org.id] && (
                                                <div className="animate-fade-in flex flex-wrap items-center gap-4 border-t border-dashed border-outline-variant/30 pt-3">
                                                    <Link
                                                        href={
                                                            organisasiKeuangan(
                                                                org.id,
                                                            ).url
                                                        }
                                                        className="hover:text-primary-dim inline-flex items-center gap-1 text-label-md font-semibold text-primary/80 transition-colors"
                                                    >
                                                        Lihat Keuangan
                                                    </Link>
                                                    <Link
                                                        href={
                                                            organisasiKegiatan(
                                                                org.id,
                                                            ).url
                                                        }
                                                        className="hover:text-primary-dim inline-flex items-center gap-1 text-label-md font-semibold text-primary/80 transition-colors"
                                                    >
                                                        Lihat Kegiatan
                                                    </Link>
                                                    <Link
                                                        href={
                                                            organisasiPengurus(
                                                                org.id,
                                                            ).url
                                                        }
                                                        className="hover:text-primary-dim inline-flex items-center gap-1 text-label-md font-semibold text-primary/80 transition-colors"
                                                    >
                                                        Lihat Pengurus
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}
