"use client";

import { useEffect, useRef } from "react";

export default function MouseLight() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let raf = 0;
        let tx = window.innerWidth / 2;
        let ty = window.innerHeight / 2;
        let cx = tx;
        let cy = ty;

        const onMove = (e: MouseEvent) => {
            tx = e.clientX;
            ty = e.clientY;
        };
        window.addEventListener("mousemove", onMove);

        const tick = () => {
            cx += (tx - cx) * 0.08;
            cy += (ty - cy) * 0.08;
            el.style.transform = `translate3d(${cx - 300}px, ${cy - 300}px, 0)`;
            raf = requestAnimationFrame(tick);
        };
        tick();

        return () => {
            window.removeEventListener("mousemove", onMove);
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <div
            ref={ref}
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[2] h-[600px] w-[600px] rounded-full opacity-40 blur-3xl mix-blend-screen"
            style={{
                background:
                    "radial-gradient(circle, rgba(212,175,55,0.35) 0%, rgba(212,175,55,0.08) 35%, transparent 65%)",
            }}
        />
    );
}
