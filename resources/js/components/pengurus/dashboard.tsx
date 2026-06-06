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
    MoreVertical
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
    SelectValue
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
                <span className="text-success text-label-md font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    +12%
                </span>
            )
        },
        {
            title: 'Kegiatan Aktif',
            value: '24',
            icon: CalendarCheck,
            iconBg: 'bg-secondary-container/20 text-secondary dark:bg-secondary-container dark:text-on-secondary-container',
            badge: (
                <Badge variant="secondary" className="bg-secondary-container/30 text-on-secondary-container font-bold border-none px-2 py-0.5 rounded h-auto">
                    Aktif
                </Badge>
            )
        },
        {
            title: 'Saldo Kas',
            value: isSaldoVisible ? 'Rp 12.5M' : 'Rp *********',
            icon: Wallet,
            iconBg: 'bg-tertiary-container/10 text-tertiary dark:bg-tertiary-container dark:text-on-tertiary-container',
            badge: (
                <button
                    onClick={() => setIsSaldoVisible(!isSaldoVisible)}
                    className="text-on-surface-variant hover:text-primary dark:hover:text-primary/80 transition-colors focus:outline-none cursor-pointer"
                >
                    {isSaldoVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            )
        },
        {
            title: 'Menunggu Verifikasi',
            value: '42',
            icon: Clock,
            iconBg: 'bg-error-container/50 text-error dark:bg-error-container dark:text-on-error-container',
            badge: (
                <Badge className="animate-pulse bg-error text-on-error font-bold border-none px-2 py-0.5 rounded-full h-auto">
                    8 Baru
                </Badge>
            )
        }
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
            initialsBg: 'bg-primary/10 text-primary dark:bg-primary-container dark:text-on-primary-container',
            nim: '210010123',
            status: 'Approved',
            date: '12 Okt 2023'
        },
        {
            name: 'Bagus Satria',
            initials: 'BS',
            initialsBg: 'bg-secondary-container/20 text-secondary dark:bg-secondary-container dark:text-on-secondary-container',
            nim: '210010456',
            status: 'Pending',
            date: '14 Okt 2023'
        }
    ];

    return (
        <div className="p-margin-desktop max-w-container-max mx-auto w-full space-y-gutter">
            {/* Header Section */}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-unit-md">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary">Dashboard Overview</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        Selamat datang kembali, Pengurus SIMKOM.
                    </p>
                </div>
                <div className="flex gap-unit-sm">
                    <Button className="gap-2 !text-on-primary px-6 py-2.5 h-auto rounded-lg font-label-lg text-label-lg hover:shadow-md transition-all active:scale-95 cursor-pointer">
                        <Plus className="h-5 w-5" />
                        Kegiatan Baru
                    </Button>
                    <Button variant="outline" className="gap-2 bg-surface text-primary border border-primary px-6 py-2.5 h-auto rounded-lg font-label-lg text-label-lg hover:bg-primary/5 transition-all cursor-pointer">
                        <Download className="h-5 w-5" />
                        Export Data
                    </Button>
                </div>
            </section>

            {/* Stats Cards Section */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;

                    return (
                        <Card
                            key={i}
                            className="bg-surface-container-lowest p-unit-lg rounded-xl shadow-[0px_2px_4px_rgba(26,54,93,0.05)] border border-outline-variant/30 flex flex-col group hover:shadow-[0px_10px_15px_rgba(26,54,93,0.1)] transition-all ring-0"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg ${stat.iconBg}`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                {stat.badge}
                            </div>
                            <p className="font-label-lg text-label-lg text-on-surface-variant">{stat.title}</p>
                            <h3 className="font-headline-lg text-headline-lg text-primary mt-1">{stat.value}</h3>
                        </Card>
                    );
                })}
            </section>

            {/* Charts and Activities Section */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
                {/* Trend Chart Card */}
                <Card className="lg:col-span-2 bg-surface-container-lowest p-unit-lg rounded-xl border border-outline-variant/30 shadow-[0px_2px_4px_rgba(26,54,93,0.05)] ring-0">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-headline-sm text-headline-sm text-primary">Tren Pendaftaran Peserta</h4>
                        <Select value={trendPeriod} onValueChange={setTrendPeriod}>
                            <SelectTrigger className="w-[160px] bg-surface-container border-none text-primary focus:ring-2 focus:ring-primary rounded-lg font-label-md text-label-md cursor-pointer">
                                <SelectValue placeholder="7 Hari Terakhir" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7-days" className="cursor-pointer">7 Hari Terakhir</SelectItem>
                                <SelectItem value="30-days" className="cursor-pointer">30 Hari Terakhir</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-2 px-2 mt-8">
                        {trendData.map((data, idx) => (
                            <div key={idx} className="flex flex-col items-center flex-1 group">
                                <div className="relative w-full bg-primary/10 dark:bg-primary-container/45 rounded-t-lg transition-all group-hover:bg-primary/20 dark:group-hover:bg-primary-container/60 h-2/3">
                                    <div
                                        className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all duration-700 ease-out"
                                        style={{ height: data.height }}
                                    />
                                </div>
                                <span className="text-label-md mt-3 text-on-surface-variant">{data.day}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Recent Activities Card */}
                <Card className="bg-surface-container-lowest p-unit-lg rounded-xl border border-outline-variant/30 shadow-[0px_2px_4px_rgba(26,54,93,0.05)] flex flex-col ring-0">
                    <h4 className="font-headline-sm text-headline-sm text-primary mb-6">Kegiatan Terbaru</h4>
                    <div className="space-y-unit-md overflow-y-auto max-h-64 pr-2 custom-scrollbar">
                        {activities.map((activity, idx) => {
                            const ActivityIcon = activity.icon;

                            return (
                                <div
                                    key={idx}
                                    className="flex items-center gap-4 p-3 hover:bg-surface-container-low rounded-lg transition-all border-b border-outline-variant/20 last:border-0"
                                >
                                    <div className={`w-12 h-12 rounded flex items-center justify-center ${activity.iconBg}`}>
                                        <ActivityIcon className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-label-lg text-label-lg text-primary truncate">
                                            {activity.title}
                                        </p>
                                        <p className="text-label-md text-on-surface-variant">{activity.time}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <Button variant="link" className="mt-auto pt-6 text-primary hover:text-primary/80 font-bold text-label-lg hover:underline text-center cursor-pointer shadow-none">
                        Lihat Semua Kegiatan
                    </Button>
                </Card>
            </section>

            {/* Recent Members Section */}
            <Card className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0px_2px_4px_rgba(26,54,93,0.05)] overflow-hidden ring-0">
                <div className="px-unit-lg py-4 border-b border-outline-variant/30 flex justify-between items-center">
                    <h4 className="font-headline-sm text-headline-sm text-primary">Anggota Terbaru</h4>
                    <Button variant="link" className="text-primary hover:text-primary/80 font-label-lg text-label-lg p-0 h-auto cursor-pointer shadow-none">
                        Kelola Semua
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface-container-low">
                                <th className="px-unit-lg py-4 font-label-lg text-on-surface-variant">Nama Anggota</th>
                                <th className="px-unit-lg py-4 font-label-lg text-on-surface-variant">NIM</th>
                                <th className="px-unit-lg py-4 font-label-lg text-on-surface-variant">Status</th>
                                <th className="px-unit-lg py-4 font-label-lg text-on-surface-variant">Tanggal Daftar</th>
                                <th className="px-unit-lg py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/20">
                            {members.map((member, idx) => (
                                <tr key={idx} className="hover:bg-surface-container/30 transition-all">
                                    <td className="px-unit-lg py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full text-[10px] flex items-center justify-center font-bold ${member.initialsBg}`}>
                                                {member.initials}
                                            </div>
                                            <span className="font-body-md text-on-surface">{member.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-unit-lg py-4 font-body-sm text-on-surface-variant">
                                        {member.nim}
                                    </td>
                                    <td className="px-unit-lg py-4">
                                        <Badge className={`px-3 py-1 rounded-full text-[12px] font-bold border-none shadow-none h-auto ${member.status === 'Approved'
                                            ? 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950/50 dark:text-green-400 dark:hover:bg-green-950/50'
                                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-950/50 dark:text-yellow-400 dark:hover:bg-yellow-950/50'
                                            }`}>
                                            {member.status}
                                        </Badge>
                                    </td>
                                    <td className="px-unit-lg py-4 font-body-sm text-on-surface-variant">
                                        {member.date}
                                    </td>
                                    <td className="px-unit-lg py-4 text-right">
                                        <Button variant="ghost" size="icon" className="p-2 hover:bg-surface-container-high rounded-full h-8 w-8 cursor-pointer shadow-none">
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