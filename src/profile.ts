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
  tags?: string[];
}

export interface Certification {
  name: string;
  issuer: string; // who awarded it; "" if unknown
  platform: "Coursera" | "HackerRank";
  kind: "Skill test" | "Course";
  href: string;
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
  graduation: "2028",
  lookingFor: "Open to Summer 2027 internships",
  interests: "Software engineering · Applied AI · Fintech",
  email: "varunsharma42006@gmail.com",
  github: "https://github.com/varun-sharma-2006",
  linkedin: "https://www.linkedin.com/in/varunsh0040",
  resume: "/resume.pdf",

  headline: "I build products that ship, end to end.",
  intro:
    "I'm a Computer Science (AI) student at Bennett University, graduating in 2028. I work across Python, FastAPI, " +
    "React and TypeScript: I design the data model, build the API, craft the interface, and ship it with tests, CI " +
    "and a live deployment.",

  about: [
    "I enjoy the whole life of a product: turning a vague idea into a data model, an API, an interface people like " +
      "using, and a deployment that stays up.",
    "Right now I'm most interested in fintech and applied AI, and in software that is honest about its results. " +
      "Each project below is live, tested and measured, including the numbers that didn't flatter it.",
  ],

  // "Now": what I'm up to lately. Change nowUpdated whenever you edit the list.
  nowUpdated: "October 2026",
  now: [
    { label: "Latest ship", text: "BidPulse, a real-time British-auction RFQ platform (Oct 2026)" },
    { label: "Exploring", text: "AI agents with deterministic guardrails and honest evaluation" },
    { label: "Looking for", text: "Summer 2027 internships in software engineering, applied AI or fintech" },
  ],

  values: [
    { title: "End-to-end ownership", body: "From the schema and API to the interface, CI and deployment. I like owning the whole thing." },
    { title: "Honest results", body: "Out-of-sample tests, baselines and ablations, so the numbers mean something." },
    { title: "AI with guardrails", body: "LLMs do what they're good at; deterministic code and people make the decisions that matter." },
  ],

  skills: [
    { group: "Languages", items: ["Python", "C++", "TypeScript", "JavaScript"] },
    { group: "Backend", items: ["FastAPI", "REST APIs & WebSockets", "PostgreSQL", "MongoDB", "Redis & Celery", "SQLAlchemy & Alembic", "Pydantic"] },
    { group: "Frontend", items: ["React", "Vite", "Tailwind CSS", "CSS & design systems", "Responsive UI"] },
    { group: "AI & ML", items: ["Machine learning", "Scikit-learn", "Pandas", "NumPy", "Gemini function calling", "AI agents with guardrails"] },
    { group: "Quant", items: ["Backtesting", "Risk analytics", "Walk-forward testing", "Time-series analysis"] },
    { group: "Engineering", items: ["pytest, Vitest & Playwright", "GitHub Actions CI", "Docker & nginx", "Vercel", "Google OAuth & JWT"] },
  ],

  education: [
    {
      title: "B.Tech, Computer Science & Engineering (Artificial Intelligence)",
      place: "Bennett University, Greater Noida",
      period: "2024 – 2028",
      details: "Expected graduation: 2028",
      tags: ["Data Structures & Algorithms", "Artificial Intelligence", "Machine Learning", "Linear Algebra", "OOP"],
    },
  ] as TimelineItem[],
  // Shown under Education. Skill tests first, then courses.
  certifications: [
    { name: "Problem Solving (Intermediate)", issuer: "HackerRank", platform: "HackerRank", kind: "Skill test", href: "https://www.hackerrank.com/certificates/937d4f6b16a3" },
    { name: "Problem Solving (Basic)", issuer: "HackerRank", platform: "HackerRank", kind: "Skill test", href: "https://www.hackerrank.com/certificates/50ee019d859a" },
    { name: "Automata and Computability", issuer: "BITS Pilani", platform: "Coursera", kind: "Course", href: "https://coursera.org/share/545e503afbe36b16506c8451971eb92d" },
    { name: "The Bits and Bytes of Computer Networking", issuer: "Google", platform: "Coursera", kind: "Course", href: "https://coursera.org/share/a4360c146971895aa3fc9300c70d40f3" },
    { name: "Operating Systems and You: Becoming a Power User", issuer: "Google", platform: "Coursera", kind: "Course", href: "https://coursera.org/share/53c895e106b67a3b400cecd500486952" },
    { name: "Introduction to Microprocessors", issuer: "Arm", platform: "Coursera", kind: "Course", href: "https://coursera.org/share/0e744aedc28f50f72b6bbdb6d81e7a79" },
    { name: "Entrepreneurship Strategy: From Ideation to Exit", issuer: "HEC Paris", platform: "Coursera", kind: "Course", href: "https://coursera.org/share/06f7a0a170b8747bcb2f34782e71b227" },
    { name: "Ethics for Engineers: Patents, Copyrights & IPR", issuer: "", platform: "Coursera", kind: "Course", href: "https://coursera.org/share/a148fbddac18a3bffcb34b52146dd188" },
  ] as Certification[],
  // Internships, hackathons, leadership. Newest first.
  experience: [
    {
      title: "Solo participant",
      place: "Razorpay AI Buildathon 2026",
      period: "2026",
      details: "Built RazorGrowth on my own: a permissioned AI agent that recovers failed payments.",
    },
    { title: "Management Lead", place: "Sportikon 3.0", period: "2025" },
  ] as TimelineItem[],
};

