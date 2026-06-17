import { Link } from '@inertiajs/react';
import {
    Plus,
    Download,
    Users,
    TrendingUp,
    CalendarCheck,
    Wallet,
    Eye,
    EyeOff,
    Clock,
    Code,
    Palette,
    Bot,
    MoreVertical,
} from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { kegiatan, anggota } from '@/routes/pengurus';

interface DashboardProps {
    stats: {
        totalAnggota: number;
        percentageIncrease: number;
        kegiatanAktif: number;
        saldoKas: number;
        menungguVerifikasi: number;
        menungguVerifikasiBaru: number;
    };
    recentActivities: Array<{
        id_kegiatan: number;
        nama_kegiatan: string;
        jenis_kegiatan: string;
        status_kegiatan: string;
        time: string;
    }>;
    recentMembers: Array<{
        id_keanggotaan: number;
        name: string;
        initials: string;
        initialsBg: string;
        nim: string;
        status: string;
        date: string;
    }>;
    trendData7Days: Array<{
        day: string;
        count: number;
        height: string;
    }>;
    trendData30Days: Array<{
        day: string;
        count: number;
        height: string;
    }>;
}

export default function Dashboard({
    stats: statsData,
    recentActivities,
    recentMembers,
    trendData7Days,
    trendData30Days,
}: DashboardProps) {
    const [trendPeriod, setTrendPeriod] = useState('7-days');
    const [isSaldoVisible, setIsSaldoVisible] = useState(false);

    const stats = [
        {
            title: 'Total Anggota',
            value: statsData.totalAnggota.toLocaleString(),
            icon: Users,
            iconBg: 'bg-primary/10 text-primary dark:bg-primary-container dark:text-on-primary-container',
            badge: (
                <span className="text-success flex items-center gap-1 text-label-md font-bold text-green-600 dark:text-green-400">
                    <TrendingUp className="h-3.5 w-3.5" />+
                    {statsData.percentageIncrease}%
                </span>
            ),
        },
        {
            title: 'Kegiatan Aktif',
            value: statsData.kegiatanAktif.toString(),
            icon: CalendarCheck,
            iconBg: 'bg-secondary-container/20 text-secondary dark:bg-secondary-container dark:text-on-secondary-container',
            badge: (
                <Badge
                    variant="secondary"
                    className="h-auto rounded border-none bg-secondary-container/30 px-2 py-0.5 font-bold text-on-secondary-container"
                >
                    Aktif
                </Badge>
            ),
        },
        {
            title: 'Saldo Kas',
            value: isSaldoVisible
                ? new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                  })
                      .format(statsData.saldoKas)
                      .replace('IDR', 'Rp')
                : 'Rp *********',
            icon: Wallet,
            iconBg: 'bg-tertiary-container/10 text-tertiary dark:bg-tertiary-container dark:text-on-tertiary-container',
            badge: (
                <button
                    onClick={() => setIsSaldoVisible(!isSaldoVisible)}
                    className="cursor-pointer text-on-surface-variant transition-colors hover:text-primary focus:outline-none dark:hover:text-primary/80"
                >
                    {isSaldoVisible ? (
                        <EyeOff className="h-5 w-5" />
                    ) : (
                        <Eye className="h-5 w-5" />
                    )}
                </button>
            ),
        },
        {
            title: 'Menunggu Verifikasi',
            value: statsData.menungguVerifikasi.toString(),
            icon: Clock,
            iconBg: 'bg-error-container/50 text-error dark:bg-error-container dark:text-on-error-container',
            badge:
                statsData.menungguVerifikasiBaru > 0 ? (
                    <Badge className="h-auto animate-pulse rounded-full border-none bg-error px-2 py-0.5 font-bold text-on-error">
                        {statsData.menungguVerifikasiBaru} Baru
                    </Badge>
                ) : (
                    <Badge className="h-auto rounded-full border-none bg-outline-variant/30 px-2 py-0.5 font-bold text-on-surface-variant">
                        0 Baru
                    </Badge>
                ),
        },
    ];

    const trendData =
        trendPeriod === '7-days' ? trendData7Days : trendData30Days;

    const getActivityIconConfig = (jenis: string) => {
        switch (jenis) {
            case 'Pelatihan':
                return {
                    icon: Code,
                    iconBg: 'bg-primary/10 text-primary dark:bg-primary-container dark:text-on-primary-container',
                };
            case 'Lomba':
                return {
                    icon: Palette,
                    iconBg: 'bg-secondary-container/20 text-secondary dark:bg-secondary-container dark:text-on-secondary-container',
                };
            case 'Seminar':
                return {
                    icon: Bot,
                    iconBg: 'bg-tertiary-container/10 text-tertiary dark:bg-tertiary-container dark:text-on-tertiary-container',
                };
            default:
                return {
                    icon: Users,
                    iconBg: 'bg-error-container/50 text-error dark:bg-error-container dark:text-on-error-container',
                };
        }
    };

    return (
        <div className="mx-auto w-full max-w-container-max space-y-gutter p-margin-desktop">
            {/* Header Section */}
            <section className="flex flex-col items-start justify-between gap-unit-md md:flex-row md:items-center">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary">
                        Dashboard Overview
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        Selamat datang kembali, Pengurus SIMKOM.
                    </p>
                </div>
            </section>

            {/* Stats Cards Section */}
            <section className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;

                    return (
                        <Card
                            key={i}
                            className="group flex flex-col rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-unit-lg shadow-[0px_2px_4px_rgba(26,54,93,0.05)] ring-0 transition-all hover:shadow-[0px_10px_15px_rgba(26,54,93,0.1)]"
                        >
                            <div className="mb-4 flex items-start justify-between">
                                <div
                                    className={`rounded-lg p-3 ${stat.iconBg}`}
                                >
                                    <Icon className="h-6 w-6" />
                                </div>
                                {stat.badge}
                            </div>
                            <p className="font-label-lg text-label-lg text-on-surface-variant">
                                {stat.title}
                            </p>
                            <h3 className="mt-1 font-headline-lg text-headline-lg text-primary">
                                {stat.value}
                            </h3>
                        </Card>
                    );
                })}
            </section>

            {/* Charts and Activities Section */}
            <section className="grid grid-cols-1 gap-gutter lg:grid-cols-3">
                {/* Trend Chart Card */}
                <Card className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-unit-lg shadow-[0px_2px_4px_rgba(26,54,93,0.05)] ring-0 lg:col-span-2">
                    <div className="mb-6 flex items-center justify-between">
                        <h4 className="font-headline-sm text-headline-sm text-primary">
                            Tren Pendaftaran Peserta Kegiatan
                        </h4>
                        <Select
                            value={trendPeriod}
                            onValueChange={setTrendPeriod}
                        >
                            <SelectTrigger className="w-[160px] cursor-pointer rounded-lg border-none bg-surface-container font-label-md text-label-md text-primary focus:ring-2 focus:ring-primary">
                                <SelectValue placeholder="7 Hari Terakhir" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    value="7-days"
                                    className="cursor-pointer"
                                >
                                    7 Hari Terakhir
                                </SelectItem>
                                <SelectItem
                                    value="30-days"
                                    className="cursor-pointer"
                                >
                                    30 Hari Terakhir
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <TooltipProvider>
                        <div
                            className="mt-8 h-64 px-2"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(${trendData.length}, minmax(0, 1fr))`,
                                gap: trendPeriod === '7-days' ? '8px' : '4px',
                            }}
                        >
                            {trendData.map((data, idx) => {
                                const showLabel =
                                    trendPeriod === '7-days' ||
                                    (trendData.length - 1 - idx) % 5 === 0;

                                return (
                                    <Tooltip key={idx}>
                                        <TooltipTrigger asChild>
                                            <div className="group flex h-full w-full cursor-pointer flex-col items-center justify-end">
                                                <div
                                                    className={`relative h-2/3 w-full rounded-t-lg transition-all ${
                                                        data.count > 0
                                                            ? 'bg-primary/10 dark:bg-primary-container/45'
                                                            : 'bg-transparent'
                                                    } group-hover:bg-primary/5 dark:group-hover:bg-primary-container/10`}
                                                >
                                                    <div
                                                        className="absolute bottom-0 w-full rounded-t-lg bg-primary transition-all duration-700 ease-out"
                                                        style={{
                                                            height: data.height,
                                                        }}
                                                    />
                                                </div>
                                                <span className="mt-2 flex h-4 items-center justify-center text-[9px] whitespace-nowrap text-on-surface-variant md:text-label-md">
                                                    {showLabel ? data.day : ''}
                                                </span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            <p className="text-xs font-semibold">
                                                {data.day}
                                            </p>
                                            <p className="text-[11px]">
                                                {data.count} Pendaftaran
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            })}
                        </div>
                    </TooltipProvider>
                </Card>

                {/* Recent Activities Card */}
                <Card className="flex flex-col rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-unit-lg shadow-[0px_2px_4px_rgba(26,54,93,0.05)] ring-0">
                    <h4 className="mb-6 font-headline-sm text-headline-sm text-primary">
                        Kegiatan Terbaru
                    </h4>
                    <div className="custom-scrollbar max-h-64 space-y-unit-md overflow-y-auto pr-2">
                        {recentActivities.map((activity, idx) => {
                            const config = getActivityIconConfig(
                                activity.jenis_kegiatan,
                            );
                            const ActivityIcon = config.icon;

                            return (
                                <div
                                    key={idx}
                                    className="flex items-center gap-4 rounded-lg border-b border-outline-variant/20 p-3 transition-all last:border-0 hover:bg-surface-container-low"
                                >
                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded ${config.iconBg}`}
                                    >
                                        <ActivityIcon className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="truncate font-label-lg text-label-lg text-primary">
                                            {activity.nama_kegiatan}
                                        </p>
                                        <p className="text-label-md text-on-surface-variant">
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        {recentActivities.length === 0 && (
                            <p className="py-8 text-center font-body-md text-on-surface-variant">
                                Belum ada kegiatan.
                            </p>
                        )}
                    </div>
                    <Button
                        variant="link"
                        className="mt-auto cursor-pointer pt-6 text-center text-label-lg font-bold text-primary shadow-none hover:text-primary/80 hover:underline"
                        asChild
                    >
                        <Link href={kegiatan()}>Lihat Semua Kegiatan</Link>
                    </Button>
                </Card>
            </section>

            {/* Recent Members Section */}
            <Card className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0px_2px_4px_rgba(26,54,93,0.05)] ring-0">
                <div className="flex items-center justify-between border-b border-outline-variant/30 px-unit-lg py-4">
                    <h4 className="font-headline-sm text-headline-sm text-primary">
                        Anggota Terbaru
                    </h4>
                    <Button
                        variant="link"
                        className="h-auto cursor-pointer p-0 font-label-lg text-label-lg text-primary shadow-none hover:text-primary/80"
                        asChild
                    >
                        <Link href={anggota()}>Kelola Semua</Link>
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface-container-low">
                                <th className="px-unit-lg py-4 font-label-lg text-on-surface-variant">
                                    Nama Anggota
                                </th>
                                <th className="px-unit-lg py-4 font-label-lg text-on-surface-variant">
                                    NIM
                                </th>
                                <th className="px-unit-lg py-4 font-label-lg text-on-surface-variant">
                                    Status
                                </th>
                                <th className="px-unit-lg py-4 font-label-lg text-on-surface-variant">
                                    Tanggal Daftar
                                </th>
                                <th className="px-unit-lg py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/20">
                            {recentMembers.map((member, idx) => (
                                <tr
                                    key={idx}
                                    className="transition-all hover:bg-surface-container/30"
                                >
                                    <td className="px-unit-lg py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold ${member.initialsBg}`}
                                            >
                                                {member.initials}
                                            </div>
                                            <span className="font-body-md text-on-surface">
                                                {member.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-unit-lg py-4 font-body-sm text-on-surface-variant">
                                        {member.nim}
                                    </td>
                                    <td className="px-unit-lg py-4">
                                        <Badge
                                            className={`h-auto rounded-full border-none px-3 py-1 text-[12px] font-bold shadow-none ${
                                                member.status === 'Approved' ||
                                                member.status === 'Aktif'
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950/50 dark:text-green-400 dark:hover:bg-green-950/50'
                                                    : member.status ===
                                                        'Ditolak'
                                                      ? 'bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400 dark:hover:bg-red-950/50'
                                                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-950/50 dark:text-yellow-400 dark:hover:bg-yellow-950/50'
                                            }`}
                                        >
                                            {member.status}
                                        </Badge>
                                    </td>
                                    <td className="px-unit-lg py-4 font-body-sm text-on-surface-variant">
                                        {member.date}
                                    </td>
                                    <td className="px-unit-lg py-4 text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 cursor-pointer rounded-full p-2 shadow-none hover:bg-surface-container-high"
                                        >
                                            <MoreVertical className="h-5 w-5" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {recentMembers.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-unit-lg py-8 text-center font-body-md text-on-surface-variant"
                                    >
                                        Belum ada anggota terdaftar.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
