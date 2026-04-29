export const company = {
  name: "NeuralOps",
  headline: "Engineering Intelligent Digital Experiences",
  subheadline: "Web. Mobile. AI. Built for the future.",
  contact: {
    person: "Tsietsi Ramosedi",
    email: "tsietsiramosedi6@gmail.com",
    phone: "0674159694"
  }
} as const;

export const navItems = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" }
] as const;

export const services = [
  {
    title: "Web Development",
    description:
      "High-performance websites and web apps with modern architectures, smooth UX, and production-grade engineering.",
    accent: "from-cyan-400/20 to-blue-600/10",
    bullets: ["Next.js & modern stacks", "Performance + SEO", "Design systems"]
  },
  {
    title: "Mobile App Development",
    description:
      "App experiences that feel native, ship fast, and scale cleanly—built with crisp UI and reliable APIs.",
    accent: "from-fuchsia-400/20 to-purple-600/10",
    bullets: ["iOS + Android delivery", "Offline-first patterns", "Secure auth flows"]
  },
  {
    title: "AI & Automation Systems",
    description:
      "Workflow automation, intelligent assistants, and AI-driven tools designed for real business outcomes.",
    accent: "from-blue-400/20 to-cyan-600/10",
    bullets: ["AI integration-ready", "Automation pipelines", "Observability built-in"]
  },
  {
    title: "UI/UX Design",
    description:
      "Futuristic, minimal interfaces with micro-interactions, accessibility, and an Apple-level polish.",
    accent: "from-purple-400/20 to-cyan-600/10",
    bullets: ["Wireframes → high-fidelity", "Motion design", "Accessible by default"]
  }
] as const;

export const projects = [
  {
    title: "Aurora Commerce",
    tag: "Web Platform",
    description:
      "A conversion-focused storefront with cinematic motion, personalized collections, and lightning-fast performance.",
    tech: ["Next.js", "Tailwind", "Framer Motion", "Edge caching"]
  },
  {
    title: "PulseOps Mobile",
    tag: "Mobile App",
    description:
      "A clean, data-dense mobile dashboard for tracking operations, KPIs, and alerts with offline resilience.",
    tech: ["App UI kit", "Secure auth", "Realtime updates"]
  },
  {
    title: "NeuralFlow Automations",
    tag: "AI / Automation",
    description:
      "Automation workflows that route data, generate reports, and trigger actions—reducing manual effort dramatically.",
    tech: ["Workflow engine", "Event-driven", "Observability"]
  },
  {
    title: "Helix Design System",
    tag: "UI/UX",
    description:
      "A reusable component system with consistent tokens, motion principles, and accessibility baked in.",
    tech: ["Design tokens", "Components", "Documentation"]
  }
] as const;

export const processSteps = [
  {
    title: "Consultation",
    description:
      "We align on objectives, users, constraints, and success metrics—then map the fastest route to impact."
  },
  {
    title: "Design",
    description:
      "We craft a futuristic visual system, information architecture, and interaction model with clear prototypes."
  },
  {
    title: "Development",
    description:
      "We build with modular components, tested integrations, and performance-first engineering."
  },
  {
    title: "Deployment",
    description:
      "We ship on Vercel with SEO, analytics hooks, and a maintainable foundation for iteration."
  }
] as const;

export const testimonials = [
  {
    quote:
      "NeuralOps delivered a premium experience—fast, futuristic, and incredibly smooth across devices.",
    name: "Product Lead",
    company: "Confidential Client"
  },
  {
    quote:
      "They think like engineers and designers. The micro-interactions and performance are truly top-tier.",
    name: "Founder",
    company: "Startup Studio"
  },
  {
    quote:
      "Our workflow automation saved hours per week. Clean delivery, great communication, and reliable execution.",
    name: "Operations Manager",
    company: "IT Services"
  }
] as const;

