import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Auth } from '@/types/auth';

export default function HeaderSambutan({ user }: { user: Auth['user'] }) {
    const namaUser = user.name;
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            badge: 'Portal Mahasiswa',
            title: `Selamat Datang, ${namaUser}!`,
            description:
                'Pantau kegiatan, kelola organisasi, dan kumpulkan poin SKP Anda di portal SIMKOM STIKOM Bali.',
            buttonText: 'Mulai Jelajah',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNpH-22IoCl63a9joUP9Z1QrnkhqiidpiG-kGq4F28wU2YMId0zMr_kh1mpUy08_LHyxEbyr-C811ezXrxnhqsZJlzDbJwevVEZf3ZzWQGgYJax6866wuAuyf2O1FkVsMrE2_7R3XY3ROKUNJaanx5BWRYmVWv-XdtX8HCh0DzebLzXbHO2H4MYijharWgAPXVGw_kt1BhR41UIn7nEcKcc1olzoC0vAXhsY4y_aANFzz-vHg1pgH2YugoOlJtlC3u2nRFWtm9tS0',
        },
        {
            badge: 'Popular Event',
            title: 'IT Expo 2024: Transformasi Digital Masa Depan',
            description:
                'Saksikan inovasi mahasiswa terbaik se-Bali. Pendaftaran booth dan visitor telah dibuka.',
            buttonText: 'Daftar Sekarang',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCK_NS6Ef7zKNBnJ3MnSqty23HdYFvyQ_bATIHjpwP9q6y33p7sv19eRo19NIeVEvWsmXc_s4rQXjwJpK4A4mKEvtnLuMkDaQmZU3DE74cvLnodAsL5nSshnopEdQhMYd1k_iRl3KZ9nBXzuemebzGk6uB0L6r--p5FMfTOphYbRt-dbS2xmaJPr3kRVaa2zsVHCMamh7MN8k4hL97dVGLvPaeBtOC3ZiJGn1wtBz72HbjXQAPUA6Z54ZrgfqzzrHpZOOmaSSs4gZg',
        },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [currentSlide, slides.length]);

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    return (
        <section className="relative h-[500px] w-full overflow-hidden bg-primary">
            <div className="relative h-full w-full">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out ${
                            index === currentSlide
                                ? 'z-10 opacity-100'
                                : 'pointer-events-none z-0 opacity-0'
                        }`}
                    >
                        <img
                            className="h-full w-full object-cover opacity-60"
                            src={slide.image}
                            alt={slide.title}
                        />
                        <div className="absolute inset-0 flex items-center bg-gradient-to-t from-primary/90 via-primary/40 to-transparent">
                            <div className="mx-auto w-full max-w-container-max px-margin-desktop text-on-primary">
                                <span className="mb-4 inline-block rounded-full border border-secondary-container/30 bg-secondary-container px-3.5 py-1.5 font-label-lg text-label-lg text-on-secondary-container shadow-md transition-all duration-300">
                                    {slide.badge}
                                </span>
                                <h1 className="mb-4 max-w-2xl font-headline-lg text-headline-lg">
                                    {slide.title}
                                </h1>
                                <p className="mb-8 max-w-xl font-body-lg text-body-lg opacity-90">
                                    {slide.description}
                                </p>
                                <button className="cursor-pointer rounded-lg bg-on-primary px-8 py-3 font-label-lg font-semibold text-primary transition-all hover:bg-on-primary/80 hover:text-primary active:scale-95">
                                    {slide.buttonText}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentSlide
                                ? 'w-8 bg-on-primary'
                                : 'w-2 bg-on-primary/50'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={handlePrev}
                className="absolute top-1/2 left-4 z-20 hidden -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/20 p-2 text-on-primary backdrop-blur transition-colors hover:bg-black/40 active:scale-95 md:flex"
                aria-label="Previous slide"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>
            <button
                onClick={handleNext}
                className="absolute top-1/2 right-4 z-20 hidden -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/20 p-2 text-on-primary backdrop-blur transition-colors hover:bg-black/40 active:scale-95 md:flex"
                aria-label="Next slide"
            >
                <ChevronRight className="h-6 w-6" />
            </button>
        </section>
    );
}
