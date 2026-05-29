"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    y?: number;
    once?: boolean;
}

export default function Reveal({
    children,
    className,
    delay = 0,
    y = 32,
    once = true,
}: RevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once, margin: "-10% 0px -10% 0px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
            transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
}
