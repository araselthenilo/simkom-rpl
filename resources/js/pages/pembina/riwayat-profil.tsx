import { Head, usePage } from '@inertiajs/react';
import RiwayatProfil from '@/components/pembina/riwayat-profil';

interface PageProps {
    organisasi: {
        id_organisasi: number;
        nama_organisasi: string;
        status_aktif: boolean;
    };
    profils: any[];
    [key: string]: any;
}

export default function RiwayatProfilPage() {
    const { organisasi, profils, allPembina = [] } = usePage<PageProps>().props;

    return (
        <>
            <Head title={`Riwayat Profil - ${organisasi.nama_organisasi}`} />
            <RiwayatProfil
                organisasi={organisasi}
                profils={profils}
                allPembina={allPembina}
            />
        </>
    );
}
