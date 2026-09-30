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
  location: "Greater Noida, India",
  lookingFor: "Open to software engineering & fintech internships",
  email: "varunsharma42006@gmail.com",
  github: "https://github.com/varun-sharma-2006",
  linkedin: "https://www.linkedin.com/in/varun-sharma-0089321b5",
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
    { group: "Languages", items: ["Python", "C++", "TypeScript", "JavaScript"] },
    { group: "Backend", items: ["FastAPI", "REST APIs", "MongoDB", "Pydantic"] },
    { group: "Frontend", items: ["React", "Vite", "CSS & design systems", "Responsive UI"] },
    { group: "AI & ML", items: ["Machine learning", "Scikit-learn", "Pandas", "NumPy", "Gemini function calling"] },
    { group: "Quant", items: ["Backtesting", "Risk analytics", "Walk-forward testing", "Time-series analysis"] },
    { group: "Engineering", items: ["pytest & Vitest", "GitHub Actions CI", "Vercel", "Docker", "Google OAuth"] },
  ],

  education: [
    {
      title: "B.Tech, Computer Science & Engineering (Artificial Intelligence)",
      place: "Bennett University, Greater Noida",
      period: "Class of 2028",
      details: "Coursework: Data Structures & Algorithms, Artificial Intelligence, Machine Learning, Linear Algebra, OOP",
    },
  ] as TimelineItem[],
  // Internships, hackathons, leadership.
  experience: [
    { title: "Management Lead", place: "Sportikon 3.0", period: "2025" },
    { title: "Peer Mentor", place: "DSA Summit", period: "2025" },
  ] as TimelineItem[],
};

