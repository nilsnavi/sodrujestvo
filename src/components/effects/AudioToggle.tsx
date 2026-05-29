"use client";

import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function AudioToggle() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [on, setOn] = useState(false);

    useEffect(() => {
        audioRef.current = new Audio();
        // Inline data: tiny silent source — acts as ambient placeholder.
        // Replace with real ambient track at /public/audio/ambient.mp3
        audioRef.current.src = "/audio/ambient.mp3";
        audioRef.current.loop = true;
        audioRef.current.volume = 0.25;
        return () => {
            audioRef.current?.pause();
            audioRef.current = null;
        };
    }, []);

    const toggle = () => {
        if (!audioRef.current) return;
        if (on) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(() => {
                /* autoplay blocked silently */
            });
        }
        setOn((v) => !v);
    };

    return (
        <motion.button
            onClick={toggle}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="glass relative flex h-11 w-11 items-center justify-center rounded-full text-text-secondary transition-colors hover:text-gold-bright"
            aria-label={on ? "Выключить звук" : "Включить звук"}
        >
            {on ? <Volume2 size={16} /> : <VolumeX size={16} />}
            {on && (
                <span className="absolute inset-0 animate-pulse-gold rounded-full" />
            )}
        </motion.button>
    );
}
