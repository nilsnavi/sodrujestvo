"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AudioToggle from "@/components/effects/AudioToggle";
import { cn } from "@/lib/utils";

const links = [
    { href: "#breed", label: "Порода" },
    { href: "#puppies", label: "Щенки" },
    { href: "#club", label: "Клуб" },
    { href: "#media", label: "Медиа" },
    { href: "#ai", label: "AI" },
    { href: "#contact", label: "Контакты" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 32);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
            <motion.header
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                    "fixed inset-x-0 top-0 z-50 transition-all duration-500",
                    scrolled
                        ? "border-b border-white/5 bg-bg-0/70 backdrop-blur-xl"
                        : "border-b border-transparent",
                )}
            >
                <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-6 lg:px-12">
                    <Link
                        href="#"
                        className="group flex items-center gap-3"
                        aria-label="Содружество Хотошо"
                    >
                        <Logo />
                        <div className="hidden leading-tight sm:block">
                            <div className="font-display text-base tracking-[0.32em] text-text-primary">
                                ХОТОШО
                            </div>
                            <div className="text-[9px] uppercase tracking-[0.4em] text-text-tertiary">
                                Содружество
                            </div>
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-10 lg:flex">
                        {links.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className="group relative text-[11px] uppercase tracking-[0.3em] text-text-secondary transition-colors hover:text-gold-bright"
                            >
                                {l.label}
                                <span className="absolute -bottom-2 left-0 h-px w-0 bg-gold-bright transition-all duration-500 group-hover:w-full" />
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        <AudioToggle />
                        <Link
                            href="#contact"
                            className="hidden lg:inline-flex h-11 items-center justify-center gap-2 border border-gold/40 px-5 text-[11px] uppercase tracking-[0.3em] text-gold-bright transition-all hover:bg-gold/10 hover:shadow-[0_0_30px_rgba(212,175,55,0.25)]"
                        >
                            Заявка
                        </Link>
                        <button
                            onClick={() => setOpen(true)}
                            className="glass flex h-11 w-11 items-center justify-center rounded-full text-text-primary lg:hidden"
                            aria-label="Открыть меню"
                        >
                            <Menu size={18} />
                        </button>
                    </div>
                </div>
            </motion.header>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="fixed inset-0 z-[80] flex flex-col bg-bg-0/95 backdrop-blur-2xl"
                    >
                        <div className="flex h-20 items-center justify-between px-6">
                            <div className="flex items-center gap-3">
                                <div className="relative h-10 w-10">
                                    <Image
                                        src="/brand/logo-transparent.png"
                                        alt="Хотошо"
                                        fill
                                        sizes="40px"
                                        className="object-contain"
                                    />
                                </div>
                                <div className="font-display text-lg tracking-[0.32em]">
                                    ХОТОШО
                                </div>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="glass flex h-11 w-11 items-center justify-center rounded-full"
                                aria-label="Закрыть"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <nav className="flex flex-1 flex-col items-center justify-center gap-8">
                            {links.map((l, i) => (
                                <motion.div
                                    key={l.href}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * i + 0.1, duration: 0.6 }}
                                >
                                    <Link
                                        href={l.href}
                                        onClick={() => setOpen(false)}
                                        className="font-display text-4xl tracking-[0.2em] text-text-primary hover:text-gold-bright"
                                    >
                                        {l.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>
                        <div className="border-t border-white/5 p-6 text-center text-[10px] uppercase tracking-[0.4em] text-text-tertiary">
                            Содружество · Est. 2014
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function Logo() {
    return (
        <div className="relative h-12 w-12 lg:h-14 lg:w-14">
            <div className="absolute inset-0 rounded-full bg-radial-gold opacity-60 blur-md" />
            <Image
                src="/brand/logo-transparent.png"
                alt="Содружество Хотошо"
                fill
                sizes="56px"
                priority
                className="relative object-contain drop-shadow-[0_4px_16px_rgba(212,175,55,0.35)]"
            />
        </div>
    );
}
