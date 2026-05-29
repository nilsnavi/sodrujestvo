"use client";

import { Bot, CalendarHeart, Headphones, Lock, Users } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import Reveal from "@/components/ui/Reveal";

const benefits = [
    { icon: Lock, label: "Закрытый клуб владельцев" },
    { icon: Headphones, label: "Консультации 24/7" },
    { icon: Users, label: "Поддержка кураторов" },
    { icon: Bot, label: "AI-ассистент по породе" },
    { icon: CalendarHeart, label: "Закрытые мероприятия" },
];

export default function Club() {
    return (
        <section id="club" className="relative overflow-hidden py-32 lg:py-48">
            {/* large bg type */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-10 select-none text-center font-display text-[clamp(8rem,22vw,22rem)] leading-none tracking-[0.05em] text-white/[0.025]"
            >
                СОДРУЖЕСТВО
            </div>

            <div className="relative mx-auto max-w-[1500px] px-6 lg:px-12">
                <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
                    <div>
                        <Reveal>
                            <div className="mb-5 text-[10px] uppercase tracking-[0.5em] text-gold-bright">
                                · Клуб ·
                            </div>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <h2 className="font-display text-balance text-[clamp(2rem,5vw,4.8rem)] leading-[0.95]">
                                Содружество — это{" "}
                                <span className="font-serif italic text-gold-gradient">
                                    больше,
                                </span>{" "}
                                чем питомник.
                            </h2>
                        </Reveal>
                        <Reveal delay={0.2}>
                            <p className="mt-8 max-w-xl text-lg leading-relaxed text-text-secondary">
                                Это закрытое сообщество людей, выбравших Хотошо в свою жизнь.
                                Поддержка на каждом этапе — от первой встречи до старости.
                            </p>
                        </Reveal>
                        <Reveal delay={0.3}>
                            <div className="mt-10">
                                <MagneticButton href="#contact" variant="primary">
                                    Вступить в клуб
                                </MagneticButton>
                            </div>
                        </Reveal>
                    </div>

                    <div>
                        <ul className="space-y-px overflow-hidden border border-white/5">
                            {benefits.map((b, i) => (
                                <Reveal key={b.label} delay={i * 0.08}>
                                    <li className="group flex items-center gap-6 bg-bg-1/60 px-6 py-6 transition-all hover:bg-bg-2/80 hover:pl-10">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-gold/20 bg-gradient-to-br from-gold/10 to-transparent text-gold-bright transition-all group-hover:border-gold/60">
                                            <b.icon size={18} strokeWidth={1.4} />
                                        </div>
                                        <span className="flex-1 text-[15px] uppercase tracking-[0.18em] text-text-secondary group-hover:text-text-primary">
                                            {b.label}
                                        </span>
                                        <span className="font-serif text-xs italic text-text-tertiary">
                                            0{i + 1}
                                        </span>
                                    </li>
                                </Reveal>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
