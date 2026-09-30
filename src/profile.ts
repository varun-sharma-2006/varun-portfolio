/**
 * Everything on the site comes from this file. Edit it, save, and the page updates.
 * Leave a field empty ("" or []) to hide it. Never put anything here you don't want public.
 */

export interface Link {
  label: string;
  href: string;
}

export interface Project {
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  tech: string[];
  links: Link[];
  image?: string; // a file in public/projects
  note?: string; // e.g. team credits
}

export interface TimelineItem {
  title: string;
  place: string;
  period: string;
  details?: string;
}

export const profile = {
  name: "Varun Sharma",
  role: "Full-stack developer",
  headline: "I build products end to end: backends, interfaces, tests and deployment.",
  intro:
    "I like turning messy real-world problems into software people can actually use, from an honest trading " +
    "backtester to an AI agent that recovers lost payment revenue.",
  // TODO: add your city, e.g. "Delhi, India"
  location: "",
  lookingFor: "Open to software engineering and fintech internships",
  email: "varunsharma42006@gmail.com",
  github: "https://github.com/varun-sharma-2006",
  // TODO: paste your LinkedIn profile URL, e.g. "https://www.linkedin.com/in/your-name"
  linkedin: "",
  // TODO: put your resume at public/resume.pdf and set this to "/resume.pdf"
  resume: "",

  about: [
    "I'm a developer who enjoys the whole journey of a product: designing the data model, writing the API, " +
      "building a polished interface, and shipping it with tests and CI.",
    "My current focus is fintech and applied AI. I care about software that is honest about its results, " +
      "for example comparing every trading strategy against simply buying and holding.",
  ],

  skills: [
    { group: "Languages", items: ["Python", "TypeScript", "JavaScript"] },
    { group: "Backend", items: ["FastAPI", "REST APIs", "MongoDB", "Node.js", "NestJS"] },
    { group: "Frontend", items: ["React", "Vite", "HTML & CSS", "Responsive design"] },
    { group: "AI & data", items: ["Google Gemini API", "PyTorch", "Quantitative backtesting"] },
    { group: "Engineering", items: ["Git & GitHub Actions", "pytest", "Vitest", "Docker", "Vercel", "OAuth / Google Sign-In"] },
  ],

  projects: [
    {
      name: "Algo Trade Simulator",
      tagline: "Honest backtesting and paper trading on real market data",
      description:
        "A full-stack trading lab. Backtest built-in or self-designed strategies on two years of real prices with " +
        "fees and no look-ahead bias, run backdated paper portfolios, and ask an AI copilot about any stock.",
      highlights: [
        "Strategy Builder: combine SMA, EMA and RSI rules with stop-loss and take-profit",
        "Portfolio that replays every simulation on real prices and compares it with buy & hold",
        "Gemini copilot with a rule-based fallback when the API is rate-limited",
        "Sign in with Google verified on the server, admin visitor dashboard",
        "80+ automated tests, CI on GitHub Actions, deployed on Vercel with MongoDB Atlas",
      ],
      tech: ["Python", "FastAPI", "React", "TypeScript", "MongoDB", "Vercel"],
      links: [
        { label: "Live demo", href: "https://algo-trade-mu.vercel.app" },
        { label: "Code", href: "https://github.com/varun-sharma-2006/AlgoTrade" },
      ],
      image: "/projects/portfolio.png",
    },
    {
      name: "RazorGrowth",
      tagline: "AI merchant-growth agent for the Razorpay AI Buildathon 2026",
      description:
        "A permissioned AI agent that finds recoverable failed-payment revenue for merchants, checks every action " +
        "against a deterministic policy engine, and only executes after explicit human approval.",
      highlights: [
        "Policy engine enforces merchant budget and safety caps before any action",
        "Human-in-the-loop approval and idempotent Razorpay execution",
        "Complete visual audit timeline of every decision",
      ],
      tech: ["Python", "AI agents", "Razorpay API"],
      links: [{ label: "Code", href: "https://github.com/varun-sharma-2006/Razorgrowth" }],
      note: "Built with Yashika Garg",
    },
    {
      name: "AgriGuard",
      tagline: "Multi-modal crop disease detection",
      description:
        "A deep-learning system for early crop disease detection that combines satellite imagery with weather data.",
      highlights: ["Multi-modal model on imagery and weather signals", "Containerised with Docker, experiments tracked in MLflow"],
      tech: ["Python", "PyTorch", "Docker", "MLflow"],
      links: [{ label: "Code", href: "https://github.com/varun-sharma-2006/Agriguard" }],
    },
    {
      name: "Vedave",
      tagline: "Luxury fashion rental, buy & sell marketplace",
      description:
        "A marketplace for renting premium outfits for one-off occasions or buying and selling pre-owned luxury fashion.",
      highlights: ["Marketplace for rentals and resale", "Separate NestJS backend service"],
      tech: ["TypeScript", "NestJS"],
      links: [
        { label: "Code", href: "https://github.com/varun-sharma-2006/Vedave" },
        { label: "Backend", href: "https://github.com/varun-sharma-2006/Vedave-Backend-" },
      ],
    },
  ] satisfies Project[],

  // TODO: add your education, e.g.
  // { title: "B.Tech, Computer Science", place: "Your University", period: "2023 – 2027", details: "CGPA 8.9" }
  education: [] as TimelineItem[],

  // Optional: internships, hackathons, leadership. Example:
  // { title: "Participant", place: "Razorpay AI Buildathon", period: "2026", details: "Built RazorGrowth" }
  experience: [] as TimelineItem[],
};
