<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class LaporanKeuanganExport implements
    FromCollection,
    WithHeadings,
    WithMapping,
    WithStyles,
    WithTitle,
    WithColumnFormatting
{
    /**
     * @param Collection<int, array<string, mixed>> $rows
     */
    public function __construct(private readonly Collection $rows) {}

    public function collection(): Collection
    {
        return $this->rows;
    }

    public function title(): string
    {
        return 'Laporan Keuangan';
    }

    public function headings(): array
    {
        return [
            'Nama Kegiatan',
            'Jenis Transaksi',
            'Nominal (Rp)',
            'Tanggal Transaksi',
            'Sumber / Tujuan',
            'Catatan Koreksi',
        ];
    }

    /**
     * @param array<string, mixed> $row
     */
    public function map($row): array
    {
        return [
            $row['nama_kegiatan'],
            $row['jenis_transaksi'],
            $row['nominal_transaksi'],
            $row['tanggal_transaksi'],
            $row['sumber_tujuan_transaksi'],
            $row['catatan_koreksi'] ?? '-',
        ];
    }

    public function columnFormats(): array
    {
        return [
            'C' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED2,
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
