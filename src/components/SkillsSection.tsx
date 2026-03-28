import { Monitor, Database, FlaskConical, Wrench } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";
import SpotlightCard from "./SpotlightCard";

const skills = [
  {
    title: "Frontend",
    icon: <Monitor size={16} />,
    items: [
      "React",
      "Vue",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3 / SCSS",
      "Chakra UI",
      "Element Plus",
      "Canvas",
      "Chart.js",
    ],
    gradient: "var(--gradient-primary)",
  },
  {
    title: "State Management",
    icon: <Database size={16} />,
    items: ["Redux Toolkit Query",  "Context API", "Pinia", "Vuex"],
    gradient: "var(--gradient-accent)",
  },
  {
    title: "Testing",
    icon: <FlaskConical size={16} />,
    items: ["Vitest", "Jest", "Jasmine", "Karma", "Intern.js", "Leadfoot (E2E)"],
    gradient: "linear-gradient(135deg, hsl(170 70% 50%), hsl(245 80% 67%))",
  },
  {
    title: "Build & DevOps",
    icon: <Wrench size={16} />,
    items: [
      "Nx",
      "Vite",
      "Webpack",
      "Vue CLI",
      "Jenkins CI/CD",
      "Git / SVN",
      "SonarQube",
    ],
    gradient: "linear-gradient(135deg, hsl(245 80% 67%), hsl(170 70% 50%))",
  },
];

const SkillsSection = () => (
  <section id="skills" className="py-16 md:py-20 relative">
    <div
      className="absolute top-1/3 right-0 w-[400px] h-[400px] pointer-events-none"
      style={{
        background:
          "radial-gradient(circle, hsl(170 70% 50% / 0.08), transparent 70%)",
      }}
    />

    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <RevealOnScroll>
        <div className="section-label">Skills</div>
        <h2 className="section-title">
          My <span className="gradient-text">tech stack</span>
        </h2>
        <p className="section-subtitle mb-12">
          Tools and technologies I use to bring ideas to life.
        </p>
      </RevealOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {skills.map((cat, i) => (
          <RevealOnScroll key={cat.title} delay={i * 0.08}>
            <SpotlightCard
              spotlightColor="rgba(255, 255, 255, 0.05)"
              className="h-full rounded-2xl"
            >
              <div className="glass rounded-2xl p-7 h-full bg-background/50 backdrop-blur-xl border border-white/5">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: cat.gradient, color: "white" }}
                  >
                    {cat.icon}
                  </div>
                  <h3 className="font-display text-sm font-semibold">
                    {cat.title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <span
                      key={item}
                      className="px-4 py-2 rounded-full text-xs font-body text-foreground border border-border/50 hover:border-primary/40 transition-all hover:scale-105 cursor-default"
                      style={{ background: "hsl(230 20% 12% / 0.5)" }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  </section>
);

export default SkillsSection;
