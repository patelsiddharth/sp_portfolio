import { Briefcase, Building2, Code } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";
import SpotlightCard from "./SpotlightCard";

const jobs = [
  {
    period: "Jan 2025 - Present",
    company: "Vimo Inc.",
    role: "Senior Software Engineer",
    color: "hsl(245 80% 67%)",
    icon: <Code size={18} />,
    bullets: [
      "Built 5+ high-performance SPAs using React and Vue, serving 30,000+ active users with 99.9% uptime.",
      "Integrated 15+ advanced features with Redux Toolkit Query, reducing code complexity by 30%.",
      "Unified 12+ monorepos with Nx, cutting build times by 35% and halving feature release cycles.",
      "Boosted front-end Lighthouse performance by 15% through React Hooks optimization.",
      "Developed unit tests with Vitest, improving test coverage to 85%.",
    ],
  },
  {
    period: "Jul 2021 - Jan 2025",
    company: "Dassault Systèmes",
    role: "Senior Software Engineer",
    color: "hsl(330 75% 60%)",
    icon: <Building2 size={18} />,
    bullets: [
      "Managed a team of 4 across full SDLC — from requirement gathering to post-implementation support.",
      "Developed 700+ unit tests with Jasmine & Karma, achieving 95% coverage, reducing production bugs by 40%.",
      "Led Vue 2 → Vue 3 migration for 5+ applications — 25% performance gain, 20% bundle size reduction.",
      "Automated 50+ E2E test cases and delivered 200+ page object methods using Intern JS & Leadfoot.",
      "Leveraged SonarQube for code quality maintenance and security hotspot resolution.",
    ],
  },
  {
    period: "Jul 2019 - Jul 2021",
    company: "Persistent Systems",
    role: "Software Engineer",
    color: "hsl(170 70% 50%)",
    icon: <Briefcase size={18} />,
    bullets: [
      "Built and maintained frontend of a network management application for audio-video broadcasting.",
      "Implemented customer-specific features and resolved performance bottlenecks.",
      "Utilized C# and WPF for interface design in a Windows environment.",
      "Collaborated closely with backend teams for seamless integration.",
    ],
  },
];

const ExperienceSection = () => (
  <section id="experience" className="py-16 md:py-20 px-6 relative">
    <div className="absolute top-1/2 left-0 w-[400px] h-[400px] -translate-y-1/2 pointer-events-none" style={{ background: "radial-gradient(circle, hsl(245 80% 67% / 0.08), transparent 70%)" }} />

    <div className="max-w-7xl mx-auto relative z-10">
      <RevealOnScroll>
        <div className="section-label">Experience</div>
        <h2 className="section-title">
          Where I've <span className="gradient-text">made impact</span>
        </h2>
        <p className="section-subtitle mb-12">
          A journey through product companies building tools used by thousands.
        </p>
      </RevealOnScroll>

      <div className="space-y-5">
        {jobs.map((job, i) => (
          <RevealOnScroll key={i} delay={i * 0.1}>
            <SpotlightCard className="h-full rounded-2xl" spotlightColor={job.color.replace(')', ' / 0.15)')}>
              <div className="glass rounded-2xl p-8 transition-all hover:scale-[1.01] group bg-background/50 backdrop-blur-xl border border-white/5">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${job.color}20`, color: job.color }}>
                      {job.icon}
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold mb-1">{job.role}</h3>
                      <div className="font-body text-sm text-muted-foreground">{job.company}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: job.color }} />
                    <span className="font-body text-xs text-muted-foreground whitespace-nowrap">{job.period}</span>
                  </div>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {job.bullets.map((b, j) => (
                    <li key={j} className="flex gap-3 text-sm font-body text-muted-foreground leading-relaxed">
                      <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: job.color }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </SpotlightCard>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  </section>
);

export default ExperienceSection;
