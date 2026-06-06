import { usePage } from '@inertiajs/react';
import Dashboard from '@/components/admin/dashboard';

interface DashboardPageProps {
    totalOrganisasiAktif: number;
    totalMahasiswaAktif: number;
    totalAnggotaAktif: number;
    [key: string]: any;
}

export default function AdminDashboardPage() {
    const { totalOrganisasiAktif, totalMahasiswaAktif, totalAnggotaAktif } = usePage<DashboardPageProps>().props;

    return (
        <Dashboard
            totalOrganisasiAktif={totalOrganisasiAktif}
            totalMahasiswaAktif={totalMahasiswaAktif}
            totalAnggotaAktif={totalAnggotaAktif}
        />
    );
}

