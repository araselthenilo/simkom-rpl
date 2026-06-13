<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Keuangan</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 11px;
            color: #333;
            line-height: 1.4;
        }
        .header {
            margin-bottom: 20px;
            border-bottom: 2px solid #1e3a8a;
            padding-bottom: 10px;
        }
        .header h1 {
            font-size: 20px;
            color: #1e3a8a;
            margin: 0 0 5px 0;
            text-transform: uppercase;
        }
        .header p {
            margin: 2px 0;
            font-size: 12px;
            color: #666;
        }
        .info-table {
            width: 100%;
            margin-bottom: 15px;
        }
        .info-table td {
            padding: 3px 0;
        }
        .info-table td.label {
            font-weight: bold;
            width: 120px;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .data-table th, .data-table td {
            border: 1px solid #ddd;
            padding: 8px 10px;
            text-align: left;
        }
        .data-table th {
            background-color: #1e3a8a;
            color: white;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 10px;
        }
        .data-table tr:nth-child(even) {
            background-color: #f8fafc;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .badge {
            padding: 3px 8px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 9px;
            display: inline-block;
        }
        .badge-pemasukan {
            background-color: #dcfce7;
            color: #15803d;
        }
        .badge-pengeluaran {
            background-color: #fee2e2;
            color: #b91c1c;
        }
        .summary-container {
            margin-top: 20px;
            float: right;
            width: 300px;
        }
        .summary-table {
            width: 100%;
            border-collapse: collapse;
        }
        .summary-table td {
            padding: 6px 8px;
            border: 1px solid #ddd;
        }
        .summary-table td.label {
            font-weight: bold;
            background-color: #f1f5f9;
        }
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 9px;
            color: #999;
            border-top: 1px solid #eee;
            padding-top: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laporan Keuangan</h1>
        <p>SIMKOM - Sistem Informasi Manajemen Komunitas Mahasiswa</p>
    </div>

    <table class="info-table">
        <tr>
            <td class="label">Organisasi</td>
            <td>: {{ $organisasi->nama_organisasi }}</td>
            <td class="label" style="text-align: right;">Tanggal Cetak</td>
            <td style="text-align: right;">: {{ $generated_at }}</td>
        </tr>
        <tr>
            <td class="label">Jenis Laporan</td>
            <td>: Mutasi Buku Kas Keuangan</td>
            <td class="label" style="text-align: right;">Filter Wilayah</td>
            <td style="text-align: right;">: {{ isset($is_admin_all) && $is_admin_all ? 'Semua Organisasi' : 'Organisasi Terkait' }}</td>
        </tr>
    </table>

    <table class="data-table">
        <thead>
            <tr>
                <th width="30" class="text-center">No</th>
                <th width="80">Tanggal</th>
                <th>Nama Kegiatan</th>
                <th width="80" class="text-center">Jenis</th>
                <th class="text-right" width="100">Nominal</th>
                <th>Sumber / Tujuan</th>
                <th>Catatan</th>
            </tr>
        </thead>
        <tbody>
            @php 
                $totalPemasukan = 0;
                $totalPengeluaran = 0;
            @endphp
            @forelse($rows as $index => $row)
                @php
                    if (strtolower($row['jenis_transaksi']) === 'pemasukan') {
                        $totalPemasukan += $row['nominal_transaksi'];
                    } else {
                        $totalPengeluaran += $row['nominal_transaksi'];
                    }
                @endphp
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ $row['tanggal_transaksi'] }}</td>
                    <td>{{ $row['nama_kegiatan'] }}</td>
                    <td class="text-center">
                        <span class="badge {{ strtolower($row['jenis_transaksi']) === 'pemasukan' ? 'badge-pemasukan' : 'badge-pengeluaran' }}">
                            {{ $row['jenis_transaksi'] }}
                        </span>
                    </td>
                    <td class="text-right">Rp {{ number_format($row['nominal_transaksi'], 0, ',', '.') }}</td>
                    <td>{{ $row['sumber_tujuan_transaksi'] }}</td>
                    <td>{{ $row['catatan_koreksi'] ?? '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="7" class="text-center">Tidak ada transaksi keuangan.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="summary-container">
        <table class="summary-table">
            <tr>
                <td class="label">Total Pemasukan</td>
                <td class="text-right" style="color: #15803d; font-weight: bold;">Rp {{ number_format($totalPemasukan, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td class="label">Total Pengeluaran</td>
                <td class="text-right" style="color: #b91c1c; font-weight: bold;">Rp {{ number_format($totalPengeluaran, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td class="label">Sisa Saldo Buku Kas</td>
                <td class="text-right" style="font-weight: bold; background-color: #f8fafc;">Rp {{ number_format($totalPemasukan - $totalPengeluaran, 0, ',', '.') }}</td>
            </tr>
        </table>
    </div>

    <div class="footer">
        Laporan ini digenerate secara otomatis oleh SIMKOM STIKOM Bali.
    </div>
</body>
</html>
