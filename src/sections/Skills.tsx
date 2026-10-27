import { profile } from "../profile";
import { EngIcon } from "../components/icons";
import { SectionHead, Spotlight } from "../components/ui";
import { sectionNumber } from "../lib/site";

export function Skills() {
  return (
    <section id="skills" className="section">
      <SectionHead index={sectionNumber("skills")} eyebrow="Skills" title={<>Tools I <span className="grad">build with</span></>}>
        Everything here is used in at least one shipped project.
      </SectionHead>
      <div className="skills">
        {profile.skills.map((group, i) => (
          <Spotlight key={group.group} className="skill-card">
            <div className="skill-head">
              <span className="eng-icon">
                <EngIcon index={i} />
              </span>
              <h3>{group.group}</h3>
            </div>
            <div className="chips">
              {group.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </Spotlight>
        ))}
      </div>
    </section>
  );
}
