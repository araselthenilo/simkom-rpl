export default function Footer() {
    return (
        <footer className="mt-unit-xl flex flex-col items-center justify-between gap-unit-md border-t border-outline-variant/30 py-unit-lg md:flex-row">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
                © 2026 SIMKOM STIKOM Bali. All Rights Reserved.
            </p>
            <div className="flex gap-6">
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
        </footer>
    );
}
