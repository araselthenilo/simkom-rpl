import { Head, Link } from '@inertiajs/react';
import {
    Building2,
    Users2,
    Search,
    ArrowLeft,
    Phone,
    ShieldAlert,
} from 'lucide-react';
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { detail } from '@/routes/organisasi';

interface Mahasiswa {
    nim: string;
    nama_lengkap: string;
    program_studi: string;
    nomor_telepon: string | null;
}

interface AnggotaOrganisasi {
    id_keanggotaan: number;
    id_organisasi: number;
    nim: string;
    mahasiswa?: Mahasiswa;
}

interface Organisasi {
    id_organisasi: number;
    nama_organisasi: string;
}

interface ProfilOrganisasi {
    id_profil: number;
    id_organisasi: number;
    periode_kepengurusan: string;
    logo_organisasi: string | null;
    status_aktif: boolean;
}

interface Pengurus {
    id_pengurus: number;
    id_profil: number;
    id_keanggotaan: number;
    jabatan: string;
    status_aktif: boolean;
    anggota_organisasi?: AnggotaOrganisasi;
}

interface PengurusPageProps {
    organisasi: Organisasi;
    profil: ProfilOrganisasi | null;
    pengurusList: Pengurus[];
    statusKeanggotaan: string | null;
}

export default function PengurusPage({
    organisasi,
    profil,
    pengurusList = [],
}: PengurusPageProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPengurus = pengurusList.filter((p) => {
        const student = p.anggota_organisasi?.mahasiswa;
        const name = student?.nama_lengkap?.toLowerCase() || '';
        const nim = student?.nim?.toLowerCase() || '';
        const jabatan = p.jabatan?.toLowerCase() || '';

        return (
            name.includes(searchTerm.toLowerCase()) ||
            nim.includes(searchTerm.toLowerCase()) ||
            jabatan.includes(searchTerm.toLowerCase())
        );
    });

    const getInitials = (name: string) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    const getRoleBadgeColor = (role: string) => {
        const r = role.toLowerCase();
        if (r.includes('ketua')) {
            return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20';
        }
        if (r.includes('sekretaris')) {
            return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20';
        }
        if (r.includes('bendahara')) {
            return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20';
        }
        return 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border border-slate-500/20';
    };

    return (
        <>
            <Head title={`Pengurus - ${organisasi.nama_organisasi}`} />
            <main className="animate-fade-in mx-auto w-full max-w-container-max space-y-gutter p-margin-desktop">
                {/* Back Link & Header */}
                <header className="mb-unit-xl flex flex-col gap-unit-md border-b border-outline-variant pb-6">
                    <Link
                        href={detail(organisasi.id_organisasi).url}
                        className="group flex w-fit items-center gap-2 font-label-md text-on-surface-variant transition-colors hover:text-primary"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Kembali ke Profil Organisasi
                    </Link>

                    <div className="mt-2 flex flex-col justify-between gap-unit-md sm:flex-row sm:items-end">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-outline-variant/50 bg-background p-1.5 shadow-sm">
                                {profil?.logo_organisasi ? (
                                    <img
                                        src={`/storage/${profil.logo_organisasi}`}
                                        alt={`${organisasi.nama_organisasi} Logo`}
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <Building2 className="h-8 w-8 text-primary/40" />
                                )}
                            </div>
                            <div>
                                <h1 className="font-headline-lg text-headline-lg font-bold text-foreground">
                                    Pengurus Organisasi
                                </h1>
                                <p className="mt-0.5 font-body-md text-on-surface-variant">
                                    {organisasi.nama_organisasi}
                                </p>
                            </div>
                        </div>

                        {profil && (
                            <span className="w-fit rounded-full bg-secondary-container px-4 py-1.5 text-label-md font-semibold text-on-secondary-container">
                                Periode {profil.periode_kepengurusan}
                            </span>
                        )}
                    </div>
                </header>

                {/* Search & Stats Bar */}
                <div className="flex flex-col items-center justify-between gap-unit-md rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-md shadow-sm sm:flex-row">
                    <div className="flex items-center gap-3">
                        <Users2 className="h-5 w-5 text-primary" />
                        <span className="font-label-lg font-semibold text-foreground">
                            {filteredPengurus.length} Pengurus Terdaftar
                        </span>
                    </div>

                    <div className="relative w-full sm:w-80">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                        <input
                            className="w-full rounded-lg border border-outline-variant bg-background py-2 pr-4 pl-10 font-body-sm text-on-background transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            placeholder="Cari nama atau jabatan..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grid View */}
                {filteredPengurus.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <ShieldAlert className="mb-4 h-12 w-12 text-on-surface-variant/40" />
                        <h3 className="font-headline-sm text-headline-sm font-semibold text-foreground">
                            Tidak Ada Pengurus
                        </h3>
                        <p className="mx-auto mt-2 max-w-sm font-body-md text-on-surface-variant/80">
                            {searchTerm
                                ? 'Tidak ada pengurus yang cocok dengan kata kunci pencarian Anda.'
                                : 'Belum ada pengurus aktif yang terdaftar untuk organisasi ini pada periode saat ini.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {filteredPengurus.map((p) => {
                            const student = p.anggota_organisasi?.mahasiswa;
                            if (!student) return null;

                            return (
                                <Card
                                    key={p.id_pengurus}
                                    className="group relative overflow-hidden rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
                                >
                                    {/* Top decorative gradient bar */}
                                    <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-primary/60 to-primary" />

                                    <div className="flex flex-col items-center text-center">
                                        {/* Avatar initials with dynamic background colors */}
                                        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-outline-variant bg-gradient-to-br from-primary/5 to-primary/10 shadow-inner">
                                            <span className="font-headline-sm text-headline-sm font-bold text-primary">
                                                {getInitials(student.nama_lengkap)}
                                            </span>
                                        </div>

                                        <h3 className="line-clamp-1 font-headline-sm text-[16px] font-bold text-foreground">
                                            {student.nama_lengkap}
                                        </h3>
                                        <p className="mt-0.5 font-mono text-[11px] text-on-surface-variant/80">
                                            {student.nim}
                                        </p>
                                        <p className="mt-1 line-clamp-1 font-body-sm text-xs text-on-surface-variant">
                                            {student.program_studi}
                                        </p>

                                        <span
                                            className={`mt-4 rounded-full px-3 py-1 text-[11px] font-bold tracking-wide uppercase ${getRoleBadgeColor(
                                                p.jabatan,
                                            )}`}
                                        >
                                            {p.jabatan}
                                        </span>

                                        {student.nomor_telepon && (
                                            <div className="mt-6 w-full border-t border-outline-variant/30 pt-4">
                                                <a
                                                    href={`tel:${student.nomor_telepon}`}
                                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                                                >
                                                    <Phone className="h-3.5 w-3.5" />
                                                    {student.nomor_telepon}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </main>
        </>
    );
}
