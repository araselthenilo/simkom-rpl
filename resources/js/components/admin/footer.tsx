export default function Footer() {
    return (
        <footer className="mt-unit-xl py-unit-lg border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-unit-md">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
                © 2026 SIMKOM STIKOM Bali. All Rights Reserved.
            </p>
            <div className="flex gap-6">
                <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-all" href="#">Tentang Kami</a>
                <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-all" href="#">Kontak</a>
                <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-all" href="#">Bantuan</a>
            </div>
        </footer>
    );
}