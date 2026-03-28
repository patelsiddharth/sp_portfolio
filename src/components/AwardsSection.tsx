import { Award, Medal, Star, Handshake } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";
import AnimatedAwardCard from "./AnimatedAwardCard";

const awards = [
  {
    icon: <Award size={24} className="text-primary" />,
    year: "2024",
    name: "Applause Annual Award",
    org: "Dassault Systèmes",
    desc: "Outstanding contributions towards organizational objectives",
  },
  {
    icon: <Medal size={24} className="text-secondary" />,
    year: "2022",
    name: "Champion Award",
    org: "Dassault Systèmes",
    desc: "Significant contribution & demonstration of core values",
  },
  {
    icon: <Star size={24} className="text-accent" />,
    year: "2021",
    name: "Top Talent FY21",
    org: "Persistent Systems",
    desc: "Annual Performance Rating & Competency Assessment",
  },
  {
    icon: <Handshake size={24} className="text-primary" />,
    year: "2020",
    name: "Bravo Team Award",
    org: "Persistent Systems",
    desc: "Highest number of bug fixes resolved as a team",
  },
];

const AwardsSection = () => (
  <section id="awards" className="py-16 md:py-20">
    <div className="max-w-7xl mx-auto px-6">
      <RevealOnScroll>
        <div className="section-label">Recognition</div>
        <h2 className="section-title">
          Awards & <span className="gradient-text-accent">achievements</span>
        </h2>
      </RevealOnScroll>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        {awards.map((a, i) => (
          <RevealOnScroll key={i} delay={i * 0.08}>
            <AnimatedAwardCard award={a} index={i} />
          </RevealOnScroll>
        ))}
      </div>
    </div>
  </section>
);

export default AwardsSection;