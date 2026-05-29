"use client";

import { cn } from "@/lib/utils";

/**
 * Layered cinematic mountain backdrop — dark Buryat steppe.
 * Layers sit at different depths for parallax.
 */
export default function MountainBackdrop({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 1600 900"
            preserveAspectRatio="xMidYMid slice"
            className={cn("absolute inset-0 h-full w-full", className)}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
        >
            <defs>
                <linearGradient id="sky" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#000000" />
                    <stop offset="35%" stopColor="#0a0a0a" />
                    <stop offset="70%" stopColor="#141414" />
                    <stop offset="100%" stopColor="#080808" />
                </linearGradient>
                <radialGradient id="moon" cx="78%" cy="22%" r="14%">
                    <stop offset="0%" stopColor="#f5e6b3" stopOpacity="0.85" />
                    <stop offset="40%" stopColor="#d4af37" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#000" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="m1" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#1a1a1a" />
                    <stop offset="100%" stopColor="#050505" />
                </linearGradient>
                <linearGradient id="m2" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#111111" />
                    <stop offset="100%" stopColor="#020202" />
                </linearGradient>
                <linearGradient id="m3" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#080808" />
                    <stop offset="100%" stopColor="#000000" />
                </linearGradient>
            </defs>

            <rect width="1600" height="900" fill="url(#sky)" />
            <rect width="1600" height="900" fill="url(#moon)" />

            {/* Distant ridge */}
            <path
                d="M 0,600 L 120,520 L 230,560 L 360,470 L 500,540 L 640,500 L 800,560 L 940,520 L 1080,580 L 1240,510 L 1400,560 L 1600,520 L 1600,900 L 0,900 Z"
                fill="url(#m1)"
                opacity="0.85"
            />
            {/* Mid ridge */}
            <path
                d="M 0,700 L 90,640 L 220,680 L 360,610 L 500,690 L 640,640 L 800,710 L 940,640 L 1080,720 L 1220,650 L 1380,720 L 1600,660 L 1600,900 L 0,900 Z"
                fill="url(#m2)"
            />
            {/* Foreground ridge */}
            <path
                d="M 0,800 L 140,760 L 300,790 L 460,750 L 620,800 L 780,770 L 940,810 L 1100,770 L 1260,815 L 1420,775 L 1600,810 L 1600,900 L 0,900 Z"
                fill="url(#m3)"
            />
        </svg>
    );
}
