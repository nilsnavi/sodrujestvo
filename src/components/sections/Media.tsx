"use client";

import { motion } from "framer-motion";
import { Clock, Play } from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";
import Reveal from "@/components/ui/Reveal";

const items = [
    {
        type: "Documentary",
        title: "Дух Бурятии · Эпизод I",
        duration: "24 мин",
        accent: "from-[#1f1813] via-[#0e0e0e] to-[#040404]",
        sub: "Происхождение породы",
    },
    {
        type: "Story",
        title: "Один день с Хотошо",
        duration: "8 мин",
        accent: "from-[#171a1f] via-[#0c0c0c] to-[#040404]",
        sub: "Жизнь в питомнике",
    },
    {
        type: "Training",
        title: "Воспитание щенка",
        duration: "12 мин",
        accent: "from-[#1c1612] via-[#0a0a0a] to-[#020202]",
        sub: "С первых недель",
    },
    {
        type: "Short",
        title: "Тишина гор",
        duration: "1 мин",
        accent: "from-[#101418] via-[#080808] to-[#000]",
        sub: "Поэтический клип",
    },
];

export default function Media() {
    return (
        <section id="media" className="relative overflow-hidden py-32 lg:py-48">
            <div className="relative mx-auto max-w-[1500px] px-6 lg:px-12">
                <div className="mb-20 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
                    <div className="max-w-2xl">
                        <Reveal>
                            <div className="mb-5 text-[10px] uppercase tracking-[0.5em] text-gold-bright">
                                · Медиа ·
                            </div>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <h2 className="font-display text-balance text-[clamp(2rem,5vw,4.5rem)] leading-[0.95]">
                                Documentary{" "}
                                <span className="font-serif italic text-gold-gradient">
                                    о породе.
                                </span>
                            </h2>
                        </Reveal>
                    </div>
                    <Reveal delay={0.2}>
                        <p className="max-w-md text-text-secondary">
                            Эпизоды, шорты и обучающие видео — собрали лучшее в одном месте,
                            как в любимом стрим-сервисе.
                        </p>
                    </Reveal>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {items.map((m, i) => (
                        <Reveal key={m.title} delay={i * 0.07} y={48}>
                            <GlowCard className="h-full">
                                <div className="group/card relative h-full overflow-hidden">
                                    <div
                                        className={`relative aspect-[4/5] w-full bg-gradient-to-br ${m.accent}`}
                                    >
                                        {/* faux still */}
                                        <div className="absolute inset-0 bg-noise opacity-[0.1]" />
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                background:
                                                    "radial-gradient(circle at 30% 30%, rgba(212,175,55,0.18), transparent 60%)",
                                            }}
                                        />
                                        {/* horizon line */}
                                        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                                        {/* gradient veil */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-bg-0 via-bg-0/40 to-transparent" />

                                        {/* TYPE chip */}
                                        <div className="absolute left-3 top-3 inline-flex items-center gap-2 border border-white/10 bg-black/50 px-3 py-1.5 text-[9px] uppercase tracking-[0.3em] text-text-secondary backdrop-blur-md">
                                            <span className="h-1 w-1 rounded-full bg-gold-bright" />
                                            {m.type}
                                        </div>

                                        {/* duration */}
                                        <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 border border-white/10 bg-black/50 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.2em] text-text-secondary backdrop-blur-md">
                                            <Clock size={10} className="text-gold-bright" />
                                            {m.duration}
                                        </div>

                                        {/* play button */}
                                        <motion.div
                                            whileHover={{ scale: 1.08 }}
                                            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                                        >
                                            <div className="absolute inset-0 animate-pulse-gold rounded-full" />
                                            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-bg-0/70 text-gold-bright backdrop-blur-md transition-all group-hover/card:border-gold-bright group-hover/card:bg-gold/15">
                                                <Play size={20} fill="currentColor" />
                                            </div>
                                        </motion.div>

                                        {/* trailer hover sheen */}
                                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover/card:translate-x-full" />

                                        {/* title */}
                                        <div className="absolute inset-x-0 bottom-0 p-5">
                                            <div className="font-display text-xl tracking-wide text-text-primary">
                                                {m.title}
                                            </div>
                                            <div className="mt-1 text-[11px] uppercase tracking-[0.3em] text-text-tertiary">
                                                {m.sub}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </GlowCard>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
