/**
 * What "Ask my AI" knows: the site's own content, split into small passages, each tied to the section it
 * came from. Used by the serverless function (as the model's only context) and by the browser (as an offline
 * fallback that answers with the best-matching passage).
 */
import { profile, projects } from "./profile";

export interface Passage {
  id: string; // section anchor on the page, e.g. "about" or "bidpulse"
  title: string;
  text: string;
}

export const passages: Passage[] = [
  {
    id: "about",
    title: "About Varun",
    text:
      `${profile.name} is a ${profile.role.toLowerCase()} based in ${profile.location}. ${profile.intro} ` +
      `${profile.about.join(" ")} Interests: ${profile.interests}. ${profile.lookingFor}.`,
  },
  {
    id: "about",
    title: "How Varun works",
    text: profile.values.map((v) => `${v.title}: ${v.body}`).join(" "),
  },
  {
    id: "skills",
    title: "Skills",
    text: profile.skills.map((g) => `${g.group}: ${g.items.join(", ")}.`).join(" "),
  },
  {
    id: "education",
    title: "Education",
    text: profile.education
      .map((e) => `${e.title} at ${e.place}, ${e.period}. ${e.details ?? ""} Coursework: ${(e.tags ?? []).join(", ")}.`)
      .join(" "),
  },
  {
    id: "experience",
    title: "Experience",
    text: profile.experience.map((e) => `${e.title}, ${e.place} (${e.period}). ${e.details ?? ""}`).join(" "),
  },
  {
    id: "contact",
    title: "Contact and availability",
    text:
      `Availability: Varun is ${profile.lookingFor.toLowerCase()} and graduates in ${profile.graduation}. Email ${profile.email}. ` +
      `GitHub ${profile.github}. LinkedIn ${profile.linkedin}. A resume is linked from the top bar.`,
  },
  ...projects.flatMap((p) => [
    {
      id: p.id,
      title: p.name,
      text:
        `${p.name} (${p.category}${p.event ? `, ${p.event}` : ""}): ${p.tagline} ${p.summary} ` +
        `Built by ${p.team.map((t) => t.name).join(" and ")}; ${p.role}. Stack: ${p.stack.join(", ")}. ` +
        `Key numbers: ${p.stats.map((s) => `${s.value}${s.suffix} ${s.label.toLowerCase()}`).join("; ")}. ` +
        `Links: ${p.links.map((l) => `${l.label} ${l.href}`).join(", ")}.`,
    },
    {
      id: p.id,
      title: `${p.name}: story`,
      text: p.story.map((s) => `${s.kicker}: ${s.title}. ${s.body}`).join(" "),
    },
    {
      id: p.id,
      title: `${p.name}: engineering`,
      text: p.engineering.map((e) => `${e.title}: ${e.body}`).join(" "),
    },
  ]),
];

/** Section ids the assistant may cite, with display names. */
export const sources: Record<string, string> = {
  about: "About",
  skills: "Skills",
  experience: "Experience",
  education: "Education",
  contact: "Contact",
  ...Object.fromEntries(projects.map((p) => [p.id, p.name])),
};

const STOP = new Set(
  "a an and are as at be by can did do does for from has have he his how i in is it its me my of on or so tell that the their them this to under was what when where which who why will with you your varun sharma".split(
    " ",
  ),
);

// Lowercase words without stop words, with plurals folded ("internships" matches "internship", "LLMs" matches "LLM").
const words = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9+#%]+/g, " ")
    .split(" ")
    .filter((w) => w.length > 1 && !STOP.has(w))
    .map((w) => (w.length > 3 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w));

/** Passages ranked by simple word overlap with the question (good enough for a few dozen passages). */
export function retrieve(question: string, limit = 4): Passage[] {
  const q = new Set(words(question));
  if (!q.size) return [];
  return passages
    .map((p) => {
      const body = words(`${p.title} ${p.title} ${p.text}`);
      const hits = body.filter((w) => q.has(w)).length;
      return { p, score: hits / Math.sqrt(body.length) };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.p);
}

export interface AskAnswer {
  answer: string;
  sources: string[]; // section ids
  mode: "ai" | "offline";
}

/** Answer without a model: quote the best-matching passage. */
export function offlineAnswer(question: string): AskAnswer {
  const [best] = retrieve(question, 1);
  if (!best) {
    return {
      answer: `I couldn't find that on this site. You can ask Varun directly at ${profile.email}.`,
      sources: ["contact"],
      mode: "offline",
    };
  }
  // Split on sentence ends followed by a space, so "Sportikon 3.0" or "~5×" stay whole.
  const sentences = best.text.split(/(?<=[.!?])\s+/).filter(Boolean);
  return { answer: sentences.slice(0, 3).join(" ").replace(/\s+/g, " ").trim(), sources: [best.id], mode: "offline" };
}

export const SUGGESTED_QUESTIONS = [
  "What has Varun built with LLMs?",
  "When is he available for an internship?",
  "How does BidPulse handle last-second bids?",
  "What's his strongest backend experience?",
];
