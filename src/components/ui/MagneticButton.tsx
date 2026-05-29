"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    variant?: "primary" | "ghost";
    className?: string;
    icon?: ReactNode;
}

export default function MagneticButton({
    children,
    href,
    onClick,
    variant = "primary",
    className,
    icon,
}: MagneticButtonProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        setPos({ x: x * 0.25, y: y * 0.25 });
    };
    const reset = () => setPos({ x: 0, y: 0 });

    const base =
        "group relative inline-flex items-center justify-center gap-3 overflow-hidden px-8 py-4 text-[11px] font-medium uppercase tracking-[0.3em] transition-colors duration-300";

    const styles =
        variant === "primary"
            ? "text-bg-0 bg-gradient-to-br from-[#f5e6b3] via-gold-bright to-gold-deep hover:shadow-[0_0_60px_rgba(212,175,55,0.4)]"
            : "text-text-primary border border-white/15 hover:border-gold/60 hover:text-gold-bright bg-white/[0.02] backdrop-blur-md";

    const inner = (
        <>
            <span className="relative z-10">{children}</span>
            {icon && <span className="relative z-10">{icon}</span>}
            {variant === "primary" && (
                <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />
            )}
            {variant === "ghost" && (
                <span className="absolute inset-0 -z-0 bg-gradient-to-br from-gold/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            )}
        </>
    );

    const motionProps = {
        animate: { x: pos.x, y: pos.y },
        transition: { type: "spring" as const, stiffness: 200, damping: 18 },
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={reset}
            className="inline-block"
            {...motionProps}
        >
            {href ? (
                <Link href={href} className={cn(base, styles, className)}>
                    {inner}
                </Link>
            ) : (
                <button onClick={onClick} className={cn(base, styles, className)}>
                    {inner}
                </button>
            )}
        </motion.div>
    );
}
