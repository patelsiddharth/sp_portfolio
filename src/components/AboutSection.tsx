import { MapPin, GraduationCap, Users, Trophy } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";
import SpotlightCard from "./SpotlightCard";

const info = [
  {
    icon: <MapPin size={18} className="text-primary" />,
    label: "Pune, Maharashtra, India",
  },
  {
    icon: <GraduationCap size={18} className="text-secondary" />,
    label: "B.E. Computer Science — JEC (7.71 CGPA)",
  },
  {
    icon: <Users size={18} className="text-accent" />,
    label: "Team Lead (4 engineers)",
  },
  {
    icon: <Trophy size={18} className="text-primary" />,
    label: "4× Award Winner",
  },
];

const AboutSection = () => (
  <section id="about" className="py-16 md:py-20 relative">
    <div className="max-w-7xl mx-auto px-6">
      <RevealOnScroll>
        <div className="section-label">About</div>
        <h2 className="section-title">
          Building the web,{" "}
          <span className="gradient-text">one pixel at a time</span>
        </h2>
        <p className="section-subtitle mb-12">
          I&apos;m a Senior Front-End Engineer passionate about creating
          performant, scalable applications that delight users.
        </p>
      </RevealOnScroll>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <RevealOnScroll className="lg:col-span-3">
          <SpotlightCard
            className="h-full"
            spotlightColor="rgba(200, 200, 255, 0.1)"
          >
            <div className="glass rounded-2xl p-8 h-full bg-background/50 backdrop-blur-xl border border-white/5">
              <h3 className="font-display text-lg font-semibold mb-4">
                My Story
              </h3>
              <div className="space-y-4 font-body text-sm text-muted-foreground leading-[1.8]">
                <p>
                  With <span className="text-foreground">7+ years</span> in
                  frontend development, I specialize in building
                  high-performance SPAs using{" "}
                  <span className="text-foreground">React and Vue</span>{" "}
                  ecosystems. From monorepo architecture to leading migrations,
                  I bring a systems-thinking approach to every challenge.
                </p>
                <p>
                  At <span className="text-foreground">Dassault Systèmes</span>{" "}
                  and <span className="text-foreground">Vimo Inc.</span>, my
                  work serves 30,000+ active users daily. I&apos;ve achieved 95%
                  test coverage, unified 12+ monorepos with Nx, and mentored the
                  next generation of engineers.
                </p>
                <p>
                  Beyond code, I care deeply about{" "}
                  <span className="text-foreground">developer experience</span>,
                  performance optimization, and building tools that teams
                  actually love using.
                </p>
              </div>
            </div>
          </SpotlightCard>
        </RevealOnScroll>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {info.map((item, i) => (
            <RevealOnScroll key={i} delay={i * 0.08}>
              <SpotlightCard spotlightColor="rgba(200, 255, 200, 0.1)">
                <div className="glass glass-hover rounded-xl p-5 flex items-center gap-4 transition-all hover:scale-[1.02] bg-background/50 backdrop-blur-xl border border-white/5">
                  {item.icon}
                  <span className="font-body text-sm text-foreground">
                    {item.label}
                  </span>
                </div>
              </SpotlightCard>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;
