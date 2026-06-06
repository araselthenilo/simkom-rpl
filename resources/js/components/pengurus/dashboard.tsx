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

export default function Dashboard() {
    const [trendPeriod, setTrendPeriod] = useState('7-days');
    const [isSaldoVisible, setIsSaldoVisible] = useState(false);

    const stats = [
        {
            title: 'Total Anggota',
            value: '1,248',
            icon: Users,
            iconBg: 'bg-primary/10 text-primary dark:bg-primary-container dark:text-on-primary-container',
            badge: (
                <span className="text-success flex items-center gap-1 text-label-md font-bold text-green-600 dark:text-green-400">
                    <TrendingUp className="h-3.5 w-3.5" />
                    +12%
                </span>
            ),
        },
        {
            title: 'Kegiatan Aktif',
            value: '24',
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
            value: isSaldoVisible ? 'Rp 12.5M' : 'Rp *********',
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
            value: '42',
            icon: Clock,
            iconBg: 'bg-error-container/50 text-error dark:bg-error-container dark:text-on-error-container',
            badge: (
                <Badge className="h-auto animate-pulse rounded-full border-none bg-error px-2 py-0.5 font-bold text-on-error">
                    8 Baru
                </Badge>
            ),
        },
    ];

    const trendData = [
        { day: 'Sen', height: '45%' },
        { day: 'Sel', height: '60%' },
        { day: 'Rab', height: '85%' },
        { day: 'Kam', height: '40%' },
        { day: 'Jum', height: '95%' },
        { day: 'Sab', height: '70%' },
        { day: 'Min', height: '55%' },
    ];

    const activities = [
        {
            title: 'Workshop Flutter Advanced',
            time: '15 Menit yang lalu',
            icon: Code,
            iconBg: 'bg-primary/10 text-primary dark:bg-primary-container dark:text-on-primary-container',
        },
        {
            title: 'Lomba Desain UI/UX',
            time: '2 Jam yang lalu',
            icon: Palette,
            iconBg: 'bg-secondary-container/20 text-secondary dark:bg-secondary-container dark:text-on-secondary-container',
        },
        {
            title: 'Seminar AI & Future',
            time: 'Kemarin',
            icon: Bot,
            iconBg: 'bg-tertiary-container/10 text-tertiary dark:bg-tertiary-container dark:text-on-tertiary-container',
        },
    ];

    const members = [
        {
            name: 'Arya Damar',
            initials: 'AD',
            initialsBg:
                'bg-primary/10 text-primary dark:bg-primary-container dark:text-on-primary-container',
            nim: '210010123',
            status: 'Approved',
            date: '12 Okt 2023',
        },
        {
            name: 'Bagus Satria',
            initials: 'BS',
            initialsBg:
                'bg-secondary-container/20 text-secondary dark:bg-secondary-container dark:text-on-secondary-container',
            nim: '210010456',
            status: 'Pending',
            date: '14 Okt 2023',
        },
    ];

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
                <div className="flex gap-unit-sm">
                    <Button className="h-auto cursor-pointer gap-2 rounded-lg px-6 py-2.5 font-label-lg text-label-lg !text-on-primary transition-all hover:shadow-md active:scale-95">
                        <Plus className="h-5 w-5" />
                        Kegiatan Baru
                    </Button>
                    <Button
                        variant="outline"
                        className="h-auto cursor-pointer gap-2 rounded-lg border border-primary bg-surface px-6 py-2.5 font-label-lg text-label-lg text-primary transition-all hover:bg-primary/5"
                    >
                        <Download className="h-5 w-5" />
                        Export Data
                    </Button>
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
                            Tren Pendaftaran Peserta
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

                    <div className="mt-8 flex h-64 items-end justify-between gap-2 px-2">
                        {trendData.map((data, idx) => (
                            <div
                                key={idx}
                                className="group flex flex-1 flex-col items-center"
                            >
                                <div className="relative h-2/3 w-full rounded-t-lg bg-primary/10 transition-all group-hover:bg-primary/20 dark:bg-primary-container/45 dark:group-hover:bg-primary-container/60">
                                    <div
                                        className="absolute bottom-0 w-full rounded-t-lg bg-primary transition-all duration-700 ease-out"
                                        style={{ height: data.height }}
                                    />
                                </div>
                                <span className="mt-3 text-label-md text-on-surface-variant">
                                    {data.day}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Recent Activities Card */}
                <Card className="flex flex-col rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-unit-lg shadow-[0px_2px_4px_rgba(26,54,93,0.05)] ring-0">
                    <h4 className="mb-6 font-headline-sm text-headline-sm text-primary">
                        Kegiatan Terbaru
                    </h4>
                    <div className="custom-scrollbar max-h-64 space-y-unit-md overflow-y-auto pr-2">
                        {activities.map((activity, idx) => {
                            const ActivityIcon = activity.icon;

                            return (
                                <div
                                    key={idx}
                                    className="flex items-center gap-4 rounded-lg border-b border-outline-variant/20 p-3 transition-all last:border-0 hover:bg-surface-container-low"
                                >
                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded ${activity.iconBg}`}
                                    >
                                        <ActivityIcon className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="truncate font-label-lg text-label-lg text-primary">
                                            {activity.title}
                                        </p>
                                        <p className="text-label-md text-on-surface-variant">
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <Button
                        variant="link"
                        className="mt-auto cursor-pointer pt-6 text-center text-label-lg font-bold text-primary shadow-none hover:text-primary/80 hover:underline"
                    >
                        Lihat Semua Kegiatan
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
                    >
                        Kelola Semua
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
                            {members.map((member, idx) => (
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
                                                member.status === 'Approved'
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950/50 dark:text-green-400 dark:hover:bg-green-950/50'
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
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
