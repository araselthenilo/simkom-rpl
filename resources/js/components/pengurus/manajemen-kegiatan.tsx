import {
    Calendar,
    Search,
    MapPin,
    PlusCircle,
    CheckCircle2,
    XCircle,
    Edit2,
    Trash2,
    Download,
    ArrowRight,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    Tag,
    DollarSign,
    Users,
    AlertCircle,
    Info,
    RefreshCw
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
    status_kegiatan: 'Mendatang' | 'Sedang berlangsung' | 'Selesai' | 'Dibatalkan';
    alasan_pembatalan: string | null;
}

export default function ManajemenKegiatan() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'Semua' | 'Mendatang' | 'Sedang berlangsung' | 'Selesai' | 'Dibatalkan'>('Semua');
    const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

    // Sample database-backed kegiatan data state
    const [activities, setActivities] = useState<Activity[]>([
        {
            id_kegiatan: 1,
            id_profil: 101,
            username_petugas: 'admin_budi',
            nama_kegiatan: 'Seminar IT Nasional: Masa Depan Web Modern & AI',
            jenis_kegiatan: 'Seminar',
            deskripsi_kegiatan: 'Seminar nasional yang membahas perkembangan teknologi web terbaru dan integrasi kecerdasan buatan dalam pengembangan aplikasi masa kini.',
            biaya_pendaftaran: 50000,
            tanggal_pelaksanaan: '2026-06-15',
            lokasi_kegiatan: 'Aula Kampus Renon',
            kuota_peserta: 300,
            status_kegiatan: 'Mendatang',
            alasan_pembatalan: null,
        },
        {
            id_kegiatan: 2,
            id_profil: 101,
            username_petugas: 'admin_budi',
            nama_kegiatan: 'Pelatihan UI/UX: Menguasai Auto-Layout & Design System',
            jenis_kegiatan: 'Pelatihan',
            deskripsi_kegiatan: 'Workshop mendalam tentang pembuatan design system berskala besar di Figma dan taktik optimal auto-layout.',
            biaya_pendaftaran: 25000,
            tanggal_pelaksanaan: '2026-06-08',
            lokasi_kegiatan: 'Lab Komputer 3',
            kuota_peserta: 40,
            status_kegiatan: 'Mendatang',
            alasan_pembatalan: null,
        },
        {
            id_kegiatan: 3,
            id_profil: 102,
            username_petugas: 'admin_sari',
            nama_kegiatan: 'Lomba Hackathon: Solusi Cerdas untuk Lingkungan',
            jenis_kegiatan: 'Lomba',
            deskripsi_kegiatan: 'Kompetisi coding 24 jam untuk merancang solusi digital ramah lingkungan dan keberlanjutan energi.',
            biaya_pendaftaran: 150000,
            tanggal_pelaksanaan: '2026-05-20',
            lokasi_kegiatan: 'Gedung IT Center STIKOM',
            kuota_peserta: 20,
            status_kegiatan: 'Selesai',
            alasan_pembatalan: null,
        },
        {
            id_kegiatan: 4,
            id_profil: 101,
            username_petugas: 'admin_budi',
            nama_kegiatan: 'Pengabdian Masyarakat: Hijaukan Pantai Serangan',
            jenis_kegiatan: 'Pengabdian Masyarakat',
            deskripsi_kegiatan: 'Kegiatan sosial penanaman bibit pohon mangrove bersama komunitas pecinta alam Bali.',
            biaya_pendaftaran: 0,
            tanggal_pelaksanaan: '2026-04-10',
            lokasi_kegiatan: 'Pantai Melasti Serangan',
            kuota_peserta: 100,
            status_kegiatan: 'Selesai',
            alasan_pembatalan: null,
        },
        {
            id_kegiatan: 5,
            id_profil: 103,
            username_petugas: 'admin_budi',
            nama_kegiatan: 'Seminar Cyber Security: Melindungi Aset Digital Organisasi',
            jenis_kegiatan: 'Seminar',
            deskripsi_kegiatan: 'Pengenalan konsep dasar keamanan informasi dan ancaman cyber terkini di era transformasi digital.',
            biaya_pendaftaran: 0,
            tanggal_pelaksanaan: '2026-06-05',
            lokasi_kegiatan: 'Online via Zoom',
            kuota_peserta: 500,
            status_kegiatan: 'Sedang berlangsung',
            alasan_pembatalan: null,
        },
        {
            id_kegiatan: 6,
            id_profil: 101,
            username_petugas: 'admin_budi',
            nama_kegiatan: 'Lomba DevFest STIKOM 2026',
            jenis_kegiatan: 'Lomba',
            deskripsi_kegiatan: 'Festival kompetisi teknologi tingkat regional.',
            biaya_pendaftaran: 75000,
            tanggal_pelaksanaan: '2026-06-25',
            lokasi_kegiatan: 'Gedung Aula Kampus STIKOM',
            kuota_peserta: 150,
            status_kegiatan: 'Dibatalkan',
            alasan_pembatalan: 'Kurangnya alokasi dana dan bentrok dengan jadwal ujian akhir semester.',
        }
    ]);

    // Modal state controllers
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [activeActivity, setActiveActivity] = useState<Activity | null>(null);

    // Form inputs state
    const [formData, setFormData] = useState({
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
    const totalUpcoming = activities.filter(a => a.status_kegiatan === 'Mendatang').length;
    const totalActiveOrFinished = activities.filter(a => a.status_kegiatan === 'Sedang berlangsung' || a.status_kegiatan === 'Selesai').length;
    const totalCancelled = activities.filter(a => a.status_kegiatan === 'Dibatalkan').length;

    // Currency Formatter
    const formatRupiah = (value: number) => {
        if (value === 0) {
return 'Gratis';
}

        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value).replace('IDR', 'Rp');
    };

    // Filter and search activities list
    const filteredActivities = activities.filter(activity => {
        const matchesSearch = activity.nama_kegiatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
            activity.lokasi_kegiatan.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = activeTab === 'Semua' || activity.status_kegiatan === activeTab;
        const matchesCategory = selectedCategory === 'Semua' || activity.jenis_kegiatan === selectedCategory;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    // Form handlers
    const openCreateModal = () => {
        setFormData({
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

        if (!formData.nama_kegiatan || !formData.lokasi_kegiatan || !formData.deskripsi_kegiatan) {
            alert('Harap isi semua kolom wajib!');

            return;
        }

        const newActivity: Activity = {
            id_kegiatan: Date.now(),
            id_profil: 101,
            username_petugas: 'testuser',
            nama_kegiatan: formData.nama_kegiatan,
            jenis_kegiatan: formData.jenis_kegiatan,
            deskripsi_kegiatan: formData.deskripsi_kegiatan,
            biaya_pendaftaran: Number(formData.biaya_pendaftaran),
            tanggal_pelaksanaan: formData.tanggal_pelaksanaan,
            lokasi_kegiatan: formData.lokasi_kegiatan,
            kuota_peserta: Number(formData.kuota_peserta),
            status_kegiatan: 'Mendatang',
            alasan_pembatalan: null,
        };

        setActivities(prev => [newActivity, ...prev]);
        setIsCreateModalOpen(false);
    };

    const openEditModal = (activity: Activity) => {
        setActiveActivity(activity);
        setFormData({
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

        setActivities(prev =>
            prev.map(item =>
                item.id_kegiatan === activeActivity.id_kegiatan
                    ? {
                        ...item,
                        nama_kegiatan: formData.nama_kegiatan,
                        jenis_kegiatan: formData.jenis_kegiatan,
                        deskripsi_kegiatan: formData.deskripsi_kegiatan,
                        biaya_pendaftaran: Number(formData.biaya_pendaftaran),
                        tanggal_pelaksanaan: formData.tanggal_pelaksanaan,
                        lokasi_kegiatan: formData.lokasi_kegiatan,
                        kuota_peserta: Number(formData.kuota_peserta),
                    }
                    : item
            )
        );
        setIsEditModalOpen(false);
        setActiveActivity(null);
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

        setActivities(prev =>
            prev.map(item =>
                item.id_kegiatan === activeActivity.id_kegiatan
                    ? {
                        ...item,
                        status_kegiatan: 'Dibatalkan',
                        alasan_pembatalan: cancellationReasonInput,
                    }
                    : item
            )
        );
        setIsCancelModalOpen(false);
        setActiveActivity(null);
    };

    const handleDeleteActivity = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) {
            setActivities(prev => prev.filter(item => item.id_kegiatan !== id));
        }
    };

    const handleStatusTransition = (id: number, currentStatus: Activity['status_kegiatan']) => {
        let nextStatus: Activity['status_kegiatan'] = 'Mendatang';

        if (currentStatus === 'Mendatang') {
            nextStatus = 'Sedang berlangsung';
        } else if (currentStatus === 'Sedang berlangsung') {
            nextStatus = 'Selesai';
        } else if (currentStatus === 'Selesai') {
            nextStatus = 'Mendatang';
        }

        setActivities(prev =>
            prev.map(item =>
                item.id_kegiatan === id
                    ? { ...item, status_kegiatan: nextStatus, alasan_pembatalan: null }
                    : item
            )
        );
    };

    return (
        <main className="p-margin-desktop max-w-container-max mx-auto w-full space-y-gutter">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-unit-md mb-unit-xl">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary">Manajemen Kegiatan</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                        Kelola pendaftaran, lokasi, biaya, dan status pelaksanaan kegiatan organisasi.
                    </p>
                </div>
                <div className="flex gap-unit-sm w-full md:w-auto">
                    <Button
                        onClick={openCreateModal}
                        className="bg-primary text-on-primary px-6 py-3 h-auto rounded-lg font-label-lg flex items-center justify-center gap-2 shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none w-full md:w-auto"
                    >
                        <PlusCircle className="h-[18px] w-[18px]" />
                        Kegiatan Baru
                    </Button>
                </div>
            </header>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-unit-xl">
                <Card className="bg-surface-container-lowest p-unit-lg rounded-xl shadow-[0px_2px_4px_rgba(26,54,93,0.05)] border border-outline-variant flex flex-col justify-between h-32 ring-0">
                    <div className="flex justify-between items-start">
                        <span className="text-primary/70 font-label-md">Total Kegiatan</span>
                        <Calendar className="text-primary/40 h-5 w-5" />
                    </div>
                    <div className="font-headline-md text-headline-md text-primary font-bold">
                        {totalActivities}
                    </div>
                </Card>
                <Card className="bg-surface-container-lowest p-unit-lg rounded-xl shadow-[0px_2px_4px_rgba(26,54,93,0.05)] border border-outline-variant flex flex-col justify-between h-32 ring-0">
                    <div className="flex justify-between items-start">
                        <span className="text-secondary font-label-md">Kegiatan Mendatang</span>
                        <Info className="text-secondary/40 h-5 w-5" />
                    </div>
                    <div className="font-headline-md text-headline-md text-secondary font-bold">
                        {totalUpcoming}
                    </div>
                </Card>
                <Card className="bg-surface-container-lowest p-unit-lg rounded-xl shadow-[0px_2px_4px_rgba(26,54,93,0.05)] border border-outline-variant flex flex-col justify-between h-32 ring-0">
                    <div className="flex justify-between items-start">
                        <span className="text-green-700 font-label-md">Aktif / Selesai</span>
                        <CheckCircle2 className="text-green-700/40 h-5 w-5" />
                    </div>
                    <div className="font-headline-md text-headline-md text-green-700 font-bold">
                        {totalActiveOrFinished}
                    </div>
                </Card>
                <Card className="bg-surface-container-lowest p-unit-lg rounded-xl shadow-[0px_2px_4px_rgba(26,54,93,0.05)] border border-outline-variant flex flex-col justify-between h-32 ring-0">
                    <div className="flex justify-between items-start">
                        <span className="text-error font-label-md">Dibatalkan</span>
                        <XCircle className="text-error/40 h-5 w-5" />
                    </div>
                    <div className="font-headline-md text-headline-md text-error font-bold">
                        {totalCancelled}
                    </div>
                </Card>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-surface-container-lowest rounded-xl shadow-[0px_2px_4px_rgba(26,54,93,0.05)] border border-outline-variant p-unit-md mb-unit-lg flex flex-col lg:flex-row justify-between items-center gap-unit-md">
                {/* Status Tab Filters */}
                <div className="flex p-1 bg-surface-container-low rounded-lg w-full lg:w-auto overflow-x-auto">
                    {(['Semua', 'Mendatang', 'Sedang berlangsung', 'Selesai', 'Dibatalkan'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-md font-label-lg transition-all text-nowrap cursor-pointer ${activeTab === tab
                                ? 'bg-white shadow-sm text-primary font-semibold'
                                : 'text-on-surface-variant hover:text-primary'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Search & Category Filter */}
                <div className="flex flex-col sm:flex-row gap-unit-md w-full lg:w-auto items-stretch sm:items-center">
                    {/* Category Select */}
                    <div className="relative w-full sm:w-48">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-3 py-2 bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-sm text-on-background appearance-none cursor-pointer pr-10"
                        >
                            <option value="Semua">Semua Kategori</option>
                            <option value="Seminar">Seminar</option>
                            <option value="Pelatihan">Pelatihan</option>
                            <option value="Lomba">Lomba</option>
                            <option value="Pengabdian Masyarakat">Pengabdian</option>
                        </select>
                        <Tag className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 h-4 w-4 pointer-events-none" />
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant h-4 w-4" />
                        <input
                            className="w-full pl-10 pr-4 py-2 bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-sm text-on-background"
                            placeholder="Cari kegiatan atau lokasi..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Activities Table */}
            <Card className="bg-surface-container-lowest rounded-xl shadow-[0px_2px_4px_rgba(26,54,93,0.05)] border border-outline-variant overflow-hidden ring-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low border-b border-outline-variant">
                                <th className="px-unit-lg py-4 font-label-lg text-primary uppercase tracking-wider">Nama & Kategori</th>
                                <th className="px-unit-lg py-4 font-label-lg text-primary uppercase tracking-wider">Pelaksanaan & Tempat</th>
                                <th className="px-unit-lg py-4 font-label-lg text-primary uppercase tracking-wider">Biaya & Kuota</th>
                                <th className="px-unit-lg py-4 font-label-lg text-primary uppercase tracking-wider">Status</th>
                                <th className="px-unit-lg py-4 font-label-lg text-primary uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/50">
                            {filteredActivities.map((activity) => (
                                <tr key={activity.id_kegiatan} className="hover:bg-primary/[0.02] transition-colors group">
                                    {/* Name & Category */}
                                    <td className="px-unit-lg py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-body-md font-semibold text-primary group-hover:underline">
                                                {activity.nama_kegiatan}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-primary-fixed text-primary border border-primary/10">
                                                    {activity.jenis_kegiatan}
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
                                                <span>{activity.tanggal_pelaksanaan}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 font-label-md mt-1 opacity-80">
                                                <MapPin className="h-3.5 w-3.5 text-error/60" />
                                                <span className="truncate max-w-[150px]">{activity.lokasi_kegiatan}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Cost & Capacity */}
                                    <td className="px-unit-lg py-4">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1 font-body-md font-medium text-on-background">
                                                <DollarSign className="h-3.5 w-3.5 text-green-600" />
                                                <span>{formatRupiah(activity.biaya_pendaftaran)}</span>
                                            </div>
                                            <div className="flex items-center gap-1 font-label-md text-on-surface-variant/80 mt-1">
                                                <Users className="h-3.5 w-3.5 text-primary/60" />
                                                <span>Kuota: {activity.kuota_peserta} Orang</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Status & Cancellation Reason */}
                                    <td className="px-unit-lg py-4">
                                        <div className="flex flex-col items-start gap-1">
                                            <span
                                                className={`px-3 py-1 rounded-full text-[12px] font-semibold flex items-center gap-1.5 ${activity.status_kegiatan === 'Selesai'
                                                    ? 'bg-green-100 text-green-700'
                                                    : activity.status_kegiatan === 'Sedang berlangsung'
                                                        ? 'bg-amber-100 text-amber-800'
                                                        : activity.status_kegiatan === 'Mendatang'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'bg-red-100 text-red-700'
                                                }`}
                                            >
                                                {activity.status_kegiatan}
                                            </span>
                                            {activity.status_kegiatan === 'Dibatalkan' && activity.alasan_pembatalan && (
                                                <span className="text-[11px] text-red-600/90 font-label-md italic max-w-[160px] truncate" title={activity.alasan_pembatalan}>
                                                    Ket: {activity.alasan_pembatalan}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-unit-lg py-4 text-right">
                                        <div className="flex justify-end gap-1.5">
                                            {/* Change Status Switcher */}
                                            {activity.status_kegiatan !== 'Dibatalkan' && (
                                                <button
                                                    onClick={() => handleStatusTransition(activity.id_kegiatan, activity.status_kegiatan)}
                                                    className="p-2 text-secondary hover:bg-secondary-fixed rounded-lg transition-colors cursor-pointer"
                                                    title="Maju ke Tahap Selanjutnya"
                                                >
                                                    <RefreshCw className="h-4 w-4" />
                                                </button>
                                            )}

                                            {/* Edit Button */}
                                            <button
                                                onClick={() => openEditModal(activity)}
                                                className="p-2 text-primary hover:bg-primary-fixed rounded-lg transition-colors cursor-pointer"
                                                title="Edit Detail Kegiatan"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>

                                            {/* Cancel Button */}
                                            {activity.status_kegiatan !== 'Dibatalkan' && (
                                                <button
                                                    onClick={() => openCancelModal(activity)}
                                                    className="p-2 text-error hover:bg-error-container rounded-lg transition-colors cursor-pointer"
                                                    title="Batalkan Kegiatan"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                </button>
                                            )}

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDeleteActivity(activity.id_kegiatan)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
                                    <td colSpan={5} className="px-unit-lg py-8 text-center text-on-surface-variant font-body-md">
                                        Tidak ada kegiatan yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-unit-lg py-4 bg-surface-container-low border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-unit-md">
                    <span className="font-body-sm text-on-surface-variant">
                        Menampilkan 1-{filteredActivities.length} dari {filteredActivities.length} data
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            className="p-2 rounded-lg hover:bg-surface-container-highest transition-colors text-on-surface-variant disabled:opacity-30 cursor-pointer"
                            disabled
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-label-md cursor-pointer">1</button>
                        <button className="w-8 h-8 rounded-lg hover:bg-surface-container-highest transition-colors font-label-md text-on-surface-variant cursor-pointer" disabled>2</button>
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
                        <h3 className="font-headline-md text-headline-md mb-2">Panduan Pengelolaan Event</h3>
                        <p className="font-body-md opacity-80 mb-6 font-normal">
                            Pastikan pengurus berkoordinasi dengan Bendahara terkait biaya pendaftaran sebelum mendaftarkan kegiatan berbayar baru. Kegiatan yang dibatalkan wajib dicantumkan alasan pembatalannya demi laporan pertanggungjawaban.
                        </p>
                        <a className="inline-flex items-center gap-2 font-label-lg text-secondary-fixed hover:underline" href="#">
                            Lihat SOP Kegiatan STIKOM
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
                        Hubungi admin kemahasiswaan jika terjadi kendala sewa aula kampus.
                    </p>
                    <button className="w-full border-2 border-primary text-primary font-label-lg py-2 rounded-lg hover:bg-primary-fixed transition-colors cursor-pointer font-semibold">
                        Panduan Operator
                    </button>
                </div>
            </div>

            {/* Create Activity Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsCreateModalOpen(false)}></div>
                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant max-w-lg w-full p-unit-lg shadow-xl relative z-10 animate-in fade-in-50 zoom-in-95 duration-150">
                        <div className="flex justify-between items-center pb-unit-sm border-b border-outline-variant/60">
                            <h3 className="font-headline-sm text-primary font-bold">Tambah Kegiatan Baru</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-on-surface-variant hover:text-primary text-xl font-bold cursor-pointer">×</button>
                        </div>
                        <form onSubmit={handleCreateActivity} className="space-y-4 mt-4">
                            <div>
                                <label className="block text-sm font-semibold text-primary mb-1">Nama Kegiatan *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                    placeholder="Contoh: Seminar Nasional AI 2026"
                                    value={formData.nama_kegiatan}
                                    onChange={e => setFormData({ ...formData, nama_kegiatan: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-primary mb-1">Jenis Kegiatan *</label>
                                    <select
                                        className="w-full px-3 py-2 bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm cursor-pointer"
                                        value={formData.jenis_kegiatan}
                                        onChange={e => setFormData({ ...formData, jenis_kegiatan: e.target.value as Activity['jenis_kegiatan'] })}
                                    >
                                        <option value="Seminar">Seminar</option>
                                        <option value="Pelatihan">Pelatihan</option>
                                        <option value="Lomba">Lomba</option>
                                        <option value="Pengabdian Masyarakat">Pengabdian Masyarakat</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-primary mb-1">Tanggal Pelaksanaan *</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full px-3 py-2 bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm cursor-pointer"
                                        value={formData.tanggal_pelaksanaan}
                                        onChange={e => setFormData({ ...formData, tanggal_pelaksanaan: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-primary mb-1">Biaya Pendaftaran (Rp) *</label>
                                    <input
                                        type="number"
                                        min={0}
                                        required
                                        className="w-full px-3 py-2 bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                        placeholder="0 untuk gratis"
                                        value={formData.biaya_pendaftaran}
                                        onChange={e => setFormData({ ...formData, biaya_pendaftaran: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-primary mb-1">Kuota Peserta *</label>
                                    <input
                                        type="number"
                                        min={1}
                                        required
                                        className="w-full px-3 py-2 bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                        value={formData.kuota_peserta}
                                        onChange={e => setFormData({ ...formData, kuota_peserta: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-primary mb-1">Lokasi Kegiatan *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                    placeholder="Contoh: Aula STIKOM Renon / Online Zoom"
                                    value={formData.lokasi_kegiatan}
                                    onChange={e => setFormData({ ...formData, lokasi_kegiatan: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-primary mb-1">Deskripsi Kegiatan *</label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full px-3 py-2 bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none"
                                    placeholder="Jelaskan ringkasan agenda atau rincian kegiatan..."
                                    value={formData.deskripsi_kegiatan}
                                    onChange={e => setFormData({ ...formData, deskripsi_kegiatan: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-outline-variant/60">
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
                                    className="bg-primary text-on-primary hover:opacity-90 cursor-pointer"
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
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsEditModalOpen(false)}></div>
                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant max-w-lg w-full p-unit-lg shadow-xl relative z-10 animate-in fade-in-50 zoom-in-95 duration-150">
                        <div className="flex justify-between items-center pb-unit-sm border-b border-outline-variant/60">
                            <h3 className="font-headline-sm text-primary font-bold">Ubah Detail Kegiatan</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-on-surface-variant hover:text-primary text-xl font-bold cursor-pointer">×</button>
                        </div>
                        <form onSubmit={handleEditActivity} className="space-y-4 mt-4">
                            <div>
                                <label className="block text-sm font-semibold text-primary mb-1">Nama Kegiatan *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                    value={formData.nama_kegiatan}
                                    onChange={e => setFormData({ ...formData, nama_kegiatan: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-primary mb-1">Jenis Kegiatan *</label>
                                    <select
                                        className="w-full px-3 py-2 bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm cursor-pointer"
                                        value={formData.jenis_kegiatan}
                                        onChange={e => setFormData({ ...formData, jenis_kegiatan: e.target.value as Activity['jenis_kegiatan'] })}
                                    >
                                        <option value="Seminar">Seminar</option>
                                        <option value="Pelatihan">Pelatihan</option>
                                        <option value="Lomba">Lomba</option>
                                        <option value="Pengabdian Masyarakat">Pengabdian Masyarakat</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-primary mb-1">Tanggal Pelaksanaan *</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full px-3 py-2 bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm cursor-pointer"
                                        value={formData.tanggal_pelaksanaan}
                                        onChange={e => setFormData({ ...formData, tanggal_pelaksanaan: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-primary mb-1">Biaya Pendaftaran (Rp) *</label>
                                    <input
                                        type="number"
                                        min={0}
                                        required
                                        className="w-full px-3 py-2 bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                        value={formData.biaya_pendaftaran}
                                        onChange={e => setFormData({ ...formData, biaya_pendaftaran: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-primary mb-1">Kuota Peserta *</label>
                                    <input
                                        type="number"
                                        min={1}
                                        required
                                        className="w-full px-3 py-2 bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                        value={formData.kuota_peserta}
                                        onChange={e => setFormData({ ...formData, kuota_peserta: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-primary mb-1">Lokasi Kegiatan *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                    value={formData.lokasi_kegiatan}
                                    onChange={e => setFormData({ ...formData, lokasi_kegiatan: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-primary mb-1">Deskripsi Kegiatan *</label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full px-3 py-2 bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none"
                                    value={formData.deskripsi_kegiatan}
                                    onChange={e => setFormData({ ...formData, deskripsi_kegiatan: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-outline-variant/60">
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
                                    className="bg-primary text-on-primary hover:opacity-90 cursor-pointer"
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
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsCancelModalOpen(false)}></div>
                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant max-w-md w-full p-unit-lg shadow-xl relative z-10 animate-in fade-in-50 zoom-in-95 duration-150">
                        <div className="flex justify-between items-center pb-unit-sm border-b border-outline-variant/60">
                            <h3 className="font-headline-sm text-error font-bold flex items-center gap-2">
                                <AlertCircle className="h-5 w-5" />
                                Batalkan Kegiatan
                            </h3>
                            <button onClick={() => setIsCancelModalOpen(false)} className="text-on-surface-variant hover:text-primary text-xl font-bold cursor-pointer">×</button>
                        </div>
                        <form onSubmit={handleCancelActivity} className="space-y-4 mt-4">
                            <p className="font-body-sm text-on-surface-variant">
                                Anda akan membatalkan kegiatan <strong className="text-primary">{activeActivity.nama_kegiatan}</strong>. Masukkan alasan pembatalan untuk memberikan kejelasan bagi calon pendaftar.
                            </p>
                            <div>
                                <label className="block text-sm font-semibold text-primary mb-1">Alasan Pembatalan *</label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full px-3 py-2 bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none"
                                    placeholder="Contoh: Bentrok dengan agenda Ujian Tengah Semester (UTS) / Kekurangan alokasi dana..."
                                    value={cancellationReasonInput}
                                    onChange={e => setCancellationReasonInput(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-outline-variant/60">
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
                                    className="bg-error text-on-error hover:opacity-90 cursor-pointer"
                                >
                                    Ya, Batalkan Kegiatan
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
