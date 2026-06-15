<?php

namespace App\Http\Controllers;

use App\Models\Kegiatan;
use App\Models\PengurusOrganisasi;
use App\Models\TransaksiKeuangan;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TransaksiKeuanganController extends Controller
{
    public function index(Kegiatan $kegiatan): Response
    {
        Gate::authorize('is-pengurus');

        $transaksi = TransaksiKeuangan::where('id_kegiatan', $kegiatan->id_kegiatan)
            ->orderBy('tanggal_transaksi', 'desc')
            ->get()
            ->map(fn (TransaksiKeuangan $t) => $this->formatForClient($t));

        $summary = [
            'total_pemasukan' => TransaksiKeuangan::where('id_kegiatan', $kegiatan->id_kegiatan)
                ->where('jenis_transaksi', 'Pemasukan')
                ->sum('nominal_transaksi'),
            'total_pengeluaran' => TransaksiKeuangan::where('id_kegiatan', $kegiatan->id_kegiatan)
                ->where('jenis_transaksi', 'Pengeluaran')
                ->sum('nominal_transaksi'),
        ];

        $summary['saldo'] = $summary['total_pemasukan'] - $summary['total_pengeluaran'];

        return Inertia::render('TransaksiKeuangan/Index', [
            'kegiatan' => $kegiatan->only('id_kegiatan', 'nama_kegiatan'),
            'transaksi' => $transaksi,
            'summary' => $summary,
        ]);
    }

    public function create(Kegiatan $kegiatan): Response
    {
        Gate::authorize('is-pengurus');

        return Inertia::render('TransaksiKeuangan/Create', [
            'kegiatan' => $kegiatan->only('id_kegiatan', 'nama_kegiatan'),
            'jenis_transaksi' => ['Pemasukan', 'Pengeluaran'],
        ]);
    }

    public function store(Request $request, Kegiatan $kegiatan): RedirectResponse
    {
        Gate::authorize('is-pengurus');

        $validated = $request->validate([
            'jenis_transaksi' => ['required', Rule::in(['Pemasukan', 'Pengeluaran'])],
            'nominal_transaksi' => ['required', 'numeric', 'min:0'],
            'tanggal_transaksi' => ['required', 'date'],
            'sumber_tujuan_transaksi' => ['required', 'string', 'max:200'],
            'foto_bukti_transaksi' => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'catatan_koreksi' => ['nullable', 'string', 'max:500'],
        ]);

        $path = $request->file('foto_bukti_transaksi')
            ->store('transaksi_keuangan/bukti', 'local');

        TransaksiKeuangan::create([
            'id_kegiatan' => $kegiatan->id_kegiatan,
            'jenis_transaksi' => $validated['jenis_transaksi'],
            'nominal_transaksi' => $validated['nominal_transaksi'],
            'tanggal_transaksi' => $validated['tanggal_transaksi'],
            'sumber_tujuan_transaksi' => $validated['sumber_tujuan_transaksi'],
            'foto_bukti_transaksi' => $path,
            'catatan_koreksi' => $validated['catatan_koreksi'] ?? null,
        ]);

        return redirect()
            ->route('kegiatan.transaksi-keuangan.index', $kegiatan)
            ->with('success', 'Transaksi berhasil ditambahkan.');
    }

    public function show(Kegiatan $kegiatan, TransaksiKeuangan $transaksiKeuangan): Response
    {
        Gate::authorize('is-pengurus');

        $this->authorizeKegiatanOwnership($kegiatan, $transaksiKeuangan);

        return Inertia::render('TransaksiKeuangan/Show', [
            'kegiatan' => $kegiatan->only('id_kegiatan', 'nama_kegiatan'),
            'transaksi' => $this->formatForClient($transaksiKeuangan),
        ]);
    }

    public function edit(Kegiatan $kegiatan, TransaksiKeuangan $transaksiKeuangan): Response
    {
        Gate::authorize('is-pengurus');

        $this->authorizeKegiatanOwnership($kegiatan, $transaksiKeuangan);

        return Inertia::render('TransaksiKeuangan/Edit', [
            'kegiatan' => $kegiatan->only('id_kegiatan', 'nama_kegiatan'),
            'transaksi' => $this->formatForClient($transaksiKeuangan),
            'jenis_transaksi' => ['Pemasukan', 'Pengeluaran'],
        ]);
    }

    public function update(
        Request $request,
        Kegiatan $kegiatan,
        TransaksiKeuangan $transaksiKeuangan
    ): RedirectResponse {
        Gate::authorize('is-pengurus');

        $this->authorizeKegiatanOwnership($kegiatan, $transaksiKeuangan);

        $validated = $request->validate([
            'jenis_transaksi' => ['required', Rule::in(['Pemasukan', 'Pengeluaran'])],
            'nominal_transaksi' => ['required', 'numeric', 'min:0'],
            'tanggal_transaksi' => ['required', 'date'],
            'sumber_tujuan_transaksi' => ['required', 'string', 'max:200'],
            'foto_bukti_transaksi' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'catatan_koreksi' => ['nullable', 'string', 'max:500'],
        ]);

        if ($request->hasFile('foto_bukti_transaksi')) {
            Storage::disk('local')->delete($transaksiKeuangan->foto_bukti_transaksi);

            $validated['foto_bukti_transaksi'] = $request
                ->file('foto_bukti_transaksi')
                ->store('transaksi_keuangan/bukti', 'local');
        } else {
            $validated['foto_bukti_transaksi'] = $transaksiKeuangan->foto_bukti_transaksi;
        }

        $transaksiKeuangan->update($validated);

        return redirect()
            ->route('kegiatan.transaksi-keuangan.index', $kegiatan)
            ->with('success', 'Transaksi berhasil diperbarui.');
    }

    public function destroy(
        Kegiatan $kegiatan,
        TransaksiKeuangan $transaksiKeuangan
    ): RedirectResponse {
        Gate::authorize('is-petugas');

        $this->authorizeKegiatanOwnership($kegiatan, $transaksiKeuangan);

        // Delete bukti foto from on-premise storage
        Storage::disk('local')->delete($transaksiKeuangan->foto_bukti_transaksi);

        $transaksiKeuangan->delete();

        return redirect()
            ->route('kegiatan.transaksi-keuangan.index', $kegiatan)
            ->with('success', 'Transaksi berhasil dihapus.');
    }

    public function koreksi(
        Request $request,
        Kegiatan $kegiatan,
        TransaksiKeuangan $transaksiKeuangan
    ): RedirectResponse {
        Gate::authorize('is-pengurus');

        $this->authorizeKegiatanOwnership($kegiatan, $transaksiKeuangan);

        $validated = $request->validate([
            'catatan_koreksi' => ['required', 'string', 'max:500'],
        ]);

        $transaksiKeuangan->update([
            'catatan_koreksi' => $validated['catatan_koreksi'],
        ]);

        return redirect()
            ->route('kegiatan.transaksi-keuangan.show', [$kegiatan, $transaksiKeuangan])
            ->with('success', 'Catatan koreksi berhasil disimpan.');
    }

    private function authorizeKegiatanOwnership(
        Kegiatan $kegiatan,
        TransaksiKeuangan $transaksiKeuangan
    ): void {
        abort_if(
            $transaksiKeuangan->id_kegiatan !== $kegiatan->id_kegiatan,
            403,
            'Transaksi ini bukan milik kegiatan yang dikerjakan.'
        );
    }

    private function formatForClient(TransaksiKeuangan $transaksi): array
    {
        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk('public');

        return [
            'id_transaksi' => $transaksi->id_transaksi,
            'id_kegiatan' => $transaksi->id_kegiatan,
            'jenis_transaksi' => $transaksi->jenis_transaksi,
            'nominal_transaksi' => $transaksi->nominal_transaksi,
            'tanggal_transaksi' => $transaksi->tanggal_transaksi,
            'sumber_tujuan_transaksi' => $transaksi->sumber_tujuan_transaksi,
            'foto_bukti_transaksi' => $transaksi->foto_bukti_transaksi
                ? route('transaksi-keuangan.bukti', $transaksi->id_transaksi)
                : null,
            'catatan_koreksi' => $transaksi->catatan_koreksi,
        ];
    }

    private function getActivePengurusRecord()
    {
        $user = auth()->user();
        if (! $user || $user->role !== 'Mahasiswa' || ! $user->profilPengguna) {
            abort(403, 'Akses ditolak.');
        }

        $nim = $user->profilPengguna->nim;
        $activeOrgId = session('active_organization_id');

        $pengurusRecordQuery = PengurusOrganisasi::where('status_aktif', true)
            ->whereHas('anggotaOrganisasi', function ($q) use ($nim) {
                $q->where('nim', $nim);
            })
            ->whereHas('profilOrganisasi.organisasi', function ($q) {
                $q->where('status_aktif', true);
            })
            ->with(['profilOrganisasi.organisasi']);

        if ($activeOrgId) {
            $pengurusRecord = (clone $pengurusRecordQuery)
                ->whereHas('profilOrganisasi', function ($q) use ($activeOrgId) {
                    $q->where('id_organisasi', $activeOrgId);
                })
                ->first();
        }

        if (! isset($pengurusRecord) || ! $pengurusRecord) {
            $pengurusRecord = $pengurusRecordQuery->first();
            if ($pengurusRecord && $pengurusRecord->profilOrganisasi) {
                session(['active_organization_id' => $pengurusRecord->profilOrganisasi->id_organisasi]);
            }
        }

        if (! $pengurusRecord || ! $pengurusRecord->profilOrganisasi) {
            abort(403, 'Anda bukan pengurus organisasi yang aktif.');
        }

        return $pengurusRecord;
    }

    public function pengurusIndex(): Response
    {
        Gate::authorize('is-pengurus');

        $pengurusRecord = $this->getActivePengurusRecord();
        $id_profil = $pengurusRecord->id_profil;

        // Fetch activities belonging to the active profile
        $activities = Kegiatan::where('id_profil', $id_profil)->get();
        $activityIds = $activities->pluck('id_kegiatan');

        // Fetch transactions for these activities with kegiatan details
        $transactions = TransaksiKeuangan::whereIn('id_kegiatan', $activityIds)
            ->with('kegiatan')
            ->orderBy('tanggal_transaksi', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function (TransaksiKeuangan $t) {
                return [
                    'id_transaksi' => $t->id_transaksi,
                    'id_kegiatan' => $t->id_kegiatan,
                    'jenis_transaksi' => $t->jenis_transaksi,
                    'nominal_transaksi' => (float) $t->nominal_transaksi,
                    'tanggal_transaksi' => $t->tanggal_transaksi,
                    'sumber_tujuan_transaksi' => $t->sumber_tujuan_transaksi,
                    'foto_bukti_transaksi' => $t->foto_bukti_transaksi
                        ? route('transaksi-keuangan.bukti', $t->id_transaksi)
                        : null,
                    'catatan_koreksi' => $t->catatan_koreksi,
                    'created_at' => $t->created_at ? $t->created_at->toIso8601String() : null,
                    'kegiatan' => $t->kegiatan ? $t->kegiatan->only('id_kegiatan', 'nama_kegiatan') : null,
                ];
            });

        // Compute statistics
        $totalPemasukan = TransaksiKeuangan::whereIn('id_kegiatan', $activityIds)
            ->where('jenis_transaksi', 'Pemasukan')
            ->sum('nominal_transaksi');

        $totalPengeluaran = TransaksiKeuangan::whereIn('id_kegiatan', $activityIds)
            ->where('jenis_transaksi', 'Pengeluaran')
            ->sum('nominal_transaksi');

        $totalSaldo = $totalPemasukan - $totalPengeluaran;

        return Inertia::render('pengurus/manajemen-keuangan', [
            'transactions' => $transactions,
            'activities' => $activities->map(fn (Kegiatan $k) => [
                'id_kegiatan' => $k->id_kegiatan,
                'nama_kegiatan' => $k->nama_kegiatan,
            ]),
            'stats' => [
                'total_saldo' => (float) $totalSaldo,
                'total_pemasukan' => (float) $totalPemasukan,
                'total_pengeluaran' => (float) $totalPengeluaran,
            ],
        ]);
    }

    public function pengurusStore(Request $request): RedirectResponse
    {
        Gate::authorize('is-pengurus');

        $pengurusRecord = $this->getActivePengurusRecord();
        $id_profil = $pengurusRecord->id_profil;

        // Verify the kegiatan belongs to the profile
        $validated = $request->validate([
            'id_kegiatan' => [
                'required',
                Rule::exists('kegiatan', 'id_kegiatan')->where('id_profil', $id_profil),
            ],
            'jenis_transaksi' => ['required', Rule::in(['Pemasukan', 'Pengeluaran'])],
            'nominal_transaksi' => ['required', 'numeric', 'min:0'],
            'tanggal_transaksi' => ['required', 'date'],
            'sumber_tujuan_transaksi' => ['required', 'string', 'max:200'],
            'foto_bukti_transaksi' => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'catatan_koreksi' => ['nullable', 'string', 'max:500'],
        ]);

        $path = $request->file('foto_bukti_transaksi')
            ->store('transaksi_keuangan/bukti', 'local');

        TransaksiKeuangan::create([
            'id_kegiatan' => $validated['id_kegiatan'],
            'jenis_transaksi' => $validated['jenis_transaksi'],
            'nominal_transaksi' => $validated['nominal_transaksi'],
            'tanggal_transaksi' => $validated['tanggal_transaksi'],
            'sumber_tujuan_transaksi' => $validated['sumber_tujuan_transaksi'],
            'foto_bukti_transaksi' => $path,
            'catatan_koreksi' => $validated['catatan_koreksi'] ?? null,
        ]);

        return redirect()
            ->route('pengurus.keuangan')
            ->with('success', 'Transaksi berhasil ditambahkan.');
    }

    public function pengurusUpdate(Request $request, TransaksiKeuangan $transaksi): RedirectResponse
    {
        Gate::authorize('is-pengurus');

        $pengurusRecord = $this->getActivePengurusRecord();
        $id_profil = $pengurusRecord->id_profil;

        // Verify the transaction belongs to activities managed by the active profile
        $activities = Kegiatan::where('id_profil', $id_profil)->get();
        $activityIds = $activities->pluck('id_kegiatan');

        abort_unless($activityIds->contains($transaksi->id_kegiatan), 403, 'Anda tidak memiliki akses ke transaksi ini.');

        // Validate the incoming request
        $validated = $request->validate([
            'id_kegiatan' => [
                'required',
                Rule::exists('kegiatan', 'id_kegiatan')->where('id_profil', $id_profil),
            ],
            'jenis_transaksi' => ['required', Rule::in(['Pemasukan', 'Pengeluaran'])],
            'nominal_transaksi' => ['required', 'numeric', 'min:0'],
            'tanggal_transaksi' => ['required', 'date'],
            'sumber_tujuan_transaksi' => ['required', 'string', 'max:200'],
            'foto_bukti_transaksi' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'catatan_koreksi' => ['nullable', 'string', 'max:500'],
        ]);

        if ($request->hasFile('foto_bukti_transaksi')) {
            // Delete old file
            if ($transaksi->foto_bukti_transaksi) {
                Storage::disk('local')->delete($transaksi->foto_bukti_transaksi);
            }

            $validated['foto_bukti_transaksi'] = $request
                ->file('foto_bukti_transaksi')
                ->store('transaksi_keuangan/bukti', 'local');
        } else {
            unset($validated['foto_bukti_transaksi']); // Keep existing
        }

        $transaksi->update($validated);

        return redirect()
            ->route('pengurus.keuangan')
            ->with('success', 'Transaksi berhasil diperbarui.');
    }

    public function adminIndex(): Response
    {
        Gate::authorize('is-admin');

        // Fetch all transactions with kegiatan → profilOrganisasi → organisasi
        $transactions = TransaksiKeuangan::with([
            'kegiatan.profilOrganisasi.organisasi',
        ])
            ->orderBy('tanggal_transaksi', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function (TransaksiKeuangan $t) {
                /** @var FilesystemAdapter $disk */
                $disk = Storage::disk('public');

                return [
                    'id_transaksi'           => $t->id_transaksi,
                    'id_kegiatan'            => $t->id_kegiatan,
                    'jenis_transaksi'        => $t->jenis_transaksi,
                    'nominal_transaksi'      => (float) $t->nominal_transaksi,
                    'tanggal_transaksi'      => $t->tanggal_transaksi,
                    'sumber_tujuan_transaksi'=> $t->sumber_tujuan_transaksi,
                    'foto_bukti_transaksi'   => $t->foto_bukti_transaksi
                        ? route('transaksi-keuangan.bukti', $t->id_transaksi)
                        : null,
                    'catatan_koreksi'        => $t->catatan_koreksi,
                    'created_at'             => $t->created_at ? $t->created_at->toIso8601String() : null,
                    'kegiatan'               => $t->kegiatan ? [
                        'id_kegiatan'       => $t->kegiatan->id_kegiatan,
                        'nama_kegiatan'     => $t->kegiatan->nama_kegiatan,
                        'profil_organisasi' => $t->kegiatan->profilOrganisasi ? [
                            'id_profil'    => $t->kegiatan->profilOrganisasi->id_profil,
                            'organisasi'   => $t->kegiatan->profilOrganisasi->organisasi ? [
                                'id_organisasi'   => $t->kegiatan->profilOrganisasi->organisasi->id_organisasi,
                                'nama_organisasi' => $t->kegiatan->profilOrganisasi->organisasi->nama_organisasi,
                            ] : null,
                        ] : null,
                    ] : null,
                ];
            });

        // Aggregate stats across all transactions
        $totalPemasukan   = TransaksiKeuangan::where('jenis_transaksi', 'Pemasukan')->sum('nominal_transaksi');
        $totalPengeluaran = TransaksiKeuangan::where('jenis_transaksi', 'Pengeluaran')->sum('nominal_transaksi');
        $totalSaldo       = $totalPemasukan - $totalPengeluaran;

        // All activities
        $activities = Kegiatan::all()->map(fn (Kegiatan $k) => [
            'id_kegiatan'   => $k->id_kegiatan,
            'nama_kegiatan' => $k->nama_kegiatan,
        ]);

        // All active organisations
        $organisasiList = \App\Models\Organisasi::where('status_aktif', true)
            ->get()
            ->map(fn ($org) => [
                'id_organisasi'   => $org->id_organisasi,
                'nama_organisasi' => $org->nama_organisasi,
            ]);

        return Inertia::render('admin/manajemen-keuangan', [
            'transactions'   => $transactions,
            'activities'     => $activities,
            'organisasiList' => $organisasiList,
            'stats'          => [
                'total_saldo'        => (float) $totalSaldo,
                'total_pemasukan'    => (float) $totalPemasukan,
                'total_pengeluaran'  => (float) $totalPengeluaran,
            ],
        ]);
    }

    public function showBuktiTrans(TransaksiKeuangan $transaksi)
    {
        if (!auth()->check()) {
            abort(403);
        }

        $filePath = $transaksi->foto_bukti_transaksi;
        if (!$filePath || !Storage::disk('local')->exists($filePath)) {
            abort(404, 'Bukti transaksi tidak ditemukan.');
        }

        $user = auth()->user();
        $isAuthorized = false;

        // Admin / Petugas: allowed
        if (Gate::check('is-admin') || Gate::check('is-petugas')) {
            $isAuthorized = true;
        }

        // If it is a registration receipt (transaksi-bukti/...)
        if (str_starts_with($filePath, 'transaksi-bukti')) {
            // Retrieve associated event participant
            $participant = \App\Models\PesertaKegiatan::where('id_transaksi', $transaksi->id_transaksi)->first();
            if ($participant) {
                // If it is the student themselves, allow
                if ($user->role === 'Mahasiswa' && $user->profilPengguna && $user->profilPengguna->nim === $participant->nim) {
                    $isAuthorized = true;
                }
                
                // If Pembina managing the organization of the activity
                if (!$isAuthorized && Gate::check('is-pembina')) {
                    $pembina = $user->profilPengguna;
                    $managedOrgIds = $pembina ? $pembina->pembinaan()->pluck('id_organisasi')->toArray() : [];
                    $orgId = $transaksi->kegiatan->profilOrganisasi->id_organisasi ?? null;
                    if (in_array($orgId, $managedOrgIds)) {
                        $isAuthorized = true;
                    }
                }
                
                // If Pengurus managing the organization of the activity
                if (!$isAuthorized && Gate::check('is-pengurus-organisasi')) {
                    $nim = $user->profilPengguna->nim ?? null;
                    $orgId = $transaksi->kegiatan->profilOrganisasi->id_organisasi ?? null;
                    $isStaff = $nim && $orgId ? PengurusOrganisasi::where('status_aktif', true)
                        ->whereHas('anggotaOrganisasi', function ($q) use ($nim) {
                            $q->where('nim', $nim);
                        })
                        ->whereHas('profilOrganisasi', function ($q) use ($orgId) {
                            $q->where('id_organisasi', $orgId);
                        })
                        ->exists() : false;
                        
                    if ($isStaff) {
                        $isAuthorized = true;
                    }
                }
            }
        } else {
            // General financial transaction proof (transaksi_keuangan/bukti/...)
            // Accessible by all authenticated roles (students for transparency, pembina/pengurus/admin)
            $isAuthorized = true;
        }

        if (!$isAuthorized) {
            abort(403, 'Anda tidak memiliki akses ke bukti transaksi ini.');
        }

        return response()->file(Storage::disk('local')->path($filePath));
    }
}
