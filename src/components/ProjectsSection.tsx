import RevealOnScroll from "./RevealOnScroll";
import ProjectFlipCard from "./ProjectFlipCard";

const projects = [
  {
    name: "ClearPath",
    company: "Vimo",
    desc: "Multi-tenant investigation management system for 50+ organizations — reduced case processing time by 40% and improved tracking accuracy for 10,000+ active cases.",
    tags: ["React.js", "TypeScript", "Redux RTK", "Chakra UI", "Vitest"],
    gradient: "var(--gradient-primary)",
    spotlight: "rgba(100, 100, 255, 0.15)",
    metrics: [
      "40% faster case processing",
      "Tracking accuracy improved",
      "10,000+ active cases managed",
    ],
  },
  {
    name: "Scope Of Work For Partner",
    company: "Dassault Systèmes",
    desc: "External partner management portal for 30,000+ active users — 99.5% uptime, 2-second average page load, full CI/CD pipeline integration.",
    tags: ["Vue.js", "JavaScript", "Element Plus", "Jasmine", "CI/CD"],
    gradient: "var(--gradient-accent)",
    spotlight: "rgba(255, 100, 200, 0.15)",
    metrics: [
      "99.5% uptime SLA maintained",
      "2-second average page load",
      "30,000+ active users",
    ],
  },
  {
    name: "Go Strategy Model",
    company: "Dassault Systèmes",
    desc: "Interactive Canvas & Chart.js dashboard for go-to-market scenario modeling — enabled exec team to visualize 5+ revenue universes.",
    tags: ["React.js", "TypeScript", "Canvas API", "Chart.js", "Chakra UI"],
    gradient: "linear-gradient(135deg, hsl(170 70% 50%), hsl(245 80% 67%))",
    spotlight: "rgba(100, 200, 255, 0.15)",
    metrics: [
      "5+ revenue universe visualizations",
      "Real-time scenario modeling",
      "Exec team dashboards",
    ],
  },
];

const ProjectsSection = () => (
  <section id="projects" className="py-16 md:py-20 relative">
    <div
      className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none"
      style={{
        background:
          "radial-gradient(circle, hsl(330 75% 60% / 0.08), transparent 70%)",
      }}
    />

    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <RevealOnScroll>
        <div className="section-label">Projects</div>
        <h2 className="section-title">
          Selected <span className="gradient-text-accent">work</span>
        </h2>
        <p className="section-subtitle mb-12">
          Products I&apos;ve built that serve real users at scale.
        </p>
      </RevealOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p, i) => (
          <RevealOnScroll key={i} delay={i * 0.1}>
            <ProjectFlipCard {...p} />
          </RevealOnScroll>
        ))}
      </div>
    </div>
  </section>
);

export default ProjectsSection;
