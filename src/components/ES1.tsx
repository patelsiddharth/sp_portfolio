import { Briefcase, Building2, Code, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import RevealOnScroll from "./RevealOnScroll";

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
  icon: React.ReactNode;
  roles: Role[];
}

const jobs: Job[] = [
  {
    company: "Vimo Inc.",
    type: "Full-time · Remote",
    color: "hsl(245 80% 67%)",
    icon: <Briefcase className="w-5 h-5" />,
    roles: [
      {
        title: "Senior Software Engineer",
        period: "Jan 2025 – Present",
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
  },
  {
    company: "Dassault Systèmes",
    type: "Full-time · Hybrid",
    color: "hsl(330 75% 60%)",
    icon: <Building2 className="w-5 h-5" />,
    roles: [
      {
        title: "Software Engineering Manager",
        period: "May 2024 – Jan 2025",
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
        period: "Jul 2021 – Apr 2024",
        duration: "2 yrs 10 mos",
        location: "Pune, India",
        bullets: [
          "Developed 700+ unit tests with Jasmine & Karma, achieving 95% coverage, reducing production bugs by 40%.",
          "Led Vue 2 → Vue 3 migration for 5+ applications — 25% performance gain, 20% bundle size reduction.",
          "Automated 50+ E2E test cases and delivered 200+ page object methods using Intern JS & Leadfoot.",
        ],
      },
    ],
  },
  {
    company: "Persistent Systems",
    type: "Full-time · Hybrid",
    color: "hsl(170 70% 50%)",
    icon: <Code className="w-5 h-5" />,
    roles: [
      {
        title: "Software Engineer",
        period: "Jul 2019 – Jul 2021",
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
  },
];

const JobCard = ({ job, index }: { job: Job; index: number }) => {
  const [expandedRole, setExpandedRole] = useState<number>(0);
  const hasMultipleRoles = job.roles.length > 1;

  return (
    <RevealOnScroll delay={index * 0.12}>
      <div className="relative pl-8 md:pl-12 pb-12 last:pb-0 group">
        {/* Timeline line */}
        <motion.div
          className="absolute left-[11px] md:left-[19px] top-8 bottom-0 w-px"
          style={{ background: `linear-gradient(to bottom, ${job.color}, transparent)` }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.15 }}
        />

        {/* Timeline dot */}
        <motion.div
          className="absolute left-0 md:left-2 top-1.5 z-10"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 300, delay: index * 0.15 }}
        >
          <div className="relative">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: `${job.color.replace(")", " / 0.2)")}` }}
            >
              <div className="w-3 h-3 rounded-full" style={{ background: job.color }} />
            </div>
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: job.color }}
              animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          className="glass rounded-2xl overflow-hidden"
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          {/* Company header */}
          <div className="p-5 md:p-6 border-b border-white/5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ background: `${job.color.replace(")", " / 0.15)")}` }}
                >
                  <span style={{ color: job.color }}>{job.icon}</span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {job.company}
                  </h3>
                  <p className="text-xs text-muted-foreground">{job.type}</p>
                </div>
              </div>
              {hasMultipleRoles && (
                <span
                  className="text-[10px] font-mono px-2 py-1 rounded-full"
                  style={{
                    background: `${job.color.replace(")", " / 0.1)")}`,
                    color: job.color,
                  }}
                >
                  {job.roles.length} roles
                </span>
              )}
            </div>
          </div>

          {/* Roles */}
          <div className="divide-y divide-white/5">
            {job.roles.map((role, ri) => {
              const isExpanded = expandedRole === ri;
              return (
                <div key={ri}>
                  <button
                    onClick={() => setExpandedRole(isExpanded && hasMultipleRoles ? -1 : ri)}
                    className="w-full text-left p-5 md:p-6 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-display text-sm font-medium text-foreground">
                          {role.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-xs text-muted-foreground font-mono">
                            {role.period}
                          </span>
                          <span className="text-muted-foreground/30">·</span>
                          <span className="text-xs text-muted-foreground">{role.duration}</span>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="mt-1 text-muted-foreground flex-shrink-0"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <ul className="px-5 md:px-6 pb-5 md:pb-6 space-y-3">
                          {role.bullets.map((b, j) => (
                            <motion.li
                              key={j}
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: j * 0.06, duration: 0.3 }}
                              className="flex items-start gap-3 text-sm text-muted-foreground"
                            >
                              <span
                                className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ background: job.color }}
                              />
                              {b}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </RevealOnScroll>
  );
};

const ExperienceSection1 = () => (
  <section id="experience" className="py-32 px-6">
    <div className="mx-auto max-w-3xl">
      <RevealOnScroll>
        <p className="section-label">Experience</p>
        <h2 className="section-title">
          Where I've made <span className="gradient-text">impact</span>
        </h2>
        <p className="section-subtitle">
          A journey through product companies building tools used by thousands.
        </p>
      </RevealOnScroll>

      <div className="mt-16">
        {jobs.map((job, i) => (
          <JobCard key={i} job={job} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default ExperienceSection1;
