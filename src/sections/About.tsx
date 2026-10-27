import { profile } from "../profile";
import { Logo } from "../components/icons";
import { SectionHead, Spotlight } from "../components/ui";
import { sectionNumber } from "../lib/site";

export function About() {
  const facts = [
    { k: "Based in", v: profile.location },
    { k: "Studying", v: "B.Tech CSE (AI), Bennett University" },
    { k: "Graduating", v: profile.graduation },
    { k: "Interested in", v: profile.interests },
  ];
  return (
    <section id="about" className="section">
      <SectionHead index={sectionNumber("about")} eyebrow="About" title={<>The person behind <span className="grad">the products</span></>} />
      <div className="about">
        <Spotlight className="about-card">
          <div className="about-top">
            <Logo />
            <div>
              <strong>{profile.name}</strong>
              <span>
                {profile.role}
                {profile.location ? ` · ${profile.location}` : ""}
              </span>
            </div>
          </div>
          {profile.about.map((p) => (
            <p key={p.slice(0, 20)}>{p}</p>
          ))}
          <dl className="facts">
            {facts.map((f) => (
              <div key={f.k}>
                <dt>{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
          </dl>
        </Spotlight>
        <div className="values">
          {profile.values.map((v, i) => (
            <Spotlight key={v.title} className="value-card">
              <span className="mono">0{i + 1}</span>
              <h3>{v.title}</h3>
              <p>{v.body}</p>
            </Spotlight>
          ))}
        </div>
      </div>
    </section>
  );
}
