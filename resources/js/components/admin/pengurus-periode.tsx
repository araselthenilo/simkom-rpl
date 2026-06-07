import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Building2, Phone, Search, Users2, Plus, Trash2, Power, AlertCircle } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import admin from '@/routes/admin';

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

interface Pengurus {
    id_pengurus: number;
    id_profil: number;
    id_keanggotaan: number;
    jabatan: string;
    status_aktif: boolean;
    anggota_organisasi?: AnggotaOrganisasi;
}

interface Organisasi {
    id_organisasi: number;
    nama_organisasi: string;
    status_aktif: boolean;
}

interface ProfilOrganisasi {
    id_profil: number;
    id_organisasi: number;
    periode_kepengurusan: string;
    logo_organisasi: string | null;
    deskripsi_organisasi: string;
    status_aktif: boolean;
    organisasi?: Organisasi;
    pengurus_organisasi?: Pengurus[];
}

interface PengurusPeriodeProps {
    profilOrganisasi: ProfilOrganisasi;
    anggotaList?: AnggotaOrganisasi[];
}

export default function PengurusPeriode({
    profilOrganisasi,
    anggotaList = [],
}: PengurusPeriodeProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    // Dialog state
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedMemberId, setSelectedMemberId] = useState('');
    const [position, setPosition] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState('');

    const organisasi = profilOrganisasi?.organisasi;
    const officers = profilOrganisasi?.pengurus_organisasi || [];

    // Filter officers
    const filteredOfficers = officers.filter((officer) => {
        const student = officer.anggota_organisasi?.mahasiswa;
        const name = student?.nama_lengkap?.toLowerCase() || '';
        const nim = student?.nim?.toLowerCase() || '';
        const jabatan = officer.jabatan?.toLowerCase() || '';
        const matchesSearch =
            name.includes(searchTerm.toLowerCase()) ||
            nim.includes(searchTerm.toLowerCase()) ||
            jabatan.includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' && officer.status_aktif) ||
            (statusFilter === 'inactive' && !officer.status_aktif);

        return matchesSearch && matchesStatus;
    });

    const getInitials = (name: string) => {
        if (!name) {
            return '?';
        }

        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    // Helper to get role badge color
    const getRoleBadgeClass = (role: string) => {
        const r = role.toLowerCase();

        if (r.includes('ketua')) {
            return 'bg-blue-100 text-blue-700 border border-blue-200';
        } else if (r.includes('sekretaris')) {
            return 'bg-purple-100 text-purple-700 border border-purple-200';
        } else if (r.includes('bendahara')) {
            return 'bg-amber-100 text-amber-700 border border-amber-200';
        }

        return 'bg-slate-100 text-slate-700 border border-slate-200';
    };

    // Add officer handler
    const handleAddOfficer = () => {
        if (!selectedMemberId) {
            setValidationError('Silakan pilih anggota terlebih dahulu.');

            return;
        }

        if (!position.trim()) {
            setValidationError('Silakan isi jabatan pengurus.');

            return;
        }

        setIsSubmitting(true);
        router.post(
            admin.pengurus.store().url,
            {
                id_profil: profilOrganisasi.id_profil,
                id_keanggotaan: parseInt(selectedMemberId),
                jabatan: position,
                status_aktif: isActive,
            },
            {
                onSuccess: () => {
                    setIsAddOpen(false);
                    setSelectedMemberId('');
                    setPosition('');
                    setIsActive(true);
                    setValidationError('');
                },
                onError: (errors) => {
                    if (errors.id_keanggotaan) {
                        setValidationError(errors.id_keanggotaan);
                    } else if (errors.jabatan) {
                        setValidationError(errors.jabatan);
                    } else {
                        setValidationError('Gagal menambahkan pengurus.');
                    }
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    // Toggle active status handler
    const handleToggleStatus = (id: number, currentStatus: boolean, name: string) => {
        const actionText = currentStatus ? 'menonaktifkan' : 'mengaktifkan';

        if (confirm(`Apakah Anda yakin ingin ${actionText} pengurus "${name}"?`)) {
            router.patch(admin.pengurus.toggle(id).url, {}, { preserveScroll: true });
        }
    };

    // Delete officer handler
    const handleDeleteOfficer = (id: number, name: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus/mengeluarkan pengurus "${name}"?`)) {
            router.delete(admin.pengurus.destroy(id).url, { preserveScroll: true });
        }
    };

    // Filter available candidates from anggotaList that are not already officers in this profile
    const existingMemberIds = officers.map((o) => o.id_keanggotaan);
    const availableCandidates = anggotaList.filter((a) => !existingMemberIds.includes(a.id_keanggotaan));

    return (
        <main className="mx-auto flex w-full max-w-container-max flex-col gap-gutter p-margin-desktop">
            {/* Header / Breadcrumb */}
            <header className="flex flex-col gap-4">
                <Link
                    href={admin.organisasi.profil(organisasi?.id_organisasi ?? 0)}
                    className="decoration-none inline-flex cursor-pointer items-center gap-2 font-label-lg font-semibold text-primary transition-colors hover:text-primary/80"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Riwayat Profil & Pembina
                </Link>

                <div className="mt-2 flex flex-col items-start justify-between gap-unit-md border-b border-outline-variant pb-6 md:flex-row md:items-end">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-3">
                            <h2 className="font-headline-lg text-headline-lg text-primary">
                                Pengurus Organisasi
                            </h2>
                            <span className="bg-primary-fixed flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold text-primary">
                                Periode {profilOrganisasi?.periode_kepengurusan}
                            </span>
                            <span
                                className={`flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold ${
                                    profilOrganisasi?.status_aktif
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                }`}
                            >
                                <span
                                    className={`h-1.5 w-1.5 rounded-full ${profilOrganisasi?.status_aktif ? 'bg-green-700' : 'bg-red-700'}`}
                                />
                                {profilOrganisasi?.status_aktif
                                    ? 'Periode Aktif'
                                    : 'Periode Nonaktif'}
                            </span>
                        </div>
                        <p className="flex items-center gap-2 font-body-md text-on-surface-variant">
                            <Building2 className="h-4 w-4 text-primary/60" />
                            {organisasi?.nama_organisasi}
                        </p>
                    </div>

                    <div className="mt-2 shrink-0 md:mt-0">
                        <button
                            onClick={() => {
                                setSelectedMemberId('');
                                setPosition('');
                                setIsActive(true);
                                setValidationError('');
                                setIsAddOpen(true);
                            }}
                            className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary shadow-sm transition-all hover:opacity-90 active:scale-95"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Pengurus
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Card */}
            <Card className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0px_2px_4px_rgba(26,54,93,0.05)]">
                {/* Filter and Search Bar */}
                <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                    {/* Search */}
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-on-surface-variant/60" />
                        <Input
                            type="text"
                            placeholder="Cari nama, NIM, atau jabatan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-10 w-full rounded-lg border-outline-variant pl-9 focus-visible:ring-primary"
                        />
                    </div>

                    {/* Status Tabs */}
                    <div className="flex w-full items-center gap-1 overflow-x-auto rounded-lg border border-outline-variant bg-surface-container-low p-1 sm:w-auto">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`cursor-pointer rounded-md px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                                statusFilter === 'all'
                                    ? 'bg-white text-primary shadow-sm'
                                    : 'border-none bg-transparent text-on-surface-variant/80 hover:text-primary'
                            }`}
                        >
                            Semua ({officers.length})
                        </button>
                        <button
                            onClick={() => setStatusFilter('active')}
                            className={`cursor-pointer rounded-md px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                                statusFilter === 'active'
                                    ? 'bg-white text-green-700 shadow-sm'
                                    : 'border-none bg-transparent text-on-surface-variant/80 hover:text-green-700'
                            }`}
                        >
                            Aktif (
                            {officers.filter((o) => o.status_aktif).length})
                        </button>
                        <button
                            onClick={() => setStatusFilter('inactive')}
                            className={`cursor-pointer rounded-md px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                                statusFilter === 'inactive'
                                    ? 'bg-white text-red-700 shadow-sm'
                                    : 'border-none bg-transparent text-on-surface-variant/80 hover:text-red-700'
                            }`}
                        >
                            Nonaktif (
                            {officers.filter((o) => !o.status_aktif).length})
                        </button>
                    </div>
                </div>

                {/* Table View */}
                {filteredOfficers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest py-16 text-center">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant/60">
                            <Users2 className="h-6 w-6" />
                        </div>
                        <h4 className="mb-1 font-semibold text-primary">
                            Tidak Ada Pengurus
                        </h4>
                        <p className="max-w-sm text-sm text-on-surface-variant">
                            {searchTerm || statusFilter !== 'all'
                                ? 'Tidak ada pengurus yang cocok dengan kriteria pencarian Anda.'
                                : 'Belum ada pengurus yang terdaftar untuk periode kepengurusan ini.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-outline-variant">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-outline-variant bg-surface-container-low text-xs font-semibold tracking-wider text-primary uppercase">
                                    <th className="px-6 py-4">Nama / NIM</th>
                                    <th className="px-6 py-4">Program Studi</th>
                                    <th className="px-6 py-4">Jabatan</th>
                                    <th className="px-6 py-4">No. Telepon</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/60 font-body-sm text-sm text-on-surface">
                                {filteredOfficers.map((officer) => {
                                    const student =
                                        officer.anggota_organisasi?.mahasiswa;
                                    const phone = student?.nomor_telepon;

                                    return (
                                        <tr
                                            key={officer.id_pengurus}
                                            className="transition-colors hover:bg-surface-container-low/30"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-primary-fixed/30 border-primary-fixed flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-bold text-primary">
                                                        {getInitials(
                                                            student?.nama_lengkap ||
                                                                '',
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-on-surface">
                                                            {student?.nama_lengkap ||
                                                                'Tidak Diketahui'}
                                                        </div>
                                                        <div className="mt-0.5 font-mono text-xs text-on-surface-variant/80">
                                                            {student?.nim ||
                                                                '-'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-on-surface-variant">
                                                {student?.program_studi || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-md px-2.5 py-1 text-xs font-semibold ${getRoleBadgeClass(officer.jabatan)}`}
                                                >
                                                    {officer.jabatan}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {phone ? (
                                                    <a
                                                        href={`tel:${phone}`}
                                                        className="decoration-none inline-flex cursor-pointer items-center gap-1.5 font-semibold text-primary hover:underline"
                                                    >
                                                        <Phone className="h-3.5 w-3.5" />
                                                        {phone}
                                                    </a>
                                                ) : (
                                                    <span className="text-on-surface-variant/50 italic">
                                                        Tidak ada nomor
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                        officer.status_aktif
                                                            ? 'border border-green-200 bg-green-50 text-green-700'
                                                            : 'border border-red-200 bg-red-50 text-red-700'
                                                    }`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${officer.status_aktif ? 'bg-green-600' : 'bg-red-600'}`}
                                                    />
                                                    {officer.status_aktif
                                                        ? 'Aktif'
                                                        : 'Nonaktif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <button
                                                        onClick={() =>
                                                            handleToggleStatus(
                                                                officer.id_pengurus,
                                                                officer.status_aktif,
                                                                student?.nama_lengkap || '',
                                                            )
                                                        }
                                                        className={`cursor-pointer rounded-lg p-2 transition-colors ${
                                                            officer.status_aktif
                                                                ? 'text-amber-600 hover:bg-amber-50'
                                                                : 'text-green-700 hover:bg-green-50'
                                                        }`}
                                                        title={officer.status_aktif ? 'Nonaktifkan Pengurus' : 'Aktifkan Pengurus'}
                                                    >
                                                        <Power className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteOfficer(
                                                                officer.id_pengurus,
                                                                student?.nama_lengkap || '',
                                                            )
                                                        }
                                                        className="cursor-pointer rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors"
                                                        title="Keluarkan / Hapus Pengurus"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Add Officer Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Tambah Pengurus Organisasi</DialogTitle>
                        <DialogDescription>
                            Pilih mahasiswa untuk ditugaskan sebagai pengurus pada periode <strong>{profilOrganisasi?.periode_kepengurusan}</strong>.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 py-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="member-select" className="text-xs font-semibold text-on-surface-variant">
                                Pilih Anggota Organisasi
                            </label>
                            {availableCandidates.length > 0 ? (
                                <select
                                    id="member-select"
                                    value={selectedMemberId}
                                    onChange={(e) => {
                                        setSelectedMemberId(e.target.value);
                                        setValidationError('');
                                    }}
                                    className="w-full cursor-pointer rounded-lg border border-outline bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                                >
                                    <option value="">-- Pilih Anggota --</option>
                                    {availableCandidates.map((c) => (
                                        <option key={c.id_keanggotaan} value={c.id_keanggotaan}>
                                            {c.mahasiswa?.nama_lengkap} ({c.mahasiswa?.nim})
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p className="text-sm text-on-surface-variant italic">
                                    Semua anggota aktif telah ditugaskan sebagai pengurus untuk periode ini.
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="jabatan-input" className="text-xs font-semibold text-on-surface-variant">
                                Jabatan / Posisi
                            </label>
                            <Input
                                id="jabatan-input"
                                type="text"
                                placeholder="Contoh: Ketua, Sekretaris, Staff Minat Bakat"
                                value={position}
                                onChange={(e) => {
                                    setPosition(e.target.value);
                                    setValidationError('');
                                }}
                                className="h-10 rounded-lg border-outline-variant focus-visible:ring-primary"
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                id="status-aktif-checkbox"
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="h-4 w-4 cursor-pointer rounded border-outline-variant text-primary focus:ring-primary"
                            />
                            <label htmlFor="status-aktif-checkbox" className="text-sm font-medium text-on-surface cursor-pointer select-none">
                                Status Aktif
                            </label>
                        </div>

                        {validationError && (
                            <p className="flex items-center gap-1.5 text-xs font-semibold text-red-600 pt-2">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                {validationError}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsAddOpen(false)}
                            disabled={isSubmitting}
                            className="cursor-pointer"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleAddOfficer}
                            disabled={isSubmitting || !selectedMemberId || !position.trim()}
                            className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/95"
                        >
                            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    );
}
