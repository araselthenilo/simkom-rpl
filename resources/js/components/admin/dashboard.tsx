import {
    Plus,
    Clock,
    MoreVertical,
    Bell,
    Building2,
    Calendar,
    FileText,
    CreditCard,
    Megaphone,
    Mail,
    BookOpen,
    Download
} from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
    return (
        <div className="p-margin-desktop max-w-container-max mx-auto space-y-unit-lg">
            <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-unit-md">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary">Dashboard Overview</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        Selamat datang kembali, Admin Kemahasiswaan SIMKOM.
                    </p>
                </div>
                <div className="flex gap-unit-sm">
                    <Button variant="outline" className="gap-2 bg-surface text-primary border border-primary px-6 py-2.5 h-auto rounded-lg font-label-lg text-label-lg hover:bg-primary/5 transition-all cursor-pointer">
                        <Download className="h-5 w-5" />
                        Export Data
                    </Button>
                </div>
            </section>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-unit-lg">
                <div className="col-span-1 md:col-span-2 bg-surface rounded-xl p-unit-lg shadow-[0px_2px_4px_rgba(26,54,93,0.05)] border border-outline-variant flex flex-col justify-between group hover:shadow-[0px_10px_15px_rgba(26,54,93,0.1)] transition-all duration-300">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">
                                Total Organisasi Aktif
                            </p>
                            <h3 className="font-headline-lg text-headline-lg text-primary mt-2">
                                42{' '}
                                <span className="text-body-sm font-normal text-on-surface-variant">
                                    Unit Kegiatan Mahasiswa
                                </span>
                            </h3>
                        </div>
                        <div className="p-3 rounded-lg bg-primary-fixed text-primary">
                            <Building2 className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mt-8 flex gap-4">
                        <div className="flex-1 bg-surface-container-low rounded-lg p-3 border border-outline-variant/30">
                            <p className="font-label-md text-label-md text-on-surface-variant">Total Mahasiswa Aktif</p>
                            <p className="font-headline-sm text-headline-sm text-primary">28</p>
                        </div>
                        <div className="flex-1 bg-surface-container-low rounded-lg p-3 border border-outline-variant/30">
                            <p className="font-label-md text-label-md text-on-surface-variant">Total Anggota Aktif</p>
                            <p className="font-headline-sm text-headline-sm text-primary">14</p>
                        </div>
                        <div className="flex-1 bg-primary text-on-primary rounded-lg p-3 flex items-center justify-center cursor-pointer hover:bg-primary-container hover:scale-105 active:scale-95 transition-all duration-100">
                            <Plus className="h-6 w-6" />
                            <p className="text-on-primary font-label-lg text-label-lg cursor-pointer">Tambah UKM</p>
                        </div>
                    </div>
                </div>
                <div className="bg-primary-container rounded-xl p-unit-lg shadow-lg relative overflow-hidden text-on-primary flex flex-col justify-between">
                    <div className="relative z-10">
                        <p className="font-label-lg text-label-lg text-on-primary-container/80 uppercase tracking-wider">
                            Kegiatan Bulan Ini
                        </p>
                        <h3 className="font-headline-lg text-headline-lg mt-2">18</h3>
                        <p className="font-body-sm text-body-sm text-on-primary-container mt-1">
                            +4 dibandingkan bulan lalu
                        </p>
                    </div>
                    <div className="mt-8 relative z-10">
                        <div className="flex -space-x-2">
                            <img
                                className="w-8 h-8 rounded-full border-2 border-primary-container object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhqncHAb0mkuk4zJanDLqLD50FNSlNL17-ddhCuZ9Lb3r1QSSC7-dIm0tG0MOLxLlxz0rWECMH4eV9Gca7xIAvWM-KekVw_WNCUvnrevfjH6nsiw0OyAomCRGOvuXz9qwwA4nbqgkCjh-DsjbFwZLopAIjbNJgPKSaCfFReJS-lFjNuQFBtRdl_DnfUS_4rO_g_aWncboRlz1EFshOa9n57OMqI52jGDdelX-eMCCd6ZeSDiWKOa9VuIlwobHvIyZy6bpHldQ_R14"
                                alt="Student Avatar 1"
                            />
                            <img
                                className="w-8 h-8 rounded-full border-2 border-primary-container object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC04wi3gb6Q1Btb23dNw9kXY1l9LTyLDtSmM3Dt9h3JrqNatvC795GmgtusAkreR3_LtOmN0Tga0AvXSBL_btDyEcRlVPiJN9Sf41EhzyPqqraGeKu9SdmgDlUYtMuQC9skEsgzzN2WEl6NyKDeCwVPhOj2pCThWyQf4IMaMv6ep4EEOuKw6-Fj6Se31Ar_QpmZt7EpOPjcKm7GInisaOFqZ-WRfqZGlAKABUl9qo-47TlAwhyWvY-ztYNBMfA5jMMhucbxyqBgoe8"
                                alt="Student Avatar 2"
                            />
                            <div className="w-8 h-8 rounded-full border-2 border-primary-container bg-secondary-fixed text-on-secondary-fixed font-label-md flex items-center justify-center text-xs">
                                +12
                            </div>
                        </div>
                        <p className="font-label-md text-label-md mt-2 opacity-80">Aktif dalam persiapan</p>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-10">
                        <Calendar className="w-[120px] h-[120px] text-on-primary" />
                    </div>
                </div>
            </section>
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-unit-lg items-start">
                <div className="lg:col-span-2 bg-surface rounded-xl shadow-[0px_2px_4px_rgba(26,54,93,0.05)] border border-outline-variant overflow-hidden">
                    <div className="px-unit-lg py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
                        <h4 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Antrean Persetujuan
                        </h4>
                        <span className="px-3 py-1 bg-error-container text-on-error-container rounded-full font-label-lg text-label-lg">
                            3 Proposal Menunggu Revisi
                        </span>
                    </div>
                    <div className="divide-y divide-outline-variant">
                        <div className="p-unit-lg flex items-start gap-4 hover:bg-surface-container-low transition-colors group">
                            <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
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
                                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                                    Diajukan oleh: <span className="font-medium">UKM Computer Club</span>
                                </p>
                                <div className="mt-3 flex gap-2">
                                    <button className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-primary-container transition-all active:scale-95 duration-100 cursor-pointer">
                                        Review Sekarang
                                    </button>
                                    <button className="border border-outline text-on-surface-variant font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-surface-variant transition-all active:scale-95 duration-100 cursor-pointer">
                                        Simpan Draft
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-unit-lg flex items-start gap-4 hover:bg-surface-container-low transition-colors group">
                            <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
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
                                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                                    Diajukan oleh: <span className="font-medium">HIMA Sistem Informasi</span>
                                </p>
                                <div className="mt-3 flex gap-2">
                                    <button className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-primary-container transition-all active:scale-95 duration-100 cursor-pointer">
                                        Review Sekarang
                                    </button>
                                    <button className="border border-outline text-on-surface-variant font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-surface-variant transition-all active:scale-95 duration-100 cursor-pointer">
                                        Detail Laporan
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-unit-lg flex items-start gap-4 hover:bg-surface-container-low transition-colors group">
                            <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
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
                                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                                    Diajukan oleh: <span className="font-medium">Seni Teater Kampus</span>
                                </p>
                                <div className="mt-3 flex gap-2">
                                    <button className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-primary-container transition-all active:scale-95 duration-100 cursor-pointer">
                                        Setujui Segera
                                    </button>
                                    <button className="border border-outline text-on-surface-variant font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-surface-variant transition-all active:scale-95 duration-100 cursor-pointer">
                                        Tolak
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-surface-container-low text-center">
                        <button className="text-primary font-label-lg text-label-lg hover:underline transition-all cursor-pointer">
                            Lihat Semua Antrean (12)
                        </button>
                    </div>
                </div>
                <div className="space-y-unit-lg">
                    <div className="bg-secondary-container/30 border border-secondary/20 rounded-xl p-unit-lg">
                        <h4 className="font-headline-sm text-headline-sm text-on-secondary-container">Aksi Cepat</h4>
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <button className="bg-surface rounded-lg p-4 shadow-sm border border-outline-variant flex flex-col items-center gap-2 hover:bg-secondary-fixed/20 transition-all text-center cursor-pointer">
                                <Mail className="h-5 w-5 text-secondary" />
                                <span className="font-label-md text-label-md text-on-surface">Kirim Broadcast</span>
                            </button>
                            <button className="bg-surface rounded-lg p-4 shadow-sm border border-outline-variant flex flex-col items-center gap-2 hover:bg-secondary-fixed/20 transition-all text-center cursor-pointer">
                                <BookOpen className="h-5 w-5 text-secondary" />
                                <span className="font-label-md text-label-md text-on-surface">Log Aktivitas</span>
                            </button>
                        </div>
                    </div>
                    <div className="bg-surface rounded-xl border border-outline-variant p-unit-lg shadow-sm">
                        <h4 className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider mb-4">
                            Agenda Kampus Terdekat
                        </h4>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-lg bg-surface-container flex flex-col items-center justify-center shrink-0 border border-outline-variant">
                                    <span className="text-[10px] font-bold uppercase leading-none">Mei</span>
                                    <span className="text-lg font-bold leading-none">24</span>
                                </div>
                                <div>
                                    <p className="font-label-lg text-label-lg text-on-surface">Wisuda Periode I 2024</p>
                                    <p className="font-label-md text-label-md text-on-surface-variant">Gedung Serbaguna</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-lg bg-surface-container flex flex-col items-center justify-center shrink-0 border border-outline-variant">
                                    <span className="text-[10px] font-bold uppercase leading-none">Mei</span>
                                    <span className="text-lg font-bold leading-none">28</span>
                                </div>
                                <div>
                                    <p className="font-label-lg text-label-lg text-on-surface">Dies Natalis SIMKOM</p>
                                    <p className="font-label-md text-label-md text-on-surface-variant">Seluruh Kampus</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}