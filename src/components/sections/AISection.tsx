"use client";

import { motion } from "framer-motion";
import { Brain, Dna, MessageSquare, Send, Sparkles, Workflow } from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";
import Reveal from "@/components/ui/Reveal";

const modules = [
    {
        icon: Brain,
        title: "AI помощник по породе",
        body: "Отвечает на вопросы о Хотошо: уход, воспитание, здоровье. Обучен на материалах питомника.",
    },
    {
        icon: Dna,
        title: "AI подбор щенка",
        body: "Алгоритм анализирует ваш ритм жизни и подбирает подходящего щенка по характеру и темпераменту.",
    },
    {
        icon: MessageSquare,
        title: "AI консультации",
        body: "Круглосуточный диалог: тренировки, питание, поведение. Сложные вопросы — кураторы клуба.",
    },
    {
        icon: Workflow,
        title: "CRM питомника",
        body: "Карточка каждой собаки, родословные, графики прививок, помёты — всё в одной системе.",
    },
    {
        icon: Send,
        title: "Telegram bot",
        body: "Заявки, новости помётов, мгновенные уведомления — прямо в мессенджере.",
    },
    {
        icon: Sparkles,
        title: "Generative content",
        body: "Документальные ролики, портреты и истории — с поддержкой генеративных моделей.",
    },
];

export default function AISection() {
    return (
        <section id="ai" className="relative overflow-hidden py-32 lg:py-48">
            {/* circuit-like backdrop */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
                <svg
                    viewBox="0 0 1600 900"
                    preserveAspectRatio="xMidYMid slice"
                    className="h-full w-full"
                >
                    <defs>
                        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                            <path
                                d="M 60 0 L 0 0 0 60"
                                fill="none"
                                stroke="#d4af37"
                                strokeWidth="0.4"
                            />
                        </pattern>
                    </defs>
                    <rect width="1600" height="900" fill="url(#grid)" />
                </svg>
            </div>
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 bg-radial-gold opacity-30 blur-3xl" />

            <div className="relative mx-auto max-w-[1500px] px-6 lg:px-12">
                <div className="mx-auto mb-20 max-w-3xl text-center">
                    <Reveal>
                        <div className="mb-5 inline-flex items-center gap-2 border border-gold/30 bg-bg-0/60 px-4 py-2 text-[10px] uppercase tracking-[0.4em] text-gold-bright backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inset-0 animate-ping rounded-full bg-gold-bright opacity-75" />
                                <span className="relative h-2 w-2 rounded-full bg-gold-bright" />
                            </span>
                            AI Ecosystem · v1.0
                        </div>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <h2 className="font-display text-balance text-[clamp(2rem,5.5vw,5rem)] leading-[0.95]">
                            Технологии{" "}
                            <span className="font-serif italic text-gold-gradient">
                                на службе
                            </span>{" "}
                            традиции.
                        </h2>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <p className="mt-8 text-text-secondary">
                            Мы соединили древнюю породу с современным AI-стеком: помощники,
                            CRM, чат-боты и генеративные модели — внутри одного бренда.
                        </p>
                    </Reveal>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {modules.map((m, i) => (
                        <Reveal key={m.title} delay={i * 0.06} y={40}>
                            <GlowCard className="h-full">
                                <div className="relative flex h-full flex-col p-7">
                                    <div className="mb-6 flex items-start justify-between">
                                        <div className="flex h-12 w-12 items-center justify-center border border-gold/30 bg-bg-0/60 text-gold-bright">
                                            <m.icon size={20} strokeWidth={1.4} />
                                        </div>
                                        <span className="font-mono text-[10px] tracking-[0.2em] text-text-tertiary">
                                            .module/0{i + 1}
                                        </span>
                                    </div>
                                    <h3 className="mb-3 font-display text-2xl tracking-wide">
                                        {m.title}
                                    </h3>
                                    <p className="text-[14px] leading-relaxed text-text-secondary">
                                        {m.body}
                                    </p>
                                    {/* faux signal bar */}
                                    <div className="mt-6 flex items-center gap-1">
                                        {Array.from({ length: 18 }).map((_, k) => (
                                            <motion.span
                                                key={k}
                                                animate={{ opacity: [0.2, 1, 0.2] }}
                                                transition={{
                                                    duration: 2.4,
                                                    repeat: Infinity,
                                                    delay: (k * 0.08) % 2,
                                                }}
                                                className="h-3 w-[3px] bg-gold/60"
                                            />
                                        ))}
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
