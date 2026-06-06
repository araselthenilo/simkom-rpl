import {
    Download,
    Users,
    Hourglass,
    CheckCircle2,
    XCircle,
    Search,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    HelpCircle,
    IdCard
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Member {
    nim: string;
    name: string;
    major: string;
    status: 'Aktif' | 'Diproses' | 'Ditolak';
    initials: string;
    avatarColor: string;
}

export default function ManajemenAnggota() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'Semua' | 'Aktif' | 'Diproses' | 'Ditolak'>('Semua');

    const [stats, setStats] = useState({
        total: 1248,
        pending: 42,
        active: 890,
        rejected: 12
    });

    const [members, setMembers] = useState<Member[]>([
        {
            nim: '210010123',
            name: 'Bagus Putu Aris',
            major: 'Sistem Komputer',
            status: 'Aktif',
            initials: 'BP',
            avatarColor: 'bg-primary-fixed text-primary',
        },
        {
            nim: '220030045',
            name: 'Ni Made Sari',
            major: 'Teknologi Informasi',
            status: 'Diproses',
            initials: 'NM',
            avatarColor: 'bg-secondary-fixed text-on-secondary-container',
        },
        {
            nim: '210010099',
            name: 'I Gede Wahyu',
            major: 'Bisnis Digital',
            status: 'Ditolak',
            initials: 'IG',
            avatarColor: 'bg-tertiary-fixed text-on-tertiary-container',
        },
        {
            nim: '210020412',
            name: 'Kadek Amara',
            major: 'Sistem Informasi',
            status: 'Aktif',
            initials: 'KA',
            avatarColor: 'bg-primary-fixed text-primary',
        },
        {
            nim: '230010887',
            name: 'Dewa Widya',
            major: 'Teknologi Informasi',
            status: 'Diproses',
            initials: 'DW',
            avatarColor: 'bg-secondary-fixed text-on-secondary-container',
        }
    ]);

    const handleAccept = (nim: string) => {
        setMembers(prevMembers =>
            prevMembers.map(member => {
                if (member.nim === nim) {
                    if (member.status === 'Diproses') {
                        setStats(prev => ({
                            ...prev,
                            pending: Math.max(0, prev.pending - 1),
                            active: prev.active + 1,
                            total: prev.total + 1
                        }));
                    } else if (member.status === 'Ditolak') {
                        setStats(prev => ({
                            ...prev,
                            rejected: Math.max(0, prev.rejected - 1),
                            active: prev.active + 1,
                            total: prev.total + 1
                        }));
                    }

                    return { ...member, status: 'Aktif' };
                }

                return member;
            })
        );
    };

    const handleReject = (nim: string) => {
        setMembers(prevMembers =>
            prevMembers.map(member => {
                if (member.nim === nim) {
                    if (member.status === 'Diproses') {
                        setStats(prev => ({
                            ...prev,
                            pending: Math.max(0, prev.pending - 1),
                            rejected: prev.rejected + 1
                        }));
                    } else if (member.status === 'Aktif') {
                        setStats(prev => ({
                            ...prev,
                            active: Math.max(0, prev.active - 1),
                            total: Math.max(0, prev.total - 1),
                            rejected: prev.rejected + 1
                        }));
                    }

                    return { ...member, status: 'Ditolak' };
                }

                return member;
            })
        );
    };

    const filteredMembers = members.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.nim.includes(searchQuery);

        if (activeTab === 'Semua') {
return matchesSearch;
}

        return matchesSearch && member.status === activeTab;
    });

    return (
        <main className="p-margin-desktop max-w-container-max mx-auto w-full space-y-gutter">
            {/* Header */}
            <header className="flex justify-between items-end mb-unit-xl">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary">Manajemen Anggota</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                        Kelola permohonan keanggotaan dan status mahasiswa aktif.
                    </p>
                </div>
                <div className="flex gap-unit-sm">
                    <Button
                        className="bg-primary text-on-primary px-6 py-3 h-auto rounded-lg font-label-lg flex items-center gap-2 shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none"
                    >
                        <Download className="h-[18px] w-[18px]" />
                        Export PDF
                    </Button>
                </div>
            </header>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-unit-xl">
                <Card className="bg-surface-container-lowest p-unit-lg rounded-xl shadow-[0px_2px_4px_rgba(26,54,93,0.05)] border border-outline-variant flex flex-col justify-between h-32 ring-0">
                    <div className="flex justify-between items-start">
                        <span className="text-primary/70 font-label-md">Total Anggota</span>
                        <Users className="text-primary/40 h-5 w-5" />
                    </div>
                    <div className="font-headline-md text-headline-md text-primary font-bold">{stats.total.toLocaleString('id-ID')}</div>
                </Card>
                <Card className="bg-surface-container-lowest p-unit-lg rounded-xl shadow-[0px_2px_4px_rgba(26,54,93,0.05)] border border-outline-variant flex flex-col justify-between h-32 ring-0">
                    <div className="flex justify-between items-start">
                        <span className="text-secondary font-label-md">Menunggu Proses</span>
                        <Hourglass className="text-secondary/40 h-5 w-5" />
                    </div>
                    <div className="font-headline-md text-headline-md text-secondary font-bold">{stats.pending}</div>
                </Card>
                <Card className="bg-surface-container-lowest p-unit-lg rounded-xl shadow-[0px_2px_4px_rgba(26,54,93,0.05)] border border-outline-variant flex flex-col justify-between h-32 ring-0">
                    <div className="flex justify-between items-start">
                        <span className="text-green-700 font-label-md">Aktif Semester Ini</span>
                        <CheckCircle2 className="text-green-700/40 h-5 w-5" />
                    </div>
                    <div className="font-headline-md text-headline-md text-green-700 font-bold">{stats.active}</div>
                </Card>
                <Card className="bg-surface-container-lowest p-unit-lg rounded-xl shadow-[0px_2px_4px_rgba(26,54,93,0.05)] border border-outline-variant flex flex-col justify-between h-32 ring-0">
                    <div className="flex justify-between items-start">
                        <span className="text-error font-label-md">Permohonan Ditolak</span>
                        <XCircle className="text-error/40 h-5 w-5" />
                    </div>
                    <div className="font-headline-md text-headline-md text-error font-bold">{stats.rejected}</div>
                </Card>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-surface-container-lowest rounded-xl shadow-[0px_2px_4px_rgba(26,54,93,0.05)] border border-outline-variant p-unit-md mb-unit-lg flex flex-col md:flex-row justify-between items-center gap-unit-md">
                <div className="flex p-1 bg-surface-container-low rounded-lg w-full md:w-auto overflow-x-auto">
                    {(['Semua', 'Aktif', 'Diproses', 'Ditolak'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-md font-label-lg transition-all text-nowrap ${activeTab === tab
                                    ? 'bg-white shadow-sm text-primary font-semibold'
                                    : 'text-on-surface-variant hover:text-primary'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant h-4 w-4" />
                    <input
                        className="w-full pl-10 pr-4 py-2 bg-background border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-sm text-on-background"
                        placeholder="Cari NIM atau Nama..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Members Table */}
            <Card className="bg-surface-container-lowest rounded-xl shadow-[0px_2px_4px_rgba(26,54,93,0.05)] border border-outline-variant overflow-hidden ring-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low border-b border-outline-variant">
                                <th className="px-unit-lg py-4 font-label-lg text-primary uppercase tracking-wider">NIM</th>
                                <th className="px-unit-lg py-4 font-label-lg text-primary uppercase tracking-wider">Nama Mahasiswa</th>
                                <th className="px-unit-lg py-4 font-label-lg text-primary uppercase tracking-wider">Program Studi</th>
                                <th className="px-unit-lg py-4 font-label-lg text-primary uppercase tracking-wider">Status</th>
                                <th className="px-unit-lg py-4 font-label-lg text-primary uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/50">
                            {filteredMembers.map((member) => (
                                <tr key={member.nim} className="hover:bg-primary/[0.02] transition-colors">
                                    <td className="px-unit-lg py-4 font-label-md text-on-background">{member.nim}</td>
                                    <td className="px-unit-lg py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full ${member.avatarColor} flex items-center justify-center font-bold text-xs`}>
                                                {member.initials}
                                            </div>
                                            <span className="font-body-md font-medium text-on-background">{member.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-unit-lg py-4 font-body-sm text-on-surface-variant">{member.major}</td>
                                    <td className="px-unit-lg py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-[12px] font-semibold ${member.status === 'Aktif'
                                                    ? 'bg-green-100 text-green-700'
                                                    : member.status === 'Diproses'
                                                        ? 'bg-secondary-container text-on-secondary-container'
                                                        : 'bg-error-container text-error'
                                                }`}
                                        >
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="px-unit-lg py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                className="p-2 text-primary hover:bg-primary-fixed rounded-lg transition-colors"
                                                title="Lihat KTM"
                                            >
                                                <IdCard className="h-5 w-5" />
                                            </button>

                                            <button
                                                onClick={() => handleAccept(member.nim)}
                                                className={`p-2 transition-colors rounded-lg ${member.status === 'Aktif'
                                                        ? 'text-outline-variant cursor-not-allowed'
                                                        : 'text-green-700 hover:bg-green-100'
                                                    }`}
                                                disabled={member.status === 'Aktif'}
                                                title="Terima"
                                            >
                                                <CheckCircle2 className="h-5 w-5" />
                                            </button>

                                            <button
                                                onClick={() => handleReject(member.nim)}
                                                className={`p-2 transition-colors rounded-lg ${member.status === 'Ditolak'
                                                        ? 'text-outline-variant cursor-not-allowed'
                                                        : 'text-error hover:bg-error-container'
                                                    }`}
                                                disabled={member.status === 'Ditolak'}
                                                title="Tolak"
                                            >
                                                <XCircle className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredMembers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-unit-lg py-8 text-center text-on-surface-variant font-body-md">
                                        Tidak ada anggota yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-unit-lg py-4 bg-surface-container-low border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-unit-md">
                    <span className="font-body-sm text-on-surface-variant">
                        Menampilkan 1-{filteredMembers.length} dari {filteredMembers.length === 5 ? '1.248' : filteredMembers.length} data
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            className="p-2 rounded-lg hover:bg-surface-container-highest transition-colors text-on-surface-variant disabled:opacity-30"
                            disabled
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-label-md">1</button>
                        <button className="w-8 h-8 rounded-lg hover:bg-surface-container-highest transition-colors font-label-md text-on-surface-variant">2</button>
                        <button className="w-8 h-8 rounded-lg hover:bg-surface-container-highest transition-colors font-label-md text-on-surface-variant">3</button>
                        <span className="px-2 text-on-surface-variant">...</span>
                        <button className="w-8 h-8 rounded-lg hover:bg-surface-container-highest transition-colors font-label-md text-on-surface-variant">250</button>
                        <button className="p-2 rounded-lg hover:bg-surface-container-highest transition-colors text-on-surface-variant">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </Card>

            {/* Guide & Support Section */}
            <div className="mt-unit-xl grid grid-cols-1 md:grid-cols-3 gap-gutter">
                <div className="md:col-span-2 relative overflow-hidden bg-primary text-on-primary p-unit-xl rounded-xl shadow-lg">
                    <div className="relative z-10 max-w-md">
                        <h3 className="font-headline-md text-headline-md mb-2">Panduan Verifikasi</h3>
                        <p className="font-body-md opacity-80 mb-6">
                            Pastikan Nama dan NIM yang tertera di form pendaftaran sesuai dengan Kartu Tanda Mahasiswa (KTM) yang diunggah sebelum menyetujui anggota baru.
                        </p>
                        <a className="inline-flex items-center gap-2 font-label-lg text-secondary-fixed hover:underline" href="#">
                            Lihat SOP Keanggotaan
                            <ArrowRight className="h-[18px] w-[18px]" />
                        </a>
                    </div>
                    <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20"></div>
                    <div className="absolute right-12 bottom-0 w-32 h-32 bg-white/5 rounded-full mb-8"></div>
                </div>
                <div className="bg-surface-container-lowest p-unit-lg rounded-xl shadow-[0px_2px_4px_rgba(26,54,93,0.05)] border border-outline-variant flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center mb-4 text-primary">
                        <HelpCircle className="h-10 w-10" />
                    </div>
                    <h4 className="font-headline-sm text-primary mb-2">Butuh Bantuan?</h4>
                    <p className="font-body-sm text-on-surface-variant mb-4">
                        Hubungi tim IT jika terjadi kendala pada sinkronisasi data NIM.
                    </p>
                    <button className="w-full border-2 border-primary text-primary font-label-lg py-2 rounded-lg hover:bg-primary-fixed transition-colors">
                        Tiket Support
                    </button>
                </div>
            </div>
        </main>
    );
}
