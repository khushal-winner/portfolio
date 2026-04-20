import { useEffect, useRef, useState } from 'react';

interface SectionHeaderProps {
    icon: React.ReactNode;
    title: React.ReactNode;
    isH1?: boolean;
}

export function SectionHeader({ icon, title, isH1 = false }: SectionHeaderProps) {
    const Tag = isH1 ? 'h1' : 'h2';
    return (
        <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
                {icon && <span className="text-accent-primary">{icon}</span>}
                <Tag className={`font-bold text-text-primary ${isH1 ? 'text-[32px] sm:text-[36px]' : 'text-[22px] sm:text-[24px]'}`}>
                    {title}
                </Tag>
            </div>
            {isH1 && <div className="w-10 h-[3px] bg-accent-primary rounded-full" />}
        </div>
    );
}

interface StatCounterProps {
    value: number;
    label: string;
    prefix?: string;
}

export function StatCounter({ value, label, prefix = '+' }: StatCounterProps) {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    let start = 0;
                    const duration = 1500;
                    const step = (timestamp: number) => {
                        if (!start) start = timestamp;
                        const progress = Math.min((timestamp - start) / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.floor(eased * value));
                        if (progress < 1) {
                            requestAnimationFrame(step);
                        }
                    };
                    requestAnimationFrame(step);
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [value, hasAnimated]);

    return (
        <div ref={ref} className="text-center">
            <div className="text-[32px] sm:text-[36px] font-bold text-text-primary">
                {prefix}{count}
            </div>
            <div className="text-[11px] uppercase tracking-[0.15em] text-text-muted font-medium mt-1 leading-tight">
                {label}
            </div>
        </div>
    );
}

export function useInView(threshold = 0.1) {
    const ref = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                }
            },
            { threshold }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold]);

    return { ref, isInView };
}
