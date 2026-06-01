<?php

namespace App\Http\Controllers;

use App\Models\Kegiatan;
use App\Models\PesertaKegiatan;
use App\Models\TransaksiKeuangan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

use function Symfony\Component\Clock\now;

class PesertaKegiatanController extends Controller
{
    public function index(int $id_kegiatan): Response
    {
        $user = Auth::user();
        $kegiatan = Kegiatan::where('id_kegiatan', $id_kegiatan)->firstOrFail();

        if ($user->role === 'Mahasiswa') {
            Gate::authorize('is-pengurus-kegiatan');
        } else {
            Gate::authorize('is-petugas');
        }

        $peserta = PesertaKegiatan::with(['mahasiswa', 'transaksiKeuangan'])
            ->where('id_kegiatan', $id_kegiatan)
            ->orderBy('waktu_daftar')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('PesertaKegiatan/Index', [
            'kegiatan' => $kegiatan,
            'peserta'  => $peserta,
        ]);
    }

    public function riwayat(): Response
    {
        $user = Auth::user();

        abort_if(
            $user->role !== 'Mahasiswa',
            403,
            'Hanya mahasiswa yang dapat mengakses riwayat kegiatan ini.'
        );

        $mahasiswa = $user->pribadiPengguna;

        abort_if(
            !$mahasiswa,
            404,
            'Data mahasiswa tidak ditemukan'
        );

        $peserta = PesertaKegiatan::with(['kegiatan', 'transaksiKeuangan'])
            ->where('nim', $mahasiswa->nim)
            ->orderByDesc('waktu_daftar')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('PesertaKegiatan/Riwayat', [
            'peserta'   => $peserta,
            'mahasiswa' => $mahasiswa,
        ]);
    }

    public function store(Request $request, int $id_kegiatan): RedirectResponse
    {
        $kegiatan = Kegiatan::where('id_kegiatan', $id_kegiatan)->firstOrFail();

        abort_if(
            !$kegiatan,
            404,
            'Kegiatan tidak ditemukan'
        );

        $validated = $request->validate([
            'nim' => [
                'required',
                'string',
                'size:9',
                'exists:mahasiswa,nim',
            ],
            'id_transaksi' => [
                'required',
                'integer',
                'exists:transaksi_keuangan,id_transaksi',
            ],
        ]);

        $transaksi = TransaksiKeuangan::query()
            ->where([
                'id_transaksi' => $validated['id_transaksi'],
                'id_kegiatan' => $kegiatan->id_kegiatan,
            ])
            ->firstOrFail();

        abort_if(
            !$transaksi,
            403,
            'Transaksi tidak sesuai kegiatan'
        );

        $user = Auth::user();

        if ($user->role === 'Mahasiswa') {
            $mahasiswa = $user->pribadiPengguna;

            abort_if(
                !$mahasiswa,
                404,
                'Data mahasiswa tidak ditemukan.'
            );

            abort_if(
                $mahasiswa->nim !== $validated['nim'],
                403,
                'Mahasiswa hanya dapat mendaftarkan diri sendiri sebagai peserta.'
            );
        } else {
            Gate::authorize('manage-peserta-kegiatan');
        }

        $sudahTerdaftar = PesertaKegiatan::where('nim', $validated['nim'])
            ->where('id_kegiatan', $id_kegiatan)
            ->exists();

        if ($sudahTerdaftar) {
            return back()->withErrors([
                'nim' => 'Mahasiswa dengan NIM tersebut sudah terdaftar pada kegiatan ini.',
            ]);
        }

        $jumlahPeserta = Kegiatan::where('id_kegiatan', $id_kegiatan)->count();

        if ($jumlahPeserta >= $kegiatan->kuota_peserta) {
            return back()->withErrors([
                'kuota' => 'Kuota kegiatan sudah penuh.',
            ]);
        }

        DB::transaction(function () use ($request, $kegiatan, $validated) {
            $transaksi = null;

            if ($kegiatan->biaya_pendaftaran > 0) {
                $path = $request->file('foto_bukti_transaksi')
                    ->store('transaksi-bukti', 'public');

                $transaksi = TransaksiKeuangan::create([
                    'id_kegiatan' => $kegiatan->id_kegiatan,
                    'jenis_transaksi' => 'Pemasukan',
                    'nominal_transaksi' => $kegiatan->biaya_pendaftaran,
                    'tanggal_transaksi' => now(),
                    'sumber_tujuan_transaksi' => 'pendaftaran kegiatan',
                    'foto_bukti_transaksi' => $path,
                    'catatan_koreksi' => null,
                ]);
            }

            PesertaKegiatan::create([
                'id_kegiatan' => $kegiatan->id_kegiatan,
                'nim' => $validated['nim'],
                'id_transaksi' => $transaksi?->id_transaksi,
            ]);
        });

        return back()->with('success', 'Peserta berhasil didaftarkan ke kegiatan.');
    }

    public function destroy(int $id_kegiatan, int $id_peserta): RedirectResponse
    {
        $peserta = PesertaKegiatan::where('id_peserta', $id_peserta)
            ->where('id_kegiatan', $id_kegiatan)
            ->firstOrFail();

        $user = Auth::user();

        if ($user->role === 'Mahasiswa') {
            $mahasiswa = $user->pribadiPengguna;

            abort_if(
                $mahasiswa->nim !== $peserta->nim,
                403,
                'Mahasiswa tidak diizinkan membatalkan pendaftaran peserta lain.'
            );
        } else {
            Gate::authorize('is-petugas');
        }

        $peserta->delete();

        return back()->with('success', 'Pendaftaran peserta berhasil dibatalkan.');
    }
}
