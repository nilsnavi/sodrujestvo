"use client";

import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    r: number;
    vy: number;
    vx: number;
    alpha: number;
}

export default function SnowParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);

        const reduce = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;
        const count = reduce ? 0 : Math.min(80, Math.floor(width / 18));

        const particles: Particle[] = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 1.6 + 0.4,
            vy: Math.random() * 0.5 + 0.15,
            vx: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.6 + 0.2,
        }));

        const onResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr);
        };
        window.addEventListener("resize", onResize);

        let raf = 0;
        const loop = () => {
            ctx.clearRect(0, 0, width, height);
            for (const p of particles) {
                p.y += p.vy;
                p.x += p.vx;
                if (p.y > height) {
                    p.y = -4;
                    p.x = Math.random() * width;
                }
                if (p.x < -4) p.x = width + 4;
                if (p.x > width + 4) p.x = -4;

                ctx.beginPath();
                ctx.fillStyle = `rgba(245, 245, 245, ${p.alpha})`;
                ctx.shadowColor = "rgba(212, 175, 55, 0.4)";
                ctx.shadowBlur = 6;
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }
            raf = requestAnimationFrame(loop);
        };
        loop();

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-[5] opacity-70 mix-blend-screen"
            aria-hidden
        />
    );
}
