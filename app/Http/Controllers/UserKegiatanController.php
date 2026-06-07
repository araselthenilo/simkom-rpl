<?php

namespace App\Http\Controllers;

use App\Models\Kegiatan;
use App\Models\PesertaKegiatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class UserKegiatanController extends Controller
{
    public function index(Request $request): Response
    {
        $user = Auth::user();
        if (! $user || $user->role !== 'Mahasiswa' || ! $user->profilPengguna) {
            abort(403);
        }

        $nim = $user->profilPengguna->nim;

        // Fetch all Kegiatan with status 'Mendatang'
        $kegiatan = Kegiatan::where('status_kegiatan', 'Mendatang')
            ->with(['profilOrganisasi.organisasi'])
            ->withCount('pesertaKegiatan')
            ->orderBy('tanggal_pelaksanaan', 'asc')
            ->get();

        // Fetch registered kegiatan mapped to their id_peserta
        $registrations = PesertaKegiatan::where('nim', $nim)
            ->get()
            ->pluck('id_peserta', 'id_kegiatan')
            ->toArray();

        return Inertia::render('kegiatan/index', [
            'kegiatan' => $kegiatan,
            'registrations' => (object) $registrations,
            'nim' => $nim,
        ]);
    }
}
