import { Head, Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { email } from '@/routes/password';
import { login } from '@/routes';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MailIcon, SendIcon } from 'lucide-react';
import stikomLogoPng from '../../../../public/stikom-logo.png';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Forgot Password">
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
                                ITB SIMKOM STIKOM Bali
                            </h2>
                        </div>
                        {/* <!-- Recovery Card --> */}
                        <div className="glass-card rounded-xl border border-outline-variant p-unit-lg shadow-[0px_2px_4px_rgba(26,54,93,0.05)]">
                            <div className="mb-unit-lg space-y-unit-sm text-center">
                                <h1 className="font-headline-sm text-headline-sm text-on-surface">
                                    Lupa Password?
                                </h1>
                                <p className="font-body-md text-body-md text-on-surface-variant">
                                    Masukkan email institusi Anda untuk
                                    mendapatkan tautan pemulihan kata sandi.
                                </p>
                            </div>

                            {status && (
                                <div className="mb-unit-lg rounded-xl border-2 border-green-200 bg-green-50 p-unit-md text-center text-body-sm text-green-700">
                                    {status}
                                </div>
                            )}
                            <Form
                                {...email.form()}
                                className="space-y-unit-lg"
                                id="recoveryForm"
                                noValidate
                            >
                                {({ processing, errors }) => (
                                    <>
                                        {/* <!-- Input Field --> */}
                                        <div className="mb-unit-md space-y-unit-xs">
                                            <Label
                                                className="font-label-lg text-label-lg text-on-surface"
                                                htmlFor="email"
                                            >
                                                Email Institusi
                                            </Label>
                                            <div className="relative">
                                                {/* <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-[20px] text-outline">
                                                    mail
                                                </span> */}
                                                <MailIcon className="absolute top-1/2 left-3 -translate-y-1/2 text-[20px] text-outline" />
                                                <Input
                                                    className="bg-surface-container w-full rounded-lg border border-outline-variant py-6 pr-4 pl-11 font-body-lg transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                                    id="email"
                                                    name="email"
                                                    placeholder="nama@stikom-bali.ac.id"
                                                    required
                                                    type="email"
                                                    autoComplete="email"
                                                />
                                            </div>
                                            <InputError
                                                message={errors.email}
                                                className="mt-1 text-xs"
                                            />
                                        </div>
                                        {/* <!-- Action Button --> */}
                                        <Button
                                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-6 py-6 font-label-lg text-label-lg text-on-primary shadow-md transition-all duration-100 hover:bg-primary-container active:scale-[0.98]"
                                            type="submit"
                                            disabled={processing}
                                        >
                                            <span>Kirim Tautan Pemulihan</span>
                                            <SendIcon className="text-[18px]" />
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
                <footer className="bg-surface-container z-10 w-full border-t border-outline-variant py-unit-lg">
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
                                {' '}
                                Tentang Kami{' '}
                            </a>
                            <a
                                className="font-body-sm text-body-sm text-on-surface-variant transition-all hover:text-primary"
                                href="https://youtu.be/dQw4w9WgXcQ?si=sWWkq83-lpBdQXh2"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {' '}
                                Kontak{' '}
                            </a>
                            <a
                                className="font-body-sm text-body-sm text-on-surface-variant transition-all hover:text-primary"
                                href="https://youtu.be/dQw4w9WgXcQ?si=sWWkq83-lpBdQXh2"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {' '}
                                Bantuan{' '}
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
