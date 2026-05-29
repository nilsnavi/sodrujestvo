"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

const nav = {
    Питомник: ["О нас", "Порода", "Щенки", "Помёты"],
    Сообщество: ["Клуб", "Мероприятия", "AI помощник", "Консультации"],
    Медиа: ["Documentary", "Истории", "Тренировки", "Шорты"],
    Контакты: ["Telegram", "WhatsApp", "VK", "YouTube"],
};

const socials = [
    { label: "Telegram", href: "#" },
    { label: "VK", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "TikTok", href: "#" },
    { label: "Instagram", href: "#" },
];

export default function Footer() {
    return (
        <footer className="relative overflow-hidden border-t border-white/5 bg-bg-0 pt-20">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

            <div className="mx-auto max-w-[1500px] px-6 lg:px-12">
                <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
                    {/* Brand */}
                    <div className="lg:col-span-4">
                        <Reveal>
                            <div className="flex items-center gap-4">
                                <div className="relative h-16 w-16 shrink-0">
                                    <div className="absolute inset-0 rounded-full bg-radial-gold opacity-50 blur-md" />
                                    <Image
                                        src="/brand/logo-transparent.png"
                                        alt="Содружество Хотошо"
                                        fill
                                        sizes="64px"
                                        className="relative object-contain"
                                    />
                                </div>
                                <div>
                                    <div className="font-display text-3xl tracking-[0.32em] text-gold-gradient">
                                        ХОТОШО
                                    </div>
                                    <div className="mt-1 text-[10px] uppercase tracking-[0.5em] text-text-tertiary">
                                        Содружество · Est. 2014
                                    </div>
                                </div>
                            </div>
                            <p className="mt-8 max-w-sm text-sm leading-relaxed text-text-secondary">
                                Премиальный питомник бурят-монгольской породы. Сила, верность
                                и спокойствие поколений — в каждом нашем воспитаннике.
                            </p>

                            <div className="mt-10 flex flex-wrap gap-2">
                                {socials.map((s) => (
                                    <Link
                                        key={s.label}
                                        href={s.href}
                                        className="border border-white/10 bg-white/[0.02] px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-text-secondary transition-all hover:border-gold/40 hover:text-gold-bright"
                                    >
                                        {s.label}
                                    </Link>
                                ))}
                            </div>
                        </Reveal>
                    </div>

                    {/* Nav columns */}
                    <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8">
                        {Object.entries(nav).map(([title, items], i) => (
                            <Reveal key={title} delay={i * 0.05}>
                                <div>
                                    <div className="mb-5 text-[10px] uppercase tracking-[0.4em] text-gold-bright">
                                        {title}
                                    </div>
                                    <ul className="space-y-3">
                                        {items.map((it) => (
                                            <li key={it}>
                                                <Link
                                                    href="#"
                                                    className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                                                >
                                                    {it}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>

                {/* Big crest watermark */}
                <div
                    aria-hidden
                    className="relative mx-auto mt-24 h-[280px] w-[280px] sm:h-[420px] sm:w-[420px] lg:h-[520px] lg:w-[520px]"
                >
                    <div className="absolute inset-0 bg-radial-gold opacity-30 blur-3xl" />
                    <Image
                        src="/brand/logo-transparent.png"
                        alt=""
                        fill
                        sizes="(max-width: 640px) 280px, (max-width: 1024px) 420px, 520px"
                        className="relative object-contain opacity-[0.55]"
                    />
                </div>
                <div className="divider-gold mb-8 mt-2" />

                <div className="flex flex-col items-center justify-between gap-4 pb-10 text-[10px] uppercase tracking-[0.3em] text-text-tertiary lg:flex-row">
                    <div>© 2026 Содружество Хотошо · Все права защищены</div>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-text-primary">
                            Политика
                        </Link>
                        <Link href="#" className="hover:text-text-primary">
                            Соглашение
                        </Link>
                        <Link href="#" className="hover:text-text-primary">
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
