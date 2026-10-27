import { profile, projects } from "../profile";
import { TYPED, Typewriter } from "../components/effects";
import { Arrow, SOCIAL_ICONS, SocialIcon } from "../components/icons";
import { CountUp } from "../components/ui";
import { totalTests } from "../lib/site";

export function Hero() {
  const socials = [
    profile.github && { name: "GitHub" as const, href: profile.github },
    profile.linkedin && { name: "LinkedIn" as const, href: profile.linkedin },
    profile.email && { name: "Email" as const, href: `mailto:${profile.email}` },
  ].filter(Boolean) as Array<{ name: keyof typeof SOCIAL_ICONS; href: string }>;

  const [first, ...rest] = profile.headline.split(",");

  return (
    <section className="hero">
      <div className="hero-copy" data-reveal>
        {profile.lookingFor ? (
          <span className="badge">
            <i />
            {profile.lookingFor}
          </span>
        ) : null}
        <p className="hello">
          Hi, I'm <strong>{profile.name}</strong>, a {profile.role.toLowerCase()} and CS (AI) student, Class of {profile.graduation}.
        </p>
        <h1>
          {first}
          {rest.length ? (
            <>
              , <span className="grad">{rest.join(",").trim()}</span>
            </>
          ) : null}
        </h1>
        <p className="typeline">
          <span className="spark" aria-hidden="true">
            ✦
          </span>
          <span aria-hidden="true">
            Shipping <Typewriter words={TYPED} />
          </span>
          {/* Screen readers get the whole list once instead of letter-by-letter typing. */}
          <span className="sr-only">Shipping {TYPED.join(", ")}.</span>
        </p>
        <p className="lead">{profile.intro}</p>
        <div className="cta-row">
          <a className="btn btn-primary" href="#projects">
            See my work
            <Arrow down />
          </a>
          <a className="btn btn-glass" href="#contact">
            Get in touch
          </a>
        </div>
        {socials.length ? (
          <div className="socials">
            {socials.map((s) => (
              <a key={s.name} href={s.href} target={s.name === "Email" ? undefined : "_blank"} rel="noreferrer" aria-label={s.name} title={s.name}>
                <SocialIcon name={s.name} />
              </a>
            ))}
          </div>
        ) : null}
      </div>

      <div className="hero-visual" data-reveal>
        <div className="editor">
          <span className="ai-ring always" aria-hidden="true" />
          <div className="editor-bar">
            <span />
            <span />
            <span />
            <em>varun.ts</em>
          </div>
          <pre className="code" aria-label="A short profile written as code">
            <code>
              <span className="c">{"// hello, world"}</span>
              {"\n"}
              <span className="k">const</span> <span className="v">varun</span> = {"{"}
              {"\n  "}
              <span className="p">role</span>: <span className="s">"{profile.role}"</span>,{"\n  "}
              <span className="p">studying</span>: <span className="s">"B.Tech CSE (AI)"</span>,{"\n  "}
              <span className="p">graduating</span>: <span className="n">{profile.graduation}</span>,{"\n  "}
              <span className="p">based</span>: <span className="s">"{profile.location.split(",")[0]}"</span>,{"\n  "}
              <span className="p">stack</span>: [<span className="s">"Python"</span>, <span className="s">"FastAPI"</span>, <span className="s">"React"</span>, <span className="s">"TS"</span>],{"\n  "}
              <span className="p">building</span>: [<span className="s">"AI agents"</span>, <span className="s">"fintech"</span>],{"\n  "}
              <span className="p">shipped</span>: <span className="n">{projects.length}</span>, <span className="c">{"// live, tested, measured"}</span>
              {"\n  "}
              <span className="p">openTo</span>: <span className="s">"Summer 2027 internships"</span>,{"\n"}
              {"};"}
              <span className="caret" aria-hidden="true" />
            </code>
          </pre>
        </div>
        <div className="float float-a">
          <span className="mono">Products live</span>
          <strong className="grad">{projects.length} shipped</strong>
        </div>
        <div className="float float-b">
          <span className="mono">Tests passing</span>
          <strong className="grad">{totalTests}+</strong>
        </div>
      </div>

      <a href="#about" className="scroll-cue" aria-label="Scroll to About">
        <span />
      </a>
    </section>
  );
}

export function Highlights() {
  const items = [
    { value: projects.length, suffix: "", label: "Products shipped live" },
    { value: totalTests, suffix: "+", label: "Automated tests written" },
    { value: projects.filter((p) => p.team.length === 1).length, suffix: "", label: "Built solo, end to end" },
  ];
  return (
    <div className="highlights" data-reveal>
      {items.map((item) => (
        <div key={item.label}>
          <strong className="grad">
            <CountUp value={item.value} suffix={item.suffix} />
          </strong>
          <span>{item.label}</span>
        </div>
      ))}
      <div>
        <strong className="grad">'{profile.graduation.slice(2)}</strong>
        <span>Graduating, B.Tech CSE (AI)</span>
      </div>
    </div>
  );
}
