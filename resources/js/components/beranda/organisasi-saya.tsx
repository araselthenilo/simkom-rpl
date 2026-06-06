import { Link } from '@inertiajs/react';
import {
    Code2,
    Terminal,
    Megaphone,
    Music,
    Calendar,
    ChevronRight,
} from 'lucide-react';
import { pengurus } from '@/routes';

interface Organization {
    id: number;
    name: string;
    role: string;
    type: 'staff' | 'member';
    icon: string;
    bgIcon?: string;
    description?: string;
    nextMeeting?: {
        label: string;
        time: string;
    };
    statusText?: string;
    link?: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    code: Code2,
    terminal: Terminal,
    campaign: Megaphone,
    music_note: Music,
    event: Calendar,
    chevron_right: ChevronRight,
};

function OrganizationIcon({
    name,
    className,
}: {
    name: string;
    className?: string;
}) {
    const IconComponent = ICON_MAP[name];

    if (!IconComponent) {
        return null;
    }

    return <IconComponent className={className} />;
}

const DEFAULT_ORGANIZATIONS: Organization[] = [
    {
        id: 1,
        name: 'UKM Programmer',
        role: 'Ketua Divisi',
        type: 'staff',
        icon: 'code',
        bgIcon: 'terminal',
        description:
            'Fokus pada pengembangan software, kompetisi coding, dan workshop teknologi terbaru.',
        nextMeeting: {
            label: 'Rapat Terdekat',
            time: 'Besok, 14:00 - Lab 3',
        },
        link: '#',
    },
    {
        id: 2,
        name: 'UKM Jurnalistik',
        role: 'Anggota Aktif',
        type: 'member',
        icon: 'campaign',
        statusText: 'Anggota Aktif • 12 Berita Baru',
        link: '#',
    },
    {
        id: 3,
        name: 'UKM Musik',
        role: 'Anggota Pasif',
        type: 'member',
        icon: 'music_note',
        statusText: 'Anggota Pasif • 2 Agenda Latihan',
        link: '#',
    },
];

interface OrganisasiSayaProps {
    organizations?: Organization[];
}

export default function OrganisasiSaya({
    organizations = DEFAULT_ORGANIZATIONS,
}: OrganisasiSayaProps) {
    const staffOrgs = organizations.filter((org) => org.type === 'staff');
    const memberOrgs = organizations.filter((org) => org.type === 'member');

    return (
        <section className="py-unit-xl">
            <div className="mx-auto max-w-container-max px-margin-desktop">
                <div className="mb-8">
                    <h2 className="font-headline-md text-headline-md text-primary">
                        Organisasi Saya
                    </h2>
                    <p className="font-body-md text-on-surface-variant">
                        Status keanggotaan dan aktivitas organisasi Anda
                    </p>
                </div>

                {/* Robust 2-column grid */}
                <div className="grid grid-cols-1 gap-unit-md lg:grid-cols-2">
                    {/* Left Column: Staff Organizations */}
                    <div className="flex flex-col">
                        {staffOrgs.map((org) => (
                            <div
                                key={org.id}
                                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl bg-primary p-unit-lg text-on-primary shadow-lg"
                            >
                                <div className="z-10">
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-on-primary/10 backdrop-blur">
                                            <OrganizationIcon
                                                name={org.icon}
                                                className="h-7 w-7"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-headline-sm text-headline-sm">
                                                {org.name}
                                            </h3>
                                            <span className="rounded bg-secondary px-2 py-0.5 text-label-md text-on-secondary">
                                                {org.role}
                                            </span>
                                        </div>
                                    </div>
                                    {org.description && (
                                        <p className="mb-6 font-body-md opacity-80">
                                            {org.description}
                                        </p>
                                    )}
                                    {org.nextMeeting && (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 rounded-lg border border-on-primary/10 bg-on-primary/5 p-3">
                                                <Calendar className="h-5 w-5 opacity-70" />
                                                <div>
                                                    <p className="text-label-md opacity-70">
                                                        {org.nextMeeting.label}
                                                    </p>
                                                    <p className="font-label-lg">
                                                        {org.nextMeeting.time}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {org.link && (
                                    <Link
                                        href={pengurus()}
                                        className="z-10 mt-8 block w-full cursor-pointer rounded-lg bg-[#FFD54F] py-3 text-center font-label-lg font-medium text-[#001D35] transition-all hover:bg-[#FFC107]"
                                    >
                                        Dashboard UKM
                                    </Link>
                                )}
                                {org.bgIcon && (
                                    <div className="absolute -right-10 -bottom-10 opacity-10 transition-transform duration-700 group-hover:scale-110">
                                        <OrganizationIcon
                                            name={org.bgIcon}
                                            className="h-[200px] w-[200px]"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right Column: Member Organizations wrapped in an aligning flex container */}
                    {/* Added: "items-stretch" to allow children flex expansion */}
                    <div className="flex flex-col items-stretch gap-unit-md">
                        {memberOrgs.map((org) => (
                            <div
                                key={org.id}
                                /* Added: "flex-1" to stretch cards into equal heights filling the right container */
                                className="flex flex-1 cursor-pointer items-center gap-unit-lg rounded-xl border border-outline-variant bg-surface p-unit-lg shadow-sm transition-all hover:border-primary"
                                onClick={() =>
                                    org.link && window.open(org.link, '_self')
                                }
                            >
                                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-surface-container-high">
                                    <OrganizationIcon
                                        name={org.icon}
                                        className="h-7 w-7 text-primary"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <h4 className="font-headline-sm text-headline-sm text-primary">
                                        {org.name}
                                    </h4>
                                    <p className="text-body-sm text-on-surface-variant">
                                        {org.statusText}
                                    </p>
                                </div>
                                <ChevronRight className="h-5 w-5 text-on-surface-variant" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
