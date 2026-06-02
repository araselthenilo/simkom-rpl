import { Head, Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { email } from '@/routes/password';
import { login } from '@/routes';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Forgot password">
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="flex min-h-screen flex-col bg-background text-on-background">
                {/* Hero/Background Illustration Area (Decorative) */}
                <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                    <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>
                    <div className="absolute top-1/2 -right-24 h-64 w-64 rounded-full bg-secondary/5 blur-3xl"></div>
                </div>

                {/* Main Content Canvas */}
                <main className="relative z-10 flex grow items-center justify-center p-margin-mobile">
                    <div className="w-full max-w-110 animate-in duration-700 fade-in slide-in-from-bottom-4">
                        {/* Logo Section */}
                        <div className="mb-unit-xl flex flex-col items-center">
                            <div className="mb-unit-sm flex h-16 w-16 items-center justify-center rounded-xl bg-primary-container shadow-lg">
                                <span className="material-symbols-outlined text-[32px] text-on-primary">
                                    school
                                </span>
                            </div>
                            <h2 className="font-headline-md text-headline-md tracking-tight text-primary">
                                SIMKOM STIKOM Bali
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
                                <div className="mb-unit-lg rounded-xl border border-green-200 bg-green-50 p-unit-md text-body-sm text-green-700">
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
                                        <div className="space-y-unit-xs">
                                            <Label
                                                className="font-label-lg text-label-lg text-on-surface"
                                                htmlFor="email"
                                            >
                                                Email Institusi
                                            </Label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-[20px] text-outline">
                                                    mail
                                                </span>
                                                <Input
                                                    className="w-full rounded-lg border border-outline-variant bg-white py-3 pr-4 pl-11 font-body-md text-body-md transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                                                className="mt-1 text-xs text-error"
                                            />
                                        </div>
                                        {/* <!-- Action Button --> */}
                                        <button
                                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-label-lg text-label-lg text-on-primary shadow-md transition-all duration-100 hover:bg-primary-container active:scale-[0.98]"
                                            type="submit"
                                            disabled={processing}
                                        >
                                            <span>Kirim Tautan Pemulihan</span>
                                            <span className="material-symbols-outlined text-[18px]">
                                                send
                                            </span>
                                        </button>
                                    </>
                                )}
                            </Form>
                            {/* <!-- Footer Link --> */}
                            <div className="mt-unit-lg flex justify-center border-t border-outline-variant pt-unit-lg">
                                <a
                                    className="flex items-center gap-2 font-label-lg text-label-lg text-primary transition-all hover:underline"
                                    href={login().url}
                                >
                                    <span className="material-symbols-outlined text-[18px]">
                                        arrow_back
                                    </span>
                                    <span>Kembali ke Login</span>
                                </a>
                            </div>
                        </div>
                        {/* <!-- Support Text --> */}
                        <p className="mt-unit-xl text-center font-body-sm text-body-sm text-on-surface-variant">
                            Butuh bantuan lebih lanjut?
                            <a
                                className="font-medium text-primary hover:underline"
                                href="#"
                            >
                                Hubungi IT Support
                            </a>
                        </p>
                    </div>
                </main>
                {/* <!-- Footer Component (Shared) --> */}
                <footer className="bg-surface-container-low z-10 w-full border-t border-outline-variant py-unit-lg">
                    <div className="mx-auto flex max-w-container-max flex-col items-center justify-between gap-unit-md px-margin-desktop md:flex-row">
                        <span className="font-label-lg text-label-lg font-bold text-primary">
                            SIMKOM STIKOM Bali
                        </span>
                        <div className="flex gap-unit-lg">
                            <a
                                className="font-body-sm text-body-sm text-on-surface-variant transition-all hover:text-primary"
                                href="#"
                            >
                                Tentang Kami
                            </a>
                            <a
                                className="font-body-sm text-body-sm text-on-surface-variant transition-all hover:text-primary"
                                href="#"
                            >
                                Kontak
                            </a>
                            <a
                                className="font-body-sm text-body-sm text-on-surface-variant transition-all hover:text-primary"
                                href="#"
                            >
                                Bantuan
                            </a>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                            © 2024 SIMKOM STIKOM Bali. All Rights Reserved.
                        </p>
                    </div>
                </footer>
                {/* <!-- Success Feedback Overlay --> */}
                <div
                    className="fixed inset-0 z-50 hidden items-center justify-center bg-background/80 opacity-0 backdrop-blur-sm transition-opacity duration-300"
                    id="successOverlay"
                >
                    <div
                        className="glass-card w-full max-w-sm scale-95 space-y-unit-md rounded-xl border border-outline-variant p-unit-xl text-center shadow-xl transition-transform duration-300"
                        id="successCard"
                    >
                        <div className="mx-auto mb-unit-sm flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                            <span
                                className="material-symbols-outlined text-[40px] text-green-600"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                check_circle
                            </span>
                        </div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface">
                            Tautan Dikirim!
                        </h3>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                            Silakan periksa kotak masuk email institusi Anda
                            untuk melanjutkan pemulihan kata sandi.
                        </p>
                        <button className="w-full rounded-lg bg-primary px-6 py-2 font-label-lg text-on-primary">
                            Selesai
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
