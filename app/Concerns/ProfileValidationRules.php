<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait ProfileValidationRules
{
    /**
     * Get the validation rules used to validate user profiles.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function profileRules(?string $username = null): array
    {
        return [
            'username' => $this->usernameRules($username),
            'name' => $this->nameRules(),
            'email' => $this->emailRules($username),
        ];
    }

    /**
     * Get the validation rules used to validate user usernames.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function usernameRules(?string $username = null): array
    {
        return [
            'required',
            'string',
            'max:30',
            'alpha_dash',
            $username === null
                ? Rule::unique(User::class, 'username')
                : Rule::unique(User::class, 'username')->ignore($username, 'username'),
        ];
    }

    /**
     * Get the validation rules used to validate user names.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function nameRules(): array
    {
        return ['required', 'string', 'max:255'];
    }

    /**
     * Get the validation rules used to validate user emails.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function emailRules(?string $username = null): array
    {
        return [
            'required',
            'string',
            'email',
            'max:255',
            $username === null
                ? Rule::unique(User::class, 'email')
                : Rule::unique(User::class, 'email')->ignore($username, 'username'),
        ];
    }
}
