import HeaderSambutan from '@/components/beranda/header-sambutan';
import KegiatanMendatang from '@/components/beranda/kegiatan-mendatang';
import OrganisasiSaya from '@/components/beranda/organisasi-saya';
import type { Auth } from '@/types/auth';

export default function Home({
    auth,
    organizations,
    kegiatanList,
    registrations = {},
    nim = '',
}: {
    auth: Auth;
    organizations?: any[];
    kegiatanList?: any[];
    registrations?: Record<number, number>;
    nim?: string;
}) {
    const user = auth.user;

    return (
        <>
            <HeaderSambutan user={user} />
            <KegiatanMendatang
                kegiatanList={kegiatanList}
                nim={nim}
                registrations={registrations}
            />
            <OrganisasiSaya organizations={organizations} />
            {/* Brief Data Pencapaian Mahasiswa */}
        </>
    );
}
