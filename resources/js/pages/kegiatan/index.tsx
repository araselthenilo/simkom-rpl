import { Head, useForm } from '@inertiajs/react';
import {
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
import { cn } from '@/lib/utils';

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
    status_kegiatan:
    | 'Mendatang'
    | 'Sedang berlangsung'
    | 'Selesai'
    | 'Dibatalkan';
    peserta_kegiatan_count: number;
    profil_organisasi: ProfilOrganisasi;
}

interface IndexProps {
    kegiatan: Kegiatan[];
    registrations: Record<number, number>; // Maps id_kegiatan -> id_peserta
    nim: string;
}

export default function Index({
    kegiatan,
    registrations = {},
    nim,
}: IndexProps) {
    // Search & Filter States
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState('Semua');
    const [selectedPrice, setSelectedPrice] = useState('Semua');
    const [sortBy, setSortBy] = useState('date-asc');

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

    // Helper: category visual settings
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
                        'from-rose-500/20 to-red-500/20 dark:from-rose-500/10 dark:to-red-500/10',
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

    // Filter & Sort Logic
    const filteredKegiatan = useMemo(() => {
        let result = [...kegiatan];

        // Search
        if (search.trim()) {
            const query = search.toLowerCase();
            result = result.filter(
                (item) =>
                    item.nama_kegiatan.toLowerCase().includes(query) ||
                    item.deskripsi_kegiatan.toLowerCase().includes(query) ||
                    item.profil_organisasi.organisasi.nama_organisasi
                        .toLowerCase()
                        .includes(query),
            );
        }

        // Filter: Type
        if (selectedType !== 'Semua') {
            result = result.filter(
                (item) => item.jenis_kegiatan === selectedType,
            );
        }

        // Filter: Price
        if (selectedPrice !== 'Semua') {
            result = result.filter((item) => {
                const isPaid = Number(item.biaya_pendaftaran) > 0;

                return selectedPrice === 'Gratis' ? !isPaid : isPaid;
            });
        }

        // Sort
        result.sort((a, b) => {
            const dateA = new Date(a.tanggal_pelaksanaan).getTime();
            const dateB = new Date(b.tanggal_pelaksanaan).getTime();

            return sortBy === 'date-asc' ? dateA - dateB : dateB - dateA;
        });

        return result;
    }, [kegiatan, search, selectedType, selectedPrice, sortBy]);

    // Handle Open Registration Modal
    const handleOpenRegister = (item: Kegiatan) => {
        setSelectedKegiatan(item);
        regReset();
        setIsRegOpen(true);
    };

    // Handle Register Submit
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
            preserveScroll: true,
            onError: (err) => {
                if (err.nim) {
                    toast.error(err.nim);
                } else if (err.kuota) {
                    toast.error(err.kuota);
                } else {
                    toast.error(
                        'Pendaftaran gagal. Silakan periksa kembali berkas bukti transfer Anda.',
                    );
                }
            },
        });
    };

    // Handle Open Cancellation Modal
    const handleOpenCancel = (item: Kegiatan, idPeserta: number) => {
        setCancelKegiatan(item);
        setCancelPesertaId(idPeserta);
        setIsCancelOpen(true);
    };

    // Handle Cancel Submit
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
                preserveScroll: true,
                onSuccess: () => {
                    setIsCancelOpen(false);
                    toast.success(
                        `Pendaftaran ${cancelKegiatan.nama_kegiatan} berhasil dibatalkan.`,
                    );
                },
                onError: () => {
                    toast.error(
                        'Gagal membatalkan pendaftaran. Coba lagi beberapa saat.',
                    );
                },
            },
        );
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
            day: d.getDate(),
            month: monthNames[d.getMonth()],
        };
    };

    return (
        <>
            <Head title="Kegiatan Mendatang" />
            <main className="animate-fade-in w-full space-y-10 pb-20">
                {/* Hero section */}
                <div className="border-b border-outline-variant/30 bg-gradient-to-br from-primary/10 via-background to-background py-14 md:py-20">
                    <div className="mx-auto max-w-container-max px-margin-desktop">
                        <div className="flex flex-col gap-3 md:max-w-2xl">
                            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-label-md font-semibold text-primary">
                                <Compass className="animate-spin-slow h-4 w-4" />{' '}
                                Kegiatan Kampus
                            </span>
                            <h1 className="font-headline-lg text-headline-lg font-bold text-foreground">
                                Kegiatan Mendatang
                            </h1>
                            <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
                                Jelajahi berbagai pilihan seminar, pelatihan,
                                kompetisi, dan pengabdian masyarakat. Daftarkan
                                diri Anda secara praktis dan tingkatkan
                                kompetensi non-akademik Anda.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-container-max px-margin-desktop">
                    {/* Search and filter controls */}
                    <div className="flex flex-col gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-on-surface-variant/70" />
                            <input
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-low py-2.5 pr-4 pl-10 text-body-sm text-foreground transition-all outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                                placeholder="Cari nama kegiatan atau UKM penyelenggara..."
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
                            <div className="flex flex-col gap-1">
                                <select
                                    className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm text-foreground transition-all outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                                    value={selectedType}
                                    onChange={(e) =>
                                        setSelectedType(e.target.value)
                                    }
                                >
                                    <option value="Semua">
                                        Semua Kategori
                                    </option>
                                    <option value="Seminar">Seminar</option>
                                    <option value="Pelatihan">Pelatihan</option>
                                    <option value="Lomba">Lomba</option>
                                    <option value="Pengabdian Masyarakat">
                                        Pengabdian
                                    </option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <select
                                    className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm text-foreground transition-all outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                                    value={selectedPrice}
                                    onChange={(e) =>
                                        setSelectedPrice(e.target.value)
                                    }
                                >
                                    <option value="Semua">Semua Biaya</option>
                                    <option value="Gratis">Gratis</option>
                                    <option value="Berbayar">Berbayar</option>
                                </select>
                            </div>

                            <div className="col-span-2 flex flex-col gap-1 sm:col-span-1">
                                <select
                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm text-foreground transition-all outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 sm:w-auto"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="date-asc">
                                        Tanggal Terdekat
                                    </option>
                                    <option value="date-desc">
                                        Tanggal Terjauh
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Event listing */}
                <div className="mx-auto max-w-container-max px-margin-desktop">
                    {filteredKegiatan.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-outline-variant/60 bg-surface-container-low px-6 py-16 text-center">
                            <Compass className="mx-auto h-12 w-12 text-on-surface-variant/50" />
                            <h3 className="mt-4 font-headline-sm text-headline-sm font-semibold text-foreground">
                                Tidak Ada Kegiatan
                            </h3>
                            <p className="mx-auto mt-2 max-w-md font-body-md text-on-surface-variant/80">
                                Saat ini tidak ada kegiatan mendatang yang
                                sesuai dengan pencarian atau filter Anda.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredKegiatan.map((item) => {
                                const meta = getCategoryMeta(
                                    item.jenis_kegiatan,
                                );
                                const dateBadge = getCalendarBadge(
                                    item.tanggal_pelaksanaan,
                                );
                                const isPaid =
                                    Number(item.biaya_pendaftaran) > 0;
                                const idPeserta =
                                    registrations[item.id_kegiatan];
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
                                                        {
                                                            item
                                                                .profil_organisasi
                                                                .organisasi
                                                                .nama_organisasi
                                                        }
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
                                                            {
                                                                item.lokasi_kegiatan
                                                            }
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

                                                {/* Kuota Meter */}
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
                                                            {item.kuota_peserta}{' '}
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
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="mt-6 border-t border-outline-variant/30 p-6">
                                            {isRegistered ? (
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
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
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
                                        {
                                            selectedKegiatan.profil_organisasi
                                                .organisasi.nama_organisasi
                                        }
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

                            {/* Paid instruction + proof file input */}
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
                                            ke nomor rekening yang telah disampaikan dalam pengumuman.
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

                            {/* Self-registration NIM confirmation indicator */}
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
                            method="post"
                            className="space-y-4"
                            onSubmit={handleCancelSubmit}
                        >
                            <div className="space-y-1.5 rounded-xl border border-error-container/40 bg-error-container/10 p-4 text-body-sm">
                                <div className="font-bold text-foreground">
                                    {cancelKegiatan.nama_kegiatan}
                                </div>
                                <div className="text-[11px] text-on-surface-variant">
                                    Penyelenggara:{' '}
                                    {
                                        cancelKegiatan.profil_organisasi
                                            .organisasi.nama_organisasi
                                    }
                                </div>
                                <div className="text-[11px] text-on-surface-variant">
                                    Tanggal Pelaksanaan:{' '}
                                    {formatDate(
                                        cancelKegiatan.tanggal_pelaksanaan,
                                    )}
                                </div>
                            </div>

                            {Number(cancelKegiatan.biaya_pendaftaran) > 0 && (
                                <div className="flex gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                                    <Info className="mt-0.5 h-5 w-5 shrink-0" />
                                    <span>
                                        <strong>Perhatian:</strong> Ini adalah
                                        kegiatan berbayar. Pembatalan
                                        pendaftaran di SIMKOM tidak otomatis
                                        melakukan refund transaksi Anda. Harap
                                        hubungi bendahara panitia untuk
                                        koordinasi lebih lanjut.
                                    </span>
                                </div>
                            )}

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsCancelOpen(false)}
                                >
                                    Kembali
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
                                        <>
                                            <Trash2 className="mr-1.5 h-4 w-4" />{' '}
                                            Ya, Batalkan
                                        </>
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
