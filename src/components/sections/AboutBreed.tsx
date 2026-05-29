"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import KhotoshoSilhouette from "@/components/art/KhotoshoSilhouette";
import Reveal from "@/components/ui/Reveal";

const stats = [
    { label: "Происхождение", value: "Бурятия", sub: "тыс. лет до н.э." },
    { label: "Рост в холке", value: "60–74", sub: "см" },
    { label: "Вес", value: "45–70", sub: "кг" },
    { label: "Характер", value: "Спокойный", sub: "уравновешенный" },
    { label: "Продолжительность жизни", value: "12–15", sub: "лет" },
    { label: "Тип шерсти", value: "Двойная", sub: "морозостойкая" },
];

export default function AboutBreed() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

    return (
        <section id="breed" ref={ref} className="relative overflow-hidden py-32 lg:py-48">
            {/* gradient divider */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

            <div className="relative mx-auto max-w-[1500px] px-6 lg:px-12">
                <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-20">
                    {/* Left — text */}
                    <div className="lg:col-span-7">
                        <Reveal>
                            <div className="mb-5 text-[10px] uppercase tracking-[0.5em] text-gold-bright">
                                · О породе ·
                            </div>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <h2 className="font-display text-balance text-[clamp(2.2rem,5.5vw,5rem)] leading-[0.95] tracking-[-0.01em]">
                                Тысячелетия{" "}
                                <span className="font-serif italic text-gold-gradient">
                                    в горах,
                                </span>{" "}
                                рядом с человеком.
                            </h2>
                        </Reveal>

                        <Reveal delay={0.2}>
                            <div className="mt-10 space-y-6 text-[16px] leading-relaxed text-text-secondary">
                                <p>
                                    Хотошо — древняя бурят-монгольская порода, охранявшая стада
                                    и юрты кочевников Центральной Азии. Археологические находки
                                    относят её к породам бронзового века.
                                </p>
                                <p>
                                    Это не декоративная собака. Хотошо рожден для службы:
                                    внимательный охранник, выносливый компаньон, мудрый партнёр.
                                    Спокоен в покое — мгновенен в действии.
                                </p>
                                <p className="font-serif italic text-text-primary">
                                    «Старожилы говорят: где живёт Хотошо — туда не приходит беда.»
                                </p>
                            </div>
                        </Reveal>

                        {/* stats */}
                        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden border border-white/5 bg-white/5 sm:grid-cols-3">
                            {stats.map((s, i) => (
                                <Reveal key={s.label} delay={i * 0.05}>
                                    <div className="group relative h-full bg-bg-1/80 p-6 transition-colors hover:bg-bg-2">
                                        <div className="text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
                                            {s.label}
                                        </div>
                                        <div className="mt-3 font-display text-3xl text-text-primary group-hover:text-gold-bright">
                                            {s.value}
                                        </div>
                                        <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
                                            {s.sub}
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>

                    {/* Right — portrait */}
                    <div className="relative lg:col-span-5">
                        <motion.div style={{ y }} className="relative aspect-[4/5] w-full">
                            {/* gold frame */}
                            <div className="absolute inset-0 border border-gold/20" />
                            <div className="absolute -inset-3 border border-gold/10" />
                            {/* glow */}
                            <div className="absolute inset-0 bg-radial-gold opacity-50 blur-2xl" />
                            {/* mountains */}
                            <div className="absolute inset-0 overflow-hidden">
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background:
                                            "linear-gradient(180deg, #050505 0%, #0a0a0a 60%, #000 100%)",
                                    }}
                                />
                                <div className="absolute inset-0 bg-noise opacity-[0.07]" />
                            </div>
                            {/* silhouette */}
                            <div className="absolute inset-0 flex items-end justify-center pb-2">
                                <KhotoshoSilhouette className="h-[110%]" />
                            </div>
                            {/* corner labels */}
                            <div className="absolute left-4 top-4 text-[9px] uppercase tracking-[0.4em] text-gold-bright">
                                Buryat-Mongolian · 2024
                            </div>
                            <div className="absolute bottom-4 right-4 font-serif text-sm italic text-text-secondary">
                                Хотошо · портрет
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
