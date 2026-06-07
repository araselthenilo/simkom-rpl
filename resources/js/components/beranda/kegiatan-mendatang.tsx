import { Link } from '@inertiajs/react';
import { Calendar, Check, CreditCard, Heart, Laptop, MapPin, Trophy, ArrowRight } from 'lucide-react';
import { index as kegiatan } from '@/routes/kegiatan';

interface Organisasi {
    id_organisasi: number;
    nama_organisasi: string;
}

interface ProfilOrganisasi {
    id_profil: number;
    id_organisasi: number;
    logo_organisasi: string;
    organisasi: Organisasi;
}

interface Kegiatan {
    id_kegiatan: number;
    id_profil: number;
    nama_kegiatan: string;
    jenis_kegiatan: 'Seminar' | 'Pelatihan' | 'Lomba' | 'Pengabdian Masyarakat';
    deskripsi_kegiatan: string;
    biaya_pendaftaran: number;
    tanggal_pelaksanaan: string;
    lokasi_kegiatan: string;
    kuota_peserta: number;
    status_kegiatan: 'Mendatang' | 'Sedang berlangsung' | 'Selesai' | 'Dibatalkan';
    peserta_kegiatan_count: number;
    profil_organisasi: ProfilOrganisasi;
}

interface KegiatanMendatangProps {
    kegiatanList?: Kegiatan[];
    registrations?: Record<number, number>;
    nim?: string;
}

