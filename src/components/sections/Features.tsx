"use client";

import { Eye, Mountain, Shield, Sparkles } from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";
import Reveal from "@/components/ui/Reveal";

const features = [
    {
        icon: Shield,
        title: "Защитник семьи",
        body: "Природный охранный инстинкт. Хотошо защищает дом и близких — без агрессии, но с непоколебимой решимостью.",
    },
    {
        icon: Eye,
        title: "Ум и спокойствие",
        body: "Древняя порода с уравновешенной психикой. Принимает решения сам, понимает голос и взгляд хозяина.",
    },
    {
        icon: Mountain,
        title: "Выносливость",
        body: "Тысячелетия в горах и степях. Крепкий костяк, густая шерсть, способность работать в самых жёстких условиях.",
    },
    {
        icon: Sparkles,
        title: "Преданность",
        body: "Один хозяин — на всю жизнь. Глубокая эмоциональная связь, понимание без слов, верность поколений.",
    },
];

export default function Features() {
    return (
        <section className="relative overflow-hidden py-32 lg:py-48">
            {/* ambient glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[1200px] -translate-x-1/2 -translate-y-1/2 bg-radial-gold opacity-30 blur-3xl" />

            <div className="relative mx-auto max-w-[1500px] px-6 lg:px-12">
                <div className="mx-auto mb-20 max-w-3xl text-center lg:mb-28">
                    <Reveal>
                        <div className="mb-5 text-[10px] uppercase tracking-[0.5em] text-gold-bright">
                            · Характер породы ·
                        </div>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <h2 className="font-display text-balance text-[clamp(2rem,5vw,4.5rem)] leading-[1] tracking-[-0.01em]">
                            Четыре качества,{" "}
                            <span className="font-serif italic text-gold-gradient">
                                которые невозможно
                            </span>{" "}
                            подделать
                        </h2>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <div className="divider-gold mx-auto mt-10 w-32" />
                    </Reveal>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((f, i) => (
                        <Reveal key={f.title} delay={i * 0.08} y={48}>
                            <GlowCard className="h-full">
                                <div className="flex h-full flex-col p-8">
                                    <div className="mb-8 flex h-14 w-14 items-center justify-center border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent text-gold-bright">
                                        <f.icon size={22} strokeWidth={1.4} />
                                    </div>
                                    <div className="mb-4 text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
                                        0{i + 1}
                                    </div>
                                    <h3 className="mb-4 font-display text-2xl tracking-wide text-text-primary">
                                        {f.title}
                                    </h3>
                                    <p className="text-[14px] leading-relaxed text-text-secondary">
                                        {f.body}
                                    </p>
                                </div>
                            </GlowCard>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
