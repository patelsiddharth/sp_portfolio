import { Code2 } from "lucide-react";
import { GithubLineIcon, LinkedinIcon } from "@/lib/utils";

const Footer = () => (
  <footer className="border-t border-border/30 py-8 px-6">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="font-display text-sm font-bold">
        <span className="gradient-text">SP.</span>
        <span className="text-muted-foreground ml-2 font-body text-xs font-normal">© 2026 Siddharth Patel</span>
      </div>
      <div className="flex gap-5">
        {[
          { icon: <GithubLineIcon size={16} />, href: "https://github.com/patelsiddharth" },
          { icon: <LinkedinIcon size={16} />, href: "https://linkedin.com/in/siddharthpatel425" },
          { icon: <Code2 size={16} />, href: "https://leetcode.com/u/siddharthpatel" },
        ].map(l => (
          <a key={l.href} href={l.href} target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
            {l.icon}
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
