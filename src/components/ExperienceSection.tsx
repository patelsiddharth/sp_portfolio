"use client";

import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Briefcase, Building2, Code, Calendar, ChevronRight, MapPin, ChevronDown } from "lucide-react";
import SpotlightCard from "./SpotlightCard";

interface Role {
  title: string;
  period: string;
  duration: string;
  location: string;
  bullets: string[];
}

interface Job {
  company: string;
  type: string;
  color: string;
  colorRaw: string;
  icon: React.ReactNode;
  roles: Role[];
  stats: { value: string; label: string }[];
  tags: string[];
}

const jobs: Job[] = [
  {
    company: "Vimo Inc.",
    type: "Full-time · Remote",
    color: "hsl(245 80% 67%)",
    colorRaw: "245 80% 67%",
    icon: <Code size={20} />,
    roles: [
      {
        title: "Senior Software Engineer",
        period: "Jan 2025 - Present",
        duration: "1 yr 3 mos",
        location: "Pune, India",
        bullets: [
          "Built 5+ high-performance SPAs using React and Vue, serving 30,000+ active users with 99.9% uptime.",
          "Integrated 15+ advanced features with Redux Toolkit Query, reducing code complexity by 30%.",
          "Unified 12+ monorepos with Nx, cutting build times by 35% and halving feature release cycles.",
          "Boosted front-end Lighthouse performance by 15% through React Hooks optimization.",
          "Developed unit tests with Vitest, improving test coverage to 85%.",
        ],
      },
    ],
    stats: [
      { value: "30K+", label: "Active users" },
      { value: "35%", label: "Faster builds" },
      { value: "85%", label: "Test coverage" },
    ],
    tags: ["React", "Vue", "TypeScript", "Redux RTK", "Nx", "Vitest"],
  },
  {
    company: "Dassault Systèmes",
    type: "Full-time · Hybrid",
    color: "hsl(330 75% 60%)",
    colorRaw: "330 75% 60%",
    icon: <Building2 size={20} />,
    roles: [
      {
        title: "Software Engineering Manager",
        period: "May 2024 - Jan 2025",
        duration: "9 mos",
        location: "Pune, India",
        bullets: [
          "Managed a team of 4 across full SDLC — from requirement gathering to post-implementation support.",
          "Drove code review standards and mentored engineers on best practices.",
          "Leveraged SonarQube for code quality maintenance and security hotspot resolution.",
        ],
      },
      {
        title: "Software Engineering Specialist",
        period: "Jul 2021 - Apr 2024",
        duration: "2 yrs 10 mos",
        location: "Pune, India",
        bullets: [
          "Developed 700+ unit tests with Jasmine & Karma, achieving 95% coverage, reducing production bugs by 40%.",
          "Led Vue 2 → Vue 3 migration for 5+ applications — 25% performance gain, 20% bundle size reduction.",
          "Automated 50+ E2E test cases and delivered 200+ page object methods using Intern JS & Leadfoot.",
        ],
      },
    ],
    stats: [
      { value: "95%", label: "Test coverage" },
      { value: "25%", label: "Perf gain" },
      { value: "40%", label: "Fewer bugs" },
    ],
    tags: ["Vue 3", "TypeScript", "Jasmine", "Karma", "SonarQube", "Intern.js"],
  },
  {
    company: "Persistent Systems",
    type: "Full-time · Hybrid",
    color: "hsl(170 70% 50%)",
    colorRaw: "170 70% 50%",
    icon: <Briefcase size={20} />,
    roles: [
      {
        title: "Software Engineer",
        period: "Jul 2019 - Jul 2021",
        duration: "2 yrs 1 mo",
        location: "Nagpur, India",
        bullets: [
          "Built and maintained frontend of a network management application for audio-video broadcasting.",
          "Implemented customer-specific features and resolved performance bottlenecks.",
          "Utilized C# and WPF for interface design in a Windows environment.",
          "Collaborated closely with backend teams for seamless integration.",
        ],
      },
    ],
    stats: [
      { value: "2yr", label: "Duration" },
      { value: "A/V", label: "Domain" },
      { value: "Top", label: "Talent FY21" },
    ],
    tags: ["React", "C#", "WPF", "Performance", "A/V Broadcasting"],
  },
];

// Animated stat number that counts up when in view
function StatCounter({ value, label, color }: { value: string; label: string; color: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
      className="text-center"
    >
      <motion.div
        className="font-display text-2xl font-bold"
        style={{ color }}
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {value}
      </motion.div>
      <div className="font-body text-xs text-muted-foreground mt-0.5">{label}</div>
    </motion.div>
  );
}

// Individual timeline card — alternates left/right
function ExperienceCard({ job, index }: { job: Job; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-0 lg:gap-8 items-start">

      {/* Left column (desktop) */}
      <div className={`hidden lg:flex flex-col ${isEven ? "items-end" : "items-start"}`}>
        {isEven && (
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-xl"
          >
            <CardContent job={job} inView={inView} flipped isEven={isEven} />
          </motion.div>
        )}
      </div>

      {/* Centre dot + connector */}
      <div className="hidden lg:flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.1, type: "spring", stiffness: 300 }}
          className="w-12 h-12 rounded-full flex items-center justify-center border-2 relative z-10 bg-background"
          style={{ borderColor: job.color, color: job.color, boxShadow: `0 0 20px hsl(${job.colorRaw} / 0.35)` }}
        >
          {job.icon}
        </motion.div>
      </div>

      {/* Right column (desktop) */}
      <div className={`hidden lg:flex flex-col ${isEven ? "items-start" : "items-end"}`}>
        {!isEven && (
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-xl"
          >
            <CardContent job={job} inView={inView} isEven={isEven} />
          </motion.div>
        )}
      </div>

      {/* Mobile: always full width, slide from bottom */}
      <motion.div
        className="lg:hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Mobile header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center border-2 flex-shrink-0"
            style={{ borderColor: job.color, color: job.color }}
          >
            {job.icon}
          </div>
        </div>
        <CardContent job={job} inView={inView} isEven={isEven} />
      </motion.div>
    </div>
  );
}

