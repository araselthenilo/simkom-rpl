import { Head } from '@inertiajs/react';
import React from 'react';
import ProfilDetail from '@/components/pengurus/profil-detail';

interface Profil {
    id_profil: number;
    id_organisasi: number;
    periode_kepengurusan: string;
    logo_organisasi: string;
    deskripsi_organisasi: string;
    visi_organisasi: string;
    misi_organisasi: string;
    status_aktif: boolean;
}

interface Organisasi {
    id_organisasi: number;
    nama_organisasi: string;
}

interface DetailProps {
    profil: Profil;
    organisasi: Organisasi;
    statusKeanggotaan: 'Diproses' | 'Ditolak' | 'Aktif' | 'Tidak Aktif' | null;
    isReadOnly: boolean;
}

export default function Detail({
    profil,
    organisasi,
    statusKeanggotaan,
    isReadOnly,
}: DetailProps) {
    return (
        <>
            <Head title={`Profil ${organisasi.nama_organisasi}`} />
            <div className="animate-fade-in pb-12">
                <ProfilDetail
                    profil={profil}
                    organisasi={organisasi}
                    statusKeanggotaan={statusKeanggotaan}
                    isReadOnly={isReadOnly}
                />
            </div>
        </>
    );
}
