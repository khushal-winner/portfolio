import { useState, useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeader, useInView } from '../components/Shared';

interface GalleryCategory {
    name: string;
    thumbnail: string;
    images: string[];
}

const categories: GalleryCategory[] = [
    {
        name: 'Myself',
        thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        images: [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&h=800&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&h=800&fit=crop&crop=face',
        ],
    },
    {
        name: 'Tide Trails',
        thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1520942702018-0862200e6873?w=1200&h=800&fit=crop',
        ],
    },
    {
        name: 'Wings in Motion',
        thumbnail: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=400&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1480044965905-02098d419e96?w=1200&h=800&fit=crop',
        ],
    },
    {
        name: 'Spiritual Moments',
        thumbnail: 'https://images.unsplash.com/photo-1609619385002-f40e43c5e7b5?w=400&h=400&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1609619385002-f40e43c5e7b5?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1545378916-2bfa15c4b938?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1564804955922-4e4e7d946087?w=1200&h=800&fit=crop',
        ],
    },
    {
        name: 'Flora & Peace',
        thumbnail: 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=400&h=400&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?w=1200&h=800&fit=crop',
        ],
    },
    {
        name: 'Bites & Plates',
        thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=800&fit=crop',
        ],
    },
    {
        name: 'After Dark',
        thumbnail: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=400&h=400&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&h=800&fit=crop',
        ],
    },
    {
        name: 'Above Us',
        thumbnail: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=400&h=400&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1436891620584-47fd0e565afb?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=1200&h=800&fit=crop',
        ],
    },
];

export default function Gallery() {
    const [lightbox, setLightbox] = useState<{ categoryIdx: number; imageIdx: number } | null>(null);
    const gridView = useInView();

    const openLightbox = (categoryIdx: number) => {
        setLightbox({ categoryIdx, imageIdx: 0 });
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = useCallback(() => {
        setLightbox(null);
        document.body.style.overflow = '';
    }, []);

    const navigate = useCallback((direction: 'prev' | 'next') => {
        if (!lightbox) return;
        const images = categories[lightbox.categoryIdx].images;
        setLightbox(prev => {
            if (!prev) return null;
            const newIdx = direction === 'next'
                ? (prev.imageIdx + 1) % images.length
                : (prev.imageIdx - 1 + images.length) % images.length;
            return { ...prev, imageIdx: newIdx };
        });
    }, [lightbox]);

    // Keyboard support
    useEffect(() => {
        if (!lightbox) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigate('prev');
            if (e.key === 'ArrowRight') navigate('next');
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [lightbox, closeLightbox, navigate]);

    return (
        <section id="gallery" aria-label="Photography gallery">
            <SectionHeader title="Pixels & Passion" isH1 icon={null} />

            <div
                ref={gridView.ref}
                className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2"
            >
                {categories.map((category, i) => (
                    <button
                        key={category.name}
                        onClick={() => openLightbox(i)}
                        className={`relative aspect-[4/5] sm:aspect-[4/4] rounded-card overflow-hidden group cursor-pointer
              border border-border-default/30 hover:border-accent-primary/30
              transition-all duration-300
              ${gridView.isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                        style={{
                            transitionDelay: `${i * 80}ms`,
                            transitionDuration: '500ms',
                        }}
                        aria-label={`Open ${category.name} gallery`}
                    >
                        <img
                            src={category.thumbnail}
                            alt={category.name}
                            className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
                            loading="lazy"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        {/* Label */}
                        <span className="absolute bottom-3 left-3 text-[14px] sm:text-[16px] font-bold text-white drop-shadow-lg">
                            {category.name}
                        </span>
                    </button>
                ))}
            </div>

            {/* Lightbox */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-fade-in"
                    onClick={closeLightbox}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${categories[lightbox.categoryIdx].name} gallery lightbox`}
                >
                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20
              flex items-center justify-center text-white transition-colors z-10"
                        aria-label="Close lightbox"
                    >
                        <X size={20} />
                    </button>

                    {/* Previous */}
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate('prev'); }}
                        className="absolute left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20
              flex items-center justify-center text-white transition-colors z-10"
                        aria-label="Previous image"
                    >
                        <ChevronLeft size={22} />
                    </button>

                    {/* Image */}
                    <div
                        className="max-w-[90vw] max-h-[85vh] flex flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={categories[lightbox.categoryIdx].images[lightbox.imageIdx]}
                            alt={`${categories[lightbox.categoryIdx].name} - Image ${lightbox.imageIdx + 1}`}
                            className="max-w-full max-h-[80vh] object-contain rounded-lg animate-scale-in"
                        />
                        <p className="text-white/70 text-[14px] mt-3">
                            {categories[lightbox.categoryIdx].name} — {lightbox.imageIdx + 1} / {categories[lightbox.categoryIdx].images.length}
                        </p>
                    </div>

                    {/* Next */}
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate('next'); }}
                        className="absolute right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20
              flex items-center justify-center text-white transition-colors z-10"
                        aria-label="Next image"
                    >
                        <ChevronRight size={22} />
                    </button>
                </div>
            )}
        </section>
    );
}
