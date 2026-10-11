import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Work } from "@/components/sections/Work";
import { About } from "@/components/sections/About";
import { Capabilities } from "@/components/sections/Capabilities";
import { GitHubSection } from "@/components/sections/GitHubSection";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Work />
        <About />
        <Capabilities />
        <GitHubSection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
