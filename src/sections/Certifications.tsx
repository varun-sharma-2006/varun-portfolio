import { profile, type Certification } from "../profile";
import { External } from "../components/icons";
import { SectionHead } from "../components/ui";
import { sectionNumber } from "../lib/site";

/** Issuer initials for the certificate badge, e.g. "BITS Pilani" -> "BP", "HackerRank" -> "HR". */
export const issuerMark = (c: Certification) => {
  const words = (c.issuer || c.platform).split(/\s+/);
  const letters = words.length > 1 ? words.map((w) => w[0]).join("") : (words[0].match(/[A-Z]/g)?.join("") ?? words[0][0]);
  return letters.toUpperCase().slice(0, 2);
};

export function Certifications() {
  const certs = profile.certifications;
  if (!certs.length) return null;
  const groups = (["Skill test", "Course"] as const)
    .map((kind) => ({ kind, items: certs.filter((c) => c.kind === kind) }))
    .filter((g) => g.items.length);
  return (
    <section id="certifications" className="section">
      <SectionHead index={sectionNumber("certifications")} eyebrow="Certifications" title={<>Skills, <span className="grad">certified</span></>}>
        {certs.length} certificates from HackerRank and Coursera. Click any to see it.
      </SectionHead>
      {groups.map((g) => (
        <div key={g.kind} className="cert-group">
          <span className="mono cert-group-title">{g.kind === "Skill test" ? "Skill certifications" : "Courses"}</span>
          <div className="cert-grid">
            {g.items.map((c) => (
              <a key={c.href} className={`cert cert-${c.platform.toLowerCase()}`} href={c.href} target="_blank" rel="noreferrer" data-reveal>
                <span className="cert-mark" aria-hidden="true">
                  {issuerMark(c)}
                </span>
                <span className="cert-text">
                  <strong>{c.name}</strong>
                  <span>
                    {c.issuer && c.issuer !== c.platform ? `${c.issuer} · ` : ""}
                    {c.platform}
                  </span>
                </span>
                <span className="cert-open">
                  View <External />
                </span>
              </a>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
