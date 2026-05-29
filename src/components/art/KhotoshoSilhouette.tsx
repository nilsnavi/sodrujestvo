"use client";

import { cn } from "@/lib/utils";

/**
 * Cinematic SVG silhouette of a Khotosho (Buryat-Mongolian) dog.
 * Used in place of a real photograph for the hero / about sections.
 * The silhouette is intentionally moody — heavy black tones, gold rim light.
 */
export default function KhotoshoSilhouette({
    className,
    rim = true,
}: {
    className?: string;
    rim?: boolean;
}) {
    return (
        <svg
            viewBox="0 0 600 700"
            className={cn("h-full w-full", className)}
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Силуэт Хотошо"
        >
            <defs>
                <radialGradient id="bodyShade" cx="55%" cy="35%" r="75%">
                    <stop offset="0%" stopColor="#262626" />
                    <stop offset="55%" stopColor="#0c0c0c" />
                    <stop offset="100%" stopColor="#000" />
                </radialGradient>
                <linearGradient id="rimLight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f5e6b3" stopOpacity="0.95" />
                    <stop offset="55%" stopColor="#d4af37" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#8a6f3a" stopOpacity="0" />
                </linearGradient>
                <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffd166" />
                    <stop offset="60%" stopColor="#d4af37" />
                    <stop offset="100%" stopColor="#8a6f3a" />
                </radialGradient>
                <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="0.8" />
                </filter>
            </defs>

            {/* main body – sitting noble pose */}
            <g filter="url(#soft)">
                {/* tail — fluffy curl */}
                <path
                    d="M 470,520 Q 560,470 540,380 Q 520,330 470,360 Q 460,420 470,520 Z"
                    fill="url(#bodyShade)"
                />
                {/* hind body */}
                <path
                    d="M 200,560 Q 180,420 250,350 Q 360,290 460,330 Q 520,360 510,500 Q 510,580 470,610 L 230,615 Q 200,610 200,560 Z"
                    fill="url(#bodyShade)"
                />
                {/* chest mane fluff */}
                <path
                    d="M 245,360 Q 220,420 240,500 Q 260,540 320,540 Q 360,520 360,460 Q 360,400 320,360 Q 280,340 245,360 Z"
                    fill="url(#bodyShade)"
                />
                {/* head */}
                <path
                    d="M 270,210 Q 230,250 240,310 Q 250,360 310,370 Q 380,372 410,330 Q 430,290 410,240 Q 380,200 340,195 Q 295,193 270,210 Z"
                    fill="url(#bodyShade)"
                />
                {/* ears — pointy alert */}
                <path
                    d="M 268,212 L 250,170 L 290,200 Z"
                    fill="url(#bodyShade)"
                />
                <path
                    d="M 405,225 L 405,170 L 430,215 Z"
                    fill="url(#bodyShade)"
                />
                {/* snout */}
                <path
                    d="M 240,310 Q 215,318 205,330 Q 215,345 245,340 Z"
                    fill="#0a0a0a"
                />
                {/* front legs */}
                <path
                    d="M 290,540 Q 280,610 295,650 L 325,650 Q 330,600 320,540 Z"
                    fill="url(#bodyShade)"
                />
                <path
                    d="M 360,540 Q 350,610 365,650 L 395,650 Q 400,600 390,540 Z"
                    fill="url(#bodyShade)"
                />
            </g>

            {/* rim light along back/head */}
            {rim && (
                <>
                    <path
                        d="M 268,212 Q 230,250 240,310"
                        stroke="url(#rimLight)"
                        strokeWidth="2.4"
                        fill="none"
                        opacity="0.9"
                    />
                    <path
                        d="M 410,240 Q 430,290 410,330"
                        stroke="url(#rimLight)"
                        strokeWidth="2"
                        fill="none"
                        opacity="0.7"
                    />
                    <path
                        d="M 460,330 Q 510,400 510,500"
                        stroke="url(#rimLight)"
                        strokeWidth="2"
                        fill="none"
                        opacity="0.5"
                    />
                </>
            )}

            {/* eye — single golden cinematic glint */}
            <circle cx="320" cy="270" r="4" fill="url(#eyeGlow)" />
            <circle
                cx="320"
                cy="270"
                r="10"
                fill="url(#eyeGlow)"
                opacity="0.18"
            />
        </svg>
    );
}
