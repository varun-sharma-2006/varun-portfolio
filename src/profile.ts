/**
 * Everything on the site comes from this file. Edit it, save, and the page updates.
 * Leave a field empty ("" or []) to hide it. Never put anything here you don't want public.
 */

export interface Link {
  label: string;
  href: string;
}

export interface TimelineItem {
  title: string;
  place: string;
  period: string;
  details?: string;
}

export interface Shot {
  id: string;
  label: string;
  title: string;
  caption: string;
  image: string; // a file in public/
}

export const profile = {
  name: "Varun Sharma",
  role: "Full-stack developer",
  // TODO: add your city, e.g. "Delhi, India"
  location: "",
  lookingFor: "Open to software engineering & fintech internships",
  email: "varunsharma42006@gmail.com",
  github: "https://github.com/varun-sharma-2006",
  // TODO: paste your LinkedIn profile URL, e.g. "https://www.linkedin.com/in/your-name"
  linkedin: "",
  // TODO: put your resume at public/resume.pdf and set this to "/resume.pdf"
  resume: "",

  headline: "I build products that ship, end to end.",
  intro:
    "Full-stack developer working across Python, FastAPI, React and TypeScript. I design the data model, build the " +
    "API, craft the interface, and ship it with tests, CI and a live deployment.",

  about: [
    "I enjoy the whole life of a product: turning a vague idea into a data model, an API, an interface people like " +
      "using, and a deployment that stays up.",
    "Right now I'm most interested in fintech and applied AI, and in software that is honest about its results.",
  ],

  skills: [
    { group: "Languages", items: ["Python", "TypeScript", "JavaScript"] },
    { group: "Backend", items: ["FastAPI", "REST APIs", "MongoDB", "Pydantic"] },
    { group: "Frontend", items: ["React", "Vite", "CSS & design systems", "Responsive UI"] },
    { group: "AI & quant", items: ["Google Gemini API", "Backtesting", "Technical indicators"] },
    { group: "Engineering", items: ["pytest & Vitest", "GitHub Actions CI", "Vercel", "Docker", "Google OAuth"] },
  ],

  // TODO: add your education, e.g.
  // { title: "B.Tech, Computer Science", place: "Your University", period: "2023 – 2027", details: "CGPA 8.9" }
  education: [] as TimelineItem[],
  // Optional: internships, hackathons, leadership.
  experience: [] as TimelineItem[],
};

