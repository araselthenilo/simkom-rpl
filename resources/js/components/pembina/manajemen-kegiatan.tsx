import { router } from '@inertiajs/react';
import {
    Calendar,
    Search,
    MapPin,
    CheckCircle2,
    XCircle,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Tag,
    DollarSign,
    Users,
    AlertCircle,
    Info,
    RefreshCw,
    Download,
    FileText,
    SlidersHorizontal,
    ArrowUpDown,
    Eye,
    File,
} from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DialogFooter } from '../ui/dialog';

interface DokumentasiKegiatan {
    id_dokumentasi: number;
    id_kegiatan: number;
    dokumen_proposal: string | null;
    dokumen_lpj: string | null;
    hasil_evaluasi: string | null;
    status_dokumentasi: 'Diproses' | 'Butuh Revisi' | 'Diterima';
}

interface Activity {
    id_kegiatan: number;
    id_profil: number;
    username_petugas: string | null;
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
    alasan_pembatalan: string | null;
    profil_organisasi?: {
        id_profil: number;
        id_organisasi: number;
        periode_kepengurusan: string;
        organisasi?: {
            id_organisasi: number;
            nama_organisasi: string;
        };
    };
    dokumentasi_kegiatan?: DokumentasiKegiatan | null;
}

interface ProfilOrganisasi {
    id_profil: number;
    id_organisasi: number;
    periode_kepengurusan: string;
    status_aktif: boolean;
    organisasi?: {
        id_organisasi: number;
        nama_organisasi: string;
    };
}

