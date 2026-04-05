"use client";

import ScrollyCanvas from "@/components/ScrollyCanvas";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import AwardsSection from "@/components/AwardsSection";
import CurrentlyReading from "@/components/CurrentlyReading";
import Movies from "@/components/Movies";
import Spotify from "@/components/Spotify";
import SocialProof from "@/components/Socialproof";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

import BackToTop from "@/components/BackToTop";

export default function Home() {
  return (
    <div className="bg-background text-foreground min-h-screen w-full">
      <main className="relative">
        <div className="relative z-10 bg-background min-h-screen">
          <ScrollyCanvas />
          <Navbar />
          <HeroSection />
          <AboutSection />
          <ExperienceSection />
          <ProjectsSection />
          <SkillsSection />
          <AwardsSection />
          <CurrentlyReading />
          <Movies />
          <Spotify />
          <SocialProof />
          <ContactSection />
        </div>
        <Footer />
      </main>
      <BackToTop />
      {/* <Footer /> */}
    </div>
  );
}
