import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { type TimelineItem } from "../profile";

/** Card whose border and glow follow the cursor. */
export function Spotlight({ className = "", children }: { className?: string; children: ReactNode }) {
  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - box.top}px`);
  };
  return (
    <div className={`spot ${className}`} onMouseMove={onMove} data-reveal>
      {children}
    </div>
  );
}

export function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setShown(value);
      return;
    }
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / 1400, 1);
        setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);
  return (
    <span ref={ref}>
      {shown}
      {suffix}
    </span>
  );
}

export function SectionHead({ index, eyebrow, title, children }: { index?: number; eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="section-head" data-reveal>
      <span className="eyebrow">
        {index ? <b>{String(index).padStart(2, "0")}</b> : null}
        {eyebrow}
      </span>
      <h2>{title}</h2>
      {children ? <p>{children}</p> : null}
    </div>
  );
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="timeline">
      {items.map((item) => (
        <li key={`${item.title}-${item.place}`} data-reveal>
          <span className="dot" aria-hidden="true" />
          <span className="mono when">{item.period}</span>
          <div className="timeline-card">
            <strong>{item.title}</strong>
            <span className="where">{item.place}</span>
            {item.details ? <p>{item.details}</p> : null}
            {item.tags?.length ? (
              <div className="chips">
                {item.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
