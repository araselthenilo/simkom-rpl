import { MapPin, Trophy, Laptop, ArrowRight } from 'lucide-react';

interface Kegiatan {
    id: number;
    title: string;
    description: string;
    date: {
        month: string;
        day: string;
    };
    location: string;
    icon: 'location_on' | 'stadium' | 'computer';
    image: string;
    imageAlt: string;
    link?: string;
}

const DEFAULT_KEGIATAN: Kegiatan[] = [
    {
        id: 1,
        title: 'Seminar Nasional AI 2024',
        description:
            'Eksplorasi peran Artificial Intelligence dalam ekosistem industri kreatif masa kini bersama pakar ahli.',
        date: { month: 'OCT', day: '24' },
        location: 'Aula STIKOM Bali',
        icon: 'location_on',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5Qfj1WG7i3A0GGpSg8dCvrvVdDQTdc00TTlKOnHsWkDy1vU2yNRrV7y9NLzxOAZFI6m-Vn2-nMONgCs0AOrMaLPAmM80Hj8Ze4AbfWjJ99qDCbOYiAhC8xPp0J4vNzYvrZkaMZ4ITm2wPxLCGDAQt0aWN7ZYbQU68M-wpcvFA-FfwPvM3oHtacUuq1FpmJiLdLdMOditswBm7mzlUnJlkA3S1wWxlGf_zl_0SQGsKf5wcG00_4De6upsM1Z_VMtYAKKekFPTeeMI',
        imageAlt:
            'A professional academic seminar setting at STIKOM Bali with a speaker on a modern stage in front of a large digital screen. The audience is composed of attentive students in a bright, well-lit hall. The color palette is clean, emphasizing white surfaces and deep primary blue branding elements, maintaining a corporate and modern educational aesthetic.',
        link: '#',
    },
    {
        id: 2,
        title: 'PORSENI STIKOM Bali',
        description:
            'Pekan Olahraga dan Seni Mahasiswa tahunan. Tunjukkan bakat dan semangat kompetisi sportifmu.',
        date: { month: 'NOV', day: '02' },
        location: 'Gelanggang Olahraga',
        icon: 'stadium',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANqokMqYU9FOhsTWSfOQN7XeBPfa3v8bNaEN5yRgR8Ssp8Q89n70VgUZDO_rZd8eAbDjMNASYVjxHcD9ToFDgy0ME5j0L0D2NanGtSIjihRNtre-Zt6kQr16b074AY4lBMt1woup54b8YybusVq-ynI8QfwM4c1US9DBl_66Gf-lL935NYAVcowIF1LqgQseKNpiD9o5epouqjAlr8B-5Ijp4dX7YFDOcl2B0CK6p_I3uw6uf8C2wjix0R5m2Ke-7BLSFwvohJInU',
        imageAlt:
            'A vibrant student music festival and cultural event at night, illuminated by warm golden and soft primary blue stage lights. Crowds of students are seen in silhouette against a brightly lit stage. The mood is celebratory and prestigious, capturing the essence of extracurricular life at STIKOM Bali in a modern, high-contrast visual style.',
        link: '#',
    },
    {
        id: 3,
        title: 'Hackathon: Code For Bali',
        description:
            'Ciptakan solusi digital berbasis teknologi untuk tantangan sosial di lingkungan sekitar Bali.',
        date: { month: 'NOV', day: '15' },
        location: 'Lab Inovasi',
        icon: 'computer',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNpH-22IoCl63a9joUP9Z1QrnkhqiidpiG-kGq4F28wU2YMId0zMr_kh1mpUy08_LHyxEbyr-C811ezXrxnhqsZJlzDbJwevVEZf3ZzWQGgYJax6866wuAuyf2O1FkVsMrE2_7R3XY3ROKUNJaanx5BWRYmVWv-XdtX8HCh0DzebLzXbHO2H4MYijharWgAPXVGw_kt1BhR41UIn7nEcKcc1olzoC0vAXhsY4y_aANFzz-vHg1pgH2YugoOlJtlC3u2nRFWtm9tS0',
        imageAlt:
            'A collaborative coding workshop or hackathon scene in a bright, minimalist university lab. Students are working together on laptops, with code visible on screens. The room is filled with natural daylight and clean white desks, punctuated by navy blue accents. The atmosphere is focused and innovative, representing academic growth at STIKOM Bali.',
        link: '#',
    },
];

interface KegiatanMendatangProps {
    kegiatanList?: Kegiatan[];
}

export default function KegiatanMendatang({
    kegiatanList = DEFAULT_KEGIATAN,
}: KegiatanMendatangProps) {
    const getIcon = (icon: string) => {
        switch (icon) {
            case 'location_on':
                return <MapPin className="h-4 w-4" />;
            case 'stadium':
                return <Trophy className="h-4 w-4" />;
            case 'computer':
                return <Laptop className="h-4 w-4" />;
            default:
                return <MapPin className="h-4 w-4" />;
        }
    };

    return (
        <section className="mx-auto max-w-container-max px-margin-desktop py-unit-xl">
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <h2 className="font-headline-md text-headline-md text-primary">
                        Kegiatan Mendatang
                    </h2>
                    <p className="font-body-md text-on-surface-variant">
                        Jelajahi dan ikuti kegiatan menarik di kampus
                    </p>
                </div>
                <a
                    className="flex items-center gap-1 font-label-lg text-primary hover:underline"
                    href="#"
                >
                    Lihat Semua
                    <ArrowRight className="h-4 w-4" />
                </a>
            </div>
            <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
                {kegiatanList.map((item) => (
                    <div
                        key={item.id}
                        className="group flex flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface shadow-sm transition-all hover:shadow-lg"
                    >
                        <div className="relative h-48 overflow-hidden">
                            <img
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                alt={item.imageAlt}
                                src={item.image}
                            />
                            <div className="absolute top-4 left-4 rounded bg-surface/90 px-2.5 py-1.5 text-center leading-tight font-bold text-primary shadow-sm backdrop-blur">
                                <span className="block text-label-md font-semibold tracking-wider">
                                    {item.date.month}
                                </span>
                                <span className="text-headline-sm font-extrabold">
                                    {item.date.day}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col p-unit-lg">
                            <h3 className="mb-2 line-clamp-1 font-headline-sm text-headline-sm text-primary">
                                {item.title}
                            </h3>
                            <p className="mb-4 line-clamp-2 flex-1 font-body-sm text-on-surface-variant">
                                {item.description}
                            </p>
                            <div className="mt-auto flex items-center justify-between pt-2">
                                <div className="flex items-center gap-2 text-on-surface-variant">
                                    {getIcon(item.icon)}
                                    <span className="text-label-md">
                                        {item.location}
                                    </span>
                                </div>
                                <button className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-label-lg text-on-primary transition-all hover:bg-primary-container active:scale-95">
                                    Daftar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
