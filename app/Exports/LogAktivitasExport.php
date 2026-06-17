<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class LogAktivitasExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle
{
    private int $rowNumber = 1;

    /**
     * @param  Collection<int, \App\Models\LogAktivitas>  $rows
     */
    public function __construct(private readonly Collection $rows) {}

    public function collection(): Collection
    {
        return $this->rows;
    }

    public function title(): string
    {
        return 'Log Aktivitas';
    }

    public function headings(): array
    {
        return [
            'No',
            'Waktu',
            'Pengguna (Aktor)',
            'Organisasi / UKM',
            'Kategori',
            'Aktivitas / Deskripsi',
            'IP Address',
            'User Agent',
        ];
    }

    /**
     * @param  \App\Models\LogAktivitas  $row
     */
    public function map($row): array
    {
        return [
            $this->rowNumber++,
            $row->created_at ? $row->created_at->format('d/m/Y H:i:s') : '-',
            $row->user ? "{$row->user->name} ({$row->username})" : 'Sistem / Guest',
            $row->organisasi ? $row->organisasi->nama_organisasi : 'Semua / Umum',
            $row->kategori,
            $row->deskripsi,
            $row->ip_address ?? '-',
            $row->user_agent ?? '-',
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
