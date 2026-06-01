<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class LaporanKegiatanExport implements
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
        return 'Laporan Kegiatan';
    }

    public function headings(): array
    {
        return [
            'Nama Kegiatan',
            'Jenis Kegiatan',
            'Tanggal Pelaksanaan',
            'Lokasi',
            'Status',
            'Jumlah Peserta',
            'Total Pemasukan (Rp)',
            'Total Pengeluaran (Rp)',
            'Saldo (Rp)',
        ];
    }

    /**
     * @param array<string, mixed> $row
     */
    public function map($row): array
    {
        return [
            $row['nama_kegiatan'],
            $row['jenis_kegiatan'],
            $row['tanggal_pelaksanaan'],
            $row['lokasi_kegiatan'],
            $row['status_kegiatan'],
            $row['jumlah_peserta'],
            $row['total_pemasukan'],
            $row['total_pengeluaran'],
            $row['total_pemasukan'] - $row['total_pengeluaran'],
        ];
    }

    public function columnFormats(): array
    {
        return [
            'G' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED2,
            'H' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED2,
            'I' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED2,
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
