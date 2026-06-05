import KegiatanMendatang from '@/components/beranda/kegiatan-mendatang';
import HeaderSambutan from '@/components/beranda/header-sambutan';
import OrganisasiSaya from '@/components/beranda/organisasi-saya';
import HomeLayout from '@/layouts/home-layout';
import { Auth } from '@/types/auth';

export default function Home({ auth }: { auth: Auth }) {
    const user = auth.user;

    return (
        <>
            <HomeLayout>
                <HeaderSambutan user={user} />
                <KegiatanMendatang />
                <OrganisasiSaya />
                {/* Brief Data Pencapaian Mahasiswa */}
            </HomeLayout>
        </>
    );
}
