"use client";

import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps {
    children: ReactNode;
    className?: string;
    intensity?: number;
}

export default function GlowCard({
    children,
    className,
    intensity = 0.6,
}: GlowCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState({ x: -200, y: -200 });

    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={() => setPos({ x: -200, y: -200 })}
            className={cn(
                "group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-px transition-all duration-500 hover:border-gold/30",
                className,
            )}
        >
            {/* gold glow following cursor */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(360px circle at ${pos.x}px ${pos.y}px, rgba(212,175,55,${intensity}), transparent 45%)`,
                }}
                aria-hidden
            />
            <div className="relative h-full rounded-[15px] bg-gradient-to-b from-bg-1/90 to-bg-0/95 backdrop-blur-sm">
                {children}
            </div>
        </div>
    );
}
