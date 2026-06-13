import { Head, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
    Download, 
    Trash2, 
    Search, 
    FileText, 
    FileSpreadsheet, 
    BarChart3 
} from 'lucide-react';

interface ReportArchive {
    id_laporan: number;
    id_organisasi: number;
    nama_organisasi: string;
    username_petugas: string;
    jenis_laporan: string;
    file_laporan: string;
    created_at: string;
}

interface PembinaLaporanPageProps {
    arsip?: ReportArchive[];
}

export default function PembinaLaporanPage({ arsip = [] }: PembinaLaporanPageProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
            'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
        ];
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} WITA`;
    };

    const getFileExtension = (filename: string) => {
        return filename.split('.').pop()?.toLowerCase();
    };

    const handleDelete = (id_laporan: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus arsip laporan ini? Tindakan ini juga akan menghapus file fisik di penyimpanan.')) {
            router.delete(`/pembina/laporan/${id_laporan}`);
        }
    };

    const filteredReports = arsip.filter((report) => {
        const query = searchQuery.toLowerCase();
        const orgName = (report.nama_organisasi || '').toLowerCase();
        const creator = (report.username_petugas || '').toLowerCase();
        const reportType = (report.jenis_laporan || '').toLowerCase();
        const filename = (report.file_laporan.split('/').pop() || '').toLowerCase();

        return (
            orgName.includes(query) ||
            creator.includes(query) ||
            reportType.includes(query) ||
            filename.includes(query)
        );
    });

    return (
        <>
            <Head title="Arsip Laporan Keuangan" />
            <div className="mx-auto w-full max-w-container-max space-y-gutter p-margin-desktop">
                {/* Header */}
                <section className="flex flex-col items-start justify-between gap-gutter md:flex-row md:items-center">
                    <div className="space-y-unit-xs">
                        <h2 className="font-headline-lg text-headline-lg text-primary">
                            Arsip Laporan
                        </h2>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                            Daftar seluruh dokumen laporan kegiatan dan keuangan yang telah digenerate.
                        </p>
                    </div>
                </section>

                {/* Table Card */}
                <Card className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm ring-0">
                    {/* Toolbar */}
                    <div className="flex flex-col items-stretch justify-between gap-4 border-b border-outline-variant/30 bg-surface-container-low/30 px-unit-lg py-4 sm:flex-row sm:items-center">
                        <h3 className="flex items-center gap-2 font-headline-sm text-headline-sm text-primary">
                            <BarChart3 className="h-5 w-5" />
                            Daftar Laporan Terbuat
                        </h3>
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                            <input
                                className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-lowest py-2 pr-4 pl-10 text-body-sm outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Cari organisasi, pembuat, nama file..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-outline-variant/30 bg-surface-container-lowest">
                                    <th className="px-unit-lg py-4 font-label-lg text-label-lg tracking-wider text-on-surface-variant uppercase">
                                        Tanggal Dibuat
                                    </th>
                                    <th className="px-unit-lg py-4 font-label-lg text-label-lg tracking-wider text-on-surface-variant uppercase">
                                        Organisasi
                                    </th>
                                    <th className="px-unit-lg py-4 font-label-lg text-label-lg tracking-wider text-on-surface-variant uppercase">
                                        Jenis
                                    </th>
                                    <th className="px-unit-lg py-4 font-label-lg text-label-lg tracking-wider text-on-surface-variant uppercase">
                                        Format
                                    </th>
                                    <th className="px-unit-lg py-4 font-label-lg text-label-lg tracking-wider text-on-surface-variant uppercase">
                                        Nama File / Lokasi
                                    </th>
                                    <th className="px-unit-lg py-4 font-label-lg text-label-lg tracking-wider text-on-surface-variant uppercase">
                                        Pembuat
                                    </th>
                                    <th className="px-unit-lg py-4 text-right font-label-lg text-label-lg tracking-wider text-on-surface-variant uppercase">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/20">
                                {filteredReports.map((report) => {
                                    const ext = getFileExtension(report.file_laporan);
                                    const filename = report.file_laporan.split('/').pop() || 'laporan';
                                    
                                    return (
                                        <tr
                                            key={report.id_laporan}
                                            className="transition-colors hover:bg-surface-container-low/20"
                                        >
                                            <td className="px-unit-lg py-4">
                                                <span className="font-body-md text-body-md">
                                                    {formatDate(report.created_at)}
                                                </span>
                                            </td>
                                            <td className="px-unit-lg py-4">
                                                <span className="font-body-md text-body-md font-medium text-primary">
                                                    {report.nama_organisasi}
                                                </span>
                                            </td>
                                            <td className="px-unit-lg py-4">
                                                <span className="inline-flex items-center rounded-full bg-primary-container/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                                    {report.jenis_laporan}
                                                </span>
                                            </td>
                                            <td className="px-unit-lg py-4">
                                                {ext === 'pdf' ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                                                        <FileText className="h-3.5 w-3.5" />
                                                        PDF
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-bold text-green-700 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-400">
                                                        <FileSpreadsheet className="h-3.5 w-3.5" />
                                                        Excel
                                                    </span>
                                                )}
                                            </td>
                                            <td className="max-w-[200px] truncate px-unit-lg py-4 font-body-md text-body-md font-medium" title={filename}>
                                                {filename}
                                            </td>
                                            <td className="px-unit-lg py-4">
                                                <span className="font-body-md text-body-md text-on-surface-variant">
                                                    @{report.username_petugas}
                                                </span>
                                            </td>
                                            <td className="px-unit-lg py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <a
                                                        href={`/pembina/laporan/${report.id_laporan}/download`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            className="flex h-8 items-center gap-1.5 rounded-lg px-3 py-1.5 font-label-md text-label-md text-primary shadow-none hover:bg-surface-container-low"
                                                            title="Download File"
                                                        >
                                                            <Download className="h-3.5 w-3.5" />
                                                            Download
                                                        </Button>
                                                    </a>
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => handleDelete(report.id_laporan)}
                                                        className="flex h-8 items-center gap-1.5 rounded-lg px-3 py-1.5 font-label-md text-label-md text-error shadow-none hover:bg-error/10 hover:text-error"
                                                        title="Hapus Arsip"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                        Hapus
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredReports.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-unit-lg py-8 text-center font-body-md text-on-surface-variant"
                                        >
                                            Tidak ada arsip laporan yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer */}
                    <div className="border-t border-outline-variant/30 px-unit-lg py-4 text-on-surface-variant">
                        <p className="font-body-sm text-body-sm">
                            Total {filteredReports.length} arsip laporan keuangan.
                        </p>
                    </div>
                </Card>
            </div>
        </>
    );
}
