import Script from "next/script";
import { company } from "@/content/site";
import { Navbar } from "@/components/site/Navbar";
import { CursorGlow } from "@/components/site/CursorGlow";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { Portfolio } from "@/components/site/Portfolio";
import { Process } from "@/components/site/Process";
import { Testimonials } from "@/components/site/Testimonials";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: "https://neuralops.vercel.app",
    email: company.contact.email,
    telephone: company.contact.phone,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      name: company.contact.person,
      email: company.contact.email,
      telephone: company.contact.phone
    }
  };

  return (
    <>
      <Script
        id="neuralops-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CursorGlow />
      <Navbar />
      <main className="relative">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(34,211,238,0.12),transparent_50%),radial-gradient(900px_circle_at_80%_20%,rgba(168,85,247,0.10),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_38%)]" />
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Process />
        <Testimonials />
        <Contact />
        <Footer />
      </main>
    </>
  );
}