/** Shape shared by every project case study. */
export interface FeaturedProjectData {
  id: string; // anchor on the page
  name: string;
  category: string;
  tagline: string;
  highlight: string; // one key result, shown on the project card
  summary: string;
  event?: string;
  cover: string; // card image in the projects overview
  links: Link[];
  role: string;
  team: { name: string; href: string }[];
  stack: string[];
  stats: { value: number; suffix: string; label: string }[];
  story: { kicker: string; title: string; body: string }[];
  video?: { src: string; poster: string; length: string };
  gallery: Shot[];
  engineering: { icon: number; title: string; body: string }[];
}

export const algoTrade: FeaturedProjectData = {
  id: "algo-trade",
  name: "Algo Trade Simulator",
  category: "Fintech",
  tagline: "A trading lab that tells you the truth about your strategy.",
  highlight: "A tuned strategy that looked like +24% a year made +11% on unseen data, and the app says so.",
  summary:
    "Backtest trading strategies on real market data with fees and slippage, compare every result with buy & hold " +
    "and the S&P 500 on return and risk, check whether tuned settings survive with walk-forward testing, try a " +
    "machine-learning strategy trained only on the past, design your own rules, run backdated paper portfolios, " +
    "and ask an AI copilot that runs all of it for you.",
  cover: "/algotrade/dashboard.webp",
  links: [
    { label: "Open live demo", href: "https://algo-trade-mu.vercel.app" },
    { label: "View source", href: "https://github.com/varun-sharma-2006/AlgoTrade" },
  ],
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
        "like +24% a year but made +11% on unseen data; the ML model is about as accurate as a coin flip. The app " +
        "shows exactly that.",
    },
  ],

  video: { src: "/algotrade/demo.mp4", poster: "/algotrade/demo-poster.webp", length: "2 min" },

  gallery: [
    { id: "overview", label: "Overview", title: "Dashboard", caption: "Portfolio stats, watchlist sparklines and recent simulations at a glance.", image: "/algotrade/dashboard.webp" },
    { id: "lab", label: "Strategy lab", title: "Risk analytics", caption: "Growth and drawdown charts, and risk vs buy & hold and the S&P 500, fees and slippage included.", image: "/algotrade/strategy-lab.webp" },
    { id: "walk-forward", label: "Walk-forward", title: "Walk-forward test", caption: "Tuned vs out-of-sample returns, quarter by quarter, on data the settings never saw.", image: "/algotrade/walk-forward.webp" },
    { id: "ml", label: "ML model", title: "Machine-learning strategy", caption: "Out-of-sample accuracy vs an always-up baseline, ROC-AUC and what the model weighs.", image: "/algotrade/ml-strategy.webp" },
    { id: "portfolio", label: "Portfolio", title: "Paper portfolio", caption: "Value over time, allocation, and every position's P&L against buy & hold.", image: "/algotrade/portfolio.webp" },
    { id: "builder", label: "Builder", title: "Strategy Builder", caption: "Design rules, see them in plain English, backtest on 2 years of data and save.", image: "/algotrade/builder.webp" },
    { id: "copilot", label: "Copilot", title: "AI copilot with actions", caption: "Ask it to compare strategies and it runs the backtests, then explains the results.", image: "/algotrade/copilot-actions.webp" },
    { id: "markets", label: "Markets", title: "Live markets", caption: "Search any ticker and study its candles across ranges.", image: "/algotrade/live-data.webp" },
  ],

  engineering: [
    { icon: 0, title: "No look-ahead bias", body: "Signals use only data up to each close; the ML model trains only on labels already known. Tests prove it." },
    { icon: 3, title: "Walk-forward testing", body: "Every quarter re-tunes on the past year and trades unseen data, exposing curve fitting." },
    { icon: 2, title: "Copilot with real actions", body: "Gemini calls the backtester through function calling, with memoised tools and an offline fallback." },
    { icon: 1, title: "Works on serverless", body: "Signed sessions and per-loop database clients survive Vercel's parallel instances." },
    { icon: 4, title: "Lean deployment", body: "Direct market-data calls and an ML model in plain Python keep the server bundle ~5× smaller." },
    { icon: 5, title: "Tested and automated", body: "107 tests across backend and frontend run on every push via GitHub Actions." },
  ],
};

