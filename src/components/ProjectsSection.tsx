import { ExternalLink } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";
import SpotlightCard from "./SpotlightCard";

const projects = [
  {
    name: "ClearPath",
    company: "Vimo Inc.",
    desc: "Multi-tenant investigation management system for 50+ organizations — reduced case processing time by 40% and improved tracking accuracy for 10,000+ active cases.",
    tags: ["React.js", "TypeScript", "Redux RTK", "Chakra UI", "Vitest"],
    gradient: "var(--gradient-primary)",
    spotlight: "rgba(100, 100, 255, 0.15)"
  },
  {
    name: "Partner Scope of Work",
    company: "Dassault Systèmes",
    desc: "External partner management portal for 30,000+ active users — 99.5% uptime, 2-second average page load, full CI/CD pipeline integration.",
    tags: ["Vue.js", "JavaScript", "Element Plus", "Jasmine", "CI/CD"],
    gradient: "var(--gradient-accent)",
    spotlight: "rgba(255, 100, 200, 0.15)"
  },
  {
    name: "Go Strategy Model",
    company: "Dassault Systèmes",
    desc: "Interactive Canvas & Chart.js dashboard for go-to-market scenario modeling — enabled exec team to visualize 5+ revenue universes.",
    tags: ["React.js", "TypeScript", "Canvas API", "Chart.js", "Chakra UI"],
    gradient: "linear-gradient(135deg, hsl(170 70% 50%), hsl(245 80% 67%))",
    spotlight: "rgba(100, 200, 255, 0.15)"
  },
];

const ProjectsSection = () => (
  <section id="projects" className="py-16 md:py-20 px-6 relative">
    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(330 75% 60% / 0.08), transparent 70%)" }} />

    <div className="max-w-7xl mx-auto relative z-10">
      <RevealOnScroll>
        <div className="section-label">Projects</div>
        <h2 className="section-title">
          Selected <span className="gradient-text-accent">work</span>
        </h2>
        <p className="section-subtitle mb-12">
          Products I've built that serve real users at scale.
        </p>
      </RevealOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p, i) => (
          <RevealOnScroll key={i} delay={i * 0.1}>
            <SpotlightCard spotlightColor={p.spotlight} className="h-full">
              <div className="glass rounded-2xl overflow-hidden transition-all hover:scale-[1.01] hover:shadow-[0_0_40px_-10px_hsl(245_80%_67%_/_0.3)] h-full flex flex-col relative z-20 bg-background/50 backdrop-blur-xl border border-white/5">
                <div className="h-1 w-full" style={{ background: p.gradient }} />
                <div className="p-7 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-body text-xs text-muted-foreground">{p.company}</span>
                    <ExternalLink size={14} className="text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3">{p.name}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6 flex-grow">{p.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map(t => (
                      <span key={t} className="px-3 py-1 rounded-full text-[10px] font-body tracking-wide text-muted-foreground border border-border/50 group-hover:border-primary/30 transition-colors">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  </section>
);

export default ProjectsSection;