function CardContent({ job, inView, flipped = false, isEven = false }: { job: Job; inView: boolean; flipped?: boolean; isEven?: boolean }) {
  const [expandedRole, setExpandedRole] = useState<number>(0);
  
  return (
    <SpotlightCard className="w-full" spotlightColor={`hsl(${job.colorRaw} / 0.12)`}>
      <div
        className="glass rounded-2xl p-6 bg-background/50 backdrop-blur-xl border border-white/5 transition-all hover:border-white/10"
        style={ isEven ? { borderLeftColor: job.color, borderLeftWidth: "2px" } : { borderRightColor: job.color, borderRightWidth: "2px" } }
      >
        <div className="hidden lg:block mb-4">
          <div>
            <h3 className="font-display text-base md:text-lg font-semibold text-foreground leading-tight"
            style={{ color: job.color }}>
              {job.company}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">{job.type}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
          {job.stats.map((s, i) => (
            <StatCounter key={i} value={s.value} label={s.label} color={job.color} />
          ))}
        </div>

        <div className="divide-y divide-white/5">
          {job.roles.map((role, ri) => {
            const isExpanded = expandedRole === ri;
            return (
              <div key={ri}>
                <motion.button
                  onClick={() =>
                    setExpandedRole(isExpanded ? -1 : ri)
                  }
                  className="w-full text-left p-5 md:p-6 hover:bg-white/[0.03] transition-colors group/role cursor-pointer"
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.02)" }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-sm md:text-base font-semibold text-foreground group-hover/role:text-white transition-colors">
                        {role.title}
                      </p>
                      <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar size={12} className="opacity-60" />
                          <span className="font-mono">{role.period}</span>
                        </div>
                        <span className="text-muted-foreground/20">·</span>
                        <span className="text-xs text-muted-foreground">
                          {role.duration}
                        </span>
                        <span className="text-muted-foreground/20">·</span>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin size={12} className="opacity-60" />
                          {role.location}
                        </div>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                      className="mt-1 text-muted-foreground flex-shrink-0"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </div>
                </motion.button>

                {/* Expandable content with smooth animation */}
                <AnimatePresence initial={false}>
                  {(isExpanded) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.4,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 md:px-6 pb-5 md:pb-6 bg-white/[0.01]">
                        <ul className="space-y-3">
                          {role.bullets.map((b, j) => (
                            <motion.li
                              key={j}
                              initial={{ opacity: 0, x: -16, filter: "blur(4px)" }}
                              animate={{
                                opacity: 1,
                                x: 0,
                                filter: "blur(0px)",
                              }}
                              transition={{
                                delay: j * 0.08,
                                duration: 0.4,
                                ease: "easeOut",
                              }}
                              className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed group/bullet hover:text-foreground/80 transition-colors"
                            >
                              <motion.span
                                className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ background: job.color }}
                                whileHover={{ scale: 1.5 }}
                              />
                              <span className="flex-1">{b}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {job.tags.map((tag, i) => (
            <motion.span
              key={tag}
              className="px-2.5 py-1 rounded-full text-[10px] font-body tracking-wide border"
              style={{ borderColor: `hsl(${job.colorRaw} / 0.3)`, color: job.color }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.04, duration: 0.25 }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>
    </SpotlightCard>
  );
}

export default function ExperienceSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  });

  // Vertical line grows as you scroll through the section
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" ref={sectionRef} className="py-16 md:py-24 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-0 w-[400px] h-[400px] -translate-y-1/2 pointer-events-none opacity-40"
        style={{ background: "radial-gradient(circle, hsl(245 80% 67% / 0.12), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-label">Experience</div>
          <h2 className="section-title">
            Where I&apos;ve <span className="gradient-text">made impact</span>
          </h2>
          <p className="section-subtitle mb-14">
            7+ years across product companies, building tools used by thousands every day.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">

          {/* Animated vertical line — desktop only */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-px top-6 bottom-6 w-px bg-white/5 overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full"
              style={{ height: lineHeight, background: "linear-gradient(to bottom, hsl(245 80% 67%), hsl(330 75% 60%), hsl(170 70% 50%))" }}
            />
          </div>

          {/* Cards */}
          <div className="flex flex-col gap-10 lg:gap-16">
            {jobs.map((job, i) => (
              <ExperienceCard key={i} job={job} index={i} />
            ))}
          </div>
        </div>

        {/* Bottom summary strip */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { value: "7+", label: "Years of experience", color: "hsl(245 80% 67%)" },
            { value: "30K+", label: "Daily active users", color: "hsl(330 75% 60%)" },
            { value: "4×", label: "Award winner", color: "hsl(170 70% 50%)" },
            { value: "95%", label: "Peak test coverage", color: "hsl(245 80% 67%)" },
          ].map((s, i) => (
            <div key={i} className="glass rounded-2xl p-5 text-center border border-white/5 bg-background/30">
              <div className="font-display text-3xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
              <div className="font-body text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}