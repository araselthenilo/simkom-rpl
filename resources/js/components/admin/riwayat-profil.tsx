import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    Calendar,
    Phone,
    User,
    AlertCircle,
    Award,
    Target
} from 'lucide-react';
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import admin from '@/routes/admin';

interface Pembina {
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
}

export default function RiwayatProfil({ organisasi, profils = [] }: RiwayatProfilProps) {
    const [expandedDescriptions, setExpandedDescriptions] = useState<Record<number, boolean>>({});

    const toggleDescription = (id: number) => {
        setExpandedDescriptions((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <main className="p-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-gutter">
            {/* Header / Breadcrumb */}
            <header className="flex flex-col gap-4">
                <Link
                    href={admin.organisasi()}
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-label-lg decoration-none font-semibold cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Manajemen Organisasi
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-unit-md mt-2 pb-6 border-b border-outline-variant">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="font-headline-lg text-headline-lg text-primary">
                                Riwayat Profil & Pembina
                            </h2>
                            <span
                                className={`px-3 py-1 rounded-full text-[12px] font-semibold flex items-center gap-1.5 w-fit ${organisasi.status_aktif
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                    }`}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${organisasi.status_aktif ? 'bg-green-700' : 'bg-red-700'}`} />
                                {organisasi.status_aktif ? 'Organisasi Aktif' : 'Organisasi Nonaktif'}
                            </span>
                            <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-primary-fixed text-primary flex items-center gap-1.5 w-fit">
                                {profils.length} Periode Terdaftar
                            </span>
                        </div>
                        <p className="font-body-md text-on-surface-variant flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-primary/60" />
                            {organisasi.nama_organisasi} (ID: {organisasi.id_organisasi})
                        </p>
                        <p className="font-body-sm text-on-surface-variant/80 max-w-4xl leading-relaxed">
                            Halaman ini menyajikan rekam jejak profil, visi, misi, serta pembina yang mendampingi <strong>{organisasi.nama_organisasi}</strong> dari periode ke periode kepengurusan.
                        </p>
                    </div>
                </div>
            </header>

            {/* Timeline View - 100% width */}
            <div className="w-full flex flex-col gap-6">
                {profils.length === 0 ? (
                    /* Empty State */
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-xl flex flex-col items-center justify-center text-center py-16 shadow-[0px_2px_4px_rgba(26,54,93,0.05)]">
                        <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-4 border border-outline-variant text-on-surface-variant/60">
                            <Building2 className="h-8 w-8" />
                        </div>
                        <h4 className="font-headline-sm text-primary font-semibold mb-2">
                            Belum Ada Riwayat Profil
                        </h4>
                        <p className="font-body-md text-on-surface-variant max-w-md">
                            Organisasi ini belum memiliki profil yang terdaftar di dalam sistem untuk periode kepengurusan manapun.
                        </p>
                    </div>
                ) : (
                    /* Timeline cards */
                    <div className="relative border-l-2 border-primary/20 pl-10 ml-6 flex flex-col gap-8">
                        {profils.map((profil) => {
                            const hasLogo = !!profil.logo_organisasi;
                            const logoUrl = hasLogo ? `/storage/${profil.logo_organisasi}` : null;
                            const isExpanded = !!expandedDescriptions[profil.id_profil];
                            const desc = profil.deskripsi_organisasi || '';
                            const isLong = desc.length > 250;
                            const displayText = isLong && !isExpanded ? `${desc.substring(0, 250)}...` : desc;

                            return (
                                <div key={profil.id_profil} className="relative group">
                                    <Card className="bg-surface-container-lowest p-unit-lg rounded-xl shadow-[0px_2px_4px_rgba(26,54,93,0.05)] border border-outline-variant hover:shadow-[0px_8px_16px_rgba(26,54,93,0.08)] transition-all duration-300 ring-0">
                                        {/* Card Header: Period & Status */}
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-5 w-5 text-primary/70" />
                                                <span className="font-headline-sm font-bold text-primary">
                                                    Periode Kepengurusan {profil.periode_kepengurusan}
                                                </span>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-[12px] font-semibold flex items-center gap-1.5 ${profil.status_aktif
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                    }`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full ${profil.status_aktif ? 'bg-green-700' : 'bg-red-700'}`} />
                                                {profil.status_aktif ? 'Profil Aktif' : 'Profil Nonaktif'}
                                            </span>
                                        </div>

                                        {/* Card Body Grid */}
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-unit-xl mt-6">
                                            {/* Left Profile Details (Col span 8) */}
                                            <div className="lg:col-span-8 flex flex-col gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-16 h-16 rounded-lg border border-outline-variant bg-surface flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                                        {logoUrl ? (
                                                            <img
                                                                src={logoUrl}
                                                                alt={`${organisasi.nama_organisasi} logo`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <Building2 className="h-8 w-8 text-primary/60" />
                                                        )}
                                                    </div>
                                                    <div className="space-y-1 flex-1">
                                                        <h4 className="font-label-lg font-bold text-primary">Deskripsi Organisasi</h4>
                                                        <p className="font-body-md text-on-surface-variant leading-relaxed">
                                                            {displayText}
                                                        </p>
                                                        {isLong && (
                                                            <button
                                                                onClick={() => toggleDescription(profil.id_profil)}
                                                                className="text-primary font-semibold text-xs mt-1 hover:underline focus:outline-none cursor-pointer border-none bg-transparent p-0"
                                                            >
                                                                {isExpanded ? 'Sembunyikan' : 'Lihat Selengkapnya'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Visi & Misi */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md pt-4">
                                                    {/* Visi */}
                                                    <div className="bg-surface-container-low rounded-xl p-unit-md border border-outline-variant/40 flex flex-col gap-2">
                                                        <div className="flex items-center gap-2 font-label-lg font-bold text-primary">
                                                            <Target className="h-4 w-4 text-primary/80" />
                                                            Visi
                                                        </div>
                                                        <p className="font-body-sm text-on-surface-variant leading-relaxed">
                                                            {profil.visi_organisasi}
                                                        </p>
                                                    </div>

                                                    {/* Misi */}
                                                    <div className="bg-surface-container-low rounded-xl p-unit-md border border-outline-variant/40 flex flex-col gap-2">
                                                        <div className="flex items-center gap-2 font-label-lg font-bold text-primary">
                                                            <Award className="h-4 w-4 text-primary/80" />
                                                            Misi
                                                        </div>
                                                        <p className="font-body-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
                                                            {profil.misi_organisasi}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Pembina Section (Col span 4) */}
                                            <div className="lg:col-span-4 pt-6 flex flex-col gap-4">
                                                <h4 className="font-label-lg font-bold text-primary flex items-center gap-2">
                                                    <User className="h-4 w-4 text-primary/80" />
                                                    Pembina Organisasi
                                                </h4>

                                                {profil.pembina && profil.pembina.length > 0 ? (
                                                    <div className="flex flex-col gap-3">
                                                        {profil.pembina.map((p) => (
                                                            <div
                                                                key={p.nip_pembina}
                                                                className="bg-surface-container-low rounded-xl p-unit-md border border-outline-variant/50 flex flex-col gap-2 hover:bg-surface-container-high transition-colors"
                                                            >
                                                                <div>
                                                                    <p className="font-body-md font-semibold text-primary">
                                                                        {p.nama_lengkap}
                                                                    </p>
                                                                    <p className="text-[11px] text-on-surface-variant/70">
                                                                        NIP: {p.nip_pembina}
                                                                    </p>
                                                                </div>
                                                                {p.nomor_telepon ? (
                                                                    <a
                                                                        href={`tel:${p.nomor_telepon}`}
                                                                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold decoration-none cursor-pointer pt-1"
                                                                    >
                                                                        <Phone className="h-3.5 w-3.5" />
                                                                        {p.nomor_telepon}
                                                                    </a>
                                                                ) : (
                                                                    <p className="text-xs text-on-surface-variant/50 italic pt-1">
                                                                        Tidak ada nomor telepon
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl p-unit-md flex items-start gap-2 text-amber-800 dark:text-amber-300">
                                                        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                                        <p className="font-body-sm">
                                                            Tidak ada Pembina yang ditugaskan untuk periode kepengurusan ini.
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
