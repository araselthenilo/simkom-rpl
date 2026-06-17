import { Globe, Share2 } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-outline-variant bg-surface-container-low py-unit-lg dark:bg-surface-container-highest">
            <div className="mx-auto flex max-w-container-max flex-col items-center justify-between gap-unit-md px-margin-desktop md:flex-row">
                <div className="flex flex-col items-center gap-2 md:items-start">
                    <span className="font-label-lg text-label-lg font-bold text-primary">
                        SIMKOM ITB STIKOM Bali
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-surface">
                        © 2026 SIMKOM ITB STIKOM Bali.{'\n'}
                        All Rights Reserved.
                    </p>
                </div>
                <div className="flex gap-unit-lg">
                    <a
                        className="font-body-sm text-body-sm text-on-surface-variant transition-all hover:text-primary"
                        href="https://youtu.be/BI9Ue6JwJic?si=8nQzKunA5UQp6zXS"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Tentang Kami
                    </a>
                    <a
                        className="font-body-sm text-body-sm text-on-surface-variant transition-all hover:text-primary"
                        href="https://youtu.be/BI9Ue6JwJic?si=8nQzKunA5UQp6zXS"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Kontak
                    </a>
                    <a
                        className="font-body-sm text-body-sm text-on-surface-variant transition-all hover:text-primary"
                        href="https://youtu.be/BI9Ue6JwJic?si=8nQzKunA5UQp6zXS"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Bantuan
                    </a>
                </div>
                <div className="flex gap-unit-md">
                    <a
                        href="https://youtu.be/BI9Ue6JwJic?si=8nQzKunA5UQp6zXS"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-on-primary transition-transform hover:scale-110">
                            <Globe className="h-4 w-4" />
                        </button>
                    </a>
                    <a
                        href="https://youtu.be/BI9Ue6JwJic?si=8nQzKunA5UQp6zXS"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-on-primary transition-transform hover:scale-110">
                            <Share2 className="h-4 w-4" />
                        </button>
                    </a>
                </div>
            </div>
        </footer>
    );
}
