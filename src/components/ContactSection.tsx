import { useState, FormEvent } from "react";
import { Sparkles } from "lucide-react";
import { DottedMap } from "./ui/dotted-map";
import RevealOnScroll from "./RevealOnScroll";

const FORMSPREE_ID = "mjganjdw";

const marker = [{ lat: 23.10, lng: 79.59 }];

const WorldMapWithPin = () => (
  <div className="relative w-full mt-8">
    {/* Contact info bar */}
    <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground mb-6">
      <span>siddharthpatel425@gmail.com</span>
      <span className="text-border">•</span>
      <span>+91 8982936044</span>
      <span className="text-border">•</span>
      <span>Jabalpur, Madhya Pradesh, India</span>
    </div>

    {/* SVG dotted world map with floating marker overlay */}
    <DottedMap
      markers={marker}
      mapSamples={6000}
      dotRadius={0.22}
      className="w-full h-auto"
      showFloatingMarker={true}
      floatingMarkerLabel={"I'm here"}
      floatingMarker={marker[0]}
    />
  </div>
);

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
            Let&apos;s <span className="gradient-text">connect</span>
          </h2>
          <p className="section-subtitle mb-12">
            Open to exciting roles, freelance projects, or a good conversation
            about front-end architecture.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RevealOnScroll>
            <WorldMapWithPin />
          </RevealOnScroll>

          <RevealOnScroll delay={0.12}>
            {status === "success" ? (
              <div className="glass rounded-2xl p-8 text-center">
                <Sparkles size={32} className="text-primary mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold mb-2">
                  Message Sent!
                </h3>
                <p className="font-body text-sm text-muted-foreground">
                  I&apos;ll get back to you within 24 hours.
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
