<?php

namespace App\Http\Responses;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  Request  $request
     * @return Response
     */
    public function toResponse($request)
    {
        $user = Auth::user();

        if ($user->role === 'Admin Kemahasiswaan') {
            return redirect()->intended(route('admin.dashboard'));
        }

        // if ($user->role === 'Pembina Organisasi') {
        //     return redirect()->intended(route('pembina.dashboard'));
        // }

        if ($user->role === 'Mahasiswa') {
            return redirect()->intended(route('home'));
        }

        return redirect()->intended(config('fortify.home'));
    }
}
