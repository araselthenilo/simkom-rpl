<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Log Aktivitas Sistem</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 10px;
            color: #333;
            line-height: 1.4;
        }
        .header {
            margin-bottom: 20px;
            border-bottom: 2px solid #1e3a8a;
            padding-bottom: 10px;
        }
        .header h1 {
            font-size: 18px;
            color: #1e3a8a;
            margin: 0 0 5px 0;
            text-transform: uppercase;
        }
        .header p {
            margin: 2px 0;
            font-size: 11px;
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
            width: 100px;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .data-table th, .data-table td {
            border: 1px solid #ddd;
            padding: 6px 8px;
            text-align: left;
            word-wrap: break-word;
        }
        .data-table th {
            background-color: #1e3a8a;
            color: white;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 9px;
        }
        .data-table tr:nth-child(even) {
            background-color: #f8fafc;
        }
        .text-center {
            text-align: center;
        }
        .badge {
            padding: 2px 5px;
            border-radius: 3px;
            font-weight: bold;
            font-size: 8px;
            display: inline-block;
            text-transform: uppercase;
        }
        .badge-autentikasi {
            background-color: #e2e8f0;
            color: #475569;
        }
        .badge-profil {
            background-color: #dbeafe;
            color: #1d4ed8;
        }
        .badge-kegiatan {
            background-color: #dcfce7;
            color: #15803d;
        }
        .badge-keuangan {
            background-color: #fef9c3;
            color: #a16207;
        }
        .badge-sistem {
            background-color: #f3e8ff;
            color: #6b21a8;
        }
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 8px;
            color: #999;
            border-top: 1px solid #eee;
            padding-top: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laporan Log Aktivitas Sistem</h1>
        <p>SIMKOM - Sistem Informasi Manajemen Komunitas Mahasiswa</p>
    </div>

    <table class="info-table">
        <tr>
            <td class="label">Petugas Pencetak</td>
            <td>: {{ $petugas }}</td>
            <td class="label" style="text-align: right;">Tanggal Cetak</td>
            <td style="text-align: right;">: {{ $generated_at }}</td>
        </tr>
        <tr>
            <td class="label">Filter UKM</td>
            <td>: {{ $filter_organisasi }}</td>
            <td class="label" style="text-align: right;">Filter Kategori</td>
            <td style="text-align: right;">: {{ $filter_kategori }}</td>
        </tr>
        <tr>
            <td class="label">Periode Log</td>
            <td>: {{ $periode }}</td>
            <td></td>
            <td></td>
        </tr>
    </table>

    <table class="data-table">
        <thead>
            <tr>
                <th width="5%" class="text-center">No</th>
                <th width="15%">Waktu</th>
                <th width="20%">Pengguna (Aktor)</th>
                <th width="15%" class="text-center">Kategori</th>
                <th width="15%">Organisasi/UKM</th>
                <th width="30%">Aktivitas / Deskripsi</th>
            </tr>
        </thead>
        <tbody>
            @forelse($rows as $index => $row)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ $row->created_at ? $row->created_at->format('d/m/Y H:i:s') : '-' }}</td>
                    <td>
                        {{ $row->user ? $row->user->name : 'Sistem / Guest' }}
                        <br>
                        <span style="font-size: 8px; color: #666;">({{ $row->username ?? 'Guest' }})</span>
                    </td>
                    <td class="text-center">
                        @php
                            $badgeClass = 'badge-sistem';
                            $kat = strtolower($row->kategori);
                            if ($kat === 'autentikasi') $badgeClass = 'badge-autentikasi';
                            elseif ($kat === 'profil') $badgeClass = 'badge-profil';
                            elseif ($kat === 'kegiatan') $badgeClass = 'badge-kegiatan';
                            elseif ($kat === 'keuangan') $badgeClass = 'badge-keuangan';
                        @endphp
                        <span class="badge {{ $badgeClass }}">
                            {{ $row->kategori }}
                        </span>
                    </td>
                    <td>{{ $row->organisasi ? $row->organisasi->nama_organisasi : 'Semua / Umum' }}</td>
                    <td>{{ $row->deskripsi }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" class="text-center">Tidak ada rekaman log aktivitas yang cocok dengan kriteria filter.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Laporan ini digenerate secara otomatis oleh SIMKOM STIKOM Bali. Halaman 1 dari 1 (atau dinonaktifkan halaman default).
    </div>
</body>
</html>
