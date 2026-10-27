import { useEffect, useState } from "react";
import { SECTIONS } from "./lib/site";

/** Fades [data-reveal] elements in as they scroll into view, including ones added later (e.g. "Show more"). */
export function useReveal() {
  useEffect(() => {
    const pending = () => document.querySelectorAll<HTMLElement>("[data-reveal]:not(.in)");
    if (!("IntersectionObserver" in window)) {
      pending().forEach((el) => el.classList.add("in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    const watch = () => pending().forEach((el) => observer.observe(el));
    watch();
    const mutations = new MutationObserver(watch);
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);
}

/** Scroll progress (0–1) and the id of the section currently under the top bar. */
export function useScrollSpy() {
  const [state, setState] = useState({ progress: 0, active: "", scrolled: false });
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      let active = "";
      const line = window.innerHeight * 0.35;
      for (const { id } of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) active = id;
      }
      if (max > 0 && y >= max - 4) active = SECTIONS[SECTIONS.length - 1].id;
      setState({ progress: max > 0 ? Math.min(y / max, 1) : 0, active, scrolled: y > 12 });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return state;
}
