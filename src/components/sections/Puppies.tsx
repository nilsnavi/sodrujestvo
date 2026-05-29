"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Award, Calendar } from "lucide-react";
import KhotoshoSilhouette from "@/components/art/KhotoshoSilhouette";
import GlowCard from "@/components/ui/GlowCard";
import Reveal from "@/components/ui/Reveal";

const puppies = [
    {
        name: "Баатар",
        meaning: "«Богатырь»",
        age: "3 месяца",
        status: "Доступен",
        statusColor: "text-emerald-300/90",
        docs: "РКФ · Ветпаспорт · Чип",
        tone: "from-[#1a1a1a] to-[#0a0a0a]",
    },
    {
        name: "Сэсэг",
        meaning: "«Цветок»",
        age: "4 месяца",
        status: "Резерв",
        statusColor: "text-amber-300/90",
        docs: "РКФ · Ветпаспорт · Чип",
        tone: "from-[#181818] to-[#080808]",
    },
    {
        name: "Тэнгри",
        meaning: "«Небо»",
        age: "2 месяца",
        status: "Доступен",
        statusColor: "text-emerald-300/90",
        docs: "РКФ · Ветпаспорт · Чип",
        tone: "from-[#1c1c1c] to-[#0c0c0c]",
    },
    {
        name: "Алтан",
        meaning: "«Золотой»",
        age: "5 месяцев",
        status: "Продан",
        statusColor: "text-text-tertiary",
        docs: "РКФ · Ветпаспорт · Чип",
        tone: "from-[#161616] to-[#060606]",
    },
];

export default function Puppies() {
    return (
        <section id="puppies" className="relative overflow-hidden py-32 lg:py-48">
            <div className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />

            <div className="relative mx-auto max-w-[1500px] px-6 lg:px-12">
                <div className="mb-20 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
                    <div className="max-w-2xl">
                        <Reveal>
                            <div className="mb-5 text-[10px] uppercase tracking-[0.5em] text-gold-bright">
                                · Помёт 2026 ·
                            </div>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <h2 className="font-display text-balance text-[clamp(2rem,5vw,4.5rem)] leading-[0.95]">
                                Щенки{" "}
                                <span className="font-serif italic text-gold-gradient">
                                    с характером.
                                </span>
                            </h2>
                        </Reveal>
                        <Reveal delay={0.2}>
                            <p className="mt-6 max-w-xl text-text-secondary">
                                Каждый щенок — результат тщательного подбора пар, ветеринарного
                                сопровождения и социализации с первых дней жизни.
                            </p>
                        </Reveal>
                    </div>
                    <Reveal delay={0.3}>
                        <div className="text-[11px] uppercase tracking-[0.3em] text-text-tertiary">
                            Документы РКФ · FCI · Микрочип
                        </div>
                    </Reveal>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {puppies.map((p, i) => (
                        <Reveal key={p.name} delay={i * 0.08} y={48}>
                            <GlowCard className="h-full">
                                <div className="flex h-full flex-col">
                                    {/* Photo area */}
                                    <div
                                        className={`relative aspect-[3/4] overflow-hidden bg-gradient-to-b ${p.tone}`}
                                    >
                                        <div className="absolute inset-0 bg-noise opacity-[0.08]" />
                                        <div className="absolute inset-0 bg-radial-gold opacity-30" />
                                        <motion.div
                                            whileHover={{ scale: 1.06 }}
                                            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                                            className="absolute inset-0 flex items-end justify-center pb-2"
                                        >
                                            <KhotoshoSilhouette className="h-[105%] opacity-95" />
                                        </motion.div>

                                        {/* gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-bg-0 via-bg-0/30 to-transparent" />

                                        {/* status badge */}
                                        <div className="absolute left-3 top-3 inline-flex items-center gap-2 border border-white/10 bg-bg-0/70 px-3 py-1.5 backdrop-blur-md">
                                            <span
                                                className={`h-1.5 w-1.5 rounded-full bg-current ${p.statusColor}`}
                                            />
                                            <span
                                                className={`text-[9px] uppercase tracking-[0.3em] ${p.statusColor}`}
                                            >
                                                {p.status}
                                            </span>
                                        </div>

                                        {/* hover overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-bg-0 via-bg-0/40 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                                    </div>

                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="flex items-baseline justify-between">
                                            <h3 className="font-display text-2xl tracking-wide">
                                                {p.name}
                                            </h3>
                                            <span className="font-serif text-xs italic text-text-tertiary">
                                                {p.meaning}
                                            </span>
                                        </div>

                                        <div className="mt-4 space-y-2 text-[12px] text-text-secondary">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={12} className="text-gold-bright" />
                                                <span>{p.age}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Award size={12} className="text-gold-bright" />
                                                <span>{p.docs}</span>
                                            </div>
                                        </div>

                                        <button className="group/btn mt-6 inline-flex items-center justify-between border-t border-white/5 pt-4 text-[10px] uppercase tracking-[0.3em] text-text-secondary transition-colors hover:text-gold-bright">
                                            <span>Подробнее</span>
                                            <ArrowUpRight
                                                size={14}
                                                className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
                                            />
                                        </button>
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
