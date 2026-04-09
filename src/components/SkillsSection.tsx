import { Monitor, Database, FlaskConical, Wrench } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";
import SpotlightCard from "./SpotlightCard";
import AnimatedSkillTag from "./AnimatedSkillTag";
import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

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
    items: ["Redux Toolkit Query", "Context API", "Pinia", "Vuex"],
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
interface TechItem {
  name: string;
  icon: string;
  invert?: boolean;
}

const rows: TechItem[][] = [
  [
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Vue.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
    { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", invert: true },
    { name: "Tailwind", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  ],
  [
    { name: "Chakra UI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chakraui/chakraui-original.svg" },
    { name: "Nodejs", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "C#", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg" },
    { name: "Redux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" },
    { name: "Chart.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/d3js/d3js-original.svg" },
    { name: "Sass", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg" },
    { name: "Webpack", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg" },
  ],
  [
    { name: "Jest", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg" },
    { name: "Jasmine", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jasmine/jasmine-original.svg" },
    { name: "Karma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/karma/karma-original.svg" },
    { name: "NPM", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original.svg" },
    { name: "Vercel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg", invert: true },
    { name: "Jenkins", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg" },
  ],
  [
    { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    { name: "SVN", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/subversion/subversion-original.svg" },
    { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", invert: true },
    { name: "VS Code", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
    { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
  ],
  [
    { name: "Vitest", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitest/vitest-original.svg" },
    { name: "Nx", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nx/nx-original.svg", invert: true },
    { name: "Vite", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" },
    { name: "Bitbucket", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bitbucket/bitbucket-original.svg" },
  ],
  [
    { name: "SonarQube", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sonarqube/sonarqube-original.svg" },
    { name: "Jira", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg" },
  ],
];

const SkillsSection = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left - rect.width / 2) / rect.width,
      y: (e.clientY - rect.top - rect.height / 2) / rect.height,
    });
  }, []);

  let globalIndex = 0;

  return (
    <section id="skills" className="py-16 md:py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, hsl(var(--primary)), hsl(var(--secondary)), transparent 70%)" }}
        />
        {/* Subtle grid lines like reference */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>
      <div
        className="absolute top-1/3 right-0 w-[400px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, hsl(170 70% 50% / 0.08), transparent 70%)",
        }}
      />

      {/* Title */}
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
      </div>

      {/* Pyramid grid */}
      <div className="relative mx-auto max-w-6xl" ref={containerRef} onMouseMove={handleMouseMove}>
        <div className="flex flex-col items-center gap-4">
          {rows.map((row, rowIndex) => {
            const rowItems = row.map((item) => {
              const idx = globalIndex++;
              return { ...item, idx };
            });

            return (
              <motion.div
                key={rowIndex}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: rowIndex * 0.08 }}
                className="flex flex-wrap justify-center gap-3 md:gap-4"
              >
                {rowItems.map(({ name, icon, invert, idx }) => {
                  const id = `${rowIndex}-${name}`;
                  const isHovered = hoveredId === id;
                  const isDimmed = hoveredId !== null && !isHovered;
                  // Subtle parallax per card
                  const depth = 0.3 + (idx % 5) * 0.12;
                  const px = mousePos.x * 4 * depth;
                  const py = mousePos.y * 3 * depth;

                  return (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.03 }}
                      style={{
                        x: px,
                        y: py,
                        opacity: isDimmed ? 0.35 : 1,
                        transition: "opacity 0.3s ease",
                      }}
                      whileHover={{
                        y: py - 6,
                        scale: 1.08,
                        transition: { duration: 0.2, ease: "easeOut" },
                      }}
                      onMouseEnter={() => setHoveredId(id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className="group relative cursor-default"
                    >
                      {/* Hover glow */}
                      <div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
                        style={{ background: "hsl(var(--primary) / 0.2)" }}
                      />

                      {/* Gradient border on hover */}
                      <div
                        className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                        style={{
                          background: "var(--gradient-primary)",
                          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                          WebkitMaskComposite: "xor",
                          maskComposite: "exclude",
                          padding: "1px",
                          borderRadius: "0.75rem",
                        }}
                      />

                      {/* Card */}
                      <div
                        className="relative flex flex-col items-center justify-center w-[80px] h-[80px] sm:w-[96px] sm:h-[96px] rounded-xl backdrop-blur-md transition-shadow duration-300"
                        style={{
                          background: "hsl(var(--card) / 0.35)",
                          border: "1px solid hsl(var(--border) / 0.4)",
                          boxShadow: isHovered
                            ? "0 8px 30px -6px hsl(var(--primary) / 0.25)"
                            : "0 1px 8px -2px hsl(0 0% 0% / 0.2)",
                        }}
                      >
                        <img
                          src={icon}
                          alt={name}
                          className="w-8 h-8 sm:w-9 sm:h-9 object-contain mb-1.5 drop-shadow-sm transition-transform duration-200 group-hover:scale-110"
                          style={{ filter: invert ? "invert(1)" : undefined }}
                          loading="lazy"
                        />
                        <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300 font-body text-center leading-tight px-1 truncate max-w-full">
                          {name}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
      @keyframes pulse-glow {
        0%, 100% {
          box-shadow: 0 0 10px rgba(100, 100, 255, 0.3);
        }
        50% {
          box-shadow: 0 0 20px rgba(100, 100, 255, 0.6);
        }
      }
      :global(.animate-pulse-glow) {
        animation: pulse-glow 2s ease-in-out infinite;
      }
    `}</style>
    </section>
  )
};

export default SkillsSection;

