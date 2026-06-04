import HomeLayout from '@/layouts/home-layout';
import { Auth } from '@/types/auth';

export default function Home({ auth }: { auth: Auth }) {
    const user = auth.user;

    return (
        <>
            <HomeLayout>
                {user.role}
                {user.role === 'Mahasiswa' &&
                    (user.is_active_organization_staff ? ' Adalah Pengurus' : ' Bukan Pengurus')}
                {user.active_organization_eras.length === 0 ? 'Tidak Ada Organisasi' : (
                    user.active_organization_eras.map((era) => (
                        <p key={`${era.nama_organisasi}-${era.periode_kepengurusan}`}>
                            {era.nama_organisasi} - {era.jabatan} ({era.periode_kepengurusan})
                        </p>
                    ))
                )}
            </HomeLayout>
        </>
    );
}