/** Freight Invoice Auditor. Numbers come from the project's eval harness (fresh held-out test split). */
export const freightAudit: FeaturedProjectData = {
  id: "freight-audit",
  name: "Freight Invoice Auditor",
  category: "Applied AI",
  tagline: "An AI auditor that catches carrier overcharges, and proves every claim before a person sends it.",
  highlight: "100% precision on unseen invoices, vs 51.9% when the LLM judges on its own.",
  summary:
    "Carriers bill shippers with invoices full of line items, and they often don't match the contract. This agent " +
    "reads a carrier's invoice PDF, checks every line against the contracted rate sheet, flags overcharges with the " +
    "exact contract clause and invoice line as evidence, and drafts a dispute that a signed-in reviewer must approve " +
    "before anything is sent.",
  cover: "/freight/dashboard.webp",
  links: [
    { label: "Open live demo", href: "https://freight-invoice-auditing-agent.vercel.app" },
    { label: "View source", href: "https://github.com/varun-sharma-2006/Freight-Invoice-Auditing-Agent" },
  ],
  role: "Design, extraction, rule engine, evaluation harness, interface and deployment",
  team: [{ name: "Varun Sharma", href: "https://github.com/varun-sharma-2006" }],
  stack: ["Python", "FastAPI", "Pydantic", "SQLAlchemy", "Gemini API", "pdfplumber", "React", "TypeScript", "Tailwind CSS", "Vercel", "GitHub Actions"],

  stats: [
    { value: 100, suffix: "", label: "Automated tests" },
    { value: 8, suffix: "", label: "Overcharge types caught" },
    { value: 100, suffix: "%", label: "Precision on unseen invoices" },
    { value: 0, suffix: "", label: "Emails sent without approval" },
  ],

  story: [
    {
      kicker: "The problem",
      title: "Overbilling hides in line items",
      body:
        "A freight invoice can carry a dozen charges: base freight, bunker surcharge, port fees, detention. Rates " +
        "change by lane, container type and validity period, so wrong rates, duplicate lines and extra fees slip " +
        "through, and checking every invoice by hand rarely happens.",
    },
    {
      kicker: "The approach",
      title: "The LLM reads, code decides",
      body:
        "An LLM turns the PDF into validated fields. A deterministic rule engine does every comparison and " +
        "calculation, because LLMs are unreliable at arithmetic and a wrong accusation against a carrier is costly. " +
        "Every finding cites its evidence, and a reviewer approves before anything is sent.",
    },
    {
      kicker: "The result",
      title: "Measured, not claimed",
      body:
        "On 60 unseen invoices, the hybrid caught all 58 injected errors with no false findings. Given the same " +
        "PDFs, letting the model judge the invoices itself dropped precision to 51.9% and falsely accused carriers on " +
        "9 of the 25 invoices that had no errors.",
    },
  ],

  gallery: [
    { id: "signin", label: "Sign in", title: "Reviewer sign-in", caption: "Signed, expiring sessions. Every API route requires them, and evaluators get one-click demo access.", image: "/freight/login.webp" },
    { id: "dashboard", label: "Dashboard", title: "Audit workspace", caption: "Overcharges found, invoices needing review and disputes at a glance, with drag-and-drop upload and the carrier contracts on file.", image: "/freight/dashboard.webp" },
    { id: "review", label: "Review", title: "Invoice review", caption: "Every extracted field and line, each charge mapped to a standard type, with the flagged lines highlighted.", image: "/freight/review.webp" },
    { id: "findings", label: "Evidence", title: "Findings with evidence", caption: "An expired rate and miscalculated detention, each with the invoice line and the contract clause side by side.", image: "/freight/findings.webp" },
    { id: "dispute", label: "Approval", title: "Approval-gated dispute", caption: "A drafted dispute email the reviewer can edit, approve or reject. Sending stays locked until a signed-in reviewer approves.", image: "/freight/dispute.webp" },
    { id: "audit", label: "Audit trail", title: "Tamper-evident log", caption: "Every upload, extraction, audit and approval, each event chained to the previous one by SHA-256.", image: "/freight/audit.webp" },
    { id: "eval", label: "Evaluation", title: "Measured accuracy", caption: "The hybrid against an LLM-only baseline on the same unseen invoices: 100% vs 51.9% precision, per error type.", image: "/freight/eval.webp" },
  ],

  engineering: [
    { icon: 0, title: "Deterministic rule engine", body: "Eight error types, from expired rate periods and detention free days to FX and tax, checked in code with tolerances. Only overcharges are disputed." },
    { icon: 3, title: "Human approval, real identity", body: "Sending is refused unless a signed-in reviewer approved the dispute; approvals carry the reviewer's identity, never a typed name." },
    { icon: 2, title: "The LLM can't invent numbers", body: "LLM extraction is schema-validated and retried. Drafted emails are checked against the findings, and any made-up figure falls back to a template." },
    { icon: 4, title: "Fails safe", body: "Unreadable layouts, low-confidence fields and impossible date orders go to human review instead of becoming accusations." },
    { icon: 1, title: "An honest evaluation", body: "A labelled synthetic generator with a held-out invoice layout, an ablation against an LLM-only baseline, and a fresh test split after fixes." },
    { icon: 5, title: "Tested and traceable", body: "100 tests in CI, idempotent uploads, duplicate-invoice detection and a hash-chained, append-only audit log." },
  ],
};

