import { useEffect, useRef, useState } from "react";
import { projects } from "../profile";
import { prefersReducedMotion } from "../lib/site";

/** A slowly drifting neural-network constellation behind the page; nodes link up near the cursor. */
export function NeuralBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = prefersReducedMotion();
    // Phones and tablets: fewer nodes, 1x pixels and 30 fps, to spare battery and keep scrolling smooth.
    const light = window.matchMedia?.("(max-width: 760px), (pointer: coarse)").matches ?? false;
    const dpr = light ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    const maxNodes = light ? 40 : 95;
    const minFrameMs = light ? 33 : 0;
    const mouse = { x: -1e4, y: -1e4 };
    let w = 0;
    let h = 0;
    let frame = 0;
    let last = 0;
    let nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = [];

    const resize = () => {
      const widthChanged = window.innerWidth !== w;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Mobile browsers change the height as the address bar hides; only re-seed when the width changes.
      if (!widthChanged && nodes.length) return;
      const count = Math.round(Math.min(maxNodes, (w * h) / 15000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.4 + 0.6,
      }));
    };

    const draw = (now = 0) => {
      if (minFrameMs && now && now - last < minFrameMs) {
        frame = requestAnimationFrame(draw);
        return;
      }
      last = now;
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        if (!reduce) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < -20) n.x = w + 20;
          if (n.x > w + 20) n.x = -20;
          if (n.y < -20) n.y = h + 20;
          if (n.y > h + 20) n.y = -20;
        }
      }
      const link = 140;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < link) {
            ctx.strokeStyle = `rgba(167, 139, 250, ${(1 - d / link) * 0.22})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dm < 200) {
          ctx.strokeStyle = `rgba(196, 181, 253, ${(1 - dm / 200) * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
        ctx.fillStyle = dm < 200 ? "rgba(237, 233, 254, 0.95)" : "rgba(196, 181, 253, 0.7)";
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce && !document.hidden) frame = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (reduce) draw();
    };
    const onVisible = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) draw();
    };
    const onResize = () => {
      resize();
      if (reduce) draw();
    };

    resize();
    draw();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);
  return <canvas className="neural" ref={ref} aria-hidden="true" />;
}

/** A soft glow that follows the mouse (pointer devices only). */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia?.("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      ref.current?.style.setProperty("transform", `translate(${e.clientX}px, ${e.clientY}px)`);
      ref.current?.classList.add("on");
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return <div className="cursor-glow" ref={ref} aria-hidden="true" />;
}

/** Types each phrase, pauses, deletes it and moves to the next. */
export function Typewriter({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    if (prefersReducedMotion()) {
      setLength(words[index].length);
      return;
    }
    const word = words[index];
    let t: number;
    if (!deleting && length < word.length) t = window.setTimeout(() => setLength(length + 1), 55);
    else if (!deleting) t = window.setTimeout(() => setDeleting(true), 1700);
    else if (length > 0) t = window.setTimeout(() => setLength(length - 1), 26);
    else
      t = window.setTimeout(() => {
        setDeleting(false);
        setIndex((index + 1) % words.length);
      }, 250);
    return () => clearTimeout(t);
  }, [length, deleting, index, words]);
  return (
    <span className="typed" aria-live="off">
      <span className="grad">{words[index].slice(0, length)}</span>
      <i className="type-caret" aria-hidden="true" />
    </span>
  );
}

export const TYPED = ["AI agents with guardrails", "LLM pipelines that cite evidence", "honest fintech tools", "real-time auction systems"];

/** Every technology across the projects, scrolling past in a loop. */
export function StackMarquee() {
  const stack = Array.from(new Set(projects.flatMap((p) => p.stack)));
  return (
    <div className="marquee" aria-label={`Technologies: ${stack.join(", ")}`}>
      <div className="marquee-track" aria-hidden="true">
        {[...stack, ...stack].map((s, i) => (
          <span key={`${s}-${i}`}>
            <i>✦</i>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
