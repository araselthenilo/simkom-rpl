import { Form, Head } from '@inertiajs/react';
import { ArrowLeft, Lock, MailIcon } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { update } from '@/routes/password';
import stikomLogoPng from '../../../../public/stikom-logo.png';

type Props = {
    token: string;
    email: string;
    passwordRules: string;
};

export default function ResetPassword({ token, email, passwordRules }: Props) {
    return (
        <>
            <Head title="Reset Password">
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col bg-background text-on-background">
                {/* Main Content Canvas */}
                <main className="relative z-10 flex grow items-center justify-center p-margin-mobile">
                    <div className="w-full max-w-110 animate-in duration-700 fade-in slide-in-from-bottom-4">
                        {/* Logo Section */}
                        <div className="mb-unit-xl flex flex-col items-center">
                            <div className="mb-unit-sm flex h-16 w-16 items-center justify-center rounded-xl bg-primary-container shadow-lg">
                                <img
                                    src={stikomLogoPng}
                                    alt="STIKOM Logo"
                                    className="has-[2.25rem] w-[2.25rem] object-contain"
                                />
                            </div>
                            <h2 className="font-headline-md text-headline-md tracking-tight text-primary">
                                SIMKOM ITB STIKOM Bali
                            </h2>
                        </div>
                        {/* <!-- Reset Password Card --> */}
                        <div className="glass-card rounded-xl border border-outline-variant p-unit-lg shadow-[0px_2px_4px_rgba(26,54,93,0.05)]">
                            <div className="mb-unit-lg space-y-unit-sm text-center">
                                <h1 className="font-headline-sm text-headline-sm text-on-surface">
                                    Reset Password
                                </h1>
                                <p className="font-body-md text-body-md text-on-surface-variant">
                                    Silakan masukkan password baru Anda di bawah
                                    ini.
                                </p>
                            </div>

                            <Form
                                {...update.form()}
                                transform={(data) => ({
                                    ...data,
                                    token,
                                    email,
                                })}
                                resetOnSuccess={[
                                    'password',
                                    'password_confirmation',
                                ]}
                                className="space-y-unit-lg"
                                noValidate
                            >
                                {({ processing, errors }) => (
                                    <>
                                        {/* <!-- Email Field (Read Only) --> */}
                                        <div className="mb-unit-md space-y-unit-xs">
                                            <Label
                                                className="font-label-lg text-label-lg text-on-surface"
                                                htmlFor="email"
                                            >
                                                Email
                                            </Label>
                                            <div className="relative">
                                                <MailIcon className="absolute top-1/2 left-3 -translate-y-1/2 text-[20px] text-outline" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    autoComplete="email"
                                                    value={email}
                                                    className="w-full rounded-lg border border-outline-variant bg-surface-container py-6 pr-12 pl-11 font-body-lg transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                                    readOnly
                                                />
                                            </div>
                                            <InputError
                                                message={errors.email}
                                                className="mt-1 text-xs"
                                            />
                                        </div>

                                        {/* <!-- New Password Field --> */}
                                        <div className="mb-unit-md space-y-unit-xs">
                                            <Label
                                                className="font-label-lg text-label-lg text-on-surface"
                                                htmlFor="password"
                                            >
                                                Password Baru
                                            </Label>
                                            <div className="relative">
                                                <Lock className="absolute top-1/2 left-3 -translate-y-1/2 text-[20px] text-outline" />
                                                <PasswordInput
                                                    id="password"
                                                    name="password"
                                                    placeholder="••••••••"
                                                    autoComplete="new-password"
                                                    autoFocus
                                                    className="w-full rounded-lg border border-outline-variant bg-surface-container py-6 pr-12 pl-11 font-body-lg transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                                    passwordrules={
                                                        passwordRules
                                                    }
                                                    required
                                                />
                                            </div>
                                            <InputError
                                                message={errors.password}
                                                className="mt-1 text-xs"
                                            />
                                        </div>

                                        {/* <!-- Confirm Password Field --> */}
                                        <div className="mb-unit-md space-y-unit-xs">
                                            <Label
                                                className="font-label-lg text-label-lg text-on-surface"
                                                htmlFor="password_confirmation"
                                            >
                                                Konfirmasi Password Baru
                                            </Label>
                                            <div className="relative">
                                                <Lock className="absolute top-1/2 left-3 -translate-y-1/2 text-[20px] text-outline" />
                                                <PasswordInput
                                                    id="password_confirmation"
                                                    name="password_confirmation"
                                                    placeholder="••••••••"
                                                    autoComplete="new-password"
                                                    className="w-full rounded-lg border border-outline-variant bg-surface-container py-6 pr-12 pl-11 font-body-lg transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                                    passwordrules={
                                                        passwordRules
                                                    }
                                                    required
                                                />
                                            </div>
                                            <InputError
                                                message={
                                                    errors.password_confirmation
                                                }
                                                className="mt-1 text-xs"
                                            />
                                        </div>

                                        {/* <!-- Action Button --> */}
                                        <Button
                                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-6 py-6 font-label-lg text-label-lg text-on-primary shadow-md transition-all duration-100 hover:bg-primary-container active:scale-[0.98]"
                                            type="submit"
                                            disabled={processing}
                                            data-test="reset-password-button"
                                        >
                                            {processing && <Spinner />}
                                            <span>Reset Password</span>
                                        </Button>
                                    </>
                                )}
                            </Form>
                            {/* <!-- Footer Link --> */}
                            <div className="mt-unit-lg flex justify-center border-t border-outline-variant pt-unit-lg">
                                <a
                                    className="flex items-center gap-2 font-label-lg text-label-lg text-primary transition-all hover:scale-105 hover:text-primary-container active:scale-95"
                                    href={login().url}
                                >
                                    <ArrowLeft className="text-[18px]" />
                                    <span>Kembali ke Login</span>
                                </a>
                            </div>
                        </div>
                        {/* <!-- Support Text --> */}
                        <p className="mt-unit-xl text-center font-body-sm text-body-sm text-on-surface-variant">
                            Butuh bantuan lebih lanjut?{' '}
                            <a
                                className="font-medium text-primary hover:underline"
                                href="https://youtu.be/dQw4w9WgXcQ?si=sWWkq83-lpBdQXh2"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Hubungi IT Support
                            </a>
                        </p>
                    </div>
                </main>
                {/* <!-- Footer Component (Shared) --> */}
                <footer className="z-10 w-full border-t border-outline-variant bg-surface-container py-unit-lg">
                    <div className="mx-auto grid w-full max-w-container-max grid-cols-1 items-center justify-items-center gap-unit-md px-margin-desktop text-center md:grid-cols-3">
                        {/* Left Column: Brand Name */}
                        <div className="w-full md:text-right">
                            <span className="font-label-lg text-label-lg font-bold text-primary">
                                SIMKOM STIKOM Bali
                            </span>
                        </div>

                        {/* Center Column: Links (Always Dead Center) */}
                        <div className="flex w-full flex-row justify-center gap-unit-lg">
                            <a
                                className="font-body-sm text-body-sm text-on-surface-variant transition-all hover:text-primary"
                                href="https://youtu.be/dQw4w9WgXcQ?si=sWWkq83-lpBdQXh2"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Tentang Kami
                            </a>
                            <a
                                className="font-body-sm text-body-sm text-on-surface-variant transition-all hover:text-primary"
                                href="https://youtu.be/dQw4w9WgXcQ?si=sWWkq83-lpBdQXh2"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Kontak
                            </a>
                            <a
                                className="font-body-sm text-body-sm text-on-surface-variant transition-all hover:text-primary"
                                href="https://youtu.be/dQw4w9WgXcQ?si=sWWkq83-lpBdQXh2"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Bantuan
                            </a>
                        </div>
                        {/* Right Column: Copyright */}
                        <div className="w-full md:text-left">
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                © 2026 ITB STIKOM Bali. All Rights Reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
