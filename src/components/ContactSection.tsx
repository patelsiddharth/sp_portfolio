import { useState, FormEvent } from "react";
import { Mail, Code2, Sparkles } from "lucide-react";
import { WhatsAppIcon, LinkedinIcon, GithubLineIcon } from "@/lib/utils";
import RevealOnScroll from "./RevealOnScroll";

const FORMSPREE_ID = "mjganjdw";

const socials = [
  {
    icon: <Mail size={18} className="text-primary" />,
    label: "siddharthpatel425@gmail.com",
    href: "mailto:siddharthpatel425@gmail.com",
  },
  {
    icon: <WhatsAppIcon className="text-accent" />,
    label: "+91 8982936044",
    href: "https://wa.me/918982936044",
  },
  {
    icon: <LinkedinIcon className="text-secondary" />,
    label: "LinkedIn",
    href: "https://linkedin.com/in/siddharthpatel425",
  },
  {
    icon: <GithubLineIcon className="text-foreground" />,
    label: "GitHub",
    href: "https://github.com/patelsiddharth",
  },
  {
    icon: <Code2 size={18} className="text-primary" />,
    label: "LeetCode",
    href: "https://leetcode.com/u/siddharthpatel",
  },
];

const ContactSection = () => {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: new FormData(e.currentTarget),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else throw new Error();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-16 md:py-20 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center bottom, hsl(245 80% 67% / 0.1), transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <RevealOnScroll>
          <div className="section-label">Contact</div>
          <h2 className="section-title">
            Let's <span className="gradient-text">connect</span>
          </h2>
          <p className="section-subtitle mb-12">
            Open to exciting roles, freelance projects, or a good conversation
            about front-end architecture.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RevealOnScroll>
            <div className="space-y-3">
              {socials.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target={s.href.startsWith("mailto") ? undefined : "_blank"}
                  className="glass glass-hover rounded-xl p-5 flex items-center gap-4 transition-all hover:scale-[1.02] group block"
                >
                  {s.icon}
                  <span className="font-body text-sm text-muted-foreground group-hover:text-foreground transition-colors flex-grow">
                    {s.label}
                  </span>
                  <span className="text-muted-foreground group-hover:text-primary transition-colors">
                    →
                  </span>
                </a>
              ))}
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.12}>
            {status === "success" ? (
              <div className="glass rounded-2xl p-8 text-center">
                <Sparkles size={32} className="text-primary mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold mb-2">
                  Message Sent!
                </h3>
                <p className="font-body text-sm text-muted-foreground">
                  I'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass rounded-2xl p-8 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs text-muted-foreground mb-1.5 block">
                      Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      required
                      placeholder="Your name"
                      className="w-full bg-muted/50 border border-border/50 rounded-lg px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs text-muted-foreground mb-1.5 block">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="your@email.com"
                      className="w-full bg-muted/50 border border-border/50 rounded-lg px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-body text-xs text-muted-foreground mb-1.5 block">
                    Subject
                  </label>
                  <input
                    name="subject"
                    type="text"
                    placeholder="What's this about?"
                    className="w-full bg-muted/50 border border-border/50 rounded-lg px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="font-body text-xs text-muted-foreground mb-1.5 block">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    placeholder="Tell me about the opportunity..."
                    className="w-full bg-muted/50 border border-border/50 rounded-lg px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full py-3.5 rounded-lg text-sm font-medium text-primary-foreground transition-all hover:opacity-90 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  {status === "sending" ? "Sending..." : "Send Message →"}
                </button>
                {status === "error" && (
                  <p className="text-xs text-center text-destructive">
                    Something went wrong. Email me directly.
                  </p>
                )}
              </form>
            )}
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
