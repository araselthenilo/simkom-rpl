import { Link } from '@inertiajs/react';
import {
    Plus,
    Clock,
    Building2,
    Calendar,
    FileText,
    CreditCard,
    Megaphone,
    Mail,
    BookOpen,
    Download,
    PlusCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import pembina from '@/routes/pembina';

interface DashboardProps {
    totalOrganisasiAktif: number;
    totalMahasiswaAktif: number;
    totalAnggotaAktif: number;
    pengajuanProfilList?: any[];
    totalPendingPengajuan?: number;
    pendingDokumentasiList?: any[];
    totalPendingDokumentasi?: number;
    kegiatanBulanIni?: number;
    perubahanKegiatanBulanLalu?: number;
    agendaTerdekat?: any[];
}

export default function Dashboard({
    totalOrganisasiAktif = 0,
    totalMahasiswaAktif = 0,
    totalAnggotaAktif = 0,
    pengajuanProfilList = [],
    totalPendingPengajuan = 0,
    pendingDokumentasiList = [],
    totalPendingDokumentasi = 0,
    kegiatanBulanIni = 0,
    perubahanKegiatanBulanLalu = 0,
    agendaTerdekat = [],
}: DashboardProps) {
    const getRelativeTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) {
            return 'Baru saja';
        }

        if (diffMins < 60) {
            return `${diffMins} menit yang lalu`;
        }

        if (diffHours < 24) {
            return `${diffHours} jam yang lalu`;
        }

        if (diffDays === 1) {
            return 'Kemarin';
        }

        return `${diffDays} hari yang lalu`;
    };

    const getFormatDate = (dateStr: string) => {
        const parts = dateStr.split('-');

        if (parts.length === 3) {
            const year = parseInt(parts[0], 10);
            const monthIdx = parseInt(parts[1], 10) - 1;
            const day = parseInt(parts[2], 10);
            const months = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'Mei',
                'Jun',
                'Jul',
                'Agt',
                'Sep',
                'Okt',
                'Nov',
                'Des',
            ];

            return { day, month: months[monthIdx] };
        }

        const date = new Date(dateStr);
        const day = date.getDate();
        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'Mei',
            'Jun',
            'Jul',
            'Agt',
            'Sep',
            'Okt',
            'Nov',
            'Des',
        ];

        return { day, month: months[date.getMonth()] };
    };

    return (
        <div className="mx-auto max-w-container-max space-y-unit-lg p-margin-desktop">
            <section className="flex flex-col items-start justify-between gap-unit-md md:flex-row md:items-center">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary">
                        Dashboard Overview
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        Selamat datang kembali, Pembina Organisasi SIMKOM.
                    </p>
                </div>
            </section>
            <section className="grid grid-cols-1 gap-unit-lg md:grid-cols-3">
                <div className="group col-span-1 flex flex-col justify-between rounded-xl border border-outline-variant bg-surface p-unit-lg shadow-[0px_2px_4px_rgba(26,54,93,0.05)] transition-all duration-300 hover:shadow-[0px_10px_15px_rgba(26,54,93,0.1)] md:col-span-2">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="font-label-lg text-label-lg tracking-wider text-on-surface-variant uppercase">
                                Total Organisasi Aktif Dalam Pembinaan
                            </p>
                            <h3 className="mt-2 font-headline-lg text-headline-lg text-primary">
                                {totalOrganisasiAktif}{' '}
                                <span className="text-body-sm font-normal text-on-surface-variant">
                                    Unit Kegiatan Mahasiswa
                                </span>
                            </h3>
                        </div>
                        <div className="rounded-lg bg-primary-fixed p-3 text-primary">
                            <Building2 className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mt-8 flex gap-4">
                        <div className="flex-1 rounded-lg border border-outline-variant/30 bg-surface-container-low p-3">
                            <p className="font-label-md text-label-md text-on-surface-variant">
                                Total Anggota Aktif
                            </p>
                            <p className="font-headline-sm text-headline-sm text-primary">
                                {totalAnggotaAktif}
                            </p>
                        </div>
                        <div className="flex-grow"></div>
                    </div>
                </div>
                <div className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-primary-container p-unit-lg text-on-primary shadow-lg">
                    <div className="relative z-10">
                        <p className="font-label-lg text-label-lg tracking-wider text-on-primary-container/80 uppercase">
                            Kegiatan Bulan Ini
                        </p>
                        <h3 className="mt-2 font-headline-lg text-headline-lg">
                            {kegiatanBulanIni}
                        </h3>
                        <p className="mt-1 font-body-sm text-body-sm text-on-primary-container">
                            {perubahanKegiatanBulanLalu >= 0
                                ? `+${perubahanKegiatanBulanLalu}`
                                : perubahanKegiatanBulanLalu}{' '}
                            dibandingkan bulan lalu
                        </p>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-10">
                        <Calendar className="h-[120px] w-[120px] text-on-primary" />
                    </div>
                </div>
            </section>
            <section className="grid grid-cols-1 items-start gap-unit-lg lg:grid-cols-3">
                <div className="space-y-unit-lg lg:col-span-2">
                    {/* Antrean Persetujuan Dokumentasi Kegiatan */}
                    <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-[0px_2px_4px_rgba(26,54,93,0.05)]">
                        <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-unit-lg py-4">
                            <h4 className="flex items-center gap-2 font-headline-sm text-headline-sm text-primary">
                                <Clock className="h-5 w-5" />
                                Antrean Persetujuan Dokumentasi Kegiatan
                            </h4>
                            {totalPendingDokumentasi > 0 && (
                                <span className="rounded-full bg-error-container px-3 py-1 font-label-lg text-label-lg text-on-error-container">
                                    {totalPendingDokumentasi} Dokumentasi Baru
                                </span>
                            )}
                        </div>
                        <div className="divide-y divide-outline-variant">
                            {pendingDokumentasiList.length === 0 ? (
                                <div className="p-8 text-center font-body-md text-on-surface-variant">
                                    Tidak ada pengajuan dokumentasi kegiatan
                                    baru.
                                </div>
                            ) : (
                                pendingDokumentasiList.map((item) => (
                                    <div
                                        key={item.id_dokumentasi}
                                        className="group flex items-start gap-4 p-unit-lg transition-colors hover:bg-surface-container-low"
                                    >
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-high">
                                            <FileText className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <h5 className="font-label-lg text-label-lg font-semibold text-on-surface">
                                                    Persetujuan Dokumentasi:{' '}
                                                    {
                                                        item.kegiatan
                                                            ?.nama_kegiatan
                                                    }
                                                </h5>
                                                <span className="font-label-md text-label-md font-medium text-on-surface-variant">
                                                    {getRelativeTime(
                                                        item.created_at,
                                                    )}
                                                </span>
                                            </div>
                                            <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                                                Diajukan oleh:{' '}
                                                <span className="font-medium">
                                                    {item.kegiatan
                                                        ?.profilOrganisasi
                                                        ?.organisasi
                                                        ?.nama_organisasi ||
                                                        'Organisasi'}
                                                </span>
                                            </p>
                                            <div className="mt-3 flex gap-2">
                                                <Link
                                                    href={
                                                        pembina.dokumentasiKegiatan.show(
                                                            item.id_dokumentasi,
                                                        ).url
                                                    }
                                                    className="decoration-none cursor-pointer rounded-lg bg-primary px-4 py-2 text-center font-label-md text-label-md text-on-primary transition-all duration-100 hover:bg-primary-container active:scale-95"
                                                >
                                                    Review Sekarang
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="bg-surface-container-low p-4 text-center">
                            <Link
                                href={pembina.dokumentasiKegiatan.index().url}
                                className="decoration-none cursor-pointer font-label-lg text-label-lg text-primary transition-all hover:underline"
                            >
                                Lihat Selengkapnya
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-[0px_2px_4px_rgba(26,54,93,0.05)]">
                        <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-unit-lg py-4">
                            <h4 className="flex items-center gap-2 font-headline-sm text-headline-sm text-primary">
                                <Clock className="h-5 w-5" />
                                Antrean Persetujuan
                            </h4>
                            {totalPendingPengajuan > 0 && (
                                <span className="rounded-full bg-error-container px-3 py-1 font-label-lg text-label-lg text-on-error-container">
                                    {totalPendingPengajuan} Pengajuan Baru
                                </span>
                            )}
                        </div>
                        <div className="divide-y divide-outline-variant">
                            {pengajuanProfilList.length === 0 ? (
                                <div className="p-8 text-center font-body-md text-on-surface-variant">
                                    Tidak ada pengajuan profil baru.
                                </div>
                            ) : (
                                pengajuanProfilList.map((item) => (
                                    <div
                                        key={item.id_pengajuan}
                                        className="group flex items-start gap-4 p-unit-lg transition-colors hover:bg-surface-container-low"
                                    >
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-high">
                                            <FileText className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <h5 className="font-label-lg text-label-lg font-semibold text-on-surface">
                                                    Pengajuan Profil Periode{' '}
                                                    {item.periode_kepengurusan}
                                                </h5>
                                                <span className="font-label-md text-label-md font-medium text-on-surface-variant">
                                                    {getRelativeTime(
                                                        item.created_at,
                                                    )}
                                                </span>
                                            </div>
                                            <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                                                Diajukan oleh:{' '}
                                                <span className="font-medium">
                                                    {item.organisasi
                                                        ?.nama_organisasi ||
                                                        'Organisasi'}
                                                </span>
                                            </p>
                                            <div className="mt-3 flex gap-2">
                                                <Link
                                                    href={
                                                        pembina.pengajuanProfil.show(
                                                            item.id_pengajuan,
                                                        ).url
                                                    }
                                                    className="decoration-none cursor-pointer rounded-lg bg-primary px-4 py-2 text-center font-label-md text-label-md text-on-primary transition-all duration-100 hover:bg-primary-container active:scale-95"
                                                >
                                                    Review Sekarang
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="bg-surface-container-low p-4 text-center">
                            <Link
                                href={pembina.pengajuanProfil.index().url}
                                className="decoration-none cursor-pointer font-label-lg text-label-lg text-primary transition-all hover:underline"
                            >
                                Lihat Selengkapnya
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="space-y-unit-lg">
                    <div className="rounded-xl border border-outline-variant bg-surface p-unit-lg shadow-sm">
                        <h4 className="mb-4 font-label-lg text-label-lg tracking-wider text-on-surface-variant uppercase">
                            Agenda Kampus Terdekat
                        </h4>
                        <div className="space-y-4">
                            {agendaTerdekat.length === 0 ? (
                                <div className="py-4 text-center font-body-sm text-on-surface-variant">
                                    Tidak ada agenda terdekat.
                                </div>
                            ) : (
                                agendaTerdekat.map((item) => {
                                    const { day, month } = getFormatDate(
                                        item.tanggal_pelaksanaan,
                                    );

                                    return (
                                        <div
                                            key={item.id_kegiatan}
                                            className="flex gap-3"
                                        >
                                            <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg border border-outline-variant bg-surface-container">
                                                <span className="text-[10px] leading-none font-bold uppercase">
                                                    {month}
                                                </span>
                                                <span className="text-lg leading-none font-bold">
                                                    {day}
                                                </span>
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="truncate font-label-lg text-label-lg font-semibold text-on-surface">
                                                    {item.nama_kegiatan}
                                                </p>
                                                <p className="truncate font-label-md text-label-md text-on-surface-variant">
                                                    {item.lokasi_kegiatan}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
