"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { MessageCircle, Send } from "lucide-react";
import { useRef } from "react";
import KhotoshoSilhouette from "@/components/art/KhotoshoSilhouette";
import MountainBackdrop from "@/components/art/MountainBackdrop";
import MagneticButton from "@/components/ui/MagneticButton";
import Reveal from "@/components/ui/Reveal";

export default function CTA() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
    const dogY = useTransform(scrollYProgress, [0, 1], [80, -80]);

    return (
        <section
            id="contact"
            ref={ref}
            className="relative isolate overflow-hidden py-40 lg:py-56"
        >
            {/* backdrop */}
            <motion.div className="absolute inset-0" style={{ y }}>
                <MountainBackdrop className="opacity-60" />
            </motion.div>
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.7) 70%, #000 100%)",
                }}
            />
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.06]" />

            {/* silhouette */}
            <motion.div
                style={{ y: dogY }}
                className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-[480px] max-w-[700px] opacity-90"
            >
                <div className="absolute inset-0 bg-radial-gold opacity-40 blur-2xl" />
                <KhotoshoSilhouette className="relative h-full" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg-0 to-transparent" />
            </motion.div>

            <div className="relative mx-auto flex max-w-[1100px] flex-col items-center px-6 text-center lg:px-12">
                <Reveal>
                    <div className="mb-6 text-[10px] uppercase tracking-[0.5em] text-gold-bright">
                        · Заявка ·
                    </div>
                </Reveal>

                <Reveal delay={0.1}>
                    <h2 className="font-display text-balance text-[clamp(2.5rem,8vw,7rem)] leading-[0.92] tracking-[-0.01em]">
                        Найдите{" "}
                        <span className="font-serif italic text-gold-gradient">своего</span>{" "}
                        Хотошо.
                    </h2>
                </Reveal>

                <Reveal delay={0.2}>
                    <p className="mt-8 max-w-2xl text-lg text-text-secondary">
                        Расскажите о себе и образе жизни — мы подберём щенка, который
                        идеально впишется в вашу историю.
                    </p>
                </Reveal>

                <Reveal delay={0.3}>
                    <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
                        <MagneticButton
                            href="https://t.me/"
                            variant="primary"
                            icon={<Send size={14} />}
                        >
                            Telegram
                        </MagneticButton>
                        <MagneticButton
                            href="https://wa.me/"
                            variant="ghost"
                            icon={<MessageCircle size={14} />}
                        >
                            WhatsApp
                        </MagneticButton>
                        <MagneticButton href="#form" variant="ghost">
                            Оставить заявку
                        </MagneticButton>
                    </div>
                </Reveal>

                <Reveal delay={0.4}>
                    <div className="mt-14 text-[10px] uppercase tracking-[0.4em] text-text-tertiary">
                        Ответ в течение 24 часов · Россия & СНГ
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