/** The featured case study. */
export const caseStudy = {
  name: "Algo Trade Simulator",
  tagline: "A trading lab that tells you the truth about your strategy.",
  summary:
    "Backtest trading strategies on two years of real market data, design your own rules, run backdated paper " +
    "portfolios, and ask an AI copilot about any stock. Every result is shown next to simply buying and holding.",
  links: [
    { label: "Open live demo", href: "https://algo-trade-mu.vercel.app" },
    { label: "View source", href: "https://github.com/varun-sharma-2006/AlgoTrade" },
  ] satisfies Link[],
  heroImage: "/algotrade/portfolio.png",
  role: "Solo · design, backend, frontend, deployment",
  stack: ["Python", "FastAPI", "React", "TypeScript", "MongoDB Atlas", "Google Gemini", "Vercel", "GitHub Actions"],

  stats: [
    { value: 86, suffix: "", label: "Automated tests" },
    { value: 4, suffix: "", label: "Built-in strategies + your own" },
    { value: 2, suffix: " yrs", label: "Real daily market data" },
    { value: 10, suffix: " bps", label: "Fee on every trade" },
  ],

  story: [
    {
      kicker: "The problem",
      title: "Most backtests flatter the strategy",
      body:
        "My first version reported a strategy's return as the stock's buy-and-hold return and used a hard-coded win " +
        "rate. It looked great and meant nothing. Many 'profitable' strategies online make the same mistakes.",
    },
    {
      kicker: "The approach",
      title: "Simulate every trade honestly",
      body:
        "I rebuilt the engine to decide positions at each day's close using only past data, hold them from the next " +
        "day, charge a fee on every entry and exit, and always report the result next to buy & hold.",
    },
    {
      kicker: "The result",
      title: "Numbers you can trust",
      body:
        "Real Sharpe ratio, drawdown, win rate, time in market and a full trade log. Often the honest answer is that " +
        "the strategy lost to buy & hold, and the app shows exactly by how much.",
    },
  ],

  features: [
    {
      title: "Strategy Builder",
      body: "Combine price, SMA, EMA and RSI rules with crossovers, stop-loss and take-profit. Read it back in plain English, backtest, save.",
      image: "/algotrade/builder.png",
      size: "wide",
    },
    {
      title: "Paper portfolio",
      body: "Backdate simulations up to a year. Each is replayed on real prices with its strategy's rules to show live P&L.",
      image: "/algotrade/portfolio.png",
      size: "tall",
    },
    {
      title: "AI trading copilot",
      body: "Gemini answers with live market data; a rule-based analyst takes over when the API is rate-limited.",
      image: "/algotrade/chatbot.png",
      size: "normal",
    },
    {
      title: "Live markets",
      body: "Quotes and candlestick charts for any stock, index or crypto.",
      image: "/algotrade/live-data.png",
      size: "normal",
    },
    {
      title: "Sign in with Google",
      body: "Tokens verified on the server, private workspaces, and an admin dashboard of visitors.",
      image: "/algotrade/login.png",
      size: "wide",
    },
  ],

  gallery: [
    { id: "overview", label: "Overview", title: "Dashboard", caption: "Portfolio stats, watchlist sparklines and recent simulations at a glance.", image: "/algotrade/dashboard.png" },
    { id: "portfolio", label: "Portfolio", title: "Paper portfolio", caption: "Value over time, allocation, and every position's P&L against buy & hold.", image: "/algotrade/portfolio.png" },
    { id: "builder", label: "Builder", title: "Strategy Builder", caption: "Design rules, see them in plain English, backtest on 2 years of data and save.", image: "/algotrade/builder.png" },
    { id: "lab", label: "Strategy lab", title: "Backtest results", caption: "Equity curve, Sharpe, drawdown, win rate and a trade log for built-in strategies.", image: "/algotrade/strategy-lab.png" },
    { id: "copilot", label: "Copilot", title: "AI trading copilot", caption: "Ranks stocks by trend, momentum and RSI and explains why, with live numbers.", image: "/algotrade/chatbot.png" },
    { id: "markets", label: "Markets", title: "Live markets", caption: "Search any ticker and study its candles across ranges.", image: "/algotrade/live-data.png" },
  ] satisfies Shot[],

  architecture: [
    { layer: "Interface", items: ["React + TypeScript", "Custom design system", "Vitest"] },
    { layer: "API", items: ["FastAPI routers", "Pydantic validation", "Google ID-token checks"] },
    { layer: "Engine", items: ["Backtester", "Rule engine", "Portfolio valuer"] },
    { layer: "Data & AI", items: ["Yahoo Finance", "MongoDB Atlas", "Google Gemini"] },
  ],

  engineering: [
    { title: "No look-ahead bias", body: "Signals use only data up to each close; positions take effect the next day." },
    { title: "Works on serverless", body: "Signed sessions and per-loop database clients survive Vercel's parallel instances." },
    { title: "Graceful AI fallback", body: "Tries several Gemini models, then answers from a built-in analyst instead of erroring." },
    { title: "Secure sign-in", body: "Google tokens are verified server-side for signature, audience and a verified email." },
    { title: "Lean deployment", body: "Replaced a heavy data library with direct API calls, shrinking the server bundle ~5×." },
    { title: "Tested and automated", body: "86 tests across backend and frontend run on every push via GitHub Actions." },
  ],
};

/**
 * Other GitHub projects, hidden until they get their own case study.
 * Set `show: true` on a project to list it in the "More work" section.
 */
export const otherProjects = [
  { name: "RazorGrowth", tagline: "AI merchant-growth agent (Razorpay AI Buildathon 2026)", href: "https://github.com/varun-sharma-2006/Razorgrowth", show: false },
  { name: "AgriGuard", tagline: "Multi-modal crop disease detection", href: "https://github.com/varun-sharma-2006/Agriguard", show: false },
  { name: "Vedave", tagline: "Luxury fashion rental, buy & sell marketplace", href: "https://github.com/varun-sharma-2006/Vedave", show: false },
];