/** The featured case study. */
export const caseStudy = {
  name: "Algo Trade Simulator",
  tagline: "A trading lab that tells you the truth about your strategy.",
  summary:
    "Backtest trading strategies on real market data with fees and slippage, compare every result with buy & hold " +
    "and the S&P 500 on return and risk, check whether tuned settings survive with walk-forward testing, try a " +
    "machine-learning strategy trained only on the past, design your own rules, run backdated paper portfolios, " +
    "and ask an AI copilot that runs all of it for you.",
  links: [
    { label: "Open live demo", href: "https://algo-trade-mu.vercel.app" },
    { label: "View source", href: "https://github.com/varun-sharma-2006/AlgoTrade" },
  ] satisfies Link[],
  heroImage: "/algotrade/portfolio.png",
  role: "Design, backend, frontend and deployment",
  team: [
    { name: "Varun Sharma", href: "https://github.com/varun-sharma-2006" },
    { name: "Yashika Garg", href: "https://github.com/yashikagarg16" },
  ],
  stack: ["Python", "FastAPI", "React", "TypeScript", "MongoDB Atlas", "Google Gemini", "Vercel", "GitHub Actions"],

  stats: [
    { value: 107, suffix: "", label: "Automated tests" },
    { value: 5, suffix: "", label: "Built-in strategies, incl. ML" },
    { value: 7, suffix: "", label: "Risk metrics vs the S&P 500" },
    { value: 15, suffix: " bps", label: "Fees + slippage per trade" },
  ],

  story: [
    {
      kicker: "The problem",
      title: "Most backtests flatter the strategy",
      body:
        "Our first version reported a strategy's return as the stock's buy-and-hold return and used a hard-coded win " +
        "rate. It looked great and meant nothing. Many 'profitable' strategies online make the same mistakes.",
    },
    {
      kicker: "The approach",
      title: "Simulate every trade honestly",
      body:
        "We rebuilt the engine to decide positions at each day's close using only past data, hold them from the next " +
        "day, and charge fees and slippage on every entry and exit. Walk-forward tests tune on one year and trade the " +
        "next quarter, and the ML model is only ever trained on the past.",
    },
    {
      kicker: "The result",
      title: "Numbers you can trust",
      body:
        "Sharpe, Sortino, drawdown and beta against buy & hold and the S&P 500. On AAPL, a tuned SMA strategy looked " +
        "like +24% a year but made +10% on unseen data; the ML model is about as accurate as a coin flip. The app " +
        "shows exactly that.",
    },
  ],

  features: [
    {
      title: "Risk analytics",
      body: "Return, volatility, Sharpe, Sortino, drawdown and Calmar for the strategy, buy & hold and the S&P 500 side by side, with growth and drawdown charts.",
      image: "/algotrade/strategy-lab.png",
      size: "wide",
    },
    {
      title: "Walk-forward testing",
      body: "Tune on each past year, trade the best settings on the next quarter they've never seen, and roll forward. The gap between tuned and out-of-sample returns is curve fitting, made visible.",
      image: "/algotrade/walk-forward.png",
      size: "tall",
    },
    {
      title: "Machine-learning strategy",
      body: "Logistic regression on 8 price features, retrained monthly on past data only, with accuracy vs a baseline, ROC-AUC and feature weights.",
      image: "/algotrade/ml-strategy.png",
      size: "normal",
    },
    {
      title: "Copilot that runs backtests",
      body: "Gemini function calling runs the real backtester, strategy comparisons and walk-forward tests, then explains the numbers.",
      image: "/algotrade/copilot-actions.png",
      size: "normal",
    },
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

  video: { src: "/algotrade/demo.mp4", poster: "/algotrade/demo-poster.png", length: "2 min" },

  gallery: [
    { id: "overview", label: "Overview", title: "Dashboard", caption: "Portfolio stats, watchlist sparklines and recent simulations at a glance.", image: "/algotrade/dashboard.png" },
    { id: "lab", label: "Strategy lab", title: "Risk analytics", caption: "Growth and drawdown charts, and risk vs buy & hold and the S&P 500, fees and slippage included.", image: "/algotrade/strategy-lab.png" },
    { id: "walk-forward", label: "Walk-forward", title: "Walk-forward test", caption: "Tuned vs out-of-sample returns, quarter by quarter, on data the settings never saw.", image: "/algotrade/walk-forward.png" },
    { id: "ml", label: "ML model", title: "Machine-learning strategy", caption: "Out-of-sample accuracy vs an always-up baseline, ROC-AUC and what the model weighs.", image: "/algotrade/ml-strategy.png" },
    { id: "portfolio", label: "Portfolio", title: "Paper portfolio", caption: "Value over time, allocation, and every position's P&L against buy & hold.", image: "/algotrade/portfolio.png" },
    { id: "builder", label: "Builder", title: "Strategy Builder", caption: "Design rules, see them in plain English, backtest on 2 years of data and save.", image: "/algotrade/builder.png" },
    { id: "copilot", label: "Copilot", title: "AI copilot with actions", caption: "Ask it to compare strategies and it runs the backtests, then explains the results.", image: "/algotrade/copilot-actions.png" },
    { id: "markets", label: "Markets", title: "Live markets", caption: "Search any ticker and study its candles across ranges.", image: "/algotrade/live-data.png" },
  ] satisfies Shot[],

  architecture: [
    { layer: "Interface", items: ["React + TypeScript", "Custom design system", "Hand-built SVG charts"] },
    { layer: "API", items: ["FastAPI routers", "Pydantic validation", "Google ID-token checks"] },
    { layer: "Engine", items: ["Backtester & risk metrics", "Walk-forward & ML model", "Rule engine & portfolio"] },
    { layer: "Data & AI", items: ["Yahoo Finance", "MongoDB Atlas", "Gemini function calling"] },
  ],

  engineering: [
    { title: "No look-ahead bias", body: "Signals use only data up to each close; the ML model trains only on labels already known. Tests prove it." },
    { title: "Walk-forward testing", body: "Every quarter re-tunes on the past year and trades unseen data, exposing curve fitting." },
    { title: "Copilot with real actions", body: "Gemini calls the backtester through function calling, with memoised tools and an offline fallback." },
    { title: "Works on serverless", body: "Signed sessions and per-loop database clients survive Vercel's parallel instances." },
    { title: "Lean deployment", body: "Direct market-data calls and an ML model in plain Python keep the server bundle ~5× smaller." },
    { title: "Tested and automated", body: "107 tests across backend and frontend run on every push via GitHub Actions." },
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
