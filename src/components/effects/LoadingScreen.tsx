"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
    const [visible, setVisible] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let raf = 0;
        const start = performance.now();
        const duration = 1600;
        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            setProgress(Math.round(t * 100));
            if (t < 1) raf = requestAnimationFrame(tick);
            else setTimeout(() => setVisible(false), 350);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg-0"
                >
                    <div className="absolute inset-0 bg-radial-gold opacity-40" />
                    <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="relative flex flex-col items-center"
                    >
                        <div className="relative h-44 w-44 sm:h-56 sm:w-56">
                            <div className="absolute inset-0 animate-pulse-gold rounded-full" />
                            <div className="absolute inset-0 rounded-full bg-radial-gold opacity-80 blur-2xl" />
                            <Image
                                src="/brand/logo-transparent.png"
                                alt="Содружество Хотошо"
                                fill
                                sizes="224px"
                                priority
                                className="relative object-contain drop-shadow-[0_10px_40px_rgba(212,175,55,0.45)]"
                            />
                        </div>
                        <div className="mt-6 text-[10px] uppercase tracking-[0.5em] text-text-tertiary">
                            Содружество · Est. 2014
                        </div>
                        <div className="mt-8 h-px w-64 overflow-hidden bg-white/5">
                            <motion.div
                                className="h-full bg-gradient-to-r from-transparent via-gold-bright to-transparent"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="mt-3 text-[10px] tracking-[0.4em] text-text-tertiary">
                            {String(progress).padStart(3, "0")} / 100
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
