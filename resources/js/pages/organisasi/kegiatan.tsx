import { Head, Link, useForm } from '@inertiajs/react';
import {
    Building2,
    Calendar,
    Check,
    Compass,
    CreditCard,
    Heart,
    Info,
    Laptop,
    Loader2,
    MapPin,
    Search,
    Trash2,
    Trophy,
    Users,
    ArrowLeft,
    AlertCircle,
    XCircle,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { daftar, batal } from '@/routes/kegiatan';
import { detail } from '@/routes/organisasi';

interface Organisasi {
    id_organisasi: number;
    nama_organisasi: string;
}

interface ProfilOrganisasi {
    id_profil: number;
    id_organisasi: number;
    logo_organisasi: string | null;
    periode_kepengurusan: string;
    status_aktif: boolean;
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
    status_kegiatan:
        | 'Mendatang'
        | 'Sedang berlangsung'
        | 'Selesai'
        | 'Dibatalkan';
    peserta_kegiatan_count: number;
    alasan_pembatalan?: string | null;
}

interface KegiatanPageProps {
    organisasi: Organisasi;
    profil: ProfilOrganisasi | null;
    kegiatanList: Kegiatan[];
    registrations: Record<number, number>; // Maps id_kegiatan -> id_peserta
    nim: string;
}

export default function KegiatanPage({
    organisasi,
    profil,
    kegiatanList = [],
    registrations = {},
    nim,
}: KegiatanPageProps) {
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState('Semua');
    const [selectedStatus, setSelectedStatus] = useState('Semua');
    const [sortBy, setSortBy] = useState('date-desc'); // default to newest first for all activities

    // Registration Modal States
    const [isRegOpen, setIsRegOpen] = useState(false);
    const [selectedKegiatan, setSelectedKegiatan] = useState<Kegiatan | null>(
        null,
    );
    const {
        setData: setRegData,
        post: regPost,
        processing: regProcessing,
        errors: regErrors,
        reset: regReset,
    } = useForm({
        nim: nim,
        foto_bukti_transaksi: null as File | null,
    });

    // Cancellation Modal States
    const [isCancelOpen, setIsCancelOpen] = useState(false);
    const [cancelKegiatan, setCancelKegiatan] = useState<Kegiatan | null>(null);
    const [cancelPesertaId, setCancelPesertaId] = useState<number | null>(null);
    const { delete: cancelDelete, processing: cancelProcessing } = useForm();

    const getCategoryMeta = (type: Kegiatan['jenis_kegiatan']) => {
        switch (type) {
            case 'Seminar':
                return {
                    icon: <Calendar className="h-5 w-5" />,
                    gradient:
                        'from-blue-500/20 to-indigo-500/20 dark:from-blue-500/10 dark:to-indigo-500/10',
                    border: 'border-blue-200/50 dark:border-blue-900/30',
                    text: 'text-blue-700 dark:text-blue-400',
                };
            case 'Pelatihan':
                return {
                    icon: <Laptop className="h-5 w-5" />,
                    gradient:
                        'from-teal-500/20 to-emerald-500/20 dark:from-teal-500/10 dark:to-emerald-500/10',
                    border: 'border-teal-200/50 dark:border-teal-900/30',
                    text: 'text-teal-700 dark:text-teal-400',
                };
            case 'Lomba':
                return {
                    icon: <Trophy className="h-5 w-5" />,
                    gradient:
                        'from-amber-500/20 to-orange-500/20 dark:from-amber-500/10 dark:to-orange-500/10',
                    border: 'border-amber-200/50 dark:border-amber-900/30',
                    text: 'text-amber-700 dark:text-amber-400',
                };
            case 'Pengabdian Masyarakat':
                return {
                    icon: <Heart className="h-5 w-5" />,
                    gradient:
                        'from-rose-500/20 to-red-500/20 dark:from-rose-500/10 dark:to-red-500/10',
                    border: 'border-rose-200/50 dark:border-rose-900/30',
                    text: 'text-rose-700 dark:text-rose-400',
                };
            default:
                return {
                    icon: <Calendar className="h-5 w-5" />,
                    gradient:
                        'from-gray-500/20 to-slate-500/20 dark:from-gray-500/10 dark:to-slate-500/10',
                    border: 'border-gray-200/50 dark:border-gray-900/30',
                    text: 'text-gray-700 dark:text-gray-400',
                };
        }
    };

    const getStatusMeta = (status: Kegiatan['status_kegiatan']) => {
        switch (status) {
            case 'Mendatang':
                return 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
            case 'Sedang berlangsung':
                return 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
            case 'Selesai':
                return 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20';
            case 'Dibatalkan':
                return 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20';
            default:
                return 'bg-gray-100 text-gray-700 border border-gray-200';
        }
    };

    const filteredKegiatan = useMemo(() => {
        let result = [...kegiatanList];

        if (search.trim()) {
            const query = search.toLowerCase();
            result = result.filter(
                (item) =>
                    item.nama_kegiatan.toLowerCase().includes(query) ||
                    item.deskripsi_kegiatan.toLowerCase().includes(query),
            );
        }

        if (selectedType !== 'Semua') {
            result = result.filter(
                (item) => item.jenis_kegiatan === selectedType,
            );
        }

        if (selectedStatus !== 'Semua') {
            result = result.filter(
                (item) => item.status_kegiatan === selectedStatus,
            );
        }

        result.sort((a, b) => {
            const dateA = new Date(a.tanggal_pelaksanaan).getTime();
            const dateB = new Date(b.tanggal_pelaksanaan).getTime();

            return sortBy === 'date-asc' ? dateA - dateB : dateB - dateA;
        });

        return result;
    }, [kegiatanList, search, selectedType, selectedStatus, sortBy]);

    const handleOpenRegister = (item: Kegiatan) => {
        setSelectedKegiatan(item);
        regReset();
        setIsRegOpen(true);
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedKegiatan) {
            return;
        }

        regPost(daftar.url(selectedKegiatan.id_kegiatan), {
            onSuccess: () => {
                setIsRegOpen(false);
                toast.success(
                    `Berhasil mendaftar ke kegiatan: ${selectedKegiatan.nama_kegiatan}`,
                );
                regReset();
            },
            onError: (err) => {
                if (err.nim) {
                    toast.error(err.nim);
                } else if (err.kuota) {
                    toast.error(err.kuota);
                } else {
                    toast.error(
                        'Pendaftaran gagal. Silakan periksa kembali bukti transfer Anda.',
                    );
                }
            },
        });
    };

    const handleOpenCancel = (item: Kegiatan, idPeserta: number) => {
        setCancelKegiatan(item);
        setCancelPesertaId(idPeserta);
        setIsCancelOpen(true);
    };

    const handleCancelSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!cancelKegiatan || !cancelPesertaId) {
            return;
        }

        cancelDelete(
            batal.url({
                id_kegiatan: cancelKegiatan.id_kegiatan,
                id_peserta: cancelPesertaId,
            }),
            {
                onSuccess: () => {
                    setIsCancelOpen(false);
                    toast.success(
                        `Pendaftaran ${cancelKegiatan.nama_kegiatan} berhasil dibatalkan.`,
                    );
                },
                onError: () => {
                    toast.error(
                        'Gagal membatalkan pendaftaran. Silakan coba lagi.',
                    );
                },
            },
        );
    };

    const formatRupiah = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

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
            day: d.getDate(),
            month: monthNames[d.getMonth()],
        };
    };

    return (
        <>
            <Head title={`Kegiatan - ${organisasi.nama_organisasi}`} />
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
                                    Daftar Kegiatan
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

                {/* Filters */}
                <div className="flex flex-col gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm md:flex-row md:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-on-surface-variant/70" />
                        <input
                            className="w-full rounded-lg border border-outline-variant bg-surface-container-low py-2.5 pr-4 pl-10 text-body-sm text-foreground transition-all outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                            placeholder="Cari nama kegiatan..."
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3 sm:flex sm:items-center">
                        <select
                            className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm text-foreground transition-all outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            <option value="Semua">Semua Kategori</option>
                            <option value="Seminar">Seminar</option>
                            <option value="Pelatihan">Pelatihan</option>
                            <option value="Lomba">Lomba</option>
                            <option value="Pengabdian Masyarakat">
                                Pengabdian
                            </option>
                        </select>

                        <select
                            className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm text-foreground transition-all outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="Semua">Semua Status</option>
                            <option value="Mendatang">Mendatang</option>
                            <option value="Sedang berlangsung">
                                Sedang berlangsung
                            </option>
                            <option value="Selesai">Selesai</option>
                            <option value="Dibatalkan">Dibatalkan</option>
                        </select>

                        <select
                            className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm text-foreground transition-all outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="date-desc">Terbaru</option>
                            <option value="date-asc">Terlama</option>
                        </select>
                    </div>
                </div>

                {/* Event Listing Grid */}
                {filteredKegiatan.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Compass className="mb-4 h-12 w-12 text-on-surface-variant/40" />
                        <h3 className="font-headline-sm text-headline-sm font-semibold text-foreground">
                            Tidak Ada Kegiatan
                        </h3>
                        <p className="mx-auto mt-2 max-w-sm font-body-md text-on-surface-variant/80">
                            Tidak ada kegiatan yang sesuai dengan kriteria
                            filter Anda.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredKegiatan.map((item) => {
                            const meta = getCategoryMeta(item.jenis_kegiatan);
                            const dateBadge = getCalendarBadge(
                                item.tanggal_pelaksanaan,
                            );
                            const isPaid = Number(item.biaya_pendaftaran) > 0;
                            const idPeserta = registrations[item.id_kegiatan];
                            const isRegistered = idPeserta !== undefined;
                            const isFull =
                                item.peserta_kegiatan_count >=
                                item.kuota_peserta;
                            const percentage = Math.min(
                                100,
                                Math.round(
                                    (item.peserta_kegiatan_count /
                                        item.kuota_peserta) *
                                        100,
                                ),
                            );
                            const barColorClass =
                                percentage >= 85
                                    ? 'bg-amber-500'
                                    : 'bg-primary';

                            return (
                                <div
                                    key={item.id_kegiatan}
                                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
                                >
                                    <div className="space-y-4">
                                        {/* Header Image/Banner */}
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

                                        {/* Body */}
                                        <div className="space-y-4 px-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${getStatusMeta(item.status_kegiatan)}`}
                                                    >
                                                        {item.status_kegiatan}
                                                    </span>
                                                </div>
                                                <h3 className="line-clamp-2 font-headline-sm text-[16px] font-bold text-foreground transition-colors group-hover:text-primary">
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
                                                        {formatDate(
                                                            item.tanggal_pelaksanaan,
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2.5 font-medium text-on-surface-variant/90">
                                                    <CreditCard className="h-4 w-4 shrink-0 text-primary" />
                                                    <span className="text-body-sm text-foreground">
                                                        {isPaid ? (
                                                            <span className="font-semibold text-amber-700 dark:text-amber-400">
                                                                {formatRupiah(
                                                                    item.biaya_pendaftaran,
                                                                )}
                                                            </span>
                                                        ) : (
                                                            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                                                                Gratis
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Kuota Meter for upcoming/ongoing events */}
                                            {item.status_kegiatan !==
                                                'Selesai' &&
                                                item.status_kegiatan !==
                                                    'Dibatalkan' && (
                                                    <div className="space-y-1.5">
                                                        <div className="flex justify-between text-[11px] font-semibold tracking-wide uppercase">
                                                            <span className="text-on-surface-variant/80">
                                                                Kapasitas
                                                            </span>
                                                            <span className="text-foreground">
                                                                {
                                                                    item.peserta_kegiatan_count
                                                                }{' '}
                                                                /{' '}
                                                                {
                                                                    item.kuota_peserta
                                                                }{' '}
                                                                Terisi
                                                            </span>
                                                        </div>
                                                        <div className="h-2 w-full overflow-hidden rounded-full bg-outline-variant/30">
                                                            <div
                                                                className={`h-full ${barColorClass} transition-all duration-500`}
                                                                style={{
                                                                    width: `${percentage}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )}

                                            {item.status_kegiatan ===
                                                'Dibatalkan' &&
                                                item.alasan_pembatalan && (
                                                    <div className="rounded-lg border border-red-500/10 bg-red-500/5 p-3 text-xs text-red-800 dark:text-red-400">
                                                        <span className="font-bold">
                                                            Alasan Batal:
                                                        </span>{' '}
                                                        {item.alasan_pembatalan}
                                                    </div>
                                                )}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="mt-6 border-t border-outline-variant/30 p-6">
                                        {item.status_kegiatan ===
                                        'Mendatang' ? (
                                            isRegistered ? (
                                                <Button
                                                    className="flex w-full cursor-pointer items-center justify-center gap-1.5 bg-emerald-600 font-medium text-white shadow-sm hover:bg-emerald-700"
                                                    onClick={() =>
                                                        handleOpenCancel(
                                                            item,
                                                            idPeserta,
                                                        )
                                                    }
                                                >
                                                    <Check className="h-4 w-4 stroke-[3]" />{' '}
                                                    Terdaftar
                                                </Button>
                                            ) : isFull ? (
                                                <Button
                                                    disabled
                                                    className="w-full border border-outline-variant bg-outline-variant/50 font-medium text-on-surface-variant/70"
                                                    variant="secondary"
                                                >
                                                    Kuota Penuh
                                                </Button>
                                            ) : (
                                                <Button
                                                    className="w-full cursor-pointer font-medium shadow-sm transition-transform duration-100 hover:scale-[1.01]"
                                                    onClick={() =>
                                                        handleOpenRegister(item)
                                                    }
                                                >
                                                    Daftar Sekarang
                                                </Button>
                                            )
                                        ) : (
                                            <Button
                                                disabled
                                                variant="outline"
                                                className="w-full border border-outline-variant bg-surface-container-low font-medium text-on-surface-variant/70"
                                            >
                                                Pendaftaran Ditutup
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* REGISTRATION DIALOG */}
            <Dialog open={isRegOpen} onOpenChange={setIsRegOpen}>
                <DialogContent className="max-w-md rounded-2xl border border-outline-variant bg-surface-container-lowest p-6">
                    <DialogHeader>
                        <DialogTitle className="font-headline-sm text-headline-sm font-bold text-foreground">
                            Pendaftaran Kegiatan
                        </DialogTitle>
                        <DialogDescription className="text-body-sm text-on-surface-variant">
                            {selectedKegiatan?.nama_kegiatan}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedKegiatan && (
                        <form
                            className="space-y-5 py-2"
                            onSubmit={handleRegisterSubmit}
                        >
                            <div className="space-y-3 rounded-xl bg-surface-container-low p-4 text-body-sm">
                                <div className="flex justify-between">
                                    <span className="text-on-surface-variant">
                                        Kategori:
                                    </span>
                                    <span className="font-medium text-foreground">
                                        {selectedKegiatan.jenis_kegiatan}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-on-surface-variant">
                                        Penyelenggara:
                                    </span>
                                    <span className="font-medium text-foreground">
                                        {organisasi.nama_organisasi}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-on-surface-variant">
                                        Waktu:
                                    </span>
                                    <span className="font-medium text-foreground">
                                        {formatDate(
                                            selectedKegiatan.tanggal_pelaksanaan,
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between border-t border-outline-variant/30 pt-2 text-body-md font-semibold">
                                    <span className="text-foreground">
                                        Biaya:
                                    </span>
                                    <span>
                                        {Number(
                                            selectedKegiatan.biaya_pendaftaran,
                                        ) > 0 ? (
                                            <span className="text-amber-700 dark:text-amber-400">
                                                {formatRupiah(
                                                    selectedKegiatan.biaya_pendaftaran,
                                                )}
                                            </span>
                                        ) : (
                                            <span className="text-emerald-700 dark:text-emerald-400">
                                                Gratis
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>

                            {Number(selectedKegiatan.biaya_pendaftaran) > 0 && (
                                <div className="space-y-3 border-t border-outline-variant/30 pt-4">
                                    <div className="flex gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-amber-800 dark:text-amber-300">
                                        <Info className="mt-0.5 h-5 w-5 shrink-0" />
                                        <div className="text-[11px] leading-relaxed">
                                            <p className="mb-1 font-bold">
                                                Petunjuk Pembayaran:
                                            </p>
                                            Silakan transfer sebesar{' '}
                                            <span className="font-bold">
                                                {formatRupiah(
                                                    selectedKegiatan.biaya_pendaftaran,
                                                )}
                                            </span>{' '}
                                            ke rekening Bendahara UKM
                                            penyelenggara:
                                            <p className="mt-1 font-bold">
                                                Bank BNI: 0883-2947-23 (a.n.
                                                SIMKOM RPL)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-label-sm font-semibold text-foreground">
                                            Unggah Bukti Transfer{' '}
                                            <span className="text-error">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            required
                                            className="file:text-label-sm w-full cursor-pointer rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-2.5 file:py-1 file:font-semibold file:text-on-primary file:hover:opacity-90"
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg, application/pdf"
                                            onChange={(e) => {
                                                const files = e.target.files;

                                                if (files && files.length > 0) {
                                                    setRegData(
                                                        'foto_bukti_transaksi',
                                                        files[0],
                                                    );
                                                }
                                            }}
                                        />
                                        <p className="text-[10px] text-on-surface-variant/70">
                                            Format: JPG, JPEG, PNG, atau PDF.
                                            Ukuran maks. 5 MB.
                                        </p>
                                        {regErrors.foto_bukti_transaksi && (
                                            <p className="text-label-sm text-error">
                                                {regErrors.foto_bukti_transaksi}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2 text-[11px] text-on-surface-variant">
                                <Users className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                <span>
                                    Pendaftaran akan diajukan atas nama NIM Anda
                                    secara otomatis (
                                    <span className="font-bold text-foreground">
                                        {nim}
                                    </span>
                                    ).
                                </span>
                            </div>

                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsRegOpen(false)}
                                >
                                    Batal
                                </Button>
                                <Button disabled={regProcessing} type="submit">
                                    {regProcessing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                                            Mendaftar...
                                        </>
                                    ) : (
                                        'Daftar Sekarang'
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* CANCELLATION DIALOG */}
            <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
                <DialogContent className="max-w-md rounded-2xl border border-outline-variant bg-surface-container-lowest p-6">
                    <DialogHeader>
                        <DialogTitle className="font-headline-sm text-headline-sm font-bold text-foreground">
                            Batalkan Pendaftaran
                        </DialogTitle>
                        <DialogDescription className="text-body-sm text-on-surface-variant">
                            Apakah Anda yakin ingin membatalkan keikutsertaan
                            Anda dalam kegiatan ini?
                        </DialogDescription>
                    </DialogHeader>

                    {cancelKegiatan && (
                        <form
                            className="space-y-4"
                            onSubmit={handleCancelSubmit}
                        >
                            <div className="space-y-1.5 rounded-xl border border-error-container/40 bg-error-container/10 p-4 text-body-sm">
                                <div className="font-bold text-foreground">
                                    {cancelKegiatan.nama_kegiatan}
                                </div>
                                <div className="text-[11px] text-on-surface-variant">
                                    Penyelenggara: {organisasi.nama_organisasi}
                                </div>
                                <div className="text-[11px] text-on-surface-variant">
                                    Tanggal Pelaksanaan:{' '}
                                    {formatDate(
                                        cancelKegiatan.tanggal_pelaksanaan,
                                    )}
                                </div>
                            </div>

                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsCancelOpen(false)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    disabled={cancelProcessing}
                                    variant="destructive"
                                    type="submit"
                                >
                                    {cancelProcessing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                                            Membatalkan...
                                        </>
                                    ) : (
                                        'Ya, Batalkan'
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
