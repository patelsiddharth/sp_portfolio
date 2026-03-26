"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MagneticButton from "./MagneticButton";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#awards", label: "Awards" },
  { href: "#contact", label: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [showName, setShowName] = useState(false);

  // Simple scroll latch — once past 60% of viewport, name shows permanently
  useEffect(() => {
    const threshold = () => window.innerHeight * 0.6;

    if (window.scrollY > threshold()) {
      setShowName(true);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > threshold()) {
        setShowName(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Section highlighting
  useEffect(() => {
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`);
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    });

    links.forEach(l => {
      const el = document.querySelector(l.href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header
        id="main-navbar"
        className="sticky top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-white/10 shadow-lg"
      >
        <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <a href="#hero" className="font-display text-2xl font-bold tracking-tighter min-w-[200px]">
            <AnimatePresence mode="wait">
              {showName ? (
                <motion.span
                  id="navbar-logo-text"
                  key="name-on"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="inline-block"
                >
                  <span className="text-white">Siddharth </span>
                  <span className="gradient-text">Patel.</span>
                </motion.span>
              ) : (
                <span id="navbar-logo-text-off" key="name-off" className="inline-block opacity-0 select-none" aria-hidden>
                  Siddharth Patel.
                </span>
              )}
            </AnimatePresence>
          </a>

          <ul className="hidden md:flex gap-2">
            {links.map(l => (
              <li key={l.href} className="relative px-4 py-2">
                <a
                  href={l.href}
                  className={`relative z-10 font-body text-sm transition-colors duration-300 ${activeSection === l.href
                    ? "text-white font-medium"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {l.label}
                </a>
                {activeSection === l.href && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-white/10 rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </li>
            ))}
          </ul>

          <MagneticButton
            href="#contact"
            className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium text-white transition-all hover:scale-105 hover:shadow-[0_0_20px_-5px_hsl(245_80%_67%)] border border-white/10"
            style={{ background: "var(--gradient-primary)" }}
          >
            Let&apos;s Talk
          </MagneticButton>

          <button
            className="md:hidden relative w-7 h-5 z-[102]"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
          >
            <span className={`block absolute h-0.5 w-full bg-foreground rounded transition-all duration-300 ${open ? "top-[9px] rotate-45" : "top-0"}`} />
            <span className={`block absolute h-0.5 w-full bg-foreground rounded transition-all duration-300 top-[9px] ${open ? "opacity-0" : ""}`} />
            <span className={`block absolute h-0.5 w-full bg-foreground rounded transition-all duration-300 ${open ? "top-[9px] -rotate-45" : "top-[18px]"}`} />
          </button>
        </nav>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[101] flex items-center justify-center transition-all duration-500 ease-out ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        style={{ background: "hsl(230 25% 7% / 0.98)", backdropFilter: "blur(20px)" }}
      >
        <ul className="flex flex-col gap-8 text-center w-full px-6">
          {links.map((l, i) => (
            <motion.li
              key={l.href}
              initial={{ opacity: 0, y: 20 }}
              animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display text-4xl font-bold text-gray-400 hover:text-white transition-colors"
              >
                {l.label}
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
