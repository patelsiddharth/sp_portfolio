import { Code2 } from "lucide-react";
import { GithubLineIcon, LinkedinIcon } from "@/lib/utils";

const Footer = () => (
  <footer className="relative pt-24 pb-12 px-6 overflow-hidden bg-background">
    {/* Main Footer Content */}
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
        {/* Get in Touch */}
        <div>
          <h4 className="text-[10px] font-body font-medium tracking-[2px] uppercase text-muted-foreground mb-6">
            Get in Touch
          </h4>
          <a 
            href="mailto:siddharthpatel425@gmail.com" 
            className="group flex items-center gap-3 mb-4"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden transition-colors group-hover:border-white/20">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
            </div>
            <span className="text-sm font-body text-foreground/80 group-hover:text-foreground transition-colors">
              siddharthpatel425@gmail.com
            </span>
          </a>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-[240px]">
            Open to freelance projects, collaborations, and full-time opportunities.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-[10px] font-body font-medium tracking-[2px] uppercase text-muted-foreground mb-6">
            Navigation
          </h4>
          <nav className="flex flex-col gap-3">
            {["Home", "About", "Work", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors w-fit"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

        {/* Connect */}
        <div>
          <h4 className="text-[10px] font-body font-medium tracking-[2px] uppercase text-muted-foreground mb-6">
            Connect
          </h4>
          <div className="flex gap-4">
            {[
              { icon: <GithubLineIcon size={20} />, href: "https://github.com/patelsiddharth" },
              { icon: <LinkedinIcon size={20} />, href: "https://linkedin.com/in/siddharthpatel425" },
              { icon: <Code2 size={20} />, href: "https://leetcode.com/u/siddharthpatel" },
            ].map((l, i) => (
              <a
                key={i}
                href={l.href}
                target="_blank"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
              >
                {l.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Large Name Text */}
      <div className="relative mb-12 select-none">
        <div
          className="font-display font-bold text-transparent text-center leading-none tracking-tighter"
          style={{
            fontSize: "clamp(60px, 15vw, 200px)",
            WebkitTextStroke: "1px rgba(255, 255, 255, 0.1)",
            opacity: 0.8,
          }}
        >
          SIDDHARTH
          <span className="text-[20px] align-top ml-2 opacity-30 font-display">TM</span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] font-body text-muted-foreground tracking-wider">
          2026 — All rights reserved
        </p>
        <div className="flex gap-6">
          <p className="text-[10px] font-body text-muted-foreground/50">
            Designed & Developed by Siddharth
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
