<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Http\Controllers\PengurusDashboardController;
use Illuminate\Support\Facades\Auth;

$pengurusRecord = \App\Models\PengurusOrganisasi::where('status_aktif', true)->first();
$mahasiswa = $pengurusRecord->anggotaOrganisasi->mahasiswa;
$user = $mahasiswa->user;

Auth::login($user);
$orgId = $pengurusRecord->profilOrganisasi->id_organisasi;
session(['active_organization_id' => $orgId]);

$controller = new PengurusDashboardController();
$response = $controller->index();

echo "PROPS DUMP:\n";
print_r($response->toResponse(request())->original['page']['props']['stats']);
