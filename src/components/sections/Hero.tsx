"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ChevronRight, PlayCircle } from "lucide-react";
import { useRef } from "react";
import KhotoshoSilhouette from "@/components/art/KhotoshoSilhouette";
import MountainBackdrop from "@/components/art/MountainBackdrop";
import MagneticButton from "@/components/ui/MagneticButton";

export default function Hero() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const yBack = useTransform(scrollYProgress, [0, 1], [0, 80]);
    const yMid = useTransform(scrollYProgress, [0, 1], [0, 160]);
    const yDog = useTransform(scrollYProgress, [0, 1], [0, 220]);
    const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

    return (
        <section
            ref={ref}
            className="relative h-[100svh] min-h-[760px] w-full overflow-hidden"
        >
            {/* Mountain backdrop with parallax */}
            <motion.div
                className="absolute inset-0"
                style={{ y: yBack, scale }}
            >
                <div className="absolute inset-0 animate-slow-zoom">
                    <MountainBackdrop />
                </div>
            </motion.div>

            {/* Fog layers */}
            <motion.div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
                style={{ y: yMid }}
            >
                <div className="absolute inset-0 animate-fog opacity-60 mix-blend-screen">
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "radial-gradient(ellipse 80% 40% at 30% 80%, rgba(180,180,180,0.18), transparent 60%), radial-gradient(ellipse 70% 35% at 70% 90%, rgba(180,180,180,0.14), transparent 60%)",
                        }}
                    />
                </div>
            </motion.div>

            {/* Vignette */}
            <div
                className="pointer-events-none absolute inset-0 z-[3]"
                style={{
                    background:
                        "radial-gradient(ellipse 90% 70% at 50% 50%, transparent 0%, rgba(0,0,0,0.55) 75%, #000 100%)",
                }}
            />
            <div className="pointer-events-none absolute inset-0 z-[3] bg-noise opacity-[0.06]" />

            {/* Content */}
            <motion.div
                style={{ opacity }}
                className="relative z-10 mx-auto flex h-full max-w-[1500px] items-end px-6 pb-24 pt-32 lg:items-center lg:px-12 lg:pb-0"
            >
                <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12">
                    {/* Left — copy */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.6, duration: 1 }}
                            className="mb-8 inline-flex items-center gap-3 border border-gold/30 bg-bg-0/40 px-4 py-2 backdrop-blur-md"
                        >
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-bright" />
                            <span className="text-[10px] uppercase tracking-[0.4em] text-text-secondary">
                                Древняя порода · Est. 2014
                            </span>
                        </motion.div>

                        <h1 className="font-display text-balance text-[clamp(2.8rem,7.5vw,7rem)] leading-[0.9] tracking-[-0.01em] text-text-primary">
                            <SplitWord text="Хотошо" delay={1.7} className="block" />
                            <SplitWord
                                text="— не просто"
                                delay={2.0}
                                className="block text-text-secondary"
                            />
                            <span className="block">
                                <SplitWord
                                    text="собака."
                                    delay={2.2}
                                    className="text-text-primary"
                                />{" "}
                                <SplitWord
                                    text="Это"
                                    delay={2.4}
                                    className="font-serif italic text-gold-gradient"
                                />{" "}
                                <SplitWord
                                    text="характер."
                                    delay={2.55}
                                    className="font-serif italic text-gold-gradient"
                                />
                            </span>
                        </h1>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 2.9, duration: 1 }}
                            className="mt-8 max-w-xl text-lg leading-relaxed text-text-secondary"
                        >
                            Древняя бурятская порода. Сила, верность и спокойствие поколений —
                            в каждом взгляде, в каждом шаге.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 3.1, duration: 0.9 }}
                            className="mt-12 flex flex-wrap items-center gap-5"
                        >
                            <MagneticButton
                                href="#puppies"
                                variant="primary"
                                icon={<ChevronRight size={14} />}
                            >
                                Смотреть щенков
                            </MagneticButton>
                            <MagneticButton
                                href="#breed"
                                variant="ghost"
                                icon={<PlayCircle size={14} />}
                            >
                                История породы
                            </MagneticButton>
                        </motion.div>

                        {/* mini stats */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 3.4, duration: 1 }}
                            className="mt-16 grid max-w-lg grid-cols-3 gap-8 border-t border-white/5 pt-8"
                        >
                            <Stat value="11+" label="лет питомника" />
                            <Stat value="200+" label="воспитанников" />
                            <Stat value="∞" label="преданности" />
                        </motion.div>
                    </div>

                    {/* Right — silhouette */}
                    <motion.div
                        style={{ y: yDog }}
                        className="relative hidden h-[640px] lg:col-span-5 lg:block"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.4, duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute inset-0 animate-float-slow"
                        >
                            {/* aura behind dog */}
                            <div className="absolute inset-0 bg-radial-gold opacity-50 blur-2xl" />
                            <KhotoshoSilhouette className="relative drop-shadow-[0_30px_80px_rgba(0,0,0,0.9)]" />
                            {/* fog over feet */}
                            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg-0 via-bg-0/70 to-transparent" />
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>

            {/* scroll cue */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.6, duration: 1 }}
                className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
            >
                <div className="flex flex-col items-center gap-3 text-[10px] uppercase tracking-[0.5em] text-text-tertiary">
                    <span>Прокрутить</span>
                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity }}
                    >
                        <ArrowDown size={14} className="text-gold-bright" />
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}

function Stat({ value, label }: { value: string; label: string }) {
    return (
        <div>
            <div className="font-display text-3xl text-gold-gradient">{value}</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
                {label}
            </div>
        </div>
    );
}

function SplitWord({
    text,
    delay,
    className,
}: {
    text: string;
    delay: number;
    className?: string;
}) {
    return (
        <span className={`inline-block overflow-hidden align-baseline ${className ?? ""}`}>
            <motion.span
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ delay, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block"
            >
                {text}
            </motion.span>
        </span>
    );
}