export const razorGrowth: FeaturedProjectData = {
  id: "razorgrowth",
  name: "RazorGrowth",
  category: "AI agents · Payments",
  tagline: "An AI agent that wins back failed payments, without ever holding the purse strings.",
  highlight: "Beats a heuristic baseline by 2.3% on revenue recovered beyond what would have come back anyway.",
  summary:
    "Failed payments quietly cost merchants revenue. RazorGrowth is an AI agent that investigates them with read-only tools and proposes " +
    "Razorpay recovery campaigns, but it can't spend a rupee on its own: every proposal passes a deterministic " +
    "policy engine and needs the merchant's explicit approval, and every step is audited. To let anyone try it, " +
    "it ships as a live simulator: run a store for a week, command the agent, and compete on a weekly leaderboard.",
  event: "Razorpay AI Buildathon 2026",
  cover: "/razorgrowth/dashboard.webp",
  links: [
    { label: "Open live demo", href: "https://razorgrowth.vercel.app" },
    { label: "View source", href: "https://github.com/varun-sharma-2006/Razorgrowth" },
  ],
  role: "Everything: agent, policy engine, simulator, interface and deployment",
  team: [{ name: "Varun Sharma", href: "https://github.com/varun-sharma-2006" }],
  stack: ["Python", "FastAPI", "Gemini API", "SQLAlchemy", "Alembic", "React", "TypeScript", "Razorpay API", "Google sign-in", "Vercel", "FastAPI Cloud"],

  stats: [
    { value: 70, suffix: "", label: "Automated tests" },
    { value: 5, suffix: "", label: "Market scenarios" },
    { value: 168, suffix: "h", label: "Simulated per week" },
    { value: 0, suffix: "", label: "Duplicate links on retry" },
  ],

  story: [
    {
      kicker: "The problem",
      title: "AI that can spend money is a liability",
      body:
        "An agent that recovers revenue has to send payment links and offer discounts. Letting an LLM do that " +
        "unchecked is how you get runaway incentives and duplicate charges.",
    },
    {
      kicker: "The approach",
      title: "The AI proposes, code and people decide",
      body:
        "A Gemini tool-calling agent investigates with read-only tools, then its proposal must pass a strict schema, " +
        "a deterministic policy engine (budget cap, incentive wallet) " +
        "then the merchant. Approval is atomic, and every Razorpay link carries a deterministic reference ID, so a " +
        "retry after a timeout can never create a second link.",
    },
    {
      kicker: "The result",
      title: "A score that can't be gamed",
      body:
        "The simulator counts only revenue recovered beyond what customers would have paid back anyway. Doing " +
        "nothing scores exactly zero. An evaluation harness over full simulated weeks caught a bug in the agent's " +
        "estimates; after the fix it beats a heuristic baseline by 2.3%.",
    },
  ],

  gallery: [
    { id: "signin", label: "Sign in", title: "Sign in with Google", caption: "A live recovery feed tells the story: a payment fails, the agent proposes, policy passes, you approve, the customer pays.", image: "/razorgrowth/login.webp" },
    { id: "scenarios", label: "Scenarios", title: "Pick a week", caption: "Five scenarios, from a steady week to a UPI outage. Everyone gets the same customers each week, so the leaderboard is fair.", image: "/razorgrowth/new-run.webp" },
    { id: "dashboard", label: "Dashboard", title: "Mission control", caption: "Score, incentive wallet and recovery figures update every simulated hour, driven from a media-player style dock.", image: "/razorgrowth/dashboard.webp" },
    { id: "charts", label: "Live charts", title: "You vs doing nothing", caption: "Recovered revenue against what would have come back anyway, and failures by payment method with market events.", image: "/razorgrowth/charts.webp" },
    { id: "approval", label: "Approval", title: "Permissioned approval", caption: "The agent's investigation, step by step: which tool it called, why, and what it found. Then the policy checklist and your decision.", image: "/razorgrowth/approval.webp" },
    { id: "campaigns", label: "Campaigns", title: "Recovery links", caption: "One Razorpay Payment Link per failed payment, each with its share of the incentive and its outcome.", image: "/razorgrowth/campaigns.webp" },
    { id: "lab", label: "Safety lab", title: "Fault injection", caption: "Policy block, gateway timeouts with safe halt, and a lost response recovered without a duplicate link.", image: "/razorgrowth/safety-lab.webp" },
    { id: "results", label: "Results", title: "End of the week", caption: "The score breakdown, return on incentive, and a submission to the weekly leaderboard.", image: "/razorgrowth/results.webp" },
  ],

  engineering: [
    { icon: 3, title: "Deterministic guardrails", body: "A policy engine checks every proposal against the safety cap and incentive wallet, at proposal time and again at approval." },
    { icon: 2, title: "A bounded, observable agent", body: "Gemini function calling over read-only tools, at most 6 turns. Invalid proposals go back to the model; if it can't finish, a heuristic proposes." },
    { icon: 4, title: "No duplicate payments", body: "Atomic approvals, deterministic Razorpay reference IDs, retries with backoff and a safe halt. Tested with injected faults." },
    { icon: 0, title: "A fair simulator", body: "Seeded per scenario and week, with a customer-behaviour model; future outcomes never reach the browser." },
    { icon: 1, title: "Accounts, not keys", body: "Google sign-in verified on the server, httpOnly sessions, admins by email, signed and de-duplicated webhooks." },
    { icon: 5, title: "Tested and migrated", body: "70 backend tests including concurrency, security and agent cases, an evaluation harness, Alembic migrations and CI." },
  ],
};

