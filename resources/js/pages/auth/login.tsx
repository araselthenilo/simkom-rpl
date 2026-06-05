import { Head, Form } from '@inertiajs/react';
import stikomBgJpg from '../../../../public/stikom-bg.jpg';
import stikomLogoPng from '../../../../public/stikom-logo.png';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Checkbox } from '@/components/ui/checkbox';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Login">
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
                />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                />
            </Head>

            <main className="flex min-h-screen bg-background text-on-background">
                {/* Left Side: Visual Showcase */}
                <section className="relative hidden overflow-hidden bg-primary lg:flex lg:w-3/5">
                    <div className="absolute inset-0 z-10 bg-linear-to-tr from-primary/90 via-primary/40 to-transparent"></div>
                    <img
                        alt="Kampus ITB STIKOM Bali"
                        className="absolute inset-0 h-full w-full object-cover"
                        src={stikomBgJpg}
                    />
                    <div className="relative z-20 flex h-full w-full max-w-2xl flex-col justify-end p-unit-xl">
                        <div className="mb-unit-xl space-y-unit-md">
                            <h1 className="font-headline-lg text-headline-lg text-white">
                                Membangun Masa Depan Digital dari ITB STIKOM
                                Bali
                            </h1>
                            <p className="font-body-lg text-body-lg leading-relaxed text-white/80">
                                Sistem Informasi Manajemen Kegiatan Organisasi
                                Mahasiswa (SIMKOM) menyediakan akses terpusat
                                bagi seluruh civitas akademika untuk
                                berkolaborasi, berinovasi, dan mengelola
                                administrasi kampus dengan efisiensi tinggi.
                            </p>
                        </div>
                        <div className="flex items-center gap-unit-lg font-label-md text-white/60">
                            <div className="flex items-center gap-unit-xs">
                                <span className="material-symbols-outlined text-[18px]">
                                    verified
                                </span>
                                <span>Terakreditasi Unggul</span>
                            </div>
                            <div className="flex items-center gap-unit-xs">
                                <span className="material-symbols-outlined text-[18px]">
                                    group
                                </span>
                                <span>6k+ Mahasiswa Aktif</span>
                            </div>
                        </div>
                    </div>
                    {/* <div className="absolute top-unit-xl right-unit-xl z-20 h-32 w-32 rounded-full border-16 border-secondary opacity-20 blur-sm"></div> */}
                </section>

                {/* Right Side: Login Form */}
                <section className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-surface px-margin-mobile md:px-unit-xl lg:w-2/5">
                    <div className="w-full max-w-md space-y-unit-xl">
                        {/* Branding Header */}
                        <div className="space-y-unit-sm text-center">
                            <div className="mb-unit-md flex justify-center">
                                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary-container shadow-lg">
                                    <img
                                        src={stikomLogoPng}
                                        alt="STIKOM Logo"
                                        className="h-11.25 w-11.25 object-contain"
                                    />
                                </div>
                            </div>
                            <h2 className="font-headline-md text-headline-md text-primary">
                                SIMKOM ITB STIKOM Bali
                            </h2>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                Silakan masuk menggunakan akun institusi Anda
                            </p>
                        </div>

                        {/* Form Card */}
                        <Card className="gap-2 rounded-xl border border-outline-variant bg-white p-unit-lg shadow-sm">
                            <Form
                                {...store.form()}
                                resetOnSuccess={['password']}
                                className="space-y-unit-lg"
                                noValidate
                            >
                                {({ processing, errors }) => (
                                    <>
                                        {/* Username Input */}
                                        <div className="space-y-unit-sm">
                                            <Label
                                                className="font-label-lg text-label-lg text-on-surface"
                                                htmlFor="username"
                                            >
                                                Username
                                            </Label>
                                            <div className="group relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant transition-colors group-focus-within:text-primary">
                                                    <span className="material-symbols-outlined text-[20px]">
                                                        person
                                                    </span>
                                                </div>
                                                <Input
                                                    id="username"
                                                    type="text"
                                                    name="username"
                                                    tabIndex={1}
                                                    autoComplete="username"
                                                    autoFocus
                                                    className="bg-surface-container w-full rounded-lg border border-outline-variant py-6 pr-4 pl-10 font-body-lg transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                                    placeholder="Masukkan username Anda"
                                                    required
                                                />
                                            </div>
                                            <InputError
                                                className="mt-1 text-xs"
                                                message={errors.username}
                                            />
                                        </div>

                                        {/* Password Input */}
                                        <div className="space-y-unit-sm">
                                            <Label
                                                className="font-label-lg text-label-lg text-on-surface"
                                                htmlFor="password"
                                            >
                                                Password
                                            </Label>
                                            <div className="group relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant transition-colors group-focus-within:text-primary">
                                                    <span className="material-symbols-outlined text-[20px]">
                                                        lock
                                                    </span>
                                                </div>
                                                <PasswordInput
                                                    id="password"
                                                    name="password"
                                                    autoComplete="current-password"
                                                    tabIndex={2}
                                                    className="bg-surface-container w-full rounded-lg border border-outline-variant py-6 pr-12 pl-10 font-body-lg transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                                    placeholder="••••••••"
                                                    required
                                                />
                                            </div>
                                            <InputError
                                                className="mt-1 text-xs"
                                                message={errors.password}
                                            />
                                        </div>

                                        {/* Remember Me & Forgot Password */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex cursor-pointer items-center gap-unit-sm">
                                                <Checkbox
                                                    id="remember"
                                                    name="remember"
                                                    tabIndex={3}
                                                    className="h-5 w-5 rounded border-outline-variant text-primary hover:cursor-pointer hover:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 data-[state=checked]:bg-primary"
                                                />
                                                <Label
                                                    className="font-body-md text-body-md text-on-surface-variant select-none"
                                                    htmlFor="remember"
                                                >
                                                    Ingat saya
                                                </Label>
                                            </div>
                                            {/* Gunakan Inertia Link untuk SPA navigation */}
                                            {canResetPassword && (
                                                <TextLink
                                                    href={request()}
                                                    tabIndex={4}
                                                    className="font-label-lg text-label-lg text-primary transition-all hover:underline"
                                                >
                                                    Lupa Password?
                                                </TextLink>
                                            )}
                                        </div>

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            tabIndex={5}
                                            disabled={processing}
                                            className="flex w-full transform items-center justify-center gap-unit-sm rounded-lg bg-primary px-unit-lg py-unit-lg font-label-lg text-on-primary transition-all hover:cursor-pointer hover:bg-primary-container hover:shadow-lg active:scale-[0.98] disabled:opacity-50"
                                        >
                                            {processing
                                                ? 'Menghubungkan...'
                                                : 'Masuk Ke Akun'}
                                            <span className="material-symbols-outlined text-[18px]">
                                                login
                                            </span>
                                        </Button>
                                    </>
                                )}
                            </Form>

                            <div className="mt-unit-lg border-t border-outline-variant pt-unit-lg text-center">
                                <p className="font-body-md text-body-md text-on-surface-variant">
                                    Belum memiliki akses?{' '}
                                    <a
                                        href="https://www.stikom-bali.ac.id/"
                                        className="font-label-lg text-primary hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Hubungi Admin Prodi
                                    </a>
                                </p>
                            </div>
                        </Card>

                        {/* Footer Support */}
                        <div className="flex flex-col items-center justify-center gap-unit-md font-body-sm text-on-surface-variant md:flex-row">
                            <a
                                className="text-center transition-colors hover:text-primary hover:underline"
                                href="https://www.stikom-bali.ac.id/id/contact/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Pusat Bantuan
                            </a>
                            <span className="hidden h-1 w-1 rounded-full bg-outline-variant md:block"></span>
                            <a
                                className="text-center transition-colors hover:text-primary hover:underline"
                                href="https://www.stikom-bali.ac.id/id/kebijakan-mutu-itb-stikom/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Kebijakan Privasi
                            </a>
                            <span className="hidden h-1 w-1 rounded-full bg-outline-variant md:block"></span>
                            <span className="text-center text-on-surface-variant/60">
                                © 2026
                                <br />
                                ITB STIKOM Bali
                            </span>
                        </div>
                    </div>

                    {/* Decorative Background */}
                    <div className="bg-secondary-fixed/10 pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full blur-3xl"></div>
                    <div className="bg-primary-fixed-dim/10 pointer-events-none absolute -top-16 -left-16 h-64 w-64 rounded-full blur-3xl"></div>
                </section>
            </main>
        </>
    );
}
