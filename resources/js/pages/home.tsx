import HeaderSambutan from '@/components/beranda/header-sambutan';
import KegiatanMendatang from '@/components/beranda/kegiatan-mendatang';
import OrganisasiSaya from '@/components/beranda/organisasi-saya';
import type { Auth } from '@/types/auth';

export default function Home({
    auth,
    organizations,
}: {
    auth: Auth;
    organizations?: any[];
}) {
    const user = auth.user;

    return (
        <>
            <HeaderSambutan user={user} />
            <KegiatanMendatang />
            <OrganisasiSaya organizations={organizations} />
            {/* Brief Data Pencapaian Mahasiswa */}
        </>
    );
}
