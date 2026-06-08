<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\PengurusOrganisasi;

$records = PengurusOrganisasi::with('profilOrganisasi.organisasi')
    ->whereHas('anggotaOrganisasi', function($q) {
        $q->where('nim', '220010001');
    })->get()->toArray();

print_r($records);
