"use client";

import ScrollyCanvas from "@/components/ScrollyCanvas";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
// import ES1 from "@/components/ES1";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import AwardsSection from "@/components/AwardsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

import BackToTop from "@/components/BackToTop";

export default function Home() {
  return (
    <div className="bg-background text-foreground min-h-screen w-full">
      <main>
        <ScrollyCanvas />
        <Navbar />
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        {/* <ES1 /> */}
        <ProjectsSection />
        <SkillsSection />
        <AwardsSection />
        <ContactSection />
      </main>
      <BackToTop />
      <Footer />
    </div>
  );
}
