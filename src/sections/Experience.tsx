import { profile } from "../profile";
import { SectionHead, Timeline } from "../components/ui";
import { sectionNumber } from "../lib/site";

export function Experience() {
  if (!profile.experience.length) return null;
  return (
    <section id="experience" className="section">
      <SectionHead index={sectionNumber("experience")} eyebrow="Experience" title={<>Hackathons &amp; <span className="grad">leadership</span></>} />
      <Timeline items={profile.experience} />
    </section>
  );
}
