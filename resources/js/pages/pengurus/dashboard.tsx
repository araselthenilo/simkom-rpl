import Dashboard from '@/components/pengurus/dashboard';

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

export default function PengurusDashboardPage(props: DashboardProps) {
    return <Dashboard {...props} />;
}
