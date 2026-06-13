import { usePage } from '@inertiajs/react';
import Dashboard from '@/components/pembina/dashboard';

interface DashboardPageProps {
    totalOrganisasiAktif: number;
    totalMahasiswaAktif: number;
    totalAnggotaAktif: number;
    pengajuanProfilList: any[];
    totalPendingPengajuan: number;
    pendingDokumentasiList: any[];
    totalPendingDokumentasi: number;
    kegiatanBulanIni: number;
    perubahanKegiatanBulanLalu: number;
    agendaTerdekat: any[];
    [key: string]: any;
}

export default function PembinaDashboardPage() {
    const {
        totalOrganisasiAktif,
        totalMahasiswaAktif,
        totalAnggotaAktif,
        pengajuanProfilList,
        totalPendingPengajuan,
        pendingDokumentasiList = [],
        totalPendingDokumentasi = 0,
        kegiatanBulanIni = 0,
        perubahanKegiatanBulanLalu = 0,
        agendaTerdekat = [],
    } = usePage<DashboardPageProps>().props;

    return (
        <Dashboard
            totalOrganisasiAktif={totalOrganisasiAktif}
            totalMahasiswaAktif={totalMahasiswaAktif}
            totalAnggotaAktif={totalAnggotaAktif}
            pengajuanProfilList={pengajuanProfilList}
            totalPendingPengajuan={totalPendingPengajuan}
            pendingDokumentasiList={pendingDokumentasiList}
            totalPendingDokumentasi={totalPendingDokumentasi}
            kegiatanBulanIni={kegiatanBulanIni}
            perubahanKegiatanBulanLalu={perubahanKegiatanBulanLalu}
            agendaTerdekat={agendaTerdekat}
        />
    );
}
