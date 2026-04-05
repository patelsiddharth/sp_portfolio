
"use client";

import { Code2 } from "lucide-react";
import { GithubLineIcon, LinkedinIcon, WhatsAppIcon } from "@/lib/utils";
import { TextHoverEffect } from "./TextHoverEffect";

const Footer = () => (
  <footer className="sticky bottom-0 w-full bg-black border-t border-white/10 flex items-end">
    <div className="flex flex-col w-full h-full max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:justify-items-center md:grid-cols-3 gap-12">
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
              <span className="relative inline-flex gap-2 items-center cursor-pointer text-sm font-body text-foreground/80 group-hover:text-foreground transition-colors">
                <span className="relative after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1.5px] after:bg-white after:transition-all after:duration-300 group-hover:after:w-full after:rounded-full">
                  siddharthpatel425@gmail.com
                </span>
                <svg
                  className="w-4 h-4 text-foreground/80 opacity-0 translate-x-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
          </a>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">
            Open to freelance projects, collaborations, and full-time opportunities.
          </p>
        </div>

        {/* Navigation */}
        <div style={{ minWidth: '150px' }}>
          <h4 className="text-[10px] font-body font-medium tracking-[2px] uppercase text-muted-foreground mb-6">
            Navigation
          </h4>
          <nav className="flex flex-col gap-3">

            {/* Navigation links using array and map for DRY code */}
            {[
              { label: "About", href: "#about" },
              { label: "Experience", href: "#experience" },
              { label: "Projects", href: "#projects" },
              { label: "Skills", href: "#skills" },
              { label: "Awards", href: "#awards" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group flex items-center text-sm font-body text-muted-foreground hover:text-foreground transition-colors w-fit"
              >
                <span className="relative flex items-center mr-2">
                  <span className="block w-6 h-px bg-gray-400 group-hover:w-8 group-hover:bg-white transition-all duration-300"></span>
                  <span className="block w-0 h-0 border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent border-l-white opacity-0 group-hover:opacity-100 transition-all duration-300 ml-[-2px]"></span>
                </span>
                {item.label}
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
              { icon: <WhatsAppIcon size={20} />, href: "https://wa.me/918982936044" },
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
      <div className="relative select-none flex-1 py-8 md:py-0">
        <TextHoverEffect
          text="SIDDHARTH" 
          duration={0.5}
          size="text-3xl" 
          // fontFamily="Scoreboard"
          // fontFamily="Dewata"
          // fontFamily="Botanic"
          // fontFamily="Finger Print"
          fontFamily="Trio Regular"
          // fontFamily="Trio Bold"
          // fontFamily="Bebas Neue"
          // fontFamily="Bebas Neue Fallback"
        />
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
