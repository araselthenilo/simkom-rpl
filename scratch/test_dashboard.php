<?php

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

use App\Models\PengurusOrganisasi;
use Illuminate\Contracts\Console\Kernel;

$records = PengurusOrganisasi::with('profilOrganisasi.organisasi')
    ->whereHas('anggotaOrganisasi', function ($q) {
        $q->where('nim', '220010001');
    })->get()->toArray();

print_r($records);
