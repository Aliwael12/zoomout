"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/", label: "Trips" },
  { href: "/travelers", label: "Travelers" },
  { href: "/insights", label: "Insights" },
  { href: "/club", label: "✦ Club", club: true },
];

type Theme = "system" | "light" | "dark";

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const saved = localStorage.getItem("zo-theme");
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);

  const cycle = () => {
    const next: Theme = theme === "system" ? "dark" : theme === "dark" ? "light" : "system";
    setTheme(next);
    if (next === "system") {
      localStorage.removeItem("zo-theme");
      document.documentElement.removeAttribute("data-theme");
    } else {
      localStorage.setItem("zo-theme", next);
      document.documentElement.setAttribute("data-theme", next);
    }
  };

  const icon = theme === "dark" ? "☾" : theme === "light" ? "☀" : "◐";
  return (
    <button className="theme-toggle" onClick={cycle} aria-label={`Theme: ${theme}. Click to change`} title={`Theme: ${theme}`}>
      {icon}
    </button>
  );
}

export function Topbar() {
  const pathname = usePathname();
  return (
    <div className="topbar">
      <div className="wrap topbar-in">
        <div className="brand-lockup">
          <Image src="/brand/logo.jpg" alt="Zoom Out logo" width={34} height={34} priority />
          <div className="wordmark">
            ZOOM<span>OUT</span>
          </div>
        </div>
        <nav className="nav" aria-label="Screens">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={l.club ? "nav-club" : undefined}
              aria-current={pathname === l.href ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="spacer" />
        <ThemeToggle />
      </div>
    </div>
  );
}
