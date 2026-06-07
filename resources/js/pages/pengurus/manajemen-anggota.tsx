import ManajemenAnggota from '@/components/pengurus/manajemen-anggota';

interface Member {
    id_keanggotaan: number;
    nim: string;
    name: string;
    major: string;
    status: 'Aktif' | 'Diproses' | 'Ditolak' | 'Tidak Aktif';
    initials: string;
    avatarColor: string;
    foto_ktm: string;
}

interface Stats {
    total: number;
    pending: number;
    active: number;
    rejected: number;
}

interface Props {
    members: Member[];
    stats: Stats;
}

export default function ManajemenAnggotaPage({ members, stats }: Props) {
    return <ManajemenAnggota initialMembers={members} initialStats={stats} />;
}
