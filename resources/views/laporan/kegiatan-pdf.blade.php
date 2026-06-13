<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Kegiatan</title>
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
        <h1>Laporan Kegiatan</h1>
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
            <td>: Daftar Kegiatan Mahasiswa</td>
            <td class="label" style="text-align: right;">Periode</td>
            <td style="text-align: right;">: {{ $periode ?? 'Semua' }}</td>
        </tr>
    </table>

    <table class="data-table">
        <thead>
            <tr>
                <th width="30" class="text-center">No</th>
                <th>Nama Kegiatan</th>
                <th>Jenis</th>
                <th width="80">Tanggal</th>
                <th>Lokasi</th>
                <th class="text-center" width="60">Peserta</th>
                <th class="text-right" width="90">Pemasukan</th>
                <th class="text-right" width="90">Pengeluaran</th>
            </tr>
        </thead>
        <tbody>
            @forelse($rows as $index => $row)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ $row['nama_kegiatan'] }}</td>
                    <td>{{ $row['jenis_kegiatan'] }}</td>
                    <td>{{ $row['tanggal_pelaksanaan'] }}</td>
                    <td>{{ $row['lokasi_kegiatan'] }}</td>
                    <td class="text-center">{{ $row['jumlah_peserta'] }}</td>
                    <td class="text-right">Rp {{ number_format($row['total_pemasukan'], 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($row['total_pengeluaran'], 0, ',', '.') }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="8" class="text-center">Tidak ada data kegiatan.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Laporan ini digenerate secara otomatis oleh SIMKOM STIKOM Bali.
    </div>
</body>
</html>
