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
import admin from '@/routes/admin';

interface DashboardProps {
    totalOrganisasiAktif: number;
    totalMahasiswaAktif: number;
    totalAnggotaAktif: number;
}

export default function Dashboard({
    totalOrganisasiAktif = 0,
    totalMahasiswaAktif = 0,
    totalAnggotaAktif = 0,
}: DashboardProps) {
    return (
        <div className="mx-auto max-w-container-max space-y-unit-lg p-margin-desktop">
            <section className="flex flex-col items-start justify-between gap-unit-md md:flex-row md:items-center">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary">
                        Dashboard Overview
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        Selamat datang kembali, Admin Kemahasiswaan SIMKOM.
                    </p>
                </div>
                <div className="flex gap-unit-sm">
                    <Button
                        variant="outline"
                        className="h-auto cursor-pointer gap-2 rounded-lg border border-primary bg-surface px-6 py-2.5 font-label-lg text-label-lg text-primary transition-all hover:bg-primary/5"
                    >
                        <Download className="h-5 w-5" />
                        Export Data
                    </Button>
                </div>
            </section>
            <section className="grid grid-cols-1 gap-unit-lg md:grid-cols-3">
                <div className="group col-span-1 flex flex-col justify-between rounded-xl border border-outline-variant bg-surface p-unit-lg shadow-[0px_2px_4px_rgba(26,54,93,0.05)] transition-all duration-300 hover:shadow-[0px_10px_15px_rgba(26,54,93,0.1)] md:col-span-2">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="font-label-lg text-label-lg tracking-wider text-on-surface-variant uppercase">
                                Total Organisasi Aktif
                            </p>
                            <h3 className="mt-2 font-headline-lg text-headline-lg text-primary">
                                {totalOrganisasiAktif}{' '}
                                <span className="text-body-sm font-normal text-on-surface-variant">
                                    Unit Kegiatan Mahasiswa
                                </span>
                            </h3>
                        </div>
                        <div className="bg-primary-fixed rounded-lg p-3 text-primary">
                            <Building2 className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mt-8 flex gap-4">
                        <div className="flex-1 rounded-lg border border-outline-variant/30 bg-surface-container-low p-3">
                            <p className="font-label-md text-label-md text-on-surface-variant">
                                Total Mahasiswa Aktif
                            </p>
                            <p className="font-headline-sm text-headline-sm text-primary">
                                {totalMahasiswaAktif}
                            </p>
                        </div>
                        <div className="flex-1 rounded-lg border border-outline-variant/30 bg-surface-container-low p-3">
                            <p className="font-label-md text-label-md text-on-surface-variant">
                                Total Anggota Aktif
                            </p>
                            <p className="font-headline-sm text-headline-sm text-primary">
                                {totalAnggotaAktif}
                            </p>
                        </div>
                        <Link
                            href={admin.organisasi.create()}
                            className="decoration-none flex h-auto w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-none bg-primary px-6 py-3 font-label-lg font-semibold text-on-primary shadow-sm transition-all hover:opacity-90 active:scale-95 md:w-auto"
                        >
                            <PlusCircle className="h-[18px] w-[18px]" />
                            Tambah UKM Baru
                        </Link>
                    </div>
                </div>
                <div className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-primary-container p-unit-lg text-on-primary shadow-lg">
                    <div className="relative z-10">
                        <p className="font-label-lg text-label-lg tracking-wider text-on-primary-container/80 uppercase">
                            Kegiatan Bulan Ini
                        </p>
                        <h3 className="mt-2 font-headline-lg text-headline-lg">
                            18
                        </h3>
                        <p className="mt-1 font-body-sm text-body-sm text-on-primary-container">
                            +4 dibandingkan bulan lalu
                        </p>
                    </div>
                    <div className="relative z-10 mt-8">
                        <div className="flex -space-x-2">
                            <img
                                className="h-8 w-8 rounded-full border-2 border-primary-container object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhqncHAb0mkuk4zJanDLqLD50FNSlNL17-ddhCuZ9Lb3r1QSSC7-dIm0tG0MOLxLlxz0rWECMH4eV9Gca7xIAvWM-KekVw_WNCUvnrevfjH6nsiw0OyAomCRGOvuXz9qwwA4nbqgkCjh-DsjbFwZLopAIjbNJgPKSaCfFReJS-lFjNuQFBtRdl_DnfUS_4rO_g_aWncboRlz1EFshOa9n57OMqI52jGDdelX-eMCCd6ZeSDiWKOa9VuIlwobHvIyZy6bpHldQ_R14"
                                alt="Student Avatar 1"
                            />
                            <img
                                className="h-8 w-8 rounded-full border-2 border-primary-container object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC04wi3gb6Q1Btb23dNw9kXY1l9LTyLDtSmM3Dt9h3JrqNatvC795GmgtusAkreR3_LtOmN0Tga0AvXSBL_btDyEcRlVPiJN9Sf41EhzyPqqraGeKu9SdmgDlUYtMuQC9skEsgzzN2WEl6NyKDeCwVPhOj2pCThWyQf4IMaMv6ep4EEOuKw6-Fj6Se31Ar_QpmZt7EpOPjcKm7GInisaOFqZ-WRfqZGlAKABUl9qo-47TlAwhyWvY-ztYNBMfA5jMMhucbxyqBgoe8"
                                alt="Student Avatar 2"
                            />
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary-container bg-secondary-fixed font-label-md text-xs text-on-secondary-fixed">
                                +12
                            </div>
                        </div>
                        <p className="mt-2 font-label-md text-label-md opacity-80">
                            Aktif dalam persiapan
                        </p>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-10">
                        <Calendar className="h-[120px] w-[120px] text-on-primary" />
                    </div>
                </div>
            </section>
            <section className="grid grid-cols-1 items-start gap-unit-lg lg:grid-cols-3">
                <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-[0px_2px_4px_rgba(26,54,93,0.05)] lg:col-span-2">
                    <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-unit-lg py-4">
                        <h4 className="flex items-center gap-2 font-headline-sm text-headline-sm text-primary">
                            <Clock className="h-5 w-5" />
                            Antrean Persetujuan
                        </h4>
                        <span className="rounded-full bg-error-container px-3 py-1 font-label-lg text-label-lg text-on-error-container">
                            3 Proposal Menunggu Revisi
                        </span>
                    </div>
                    <div className="divide-y divide-outline-variant">
                        <div className="group flex items-start gap-4 p-unit-lg transition-colors hover:bg-surface-container-low">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-high">
                                <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <h5 className="font-label-lg text-label-lg text-on-surface">
                                        Proposal Seminar Nasional IT 2024
                                    </h5>
                                    <span className="font-label-md text-label-md text-on-surface-variant">
                                        2 jam yang lalu
                                    </span>
                                </div>
                                <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                                    Diajukan oleh:{' '}
                                    <span className="font-medium">
                                        UKM Computer Club
                                    </span>
                                </p>
                                <div className="mt-3 flex gap-2">
                                    <button className="cursor-pointer rounded-lg bg-primary px-4 py-2 font-label-md text-label-md text-on-primary transition-all duration-100 hover:bg-primary-container active:scale-95">
                                        Review Sekarang
                                    </button>
                                    <button className="hover:bg-surface-variant cursor-pointer rounded-lg border border-outline px-4 py-2 font-label-md text-label-md text-on-surface-variant transition-all duration-100 active:scale-95">
                                        Simpan Draft
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="group flex items-start gap-4 p-unit-lg transition-colors hover:bg-surface-container-low">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-high">
                                <CreditCard className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <h5 className="font-label-lg text-label-lg text-on-surface">
                                        Laporan Keuangan LKMM-TD
                                    </h5>
                                    <span className="font-label-md text-label-md text-on-surface-variant">
                                        Kemarin, 14:20
                                    </span>
                                </div>
                                <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                                    Diajukan oleh:{' '}
                                    <span className="font-medium">
                                        HIMA Sistem Informasi
                                    </span>
                                </p>
                                <div className="mt-3 flex gap-2">
                                    <button className="cursor-pointer rounded-lg bg-primary px-4 py-2 font-label-md text-label-md text-on-primary transition-all duration-100 hover:bg-primary-container active:scale-95">
                                        Review Sekarang
                                    </button>
                                    <button className="hover:bg-surface-variant cursor-pointer rounded-lg border border-outline px-4 py-2 font-label-md text-label-md text-on-surface-variant transition-all duration-100 active:scale-95">
                                        Detail Laporan
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="group flex items-start gap-4 p-unit-lg transition-colors hover:bg-surface-container-low">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-high">
                                <Megaphone className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <h5 className="font-label-lg text-label-lg text-on-surface">
                                        Permohonan Izin Ruang Aula
                                    </h5>
                                    <span className="font-label-md text-label-md text-on-surface-variant">
                                        Senin, 09:00
                                    </span>
                                </div>
                                <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                                    Diajukan oleh:{' '}
                                    <span className="font-medium">
                                        Seni Teater Kampus
                                    </span>
                                </p>
                                <div className="mt-3 flex gap-2">
                                    <button className="cursor-pointer rounded-lg bg-primary px-4 py-2 font-label-md text-label-md text-on-primary transition-all duration-100 hover:bg-primary-container active:scale-95">
                                        Setujui Segera
                                    </button>
                                    <button className="hover:bg-surface-variant cursor-pointer rounded-lg border border-outline px-4 py-2 font-label-md text-label-md text-on-surface-variant transition-all duration-100 active:scale-95">
                                        Tolak
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-surface-container-low p-4 text-center">
                        <button className="cursor-pointer font-label-lg text-label-lg text-primary transition-all hover:underline">
                            Lihat Semua Antrean (12)
                        </button>
                    </div>
                </div>
                <div className="space-y-unit-lg">
                    <div className="rounded-xl border border-secondary/20 bg-secondary-container/30 p-unit-lg">
                        <h4 className="font-headline-sm text-headline-sm text-on-secondary-container">
                            Aksi Cepat
                        </h4>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <button className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-outline-variant bg-surface p-4 text-center shadow-sm transition-all hover:bg-secondary-fixed/20">
                                <Mail className="h-5 w-5 text-secondary" />
                                <span className="font-label-md text-label-md text-on-surface">
                                    Kirim Broadcast
                                </span>
                            </button>
                            <button className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-outline-variant bg-surface p-4 text-center shadow-sm transition-all hover:bg-secondary-fixed/20">
                                <BookOpen className="h-5 w-5 text-secondary" />
                                <span className="font-label-md text-label-md text-on-surface">
                                    Log Aktivitas
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className="rounded-xl border border-outline-variant bg-surface p-unit-lg shadow-sm">
                        <h4 className="mb-4 font-label-lg text-label-lg tracking-wider text-on-surface-variant uppercase">
                            Agenda Kampus Terdekat
                        </h4>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg border border-outline-variant bg-surface-container">
                                    <span className="text-[10px] leading-none font-bold uppercase">
                                        Mei
                                    </span>
                                    <span className="text-lg leading-none font-bold">
                                        24
                                    </span>
                                </div>
                                <div>
                                    <p className="font-label-lg text-label-lg text-on-surface">
                                        Wisuda Periode I 2024
                                    </p>
                                    <p className="font-label-md text-label-md text-on-surface-variant">
                                        Gedung Serbaguna
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg border border-outline-variant bg-surface-container">
                                    <span className="text-[10px] leading-none font-bold uppercase">
                                        Mei
                                    </span>
                                    <span className="text-lg leading-none font-bold">
                                        28
                                    </span>
                                </div>
                                <div>
                                    <p className="font-label-lg text-label-lg text-on-surface">
                                        Dies Natalis SIMKOM
                                    </p>
                                    <p className="font-label-md text-label-md text-on-surface-variant">
                                        Seluruh Kampus
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
