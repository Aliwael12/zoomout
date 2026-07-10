"use client";

import { useEffect, useRef } from "react";

/**
 * Global tooltip layer: any element with a `data-tip` attribute gets a
 * hover/focus tooltip (used by the insights charts).
 */
export function TooltipLayer() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tip = ref.current;
    if (!tip) return;

    const show = (el: Element) => {
      tip.textContent = el.getAttribute("data-tip");
      tip.classList.add("show");
      const r = el.getBoundingClientRect();
      const tw = tip.offsetWidth;
      const th = tip.offsetHeight;
      let x = r.left + r.width / 2 - tw / 2;
      x = Math.max(8, Math.min(x, window.innerWidth - tw - 8));
      let y = r.top - th - 8;
      if (y < 8) y = r.bottom + 8;
      tip.style.left = `${x}px`;
      tip.style.top = `${y}px`;
    };
    const hide = () => tip.classList.remove("show");

    const onOver = (e: Event) => {
      const el = (e.target as Element).closest("[data-tip]");
      if (el) show(el);
      else hide();
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("focusin", onOver);
    window.addEventListener("scroll", hide, true);
    return () => {
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("focusin", onOver);
      window.removeEventListener("scroll", hide, true);
    };
  }, []);

  return <div className="tip" ref={ref} role="status" />;
}