export default function ManajemenKegiatan({
    initialActivities = [],
    profilList = [],
}: {
    initialActivities?: Activity[];
    profilList?: ProfilOrganisasi[];
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<
        'Semua' | 'Mendatang' | 'Sedang berlangsung' | 'Selesai' | 'Dibatalkan'
    >('Semua');
    const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

    const [activities, setActivities] = useState<Activity[]>(initialActivities);

    useEffect(() => {
        setActivities(initialActivities);
    }, [initialActivities]);

    // Modal state controllers
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
    const [previewActivity, setPreviewActivity] = useState<Activity | null>(
        null,
    );

    const getFileName = (urlPath: string | null) => {
        if (!urlPath) {
            return '';
        }

        const parts = urlPath.split('/');

        return parts[parts.length - 1];
    };

    const isPdf = (urlPath: string | null) => {
        if (!urlPath) {
            return false;
        }

        const cleanPath = urlPath.split('?')[0];

        return cleanPath.toLowerCase().endsWith('.pdf');
    };

    // Export filter & sort state
    const [exportFilters, setExportFilters] = useState({
        status: 'Semua' as 'Semua' | Activity['status_kegiatan'],
        jenis: 'Semua' as 'Semua' | Activity['jenis_kegiatan'],
        tanggalMulai: '',
        tanggalAkhir: '',
    });
    const [exportSort, setExportSort] = useState({
        field: 'tanggal_pelaksanaan' as keyof Pick<
            Activity,
            | 'nama_kegiatan'
            | 'tanggal_pelaksanaan'
            | 'biaya_pendaftaran'
            | 'kuota_peserta'
        >,
        direction: 'asc' as 'asc' | 'desc',
    });

    // Report archiving states
    const [targetOrganisasiId, setTargetOrganisasiId] = useState<string>('');
    const [reportFormat, setReportFormat] = useState<'pdf' | 'excel'>('pdf');
    const [isArchiving, setIsArchiving] = useState(false);

    const handleCreateAndArchiveReport = () => {
        if (!targetOrganisasiId) {
            alert('Silakan pilih organisasi tujuan arsip.');

            return;
        }

        setIsArchiving(true);
        router.post(
            '/pembina/laporan/generate',
            {
                jenis_laporan: 'Kegiatan',
                id_organisasi: parseInt(targetOrganisasiId, 10),
                format: reportFormat,
                status_kegiatan: exportFilters.status,
                jenis_kegiatan: exportFilters.jenis,
                tanggal_mulai: exportFilters.tanggalMulai,
                tanggal_akhir: exportFilters.tanggalAkhir,
                sort_by_field: exportSort.field,
                sort_direction: exportSort.direction,
            },
            {
                onSuccess: () => {
                    setIsExportModalOpen(false);
                    setIsArchiving(false);
                },
                onError: (errors) => {
                    setIsArchiving(false);
                    const msg = Object.values(errors).join('\n');
                    alert(
                        msg || 'Gagal membuat dan menyimpan laporan kegiatan.',
                    );
                },
            },
        );
    };

    // Compute the data to export based on filters & sort
    const getExportData = useCallback(() => {
        let data = [...activities];

        // Filter by status
        if (exportFilters.status !== 'Semua') {
            data = data.filter(
                (a) => a.status_kegiatan === exportFilters.status,
            );
        }

        // Filter by jenis
        if (exportFilters.jenis !== 'Semua') {
            data = data.filter((a) => a.jenis_kegiatan === exportFilters.jenis);
        }

        // Filter by date range
        if (exportFilters.tanggalMulai) {
            data = data.filter(
                (a) => a.tanggal_pelaksanaan >= exportFilters.tanggalMulai,
            );
        }

        if (exportFilters.tanggalAkhir) {
            data = data.filter(
                (a) => a.tanggal_pelaksanaan <= exportFilters.tanggalAkhir,
            );
        }

        // Sort
        data.sort((a, b) => {
            const valA = a[exportSort.field];
            const valB = b[exportSort.field];

            if (typeof valA === 'number' && typeof valB === 'number') {
                return exportSort.direction === 'asc'
                    ? valA - valB
                    : valB - valA;
            }

            const sA = String(valA ?? '');
            const sB = String(valB ?? '');

            return exportSort.direction === 'asc'
                ? sA.localeCompare(sB, 'id')
                : sB.localeCompare(sA, 'id');
        });

        return data;
    }, [activities, exportFilters, exportSort]);

    // Form inputs state
    const [formData, setFormData] = useState({
        id_profil: profilList[0]?.id_profil || 0,
        nama_kegiatan: '',
        jenis_kegiatan: 'Seminar' as Activity['jenis_kegiatan'],
        deskripsi_kegiatan: '',
        biaya_pendaftaran: 0,
        tanggal_pelaksanaan: '',
        lokasi_kegiatan: '',
        kuota_peserta: 10,
    });

    const [cancellationReasonInput, setCancellationReasonInput] = useState('');

    // Metrics calculations
    const totalActivities = activities.length;
    const totalUpcoming = activities.filter(
        (a) => a.status_kegiatan === 'Mendatang',
    ).length;
    const totalActiveOrFinished = activities.filter(
        (a) =>
            a.status_kegiatan === 'Sedang berlangsung' ||
            a.status_kegiatan === 'Selesai',
    ).length;
    const totalCancelled = activities.filter(
        (a) => a.status_kegiatan === 'Dibatalkan',
    ).length;

    // Currency Formatter
    const formatRupiah = (value: number) => {
        if (value === 0) {
            return 'Gratis';
        }

        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        })
            .format(value)
            .replace('IDR', 'Rp');
    };

    // Filter and search activities list
    const filteredActivities = activities.filter((activity) => {
        const matchesSearch =
            activity.nama_kegiatan
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            activity.lokasi_kegiatan
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            (activity.profil_organisasi?.organisasi?.nama_organisasi || '')
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

        const matchesStatus =
            activeTab === 'Semua' || activity.status_kegiatan === activeTab;
        const matchesCategory =
            selectedCategory === 'Semua' ||
            activity.jenis_kegiatan === selectedCategory;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    // Form handlers
    const openCreateModal = () => {
        setFormData({
            id_profil: profilList[0]?.id_profil || 0,
            nama_kegiatan: '',
            jenis_kegiatan: 'Seminar',
            deskripsi_kegiatan: '',
            biaya_pendaftaran: 0,
            tanggal_pelaksanaan: new Date().toISOString().split('T')[0],
            lokasi_kegiatan: '',
            kuota_peserta: 50,
        });
        setIsCreateModalOpen(true);
    };

    const handleCreateActivity = (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formData.id_profil ||
            !formData.nama_kegiatan ||
            !formData.lokasi_kegiatan ||
            !formData.deskripsi_kegiatan
        ) {
            alert('Harap isi semua kolom wajib!');

            return;
        }

        router.post(
            '/pembina/kegiatan',
            {
                id_profil: formData.id_profil,
                nama_kegiatan: formData.nama_kegiatan,
                jenis_kegiatan: formData.jenis_kegiatan,
                deskripsi_kegiatan: formData.deskripsi_kegiatan,
                biaya_pendaftaran: Number(formData.biaya_pendaftaran),
                tanggal_pelaksanaan: formData.tanggal_pelaksanaan,
                lokasi_kegiatan: formData.lokasi_kegiatan,
                kuota_peserta: Number(formData.kuota_peserta),
            },
            {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                },
                onError: (errors) => {
                    const message = Object.values(errors).join('\n');
                    alert(
                        message || 'Terjadi kesalahan saat menyimpan kegiatan.',
                    );
                },
            },
        );
    };

    const openEditModal = (activity: Activity) => {
        setActiveActivity(activity);
        setFormData({
            id_profil: activity.id_profil,
            nama_kegiatan: activity.nama_kegiatan,
            jenis_kegiatan: activity.jenis_kegiatan,
            deskripsi_kegiatan: activity.deskripsi_kegiatan,
            biaya_pendaftaran: activity.biaya_pendaftaran,
            tanggal_pelaksanaan: activity.tanggal_pelaksanaan,
            lokasi_kegiatan: activity.lokasi_kegiatan,
            kuota_peserta: activity.kuota_peserta,
        });
        setIsEditModalOpen(true);
    };

    const handleEditActivity = (e: React.FormEvent) => {
        e.preventDefault();

        if (!activeActivity) {
            return;
        }

        router.put(
            `/pembina/kegiatan/${activeActivity.id_kegiatan}`,
            {
                id_profil: formData.id_profil,
                nama_kegiatan: formData.nama_kegiatan,
                jenis_kegiatan: formData.jenis_kegiatan,
                deskripsi_kegiatan: formData.deskripsi_kegiatan,
                biaya_pendaftaran: Number(formData.biaya_pendaftaran),
                tanggal_pelaksanaan: formData.tanggal_pelaksanaan,
                lokasi_kegiatan: formData.lokasi_kegiatan,
                kuota_peserta: Number(formData.kuota_peserta),
            },
            {
                onSuccess: () => {
                    setIsEditModalOpen(false);
                    setActiveActivity(null);
                },
                onError: (errors) => {
                    const message = Object.values(errors).join('\n');
                    alert(
                        message ||
                            'Terjadi kesalahan saat memperbarui kegiatan.',
                    );
                },
            },
        );
    };

    const openCancelModal = (activity: Activity) => {
        setActiveActivity(activity);
        setCancellationReasonInput('');
        setIsCancelModalOpen(true);
    };

    const handleCancelActivity = (e: React.FormEvent) => {
        e.preventDefault();

        if (!activeActivity) {
            return;
        }

        if (!cancellationReasonInput.trim()) {
            alert('Harap isi alasan pembatalan!');

            return;
        }

        router.put(
            `/pembina/kegiatan/${activeActivity.id_kegiatan}`,
            {
                status_kegiatan: 'Dibatalkan',
                alasan_pembatalan: cancellationReasonInput,
            },
            {
                onSuccess: () => {
                    setIsCancelModalOpen(false);
                    setActiveActivity(null);
                },
                onError: (errors) => {
                    const message = Object.values(errors).join('\n');
                    alert(
                        message ||
                            'Terjadi kesalahan saat membatalkan kegiatan.',
                    );
                },
            },
        );
    };

    const handleDeleteActivity = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) {
            router.delete(`/pembina/kegiatan/${id}`, {
                onError: (errors) => {
                    const message = Object.values(errors).join('\n');
                    alert(message || 'Gagal menghapus kegiatan.');
                },
            });
        }
    };

    const handleStatusTransition = (
        id: number,
        currentStatus: Activity['status_kegiatan'],
    ) => {
        let nextStatus: Activity['status_kegiatan'] = 'Mendatang';

        if (currentStatus === 'Mendatang') {
            nextStatus = 'Sedang berlangsung';
        } else if (currentStatus === 'Sedang berlangsung') {
            nextStatus = 'Selesai';
        } else if (currentStatus === 'Selesai') {
            nextStatus = 'Mendatang';
        }

        router.put(
            `/pembina/kegiatan/${id}`,
            {
                status_kegiatan: nextStatus,
                alasan_pembatalan: null,
            },
            {
                preserveScroll: true,
                onError: (errors) => {
                    const message = Object.values(errors).join('\n');
                    alert(
                        message ||
                            'Terjadi kesalahan saat memperbarui status kegiatan.',
                    );
                },
            },
        );
    };

    return (
        <main className="mx-auto w-full max-w-container-max space-y-gutter p-margin-desktop">
            {/* Header */}
            <header className="mb-unit-xl flex flex-col items-start justify-between gap-unit-md md:flex-row md:items-end">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary">
                        Manajemen Kegiatan (Pembina)
                    </h2>
                    <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
                        Kelola pendaftaran, lokasi, biaya, dan status
                        pelaksanaan seluruh kegiatan organisasi/UKM.
                    </p>
                </div>
                <div className="flex w-full gap-unit-sm md:w-auto">
                    <Button
                        onClick={() => setIsExportModalOpen(true)}
                        className="flex h-auto w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-none bg-primary px-6 py-3 font-label-lg text-on-primary shadow-sm transition-all hover:opacity-90 active:scale-95 md:w-auto"
                    >
                        <FileText className="h-[18px] w-[18px]" />
                        Buat Laporan
                    </Button>
                </div>
            </header>

            {/* Metrics Grid */}
            <div className="mb-unit-xl grid grid-cols-1 gap-gutter md:grid-cols-4">
                <Card className="flex h-32 flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-[0px_2px_4px_rgba(26,54,93,0.05)] ring-0">
                    <div className="flex items-start justify-between">
                        <span className="font-label-md text-primary/70">
                            Total Kegiatan
                        </span>
                        <Calendar className="h-5 w-5 text-primary/40" />
                    </div>
                    <div className="font-headline-md text-headline-md font-bold text-primary">
                        {totalActivities}
                    </div>
                </Card>
                <Card className="flex h-32 flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-[0px_2px_4px_rgba(26,54,93,0.05)] ring-0">
                    <div className="flex items-start justify-between">
                        <span className="font-label-md text-secondary">
                            Kegiatan Mendatang
                        </span>
                        <Info className="h-5 w-5 text-secondary/40" />
                    </div>
                    <div className="font-headline-md text-headline-md font-bold text-secondary">
                        {totalUpcoming}
                    </div>
                </Card>
                <Card className="flex h-32 flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-[0px_2px_4px_rgba(26,54,93,0.05)] ring-0">
                    <div className="flex items-start justify-between">
                        <span className="font-label-md text-green-700">
                            Aktif / Selesai
                        </span>
                        <CheckCircle2 className="h-5 w-5 text-green-700/40" />
                    </div>
                    <div className="font-headline-md text-headline-md font-bold text-green-700">
                        {totalActiveOrFinished}
                    </div>
                </Card>
                <Card className="flex h-32 flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-[0px_2px_4px_rgba(26,54,93,0.05)] ring-0">
                    <div className="flex items-start justify-between">
                        <span className="font-label-md text-error">
                            Dibatalkan
                        </span>
                        <XCircle className="h-5 w-5 text-error/40" />
                    </div>
                    <div className="font-headline-md text-headline-md font-bold text-error">
                        {totalCancelled}
                    </div>
                </Card>
            </div>

            {/* Filter and Search Bar */}
            <div className="mb-unit-lg flex flex-col items-center justify-between gap-unit-md rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-md shadow-[0px_2px_4px_rgba(26,54,93,0.05)] lg:flex-row">
                {/* Status Tab Filters */}
                <div className="flex w-full overflow-x-auto rounded-lg bg-surface-container-low p-1 lg:w-auto">
                    {(
                        [
                            'Semua',
                            'Mendatang',
                            'Sedang berlangsung',
                            'Selesai',
                            'Dibatalkan',
                        ] as const
                    ).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`cursor-pointer rounded-md px-5 py-2 font-label-lg text-nowrap transition-all ${
                                activeTab === tab
                                    ? 'bg-white font-semibold text-primary shadow-sm'
                                    : 'text-on-surface-variant hover:text-primary'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Search & Category Filter */}
                <div className="flex w-full flex-col items-stretch gap-unit-md sm:flex-row sm:items-center lg:w-auto">
                    {/* Category Select */}
                    <div className="relative w-full sm:w-48">
                        <select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            className="w-full cursor-pointer appearance-none rounded-lg border border-outline-variant bg-background px-3 py-2 pr-10 font-body-sm text-on-background transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="Semua">Semua Kategori</option>
                            <option value="Seminar">Seminar</option>
                            <option value="Pelatihan">Pelatihan</option>
                            <option value="Lomba">Lomba</option>
                            <option value="Pengabdian Masyarakat">
                                Pengabdian
                            </option>
                        </select>
                        <Tag className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-on-surface-variant/60" />
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                        <input
                            className="w-full rounded-lg border border-outline-variant bg-background py-2 pr-4 pl-10 font-body-sm text-on-background transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            placeholder="Cari kegiatan, UKM, atau lokasi..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Activities Table */}
            <Card className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-[0px_2px_4px_rgba(26,54,93,0.05)] ring-0">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-outline-variant bg-surface-container-low">
                                <th className="px-unit-lg py-4 font-label-lg tracking-wider text-primary uppercase">
                                    Nama &amp; Penyelenggara
                                </th>
                                <th className="px-unit-lg py-4 font-label-lg tracking-wider text-primary uppercase">
                                    Pelaksanaan &amp; Tempat
                                </th>
                                <th className="px-unit-lg py-4 font-label-lg tracking-wider text-primary uppercase">
                                    Biaya &amp; Kuota
                                </th>
                                <th className="px-unit-lg py-4 font-label-lg tracking-wider text-primary uppercase">
                                    Status
                                </th>
                                <th className="px-unit-lg py-4 text-right font-label-lg tracking-wider text-primary uppercase">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/50">
                            {filteredActivities.map((activity) => (
                                <tr
                                    key={activity.id_kegiatan}
                                    className="group transition-colors hover:bg-primary/[0.02]"
                                >
                                    {/* Name & Category */}
                                    <td className="px-unit-lg py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-body-md font-semibold text-primary group-hover:underline">
                                                {activity.nama_kegiatan}
                                            </span>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded border border-primary/10 bg-primary-fixed px-2 py-0.5 text-[11px] font-medium text-on-primary-fixed dark:border-primary-container/30 dark:bg-primary-container dark:text-on-primary-container">
                                                    {activity.jenis_kegiatan}
                                                </span>
                                                <span className="rounded border border-secondary/10 bg-secondary-fixed px-2 py-0.5 text-[11px] font-medium text-on-secondary-fixed dark:border-secondary-container/30 dark:bg-secondary-container dark:text-on-secondary-container">
                                                    {activity.profil_organisasi
                                                        ?.organisasi
                                                        ?.nama_organisasi ||
                                                        'Organisasi'}
                                                </span>
                                                <span className="text-[11px] text-on-surface-variant/70">
                                                    ID: {activity.id_kegiatan}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Date & Location */}
                                    <td className="px-unit-lg py-4">
                                        <div className="flex flex-col text-on-surface-variant">
                                            <div className="flex items-center gap-1.5 font-body-sm">
                                                <Calendar className="h-3.5 w-3.5 text-primary/60" />
                                                <span>
                                                    {
                                                        activity.tanggal_pelaksanaan
                                                    }
                                                </span>
                                            </div>
                                            <div className="mt-1 flex items-center gap-1.5 font-label-md opacity-80">
                                                <MapPin className="h-3.5 w-3.5 text-error/60" />
                                                <span className="max-w-[150px] truncate">
                                                    {activity.lokasi_kegiatan}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Cost & Capacity */}
                                    <td className="px-unit-lg py-4">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1 font-body-md font-medium text-on-background">
                                                <DollarSign className="h-3.5 w-3.5 text-green-600" />
                                                <span>
                                                    {formatRupiah(
                                                        activity.biaya_pendaftaran,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="mt-1 flex items-center gap-1 font-label-md text-on-surface-variant/80">
                                                <Users className="h-3.5 w-3.5 text-primary/60" />
                                                <span>
                                                    Kuota:{' '}
                                                    {activity.kuota_peserta}{' '}
                                                    Orang
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Status & Cancellation Reason */}
                                    <td className="px-unit-lg py-4">
                                        <div className="flex flex-col items-start gap-1">
                                            {activity.status_kegiatan ===
                                            'Dibatalkan' ? (
                                                <span className="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-[12px] font-semibold text-red-700">
                                                    {activity.status_kegiatan}
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        handleStatusTransition(
                                                            activity.id_kegiatan,
                                                            activity.status_kegiatan,
                                                        )
                                                    }
                                                    className={`group/status-badge flex cursor-pointer items-center gap-1.5 rounded-full border-none px-3 py-1 text-[12px] font-semibold shadow-xs transition-all hover:scale-105 hover:shadow-sm active:scale-95 ${
                                                        activity.status_kegiatan ===
                                                        'Selesai'
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200/80'
                                                            : activity.status_kegiatan ===
                                                                'Sedang berlangsung'
                                                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200/80'
                                                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200/80'
                                                    }`}
                                                    title="Klik untuk maju ke tahap selanjutnya"
                                                >
                                                    <span>
                                                        {
                                                            activity.status_kegiatan
                                                        }
                                                    </span>
                                                    <RefreshCw className="h-3 w-3 opacity-60 transition-transform duration-500 group-hover/status-badge:rotate-180 group-hover/status-badge:opacity-100" />
                                                </button>
                                            )}
                                            {activity.status_kegiatan ===
                                                'Dibatalkan' &&
                                                activity.alasan_pembatalan && (
                                                    <span
                                                        className="max-w-[160px] truncate font-label-md text-[11px] text-red-600/90 italic"
                                                        title={
                                                            activity.alasan_pembatalan
                                                        }
                                                    >
                                                        Ket:{' '}
                                                        {
                                                            activity.alasan_pembatalan
                                                        }
                                                    </span>
                                                )}
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-unit-lg py-4 text-right">
                                        <div className="flex justify-end gap-1.5">
                                            {/* View Participants Button */}
                                            <button
                                                onClick={() =>
                                                    router.get(
                                                        `/pembina/kegiatan/${activity.id_kegiatan}/peserta`,
                                                    )
                                                }
                                                className="cursor-pointer rounded-lg p-2 text-primary transition-colors hover:bg-primary-fixed"
                                                title="Lihat Daftar Peserta"
                                            >
                                                <Users className="h-4 w-4" />
                                            </button>
                                            {activity.dokumentasi_kegiatan && (
                                                <button
                                                    onClick={() => {
                                                        setPreviewActivity(
                                                            activity,
                                                        );
                                                        setIsPreviewModalOpen(
                                                            true,
                                                        );
                                                    }}
                                                    className="cursor-pointer rounded-lg p-2 text-primary transition-colors hover:bg-primary-fixed"
                                                    title="Preview Dokumen Kegiatan"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                            )}

                                            {/* Edit Button */}
                                            <button
                                                onClick={() =>
                                                    openEditModal(activity)
                                                }
                                                className="cursor-pointer rounded-lg p-2 text-primary transition-colors hover:bg-primary-fixed"
                                                title="Edit Detail Kegiatan"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>

                                            {/* Cancel Button */}
                                            {activity.status_kegiatan !==
                                                'Dibatalkan' && (
                                                <button
                                                    onClick={() =>
                                                        openCancelModal(
                                                            activity,
                                                        )
                                                    }
                                                    className="cursor-pointer rounded-lg p-2 text-error transition-colors hover:bg-error-container"
                                                    title="Batalkan Kegiatan"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                </button>
                                            )}

                                            {/* Delete Button */}
                                            <button
                                                onClick={() =>
                                                    handleDeleteActivity(
                                                        activity.id_kegiatan,
                                                    )
                                                }
                                                className="cursor-pointer rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                                                title="Hapus Kegiatan"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredActivities.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-unit-lg py-8 text-center font-body-md text-on-surface-variant"
                                    >
                                        Tidak ada kegiatan yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col items-center justify-between gap-unit-md border-t border-outline-variant bg-surface-container-low px-unit-lg py-4 md:flex-row">
                    <span className="font-body-sm text-on-surface-variant">
                        Menampilkan 1-{filteredActivities.length} dari{' '}
                        {filteredActivities.length} data
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

            {/* Create Activity Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
                        onClick={() => setIsCreateModalOpen(false)}
                    ></div>
                    <div className="relative z-10 w-full max-w-lg animate-in rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-xl duration-150 fade-in-50 zoom-in-95">
                        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-unit-sm">
                            <h3 className="font-headline-sm font-bold text-primary">
                                Tambah Kegiatan Baru
                            </h3>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="cursor-pointer text-xl font-bold text-on-surface-variant hover:text-primary"
                            >
                                ×
                            </button>
                        </div>
                        <form
                            onSubmit={handleCreateActivity}
                            className="mt-4 space-y-4"
                        >
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-primary">
                                    UKM Penyelenggara *
                                </label>
                                <select
                                    required
                                    className="w-full cursor-pointer rounded-lg border border-outline-variant bg-background px-3 py-2 text-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    value={formData.id_profil}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            id_profil: Number(e.target.value),
                                        })
                                    }
                                >
                                    <option value="" disabled>
                                        -- Pilih UKM Penyelenggara --
                                    </option>
                                    {profilList.map((profil) => (
                                        <option
                                            key={profil.id_profil}
                                            value={profil.id_profil}
                                        >
                                            {profil.organisasi?.nama_organisasi}{' '}
                                            ({profil.periode_kepengurusan})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-primary">
                                    Nama Kegiatan *
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-lg border border-outline-variant bg-background px-3 py-2 text-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    placeholder="Contoh: Seminar Nasional AI 2026"
                                    value={formData.nama_kegiatan}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            nama_kegiatan: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-primary">
                                        Jenis Kegiatan *
                                    </label>
                                    <select
                                        className="w-full cursor-pointer rounded-lg border border-outline-variant bg-background px-3 py-2 text-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        value={formData.jenis_kegiatan}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                jenis_kegiatan: e.target
                                                    .value as Activity['jenis_kegiatan'],
                                            })
                                        }
                                    >
                                        <option value="Seminar">Seminar</option>
                                        <option value="Pelatihan">
                                            Pelatihan
                                        </option>
                                        <option value="Lomba">Lomba</option>
                                        <option value="Pengabdian Masyarakat">
                                            Pengabdian Masyarakat
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-primary">
                                        Tanggal Pelaksanaan *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full cursor-pointer rounded-lg border border-outline-variant bg-background px-3 py-2 text-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        value={formData.tanggal_pelaksanaan}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                tanggal_pelaksanaan:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-primary">
                                        Biaya Pendaftaran (Rp) *
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        required
                                        className="w-full rounded-lg border border-outline-variant bg-background px-3 py-2 text-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        placeholder="0 untuk gratis"
                                        value={formData.biaya_pendaftaran}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                biaya_pendaftaran: Number(
                                                    e.target.value,
                                                ),
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-primary">
                                        Kuota Peserta *
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        required
                                        className="w-full rounded-lg border border-outline-variant bg-background px-3 py-2 text-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        value={formData.kuota_peserta}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                kuota_peserta: Number(
                                                    e.target.value,
                                                ),
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-primary">
                                    Lokasi Kegiatan *
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-lg border border-outline-variant bg-background px-3 py-2 text-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    placeholder="Contoh: Aula STIKOM Renon / Online Zoom"
                                    value={formData.lokasi_kegiatan}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            lokasi_kegiatan: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-primary">
                                    Deskripsi Kegiatan *
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full resize-none rounded-lg border border-outline-variant bg-background px-3 py-2 text-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    placeholder="Jelaskan ringkasan agenda atau rincian kegiatan..."
                                    value={formData.deskripsi_kegiatan}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            deskripsi_kegiatan: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="flex justify-end gap-2 border-t border-outline-variant/60 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="cursor-pointer"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    className="cursor-pointer bg-primary text-on-primary hover:opacity-90"
                                >
                                    Simpan Kegiatan
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Activity Modal */}
            {isEditModalOpen && activeActivity && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
                        onClick={() => setIsEditModalOpen(false)}
                    ></div>
                    <div className="relative z-10 w-full max-w-lg animate-in rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-xl duration-150 fade-in-50 zoom-in-95">
                        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-unit-sm">
                            <h3 className="font-headline-sm font-bold text-primary">
                                Ubah Detail Kegiatan
                            </h3>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="cursor-pointer text-xl font-bold text-on-surface-variant hover:text-primary"
                            >
                                ×
                            </button>
                        </div>
                        <form
                            onSubmit={handleEditActivity}
                            className="mt-4 space-y-4"
                        >
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-primary">
                                    UKM Penyelenggara *
                                </label>
                                <select
                                    required
                                    className="w-full cursor-pointer rounded-lg border border-outline-variant bg-background px-3 py-2 text-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    value={formData.id_profil}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            id_profil: Number(e.target.value),
                                        })
                                    }
                                >
                                    {profilList.map((profil) => (
                                        <option
                                            key={profil.id_profil}
                                            value={profil.id_profil}
                                        >
                                            {profil.organisasi?.nama_organisasi}{' '}
                                            ({profil.periode_kepengurusan})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-primary">
                                    Nama Kegiatan *
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-lg border border-outline-variant bg-background px-3 py-2 text-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    value={formData.nama_kegiatan}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            nama_kegiatan: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-primary">
                                        Jenis Kegiatan *
                                    </label>
                                    <select
                                        className="w-full cursor-pointer rounded-lg border border-outline-variant bg-background px-3 py-2 text-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        value={formData.jenis_kegiatan}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                jenis_kegiatan: e.target
                                                    .value as Activity['jenis_kegiatan'],
                                            })
                                        }
                                    >
                                        <option value="Seminar">Seminar</option>
                                        <option value="Pelatihan">
                                            Pelatihan
                                        </option>
                                        <option value="Lomba">Lomba</option>
                                        <option value="Pengabdian Masyarakat">
                                            Pengabdian Masyarakat
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-primary">
                                        Tanggal Pelaksanaan *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full cursor-pointer rounded-lg border border-outline-variant bg-background px-3 py-2 text-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        value={formData.tanggal_pelaksanaan}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                tanggal_pelaksanaan:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-primary">
                                        Biaya Pendaftaran (Rp) *
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        required
                                        className="w-full rounded-lg border border-outline-variant bg-background px-3 py-2 text-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        value={formData.biaya_pendaftaran}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                biaya_pendaftaran: Number(
                                                    e.target.value,
                                                ),
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-primary">
                                        Kuota Peserta *
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        required
                                        className="w-full rounded-lg border border-outline-variant bg-background px-3 py-2 text-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        value={formData.kuota_peserta}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                kuota_peserta: Number(
                                                    e.target.value,
                                                ),
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-primary">
                                    Lokasi Kegiatan *
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-lg border border-outline-variant bg-background px-3 py-2 text-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    value={formData.lokasi_kegiatan}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            lokasi_kegiatan: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-primary">
                                    Deskripsi Kegiatan *
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full resize-none rounded-lg border border-outline-variant bg-background px-3 py-2 text-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    value={formData.deskripsi_kegiatan}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            deskripsi_kegiatan: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="flex justify-end gap-2 border-t border-outline-variant/60 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="cursor-pointer"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    className="cursor-pointer bg-primary text-on-primary hover:opacity-90"
                                >
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Cancel Activity Modal */}
            {isCancelModalOpen && activeActivity && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
                        onClick={() => setIsCancelModalOpen(false)}
                    ></div>
                    <div className="relative z-10 w-full max-w-md animate-in rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-xl duration-150 fade-in-50 zoom-in-95">
                        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-unit-sm">
                            <h3 className="flex items-center gap-2 font-headline-sm font-bold text-error">
                                <AlertCircle className="h-5 w-5" />
                                Batalkan Kegiatan
                            </h3>
                            <button
                                onClick={() => setIsCancelModalOpen(false)}
                                className="cursor-pointer text-xl font-bold text-on-surface-variant hover:text-primary"
                            >
                                ×
                            </button>
                        </div>
                        <form
                            onSubmit={handleCancelActivity}
                            className="mt-4 space-y-4"
                        >
                            <p className="font-body-sm text-on-surface-variant">
                                Anda akan membatalkan kegiatan{' '}
                                <strong className="text-primary">
                                    {activeActivity.nama_kegiatan}
                                </strong>
                                . Masukkan alasan pembatalan untuk memberikan
                                kejelasan bagi calon pendaftar.
                            </p>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-primary">
                                    Alasan Pembatalan *
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full resize-none rounded-lg border border-outline-variant bg-background px-3 py-2 text-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    placeholder="Contoh: Bentrok dengan agenda Ujian Tengah Semester (UTS) / Kekurangan alokasi dana..."
                                    value={cancellationReasonInput}
                                    onChange={(e) =>
                                        setCancellationReasonInput(
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>

                            <div className="flex justify-end gap-2 border-t border-outline-variant/60 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsCancelModalOpen(false)}
                                    className="cursor-pointer"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    className="cursor-pointer bg-error text-on-error hover:opacity-90"
                                >
                                    Ya, Batalkan Kegiatan
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ===================== Export Modal ===================== */}
            {isExportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-16">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsExportModalOpen(false)}
                    />

                    <div className="relative z-10 mb-8 w-full max-w-2xl animate-in rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-2xl duration-200 fade-in-50 zoom-in-95">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-outline-variant/60 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                                    <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-headline-sm font-bold text-primary">
                                        Buat Laporan Kegiatan
                                    </h3>
                                    <p className="text-xs text-on-surface-variant">
                                        Pilih filter &amp; pengurutan sebelum
                                        membuat laporan
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsExportModalOpen(false)}
                                className="cursor-pointer rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
                            >
                                <XCircle className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-6 p-6">
                            {/* ── Filter Section ── */}
                            <section>
                                <div className="mb-3 flex items-center gap-2">
                                    <SlidersHorizontal className="h-4 w-4 text-primary" />
                                    <span className="font-label-lg font-semibold text-primary">
                                        Filter Data
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {/* Status Filter */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
                                            Status Kegiatan
                                        </label>
                                        <select
                                            value={exportFilters.status}
                                            onChange={(e) =>
                                                setExportFilters({
                                                    ...exportFilters,
                                                    status: e.target
                                                        .value as typeof exportFilters.status,
                                                })
                                            }
                                            className="w-full cursor-pointer appearance-none rounded-lg border border-outline-variant bg-background px-3 py-2.5 text-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        >
                                            <option value="Semua">
                                                Semua Status
                                            </option>
                                            <option value="Mendatang">
                                                Mendatang
                                            </option>
                                            <option value="Sedang berlangsung">
                                                Sedang Berlangsung
                                            </option>
                                            <option value="Selesai">
                                                Selesai
                                            </option>
                                            <option value="Dibatalkan">
                                                Dibatalkan
                                            </option>
                                        </select>
                                    </div>

                                    {/* Jenis Filter */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
                                            Jenis Kegiatan
                                        </label>
                                        <select
                                            value={exportFilters.jenis}
                                            onChange={(e) =>
                                                setExportFilters({
                                                    ...exportFilters,
                                                    jenis: e.target
                                                        .value as typeof exportFilters.jenis,
                                                })
                                            }
                                            className="w-full cursor-pointer appearance-none rounded-lg border border-outline-variant bg-background px-3 py-2.5 text-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        >
                                            <option value="Semua">
                                                Semua Jenis
                                            </option>
                                            <option value="Seminar">
                                                Seminar
                                            </option>
                                            <option value="Pelatihan">
                                                Pelatihan
                                            </option>
                                            <option value="Lomba">Lomba</option>
                                            <option value="Pengabdian Masyarakat">
                                                Pengabdian Masyarakat
                                            </option>
                                        </select>
                                    </div>

                                    {/* Date From */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
                                            Tanggal Mulai
                                        </label>
                                        <input
                                            type="date"
                                            value={exportFilters.tanggalMulai}
                                            onChange={(e) =>
                                                setExportFilters({
                                                    ...exportFilters,
                                                    tanggalMulai:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full cursor-pointer rounded-lg border border-outline-variant bg-background px-3 py-2.5 text-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>

                                    {/* Date To */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
                                            Tanggal Akhir
                                        </label>
                                        <input
                                            type="date"
                                            value={exportFilters.tanggalAkhir}
                                            onChange={(e) =>
                                                setExportFilters({
                                                    ...exportFilters,
                                                    tanggalAkhir:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full cursor-pointer rounded-lg border border-outline-variant bg-background px-3 py-2.5 text-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Divider */}
                            <div className="border-t border-outline-variant/40" />

                            {/* ── Sort Section ── */}
                            <section>
                                <div className="mb-3 flex items-center gap-2">
                                    <ArrowUpDown className="h-4 w-4 text-primary" />
                                    <span className="font-label-lg font-semibold text-primary">
                                        Pengurutan
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
                                            Urutkan Berdasarkan
                                        </label>
                                        <select
                                            value={exportSort.field}
                                            onChange={(e) =>
                                                setExportSort({
                                                    ...exportSort,
                                                    field: e.target
                                                        .value as typeof exportSort.field,
                                                })
                                            }
                                            className="w-full cursor-pointer appearance-none rounded-lg border border-outline-variant bg-background px-3 py-2.5 text-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        >
                                            <option value="tanggal_pelaksanaan">
                                                Tanggal Pelaksanaan
                                            </option>
                                            <option value="nama_kegiatan">
                                                Nama Kegiatan (A–Z)
                                            </option>
                                            <option value="biaya_pendaftaran">
                                                Biaya Pendaftaran
                                            </option>
                                            <option value="kuota_peserta">
                                                Kuota Peserta
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
                                            Arah Urutan
                                        </label>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setExportSort({
                                                        ...exportSort,
                                                        direction: 'asc',
                                                    })
                                                }
                                                className={`flex-1 cursor-pointer rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                                                    exportSort.direction ===
                                                    'asc'
                                                        ? 'border-primary bg-primary text-on-primary'
                                                        : 'border-outline-variant bg-background text-on-surface-variant hover:border-primary/50'
                                                }`}
                                            >
                                                ↑ A–Z / Terkecil
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setExportSort({
                                                        ...exportSort,
                                                        direction: 'desc',
                                                    })
                                                }
                                                className={`flex-1 cursor-pointer rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                                                    exportSort.direction ===
                                                    'desc'
                                                        ? 'border-primary bg-primary text-on-primary'
                                                        : 'border-outline-variant bg-background text-on-surface-variant hover:border-primary/50'
                                                }`}
                                            >
                                                ↓ Z–A / Terbesar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Divider */}
                            <div className="border-t border-outline-variant/40" />

                            {/* ── Arsip Laporan Section ── */}
                            <section>
                                <div className="mb-3 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    <span className="font-label-lg font-semibold text-primary">
                                        Arsip Laporan (Simpan ke Sistem)
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {/* Format */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
                                            Format Dokumen Laporan
                                        </label>
                                        <div className="flex gap-4 py-2">
                                            <label className="flex cursor-pointer items-center gap-2 text-sm text-on-surface-variant">
                                                <input
                                                    type="radio"
                                                    name="reportFormat"
                                                    checked={
                                                        reportFormat === 'pdf'
                                                    }
                                                    onChange={() =>
                                                        setReportFormat('pdf')
                                                    }
                                                    className="h-4 w-4 accent-primary"
                                                />
                                                PDF (.pdf)
                                            </label>
                                            <label className="flex cursor-pointer items-center gap-2 text-sm text-on-surface-variant">
                                                <input
                                                    type="radio"
                                                    name="reportFormat"
                                                    checked={
                                                        reportFormat === 'excel'
                                                    }
                                                    onChange={() =>
                                                        setReportFormat('excel')
                                                    }
                                                    className="h-4 w-4 accent-primary"
                                                />
                                                Excel (.xlsx)
                                            </label>
                                        </div>
                                    </div>

                                    {/* Target Organisasi */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
                                            Simpan Laporan Pada Arsip Organisasi
                                            *
                                        </label>
                                        <select
                                            required
                                            value={targetOrganisasiId}
                                            onChange={(e) =>
                                                setTargetOrganisasiId(
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full cursor-pointer rounded-lg border border-outline-variant bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        >
                                            <option value="">
                                                -- Pilih Organisasi --
                                            </option>
                                            {profilList.map((profil) => (
                                                <option
                                                    key={profil.id_profil}
                                                    value={profil.id_organisasi.toString()}
                                                >
                                                    {profil.organisasi
                                                        ?.nama_organisasi ??
                                                        `Profil #${profil.id_profil}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </section>

                            {/* Divider */}
                            <div className="border-t border-outline-variant/40" />

                            {/* ── Preview Count ── */}
                            <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                                <Info className="h-4 w-4 shrink-0 text-primary" />
                                <span className="text-sm text-on-surface-variant">
                                    Berdasarkan filter ini,{' '}
                                    <strong className="text-primary">
                                        {getExportData().length} kegiatan
                                    </strong>{' '}
                                    akan diikutsertakan dalam ekspor dari total{' '}
                                    <strong>{activities.length}</strong> data.
                                </span>
                            </div>

                            {/* ── Action Buttons ── */}
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsExportModalOpen(false)}
                                    className="h-auto cursor-pointer py-2.5"
                                    disabled={isArchiving}
                                >
                                    Tutup
                                </Button>

                                <button
                                    type="button"
                                    onClick={handleCreateAndArchiveReport}
                                    disabled={
                                        isArchiving ||
                                        !targetOrganisasiId ||
                                        getExportData().length === 0
                                    }
                                    className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <FileText className="h-4 w-4" />
                                    {isArchiving
                                        ? 'Mengarsipkan...'
                                        : 'Buat & Simpan Laporan'}
                                </button>
                            </DialogFooter>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Document Modal */}
            {isPreviewModalOpen &&
                previewActivity &&
                previewActivity.dokumentasi_kegiatan && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
                            onClick={() => {
                                setIsPreviewModalOpen(false);
                                setPreviewActivity(null);
                            }}
                        ></div>
                        <div className="relative z-10 flex max-h-[90vh] w-full max-w-4xl animate-in flex-col rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-xl duration-150 fade-in-50 zoom-in-95">
                            {/* Header */}
                            <div className="flex shrink-0 items-center justify-between border-b border-outline-variant/60 pb-unit-sm">
                                <div className="flex items-center gap-2.5">
                                    <h3 className="font-headline-sm font-bold text-primary">
                                        Preview Dokumen:{' '}
                                        {previewActivity.nama_kegiatan}
                                    </h3>
                                    <span
                                        className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                            previewActivity.dokumentasi_kegiatan
                                                .status_dokumentasi ===
                                            'Diterima'
                                                ? 'bg-green-100 text-green-700'
                                                : previewActivity
                                                        .dokumentasi_kegiatan
                                                        .status_dokumentasi ===
                                                    'Butuh Revisi'
                                                  ? 'bg-red-100 text-red-700'
                                                  : 'bg-blue-100 text-blue-700'
                                        }`}
                                    >
                                        Status:{' '}
                                        {
                                            previewActivity.dokumentasi_kegiatan
                                                .status_dokumentasi
                                        }
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsPreviewModalOpen(false);
                                        setPreviewActivity(null);
                                    }}
                                    className="cursor-pointer text-2xl font-bold text-on-surface-variant transition-colors hover:text-primary"
                                >
                                    &times;
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="mt-4 flex-1 space-y-6 overflow-y-auto pr-1">
                                {/* Proposal Preview Section */}
                                <div className="space-y-2">
                                    <h4 className="flex items-center justify-between text-sm font-semibold text-primary">
                                        <span>Dokumen Proposal</span>
                                        {previewActivity.dokumentasi_kegiatan
                                            .dokumen_proposal && (
                                            <a
                                                href={
                                                    previewActivity
                                                        .dokumentasi_kegiatan
                                                        .dokumen_proposal
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                                            >
                                                <Download className="h-3.5 w-3.5" />{' '}
                                                Unduh
                                            </a>
                                        )}
                                    </h4>
                                    {previewActivity.dokumentasi_kegiatan
                                        .dokumen_proposal ? (
                                        isPdf(
                                            previewActivity.dokumentasi_kegiatan
                                                .dokumen_proposal,
                                        ) ? (
                                            <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low shadow-inner">
                                                <iframe
                                                    src={`${previewActivity.dokumentasi_kegiatan.dokumen_proposal}#toolbar=0&navpanes=0`}
                                                    className="h-[1000px] w-full border-none"
                                                    title="Proposal PDF Preview"
                                                />
                                            </div>
                                        ) : (
                                            <div className="rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-xs">
                                                <span className="font-medium text-on-surface-variant">
                                                    {getFileName(
                                                        previewActivity
                                                            .dokumentasi_kegiatan
                                                            .dokumen_proposal,
                                                    )}
                                                </span>
                                                <p className="mt-1 text-[11px] text-on-surface-variant/70 italic">
                                                    * Preview hanya tersedia
                                                    untuk file PDF. Silakan
                                                    unduh untuk melihat dokumen
                                                    Word.
                                                </p>
                                            </div>
                                        )
                                    ) : (
                                        <p className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-3 text-xs text-on-surface-variant/60 italic">
                                            Dokumen proposal belum diunggah.
                                        </p>
                                    )}
                                </div>

                                {/* LPJ Preview Section */}
                                <div className="space-y-2 border-t border-outline-variant/40 pt-4">
                                    <h4 className="flex items-center justify-between text-sm font-semibold text-primary">
                                        <span>
                                            Dokumen LPJ (Laporan
                                            Pertanggungjawaban)
                                        </span>
                                        {previewActivity.dokumentasi_kegiatan
                                            .dokumen_lpj && (
                                            <a
                                                href={
                                                    previewActivity
                                                        .dokumentasi_kegiatan
                                                        .dokumen_lpj
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                                            >
                                                <Download className="h-3.5 w-3.5" />{' '}
                                                Unduh
                                            </a>
                                        )}
                                    </h4>
                                    {previewActivity.dokumentasi_kegiatan
                                        .dokumen_lpj ? (
                                        isPdf(
                                            previewActivity.dokumentasi_kegiatan
                                                .dokumen_lpj,
                                        ) ? (
                                            <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low shadow-inner">
                                                <iframe
                                                    src={`${previewActivity.dokumentasi_kegiatan.dokumen_lpj}#toolbar=0&navpanes=0`}
                                                    className="h-[1000px] w-full border-none"
                                                    title="LPJ PDF Preview"
                                                />
                                            </div>
                                        ) : (
                                            <div className="rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-xs">
                                                <span className="font-medium text-on-surface-variant">
                                                    {getFileName(
                                                        previewActivity
                                                            .dokumentasi_kegiatan
                                                            .dokumen_lpj,
                                                    )}
                                                </span>
                                                <p className="mt-1 text-[11px] text-on-surface-variant/70 italic">
                                                    * Preview hanya tersedia
                                                    untuk file PDF. Silakan
                                                    unduh untuk melihat dokumen
                                                    Word.
                                                </p>
                                            </div>
                                        )
                                    ) : (
                                        <p className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-3 text-xs text-on-surface-variant/60 italic">
                                            Dokumen LPJ belum diunggah.
                                        </p>
                                    )}
                                </div>

                                {/* Hasil Evaluasi Section */}
                                <div className="space-y-2 border-t border-outline-variant/40 pt-4">
                                    <h4 className="flex items-center justify-between text-sm font-semibold text-primary">
                                        <span>
                                            Hasil Evaluasi Kegiatan (Dari
                                            Petugas)
                                        </span>
                                        {previewActivity.dokumentasi_kegiatan
                                            .hasil_evaluasi && (
                                            <a
                                                href={
                                                    previewActivity
                                                        .dokumentasi_kegiatan
                                                        .hasil_evaluasi
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                                            >
                                                <Download className="h-3.5 w-3.5" />{' '}
                                                Unduh
                                            </a>
                                        )}
                                    </h4>
                                    {previewActivity.dokumentasi_kegiatan
                                        .hasil_evaluasi ? (
                                        isPdf(
                                            previewActivity.dokumentasi_kegiatan
                                                .hasil_evaluasi,
                                        ) ? (
                                            <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low shadow-inner">
                                                <iframe
                                                    src={`${previewActivity.dokumentasi_kegiatan.hasil_evaluasi}#toolbar=0&navpanes=0`}
                                                    className="h-[1000px] w-full border-none"
                                                    title="Evaluasi PDF Preview"
                                                />
                                            </div>
                                        ) : (
                                            <div className="rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-xs">
                                                <span className="font-medium text-on-surface-variant">
                                                    {getFileName(
                                                        previewActivity
                                                            .dokumentasi_kegiatan
                                                            .hasil_evaluasi,
                                                    )}
                                                </span>
                                                <p className="mt-1 text-[11px] text-on-surface-variant/70 italic">
                                                    * Preview hanya tersedia
                                                    untuk file PDF. Silakan
                                                    unduh untuk melihat dokumen
                                                    Word.
                                                </p>
                                            </div>
                                        )
                                    ) : (
                                        <p className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-3 text-xs text-on-surface-variant/60 italic">
                                            Hasil Evaluasi Kegiatan belum
                                            diunggah.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex shrink-0 justify-end border-t border-outline-variant/60 pt-4">
                                <Button
                                    onClick={() => {
                                        setIsPreviewModalOpen(false);
                                        setPreviewActivity(null);
                                    }}
                                    className="cursor-pointer bg-primary text-on-primary hover:opacity-95"
                                >
                                    Tutup
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
        </main>
    );
}