export default function KegiatanMendatang({
    kegiatanList = [],
    registrations = {},
    nim = '',
}: KegiatanMendatangProps) {
    const getCategoryMeta = (type: Kegiatan['jenis_kegiatan']) => {
        switch (type) {
            case 'Seminar':
                return {
                    icon: <Calendar className="h-5 w-5" />,
                    gradient:
                        'from-blue-500/20 to-indigo-500/20 dark:from-blue-500/10 dark:to-indigo-500/10',
                    border: 'border-blue-200/50 dark:border-blue-900/30',
                    text: 'text-blue-700 dark:text-blue-400',
                    badgeVariant: 'default' as const,
                };
            case 'Pelatihan':
                return {
                    icon: <Laptop className="h-5 w-5" />,
                    gradient:
                        'from-teal-500/20 to-emerald-500/20 dark:from-teal-500/10 dark:to-emerald-500/10',
                    border: 'border-teal-200/50 dark:border-teal-900/30',
                    text: 'text-teal-700 dark:text-teal-400',
                    badgeVariant: 'secondary' as const,
                };
            case 'Lomba':
                return {
                    icon: <Trophy className="h-5 w-5" />,
                    gradient:
                        'from-amber-500/20 to-orange-500/20 dark:from-amber-500/10 dark:to-orange-500/10',
                    border: 'border-amber-200/50 dark:border-amber-900/30',
                    text: 'text-amber-700 dark:text-amber-400',
                    badgeVariant: 'outline' as const,
                };
            case 'Pengabdian Masyarakat':
                return {
                    icon: <Heart className="h-5 w-5" />,
                    gradient:
                        'from-rose-500/20 to-red-500/20 dark:from-rose-500/10 dark:to-rose-500/10',
                    border: 'border-rose-200/50 dark:border-rose-900/30',
                    text: 'text-rose-700 dark:text-rose-400',
                    badgeVariant: 'destructive' as const,
                };
            default:
                return {
                    icon: <Calendar className="h-5 w-5" />,
                    gradient:
                        'from-gray-500/20 to-slate-500/20 dark:from-gray-500/10 dark:to-slate-500/10',
                    border: 'border-gray-200/50 dark:border-gray-900/30',
                    text: 'text-gray-700 dark:text-gray-400',
                    badgeVariant: 'outline' as const,
                };
        }
    };

    // Format Currency
    const formatRupiah = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);
    };

    // Format Date Indon
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);

        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    // Parse Date Parts for card badge
    const getCalendarBadge = (dateStr: string) => {
        const d = new Date(dateStr);
        const monthNames = [
            'JAN',
            'FEB',
            'MAR',
            'APR',
            'MEI',
            'JUN',
            'JUL',
            'AGU',
            'SEP',
            'OKT',
            'NOV',
            'DES',
        ];

        return {
            day: d.getDate().toString().padStart(2, '0'),
            month: monthNames[d.getMonth()],
        };
    };

    return (
        <section className="mx-auto max-w-container-max px-margin-desktop py-unit-xl">
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <h2 className="font-headline-md text-headline-md text-primary">
                        Kegiatan Mendatang
                    </h2>
                    <p className="font-body-md text-on-surface-variant">
                        Jelajahi dan ikuti kegiatan menarik di kampus
                    </p>
                </div>
                <Link
                    className="flex items-center gap-1 font-label-lg text-primary hover:underline"
                    href={kegiatan()}
                >
                    Lihat Semua
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>

            {kegiatanList.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-outline-variant/60 bg-surface-container-low px-6 py-16 text-center">
                    <Calendar className="mx-auto h-12 w-12 text-on-surface-variant/50" />
                    <h3 className="mt-4 font-headline-sm text-headline-sm font-semibold text-foreground">
                        Tidak Ada Kegiatan Mendatang
                    </h3>
                    <p className="mx-auto mt-2 max-w-md font-body-md text-[13px] text-on-surface-variant/80">
                        Saat ini tidak ada kegiatan mendatang yang terdaftar.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {kegiatanList.map((item) => {
                        const meta = getCategoryMeta(item.jenis_kegiatan);
                        const dateBadge = getCalendarBadge(item.tanggal_pelaksanaan);
                        const isPaid = Number(item.biaya_pendaftaran) > 0;
                        const isRegistered = registrations[item.id_kegiatan] !== undefined;
                        const isFull = item.peserta_kegiatan_count >= item.kuota_peserta;
                        const percentage = Math.min(
                            100,
                            Math.round((item.peserta_kegiatan_count / item.kuota_peserta) * 100),
                        );
                        const barColorClass = percentage >= 85 ? 'bg-amber-500' : 'bg-primary';

                        return (
                            <div
                                key={item.id_kegiatan}
                                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
                            >
                                <div className="space-y-4">
                                    {/* Gradient category banner */}
                                    <div
                                        className={`relative h-28 bg-gradient-to-br ${meta.gradient} ${meta.border} flex items-center justify-center border-b`}
                                    >
                                        <div className="absolute top-4 left-4 flex h-8 w-8 items-center justify-center rounded-lg bg-surface/80 text-primary shadow-sm backdrop-blur-sm">
                                            {meta.icon}
                                        </div>

                                        <div className="absolute top-4 right-4 rounded-md bg-surface/90 px-2.5 py-1 text-center font-bold text-primary shadow-sm backdrop-blur-sm">
                                            <span className="block text-[10px] font-semibold tracking-wider">
                                                {dateBadge.month}
                                            </span>
                                            <span className="text-body-md font-extrabold">
                                                {dateBadge.day}
                                            </span>
                                        </div>

                                        <span
                                            className={`text-label-sm absolute bottom-3 left-4 rounded-full border px-2.5 py-0.5 font-semibold ${meta.border} bg-surface/80`}
                                        >
                                            {item.jenis_kegiatan}
                                        </span>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-4 px-6">
                                        <div className="space-y-1">
                                            <span className="text-label-sm font-medium text-primary">
                                                {item.profil_organisasi?.organisasi?.nama_organisasi}
                                            </span>
                                            <h3 className="line-clamp-2 font-headline-sm text-headline-sm font-bold text-foreground transition-colors group-hover:text-primary">
                                                {item.nama_kegiatan}
                                            </h3>
                                        </div>

                                        <p className="line-clamp-3 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
                                            {item.deskripsi_kegiatan}
                                        </p>

                                        <div className="space-y-2.5 border-y border-outline-variant/30 py-3">
                                            <div className="flex items-center gap-2.5 text-on-surface-variant/90">
                                                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                                                <span className="truncate text-body-sm">
                                                    {item.lokasi_kegiatan}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2.5 text-on-surface-variant/90">
                                                <Calendar className="h-4 w-4 shrink-0 text-primary" />
                                                <span className="text-body-sm">
                                                    {formatDate(item.tanggal_pelaksanaan)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2.5 font-medium text-on-surface-variant/90">
                                                <CreditCard className="h-4 w-4 shrink-0 text-primary" />
                                                <span className="text-body-sm text-foreground">
                                                    {isPaid ? (
                                                        <span className="font-semibold text-amber-700 dark:text-amber-400">
                                                            {formatRupiah(item.biaya_pendaftaran)}
                                                        </span>
                                                    ) : (
                                                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                                                            Gratis
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Kuota Meter */}
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-[11px] font-semibold tracking-wide uppercase">
                                                <span className="text-on-surface-variant/80">
                                                    Kapasitas
                                                </span>
                                                <span className="text-foreground">
                                                    {item.peserta_kegiatan_count} / {item.kuota_peserta} Terisi
                                                </span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-outline-variant/30">
                                                <div
                                                    className={`h-full ${barColorClass} transition-all duration-500`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="mt-6 border-t border-outline-variant/30 p-6">
                                    {isRegistered ? (
                                        <Link
                                            href={kegiatan()}
                                            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-2 font-medium text-white shadow-sm hover:bg-emerald-700 hover:text-white hover:no-underline"
                                        >
                                            <Check className="h-4 w-4 stroke-[3]" /> Terdaftar
                                        </Link>
                                    ) : isFull ? (
                                        <button
                                            disabled
                                            className="w-full rounded-lg border border-outline-variant bg-outline-variant/50 py-2 font-medium text-on-surface-variant/70 cursor-not-allowed"
                                        >
                                            Kuota Penuh
                                        </button>
                                    ) : (
                                        <Link
                                            href={kegiatan()}
                                            className="flex w-full items-center justify-center rounded-lg bg-primary py-2 font-medium text-on-primary shadow-sm transition-transform duration-100 hover:scale-[1.01] hover:bg-primary/90 hover:text-on-primary hover:no-underline"
                                        >
                                            Daftar Sekarang
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
