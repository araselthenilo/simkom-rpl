import { Link, router } from '@inertiajs/react';
import {
    Users,
    Search,
    PlusCircle,
    Power,
    Trash2,
    CheckCircle2,
    XCircle,
    Phone,
    AlertCircle,
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
import { Input } from '@/components/ui/input';
import pembina from '@/routes/pembina';

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
    status_aktif: boolean;
    profil_organisasi?: ProfilOrganisasi[];
}

interface ProfilOrganisasi {
    id_profil: number;
    id_organisasi: number;
    periode_kepengurusan: string;
    logo_organisasi: string | null;
    status_aktif: boolean;
    organisasi?: Organisasi;
}

interface Pengurus {
    id_pengurus: number;
    id_profil: number;
    id_keanggotaan: number;
    jabatan: string;
    status_aktif: boolean;
    anggota_organisasi?: AnggotaOrganisasi;
    profil_organisasi?: ProfilOrganisasi;
}

interface PengurusManagementProps {
    organisasiList?: Organisasi[];
    anggotaList?: AnggotaOrganisasi[];
    pengurusList?: Pengurus[];
}

export default function PengurusManagement({
    organisasiList = [],
    anggotaList = [],
    pengurusList = [],
}: PengurusManagementProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrgFilter, setSelectedOrgFilter] = useState<string>('all');
    const [selectedPeriodFilter, setSelectedPeriodFilter] =
        useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<
        'all' | 'active' | 'inactive'
    >('all');

    // Dialog state for Add Officer
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [modalOrgId, setModalOrgId] = useState('');
    const [modalPeriodId, setModalPeriodId] = useState('');
    const [modalMemberId, setModalMemberId] = useState('');
    const [modalPosition, setModalPosition] = useState('');
    const [modalIsActive, setModalIsActive] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState('');

    // Metrics
    const totalPengurus = pengurusList.length;
    const totalActive = pengurusList.filter((p) => p.status_aktif).length;
    const totalInactive = pengurusList.filter((p) => !p.status_aktif).length;

    // Filtered lists for rendering
    const filteredPengurus = pengurusList.filter((officer) => {
        const student = officer.anggota_organisasi?.mahasiswa;
        const org = officer.profil_organisasi?.organisasi;
        const profile = officer.profil_organisasi;

        const matchesSearch =
            student?.nama_lengkap
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            false ||
            student?.nim?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            false ||
            officer.jabatan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            false;

        const matchesOrg =
            selectedOrgFilter === 'all' ||
            org?.id_organisasi === parseInt(selectedOrgFilter);

        const matchesPeriod =
            selectedPeriodFilter === 'all' ||
            profile?.periode_kepengurusan === selectedPeriodFilter;

        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' && officer.status_aktif) ||
            (statusFilter === 'inactive' && !officer.status_aktif);

        return matchesSearch && matchesOrg && matchesPeriod && matchesStatus;
    });

    // Handle change of organization in the modal to reset period and candidate list
    const handleModalOrgChange = (orgIdStr: string) => {
        setModalOrgId(orgIdStr);
        setModalPeriodId('');
        setModalMemberId('');
        setValidationError('');
    };

    // Candidate members for modal based on chosen organization
    const activeCandidates = modalOrgId
        ? anggotaList.filter((a) => a.id_organisasi === parseInt(modalOrgId))
        : [];

    // Filter candidate members to avoid duplicate entries for the selected profile period
    const candidateMembersFiltered = activeCandidates.filter((candidate) => {
        if (!modalPeriodId) {
            return true;
        }

        // Find if this member is already an officer for the selected period
        return !pengurusList.some(
            (p) =>
                p.id_profil === parseInt(modalPeriodId) &&
                p.id_keanggotaan === candidate.id_keanggotaan,
        );
    });

    // Profile periods list for modal based on chosen organization
    const selectedOrg = organisasiList.find(
        (o) => o.id_organisasi === parseInt(modalOrgId),
    );
    const modalPeriods = selectedOrg?.profil_organisasi || [];

    // Distinct periods for global filter dropdown
    const distinctPeriods = Array.from(
        new Set(
            pengurusList
                .map((p) => p.profil_organisasi?.periode_kepengurusan)
                .filter((p): p is string => !!p),
        ),
    ).sort();

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

    const getRoleBadgeClass = (role: string) => {
        const r = role.toLowerCase();

        if (r.includes('ketua')) {
            return 'bg-blue-100 text-blue-700 border border-blue-200';
        }

        if (r.includes('sekretaris')) {
            return 'bg-purple-100 text-purple-700 border border-purple-200';
        }

        if (r.includes('bendahara')) {
            return 'bg-amber-100 text-amber-700 border border-amber-200';
        }

        return 'bg-slate-100 text-slate-700 border border-slate-200';
    };

    const handleAddOfficer = () => {
        if (!modalOrgId) {
            setValidationError('Silakan pilih organisasi.');

            return;
        }

        if (!modalPeriodId) {
            setValidationError('Silakan pilih periode kepengurusan.');

            return;
        }

        if (!modalMemberId) {
            setValidationError('Silakan pilih anggota organisasi.');

            return;
        }

        if (!modalPosition.trim()) {
            setValidationError('Silakan isi jabatan pengurus.');

            return;
        }

        setIsSubmitting(true);
        router.post(
            pembina.pengurus.store().url,
            {
                id_profil: parseInt(modalPeriodId),
                id_keanggotaan: parseInt(modalMemberId),
                jabatan: modalPosition,
                status_aktif: modalIsActive,
            },
            {
                onSuccess: () => {
                    setIsAddOpen(false);
                    setModalOrgId('');
                    setModalPeriodId('');
                    setModalMemberId('');
                    setModalPosition('');
                    setModalIsActive(true);
                    setValidationError('');
                },
                onError: (errors) => {
                    if (errors.id_keanggotaan) {
                        setValidationError(errors.id_keanggotaan);
                    } else if (errors.id_profil) {
                        setValidationError(errors.id_profil);
                    } else if (errors.jabatan) {
                        setValidationError(errors.jabatan);
                    } else {
                        setValidationError('Gagal menambahkan pengurus.');
                    }
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            },
        );
    };

    const handleToggleStatus = (
        id: number,
        currentStatus: boolean,
        name: string,
    ) => {
        const actionText = currentStatus ? 'menonaktifkan' : 'mengaktifkan';

        if (
            confirm(`Apakah Anda yakin ingin ${actionText} pengurus "${name}"?`)
        ) {
            router.patch(
                pembina.pengurus.toggle(id).url,
                {},
                { preserveScroll: true },
            );
        }
    };

    const handleDeleteOfficer = (id: number, name: string) => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus/mengeluarkan pengurus "${name}"?`,
            )
        ) {
            router.delete(pembina.pengurus.destroy(id).url, {
                preserveScroll: true,
            });
        }
    };

    return (
        <main className="mx-auto w-full max-w-container-max space-y-gutter p-margin-desktop">
            {/* Header */}
            <header className="mb-unit-xl flex flex-col items-start justify-between gap-unit-md md:flex-row md:items-end">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary">
                        Manajemen Pengurus Organisasi
                    </h2>
                    <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
                        Kelola staff kepengurusan (officers) seluruh Unit
                        Kegiatan Mahasiswa (UKM) SIMKOM.
                    </p>
                </div>
                <div className="flex w-full gap-unit-sm md:w-auto">
                    <button
                        onClick={() => {
                            setModalOrgId('');
                            setModalPeriodId('');
                            setModalMemberId('');
                            setModalPosition('');
                            setModalIsActive(true);
                            setValidationError('');
                            setIsAddOpen(true);
                        }}
                        className="decoration-none flex h-auto w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-none bg-primary px-6 py-3 font-label-lg font-semibold text-on-primary shadow-sm transition-all hover:opacity-90 active:scale-95 md:w-auto"
                    >
                        <PlusCircle className="h-[18px] w-[18px]" />
                        Tambah Pengurus Baru
                    </button>
                </div>
            </header>

            {/* Metrics Grid */}
            <div className="mb-unit-xl grid grid-cols-1 gap-gutter md:grid-cols-3">
                <Card className="flex h-32 flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-[0px_2px_4px_rgba(26,54,93,0.05)]">
                    <div className="flex items-start justify-between">
                        <span className="font-label-md text-primary/70">
                            Total Pengurus Terdaftar
                        </span>
                        <Users className="h-5 w-5 text-primary/40" />
                    </div>
                    <div className="font-headline-md text-headline-md font-bold text-primary">
                        {totalPengurus}
                    </div>
                </Card>
                <Card className="flex h-32 flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-[0px_2px_4px_rgba(26,54,93,0.05)]">
                    <div className="flex items-start justify-between">
                        <span className="font-label-md text-green-700">
                            Pengurus Aktif
                        </span>
                        <CheckCircle2 className="h-5 w-5 text-green-700/40" />
                    </div>
                    <div className="font-headline-md text-headline-md font-bold text-green-700">
                        {totalActive}
                    </div>
                </Card>
                <Card className="flex h-32 flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-lg shadow-[0px_2px_4px_rgba(26,54,93,0.05)]">
                    <div className="flex items-start justify-between">
                        <span className="font-label-md text-error">
                            Pengurus Nonaktif
                        </span>
                        <XCircle className="h-5 w-5 text-error/40" />
                    </div>
                    <div className="font-headline-md text-headline-md font-bold text-error">
                        {totalInactive}
                    </div>
                </Card>
            </div>

            {/* Filters Bar */}
            <div className="mb-unit-lg flex flex-col items-center justify-between gap-unit-md rounded-xl border border-outline-variant bg-surface-container-lowest p-unit-md shadow-[0px_2px_4px_rgba(26,54,93,0.05)] sm:flex-row">
                <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
                    {/* Organization Filter */}
                    <select
                        value={selectedOrgFilter}
                        onChange={(e) => setSelectedOrgFilter(e.target.value)}
                        className="cursor-pointer rounded-lg border border-outline bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                        <option value="all">Semua Organisasi</option>
                        {organisasiList.map((o) => (
                            <option
                                key={o.id_organisasi}
                                value={o.id_organisasi}
                            >
                                {o.nama_organisasi}
                            </option>
                        ))}
                    </select>

                    {/* Period Filter */}
                    <select
                        value={selectedPeriodFilter}
                        onChange={(e) =>
                            setSelectedPeriodFilter(e.target.value)
                        }
                        className="cursor-pointer rounded-lg border border-outline bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                        <option value="all">Semua Periode</option>
                        {distinctPeriods.map((p) => (
                            <option key={p} value={p}>
                                Periode {p}
                            </option>
                        ))}
                    </select>

                    {/* Status filter buttons */}
                    <div className="flex items-center gap-1 rounded-lg bg-surface-container-low p-1">
                        {(['all', 'active', 'inactive'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setStatusFilter(tab)}
                                className={`cursor-pointer rounded-md px-3 py-1 text-xs font-semibold whitespace-nowrap transition-all ${
                                    statusFilter === tab
                                        ? 'bg-white text-primary shadow-sm'
                                        : 'bg-transparent text-on-surface-variant hover:text-primary'
                                }`}
                            >
                                {tab === 'all'
                                    ? 'Semua'
                                    : tab === 'active'
                                      ? 'Aktif'
                                      : 'Nonaktif'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-80">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                    <input
                        className="w-full rounded-lg border border-outline-variant bg-background py-2 pr-4 pl-10 font-body-sm text-on-background transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Cari pengurus..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Officers Table */}
            <Card className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-[0px_2px_4px_rgba(26,54,93,0.05)]">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-outline-variant bg-surface-container-low">
                                <th className="px-unit-lg py-4 font-label-lg tracking-wider text-primary uppercase">
                                    Nama & NIM
                                </th>
                                <th className="px-unit-lg py-4 font-label-lg tracking-wider text-primary uppercase">
                                    Organisasi
                                </th>
                                <th className="px-unit-lg py-4 font-label-lg tracking-wider text-primary uppercase">
                                    Periode
                                </th>
                                <th className="px-unit-lg py-4 font-label-lg tracking-wider text-primary uppercase">
                                    Jabatan
                                </th>
                                <th className="px-unit-lg py-4 font-label-lg tracking-wider text-primary uppercase">
                                    No. Telepon
                                </th>
                                <th className="px-unit-lg py-4 text-center font-label-lg tracking-wider text-primary uppercase">
                                    Status
                                </th>
                                <th className="px-unit-lg py-4 text-right font-label-lg tracking-wider text-primary uppercase">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/50">
                            {filteredPengurus.map((officer) => {
                                const student =
                                    officer.anggota_organisasi?.mahasiswa;
                                const orgName =
                                    officer.profil_organisasi?.organisasi
                                        ?.nama_organisasi || 'Tidak Diketahui';
                                const period =
                                    officer.profil_organisasi
                                        ?.periode_kepengurusan || '-';
                                const phone = student?.nomor_telepon;

                                return (
                                    <tr
                                        key={officer.id_pengurus}
                                        className="group transition-colors hover:bg-primary/[0.02]"
                                    >
                                        <td className="px-unit-lg py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-fixed bg-primary-fixed/30 text-sm font-bold text-primary">
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
                                                        {student?.nim || '-'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-unit-lg py-4 font-medium text-primary hover:underline">
                                            {officer.profil_organisasi
                                                ?.id_profil ? (
                                                <Link
                                                    href={pembina.profilOrganisasi.pengurus(
                                                        officer
                                                            .profil_organisasi
                                                            .id_profil,
                                                    )}
                                                >
                                                    {orgName}
                                                </Link>
                                            ) : (
                                                orgName
                                            )}
                                        </td>
                                        <td className="px-unit-lg py-4 font-body-sm text-on-surface-variant">
                                            {period}
                                        </td>
                                        <td className="px-unit-lg py-4">
                                            <span
                                                className={`rounded-md px-2.5 py-1 text-xs font-semibold ${getRoleBadgeClass(officer.jabatan)}`}
                                            >
                                                {officer.jabatan}
                                            </span>
                                        </td>
                                        <td className="px-unit-lg py-4">
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
                                        <td className="px-unit-lg py-4 text-center">
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
                                        <td className="px-unit-lg py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    onClick={() =>
                                                        handleToggleStatus(
                                                            officer.id_pengurus,
                                                            officer.status_aktif,
                                                            student?.nama_lengkap ||
                                                                '',
                                                        )
                                                    }
                                                    className={`cursor-pointer rounded-lg p-2 transition-colors ${
                                                        officer.status_aktif
                                                            ? 'text-amber-600 hover:bg-amber-50'
                                                            : 'text-green-700 hover:bg-green-50'
                                                    }`}
                                                    title={
                                                        officer.status_aktif
                                                            ? 'Nonaktifkan Pengurus'
                                                            : 'Aktifkan Pengurus'
                                                    }
                                                >
                                                    <Power className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteOfficer(
                                                            officer.id_pengurus,
                                                            student?.nama_lengkap ||
                                                                '',
                                                        )
                                                    }
                                                    className="cursor-pointer rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                                                    title="Keluarkan / Hapus Pengurus"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredPengurus.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-unit-lg py-12 text-center font-body-md text-on-surface-variant"
                                    >
                                        Tidak ada data pengurus yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Add Officer Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Tambah Pengurus Baru</DialogTitle>
                        <DialogDescription>
                            Tugaskan mahasiswa sebagai pengurus untuk organisasi
                            dan periode kepengurusan tertentu.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 py-4">
                        {/* Organisasi Select */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="modal-org-select"
                                className="text-xs font-semibold text-on-surface-variant"
                            >
                                Pilih Organisasi (UKM)
                            </label>
                            <select
                                id="modal-org-select"
                                value={modalOrgId}
                                onChange={(e) =>
                                    handleModalOrgChange(e.target.value)
                                }
                                className="w-full cursor-pointer rounded-lg border border-outline bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                            >
                                <option value="">-- Pilih Organisasi --</option>
                                {organisasiList.map((o) => (
                                    <option
                                        key={o.id_organisasi}
                                        value={o.id_organisasi}
                                    >
                                        {o.nama_organisasi}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Periode Select */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="modal-period-select"
                                className="text-xs font-semibold text-on-surface-variant"
                            >
                                Pilih Periode Kepengurusan
                            </label>
                            <select
                                id="modal-period-select"
                                value={modalPeriodId}
                                onChange={(e) => {
                                    setModalPeriodId(e.target.value);
                                    setModalMemberId('');
                                    setValidationError('');
                                }}
                                disabled={!modalOrgId}
                                className="w-full cursor-pointer rounded-lg border border-outline bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
                            >
                                <option value="">-- Pilih Periode --</option>
                                {modalPeriods.map((p) => (
                                    <option
                                        key={p.id_profil}
                                        value={p.id_profil}
                                    >
                                        Periode {p.periode_kepengurusan}{' '}
                                        {p.status_aktif ? '(Aktif)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Anggota Select */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="modal-member-select"
                                className="text-xs font-semibold text-on-surface-variant"
                            >
                                Pilih Anggota Organisasi
                            </label>
                            <select
                                id="modal-member-select"
                                value={modalMemberId}
                                onChange={(e) => {
                                    setModalMemberId(e.target.value);
                                    setValidationError('');
                                }}
                                disabled={!modalPeriodId}
                                className="w-full cursor-pointer rounded-lg border border-outline bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
                            >
                                <option value="">-- Pilih Anggota --</option>
                                {candidateMembersFiltered.map((c) => (
                                    <option
                                        key={c.id_keanggotaan}
                                        value={c.id_keanggotaan}
                                    >
                                        {c.mahasiswa?.nama_lengkap} (
                                        {c.mahasiswa?.nim})
                                    </option>
                                ))}
                            </select>
                            {modalPeriodId &&
                                candidateMembersFiltered.length === 0 && (
                                    <p className="text-[11px] text-amber-600 italic">
                                        Semua anggota aktif telah ditugaskan
                                        atau tidak ada anggota aktif.
                                    </p>
                                )}
                        </div>

                        {/* Jabatan Input */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="modal-jabatan-input"
                                className="text-xs font-semibold text-on-surface-variant"
                            >
                                Jabatan / Posisi
                            </label>
                            <Input
                                id="modal-jabatan-input"
                                type="text"
                                placeholder="Contoh: Ketua, Sekretaris, Bendahara, Staff"
                                value={modalPosition}
                                onChange={(e) => {
                                    setModalPosition(e.target.value);
                                    setValidationError('');
                                }}
                                disabled={!modalMemberId}
                                className="h-10 rounded-lg border-outline-variant focus-visible:ring-primary disabled:opacity-50"
                            />
                        </div>

                        {/* Status Aktif Checkbox */}
                        <div className="flex items-center gap-2 pt-2">
                            <input
                                id="modal-status-aktif-checkbox"
                                type="checkbox"
                                checked={modalIsActive}
                                onChange={(e) =>
                                    setModalIsActive(e.target.checked)
                                }
                                disabled={!modalMemberId}
                                className="h-4 w-4 cursor-pointer rounded border-outline-variant text-primary focus:ring-primary disabled:opacity-50"
                            />
                            <label
                                htmlFor="modal-status-aktif-checkbox"
                                className="cursor-pointer text-sm font-medium text-on-surface select-none"
                            >
                                Status Aktif
                            </label>
                        </div>

                        {validationError && (
                            <p className="flex items-center gap-1.5 pt-2 text-xs font-semibold text-red-600">
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
                            disabled={
                                isSubmitting ||
                                !modalMemberId ||
                                !modalPosition.trim()
                            }
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
