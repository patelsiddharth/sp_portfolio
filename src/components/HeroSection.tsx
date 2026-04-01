"use client";
import { useRef, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import type { Easing } from "framer-motion";
import { Code2, Download } from "lucide-react";
import { GithubLineIcon, LinkedinIcon } from "@/lib/utils";
import MagneticButton from "./MagneticButton";
import SpotlightCard from "./SpotlightCard";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: "easeOut" as Easing },
});

interface HeroSectionProps {
  /** Called with `true` when scroll reaches the threshold where the name should appear in the navbar */
  onNameExit?: (exited: boolean) => void;
}

const HeroSection = ({ onNameExit }: HeroSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  // Scroll progress relative to the hero section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Notify parent when the name has "left" the hero (threshold ~35% of hero scroll)
  useEffect(() => {
    if (!onNameExit) return;
    const unsubscribe = scrollYProgress.on("change", (v) => {
      onNameExit(v > 0.35);
    });
    return unsubscribe;
  }, [scrollYProgress, onNameExit]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="min-h-screen relative flex flex-col overflow-hidden"
    >
      {/* Ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full animate-pulse-glow"
          style={{
            background:
              "radial-gradient(circle, hsl(245 80% 67% / 0.25), transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-0 w-[600px] h-[600px] rounded-full animate-pulse-glow"
          style={{
            background:
              "radial-gradient(circle, hsl(330 75% 60% / 0.2), transparent 70%)",
            animationDelay: "2s",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full animate-pulse-glow"
          style={{
            background:
              "radial-gradient(circle, hsl(170 70% 50% / 0.1), transparent 70%)",
            animationDelay: "4s",
          }}
        />
      </div>

      {/* ── Hero main content ── */}
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10 flex-1 py-12 lg:py-0">
        <div>
          <motion.div
            {...fadeUp(0.1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-body text-xs text-muted-foreground tracking-wide">
              Available for opportunities
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.2)}
            className="font-display font-bold leading-[1.05] mb-6"
            style={{
              fontSize: "clamp(36px, 6vw, 72px)",
              letterSpacing: "-2px",
            }}
          >
            Hi, I&apos;m <span className="gradient-text">Siddharth</span>
            <br />
            <span className="text-foreground">Patel</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.4)}
            className="font-body text-muted-foreground text-lg leading-relaxed max-w-md mb-8"
          >
            Senior Frontend Engineer crafting scalable web apps with{" "}
            <span className="text-foreground font-medium">React</span>,{" "}
            <span className="text-foreground font-medium">Vue</span> &amp;{" "}
            <span className="text-foreground font-medium">TypeScript</span> for
            7+ years.
          </motion.p>

          <motion.div {...fadeUp(0.6)} className="flex flex-wrap gap-4 mt-4 items-center">
            <MagneticButton
              href="#projects"
              className="px-7 py-3.5 rounded-full text-sm font-medium text-primary-foreground transition-all hover:scale-105 hover:shadow-[0_0_30px_-5px_hsl(245_80%_67%_/_0.5)] border border-white/10"
              style={{ background: "var(--gradient-primary)" }}
            >
              View My Work
            </MagneticButton>
            <MagneticButton
	              href="#contact"
	              className="px-7 py-3.5 rounded-full text-sm font-medium glass glass-hover text-foreground transition-all hover:scale-105 bg-background/50 backdrop-blur-md border border-white/10"
	            >
	              Get in Touch
	            </MagneticButton>
	            <MagneticButton
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/Siddharth-Patel-Senior-Software-Engineer-Resume.pdf';
                link.download = 'Siddharth-Patel-Resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="px-7 py-3.5 rounded-full text-sm font-medium glass glass-hover text-foreground transition-all hover:scale-105 bg-background/50 backdrop-blur-md border border-white/10 inline-flex items-center gap-2"
            >
              <Download size={16} />
              Download Resume
            </MagneticButton>
	          </motion.div>

          <motion.div {...fadeUp(0.8)} className="flex gap-5 mt-10">
            {[
              {
                href: "https://github.com/patelsiddharth",
                icon: <GithubLineIcon size={18} />,
                label: "GitHub",
              },
              {
                href: "https://linkedin.com/in/siddharthpatel425",
                icon: <LinkedinIcon size={18} />,
                label: "LinkedIn",
              },
              {
                href: "https://leetcode.com/u/siddharthpatel",
                icon: <Code2 size={18} />,
                label: "LeetCode",
              },
            ].map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                className="flex items-center gap-2 font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {s.icon} {s.label}
              </a>
            ))}
          </motion.div>
        </div>

        {/* Right — Floating glass cards */}
        <div className="relative h-[450px] lg:h-[550px] hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" as Easing }}
            className="absolute top-8 right-8 animate-float w-[280px]"
          >
            <SpotlightCard
              className="w-full rounded-2xl"
              spotlightColor="rgba(255, 255, 255, 0.15)"
            >
              <div className="glass rounded-2xl p-6 glow-primary bg-background/50 backdrop-blur-xl border border-white/5">
                <div className="text-4xl font-display font-bold gradient-text mb-1">
                  7+
                </div>
                <div className="text-sm text-muted-foreground">
                  Years of Experience
                </div>
                <div
                  className="mt-3 h-1 rounded-full w-3/4"
                  style={{ background: "var(--gradient-primary)" }}
                />
              </div>
            </SpotlightCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 2 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" as Easing }}
            className="absolute top-44 left-0 animate-float-slow w-[260px]"
          >
            <SpotlightCard
              className="w-full rounded-2xl"
              spotlightColor="rgba(255, 255, 255, 0.15)"
            >
              <div className="glass rounded-2xl p-6 glow-secondary bg-background/50 backdrop-blur-xl border border-white/5">
                <div className="text-4xl font-display font-bold gradient-text-accent mb-1">
                  30K+
                </div>
                <div className="text-sm text-muted-foreground">
                  Users Served Daily
                </div>
                <div
                  className="mt-3 h-1 rounded-full w-2/3"
                  style={{ background: "var(--gradient-accent)" }}
                />
              </div>
            </SpotlightCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" as Easing }}
            className="absolute bottom-12 right-12 animate-float w-[240px]"
            style={{ animationDelay: "1s" }}
          >
            <SpotlightCard
              className="w-full rounded-2xl"
              spotlightColor="rgba(255, 255, 255, 0.15)"
            >
              <div className="glass rounded-2xl p-6 bg-background/50 backdrop-blur-xl border border-white/5">
                <div className="text-4xl font-display font-bold text-accent mb-1">
                  95%
                </div>
                <div className="text-sm text-muted-foreground">
                  Test Coverage
                </div>
                <div className="mt-3 h-1 rounded-full w-1/2 bg-accent" />
              </div>
            </SpotlightCard>
          </motion.div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-border/30 animate-spin-slow" />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full border border-border/20 animate-spin-slow"
            style={{ animationDirection: "reverse", animationDuration: "15s" }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