/** BidPulse. Figures come from the project's README and test suite. */
export const bidPulse: FeaturedProjectData = {
  id: "bidpulse",
  name: "BidPulse",
  category: "Real-time systems",
  tagline: "A freight RFQ platform with British-auction bidding that stays fair down to the last second.",
  highlight: "8 simultaneous last-second bids produce exactly 5 chained extensions, never past the forced close.",
  summary:
    "Buyers post a Request for Quotation; carriers openly undercut each other in a live British auction. A bid near " +
    "the end extends the auction automatically, but it can never run past the forced close. Ranks, prices and the " +
    "reason for every extension update live on every screen, with separate buyer and supplier dashboards.",
  cover: "/bidpulse/buyer-dashboard.webp",
  links: [
    { label: "Open live demo", href: "https://britishauctionrfq.vercel.app" },
    { label: "View source", href: "https://github.com/varun-sharma-2006/British-Auction-in-RFQ-System" },
  ],
  role: "Everything: auction engine, API, real-time layer, load-balanced deployment, interface and tests",
  team: [{ name: "Varun Sharma", href: "https://github.com/varun-sharma-2006" }],
  stack: ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "Alembic", "Celery", "Redis", "WebSockets", "React", "TypeScript", "nginx", "Docker", "Playwright"],

  stats: [
    { value: 102, suffix: "", label: "Automated tests" },
    { value: 96, suffix: "%", label: "Backend test coverage" },
    { value: 3, suffix: "", label: "Load-balanced API replicas" },
    { value: 0, suffix: "", label: "Auctions past forced close" },
  ],

  story: [
    {
      kicker: "The problem",
      title: "Last-second bids break auctions",
      body:
        "In a reverse auction, the winning move is to bid at the final second so no one can respond. Extending the " +
        "deadline fixes that, but done carelessly an auction never ends, or two simultaneous bids corrupt the close time.",
    },
    {
      kicker: "The approach",
      title: "A pure rules engine, locked rows",
      body:
        "Extension rules (any bid, any rank change, or a new lowest bidder within the trigger window) live in a pure, " +
        "unit-tested engine. Every bid locks its RFQ row, and the forced close is enforced three times: in the " +
        "engine, in the API, and as a database CHECK constraint.",
    },
    {
      kicker: "The result",
      title: "Proven under concurrency",
      body:
        "A PostgreSQL test fires 8 simultaneous last-second bids and asserts exactly 5 chained extensions ending at the " +
        "forced close; it fails if the lock is removed. A bid on one API replica reaches a browser on another via Redis.",
    },
  ],

  gallery: [
    { id: "signin", label: "Sign in", title: "One-click demo accounts", caption: "Sign in as the buyer or one of the carriers; open two browsers to watch bids land live.", image: "/bidpulse/login.webp" },
    { id: "buyer", label: "Buyer", title: "Buyer dashboard", caption: "Live auctions, bids received, money saved by competition, and recent activity across every RFQ.", image: "/bidpulse/buyer-dashboard.webp" },
    { id: "listing", label: "Auctions", title: "All auctions", caption: "Current lowest bid, live countdowns, extension counts and Active / Closed / Force Closed status.", image: "/bidpulse/listing.webp" },
    { id: "live", label: "Live auction", title: "A live auction", caption: "A timeline of the trigger window and extensions, supplier ranking L1/L2, and a bid form that predicts whether a bid will extend the auction.", image: "/bidpulse/live-auction.webp" },
    { id: "details", label: "Activity log", title: "Every extension explained", caption: "Each extension logs the old and new close time and a readable reason.", image: "/bidpulse/details.webp" },
    { id: "supplier", label: "Supplier", title: "Supplier dashboard", caption: "My rank, my quote vs L1, and an outbid banner with a one-click lower quote.", image: "/bidpulse/supplier-dashboard.webp" },
    { id: "create", label: "Create RFQ", title: "Create an RFQ", caption: "Bid window, forced close, trigger window X, extension Y and the trigger type, validated on client, server and database.", image: "/bidpulse/create-rfq.webp" },
  ],

  engineering: [
    { icon: 3, title: "Forced close, enforced 3×", body: "The engine caps every extension, the API rejects late bids, and a database CHECK guarantees the close never passes the forced close." },
    { icon: 4, title: "Proven concurrency safety", body: "Bids lock the RFQ row (SELECT … FOR UPDATE); a PostgreSQL test fires 8 simultaneous last-second bids to prove it." },
    { icon: 1, title: "Load balanced, stateless", body: "nginx spreads traffic over 3 API replicas; JWT auth, Postgres row locks and Redis pub/sub mean no sticky sessions." },
    { icon: 0, title: "Live everywhere", body: "WebSockets fan updates out to every replica through Redis; countdowns correct for client clock skew using server time." },
    { icon: 2, title: "Bloom-filter availability", body: "Live \"is this taken?\" checks answer \"definitely free\" without a query; UNIQUE constraints stay the final authority." },
    { icon: 5, title: "Tested at every layer", body: "76 backend tests (96% coverage), 26 frontend tests and a Playwright run through the load balancer in CI." },
  ],
};

/** Projects in the order they appear on the page. */
export const projects: FeaturedProjectData[] = [algoTrade, freightAudit, razorGrowth, bidPulse];

/**
 * Other GitHub projects, hidden until they get their own case study.
 * Set `show: true` on a project to list it under "More on GitHub".
 */
export const otherProjects = [
  { name: "AgriGuard", tagline: "Multi-modal crop disease detection", href: "https://github.com/varun-sharma-2006/Agriguard", show: false },
  { name: "Vedave", tagline: "Luxury fashion rental, buy & sell marketplace", href: "https://github.com/varun-sharma-2006/Vedave", show: false },
];
