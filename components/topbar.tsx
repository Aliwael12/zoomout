"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode } from "react";
import { useSession } from "./session";
import { useStore } from "./store";
import { TierBadge } from "./ui";

const ADMIN_LINKS = [
  { href: "/admin", label: "Trips" },
  { href: "/admin/travelers", label: "Travelers" },
  { href: "/admin/insights", label: "Insights" },
];

const MEMBER_LINKS = [
  { href: "/club", label: "✦ My card", club: true },
  { href: "/club/trips", label: "Trips" },
];

const PUBLIC_LINKS = [
  { href: "/#trips", label: "Trips" },
  { href: "/#club", label: "The club" },
  { href: "/#how", label: "How it works" },
];

/** Members offered in the demo switcher, alongside anyone who just applied. */
const DEMO_MEMBERS = ["malak", "nour"];

/**
 * Pitch affordance, not a product feature: hop between the three surfaces
 * without signing in and out again.
 */
function ViewSwitcher() {
  const router = useRouter();
  const { session, signInAsOwner, signInAsMember, signOut } = useSession();
  const { people, newcomers } = useStore();

  /* Newcomers first: after someone applies from the landing page, the owner
     can accept them in HQ and then look at the card they just earned. */
  const pids = [...newcomers, ...DEMO_MEMBERS];
  if (session?.role === "member" && !pids.includes(session.pid)) pids.unshift(session.pid);

  const value = session ? (session.role === "admin" ? "admin" : `member:${session.pid}`) : "out";

  const onChange = (next: string) => {
    if (next === "admin") {
      signInAsOwner();
      router.push("/admin");
    } else if (next === "out") {
      signOut();
      router.push("/");
    } else {
      signInAsMember(next.slice("member:".length));
      router.push("/club");
    }
  };

  return (
    <select className="ctrl view-switch" aria-label="Switch view" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="admin">Owner · HQ</option>
      {pids.map((pid) => {
        const p = people[pid];
        if (!p) return null;
        return (
          <option key={pid} value={`member:${pid}`}>
            Member · {p.name}
          </option>
        );
      })}
      <option value="out">Signed out · landing</option>
    </select>
  );
}

function Shell({
  home,
  links,
  children,
}: {
  home: string;
  links: { href: string; label: string; club?: boolean }[];
  children?: ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="topbar">
      <div className="wrap topbar-in">
        <Link href={home} className="brand-lockup" aria-label="Zoom Out home">
          <Image src="/brand/logo.jpg" alt="" width={34} height={34} priority />
          <div className="wordmark">
            ZOOM<span>OUT</span>
          </div>
        </Link>
        <nav className="nav" aria-label="Screens">
          {links.map((l) => (
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
        {children}
      </div>
    </div>
  );
}

/**
 * The public site runs its own chrome: links left, wordmark centred, one
 * gold pill on the right. Pine ground, so it flows into the hero.
 */
export function PublicTopbar({ nav = true }: { nav?: boolean }) {
  const pathname = usePathname();
  const { session } = useSession();
  const { people } = useStore();

  /* A member who applied from the landing page lives in memory only, so after
     a refresh their session points at nobody. Offer the sign-in door instead. */
  const live = session?.role === "admin" || (session?.role === "member" && Boolean(people[session.pid]));
  const cta = !session || !live
    ? { href: "/signin", label: "Sign in" }
    : session.role === "admin"
      ? { href: "/admin", label: "Back to HQ" }
      : { href: "/club", label: "My card" };

  return (
    <div className="pub-top">
      <div className="wrap pub-top-in">
        <nav className="pub-nav" aria-label="Sections">
          {nav &&
            PUBLIC_LINKS.map((l) => (
              <Link key={l.href} href={l.href} aria-current={pathname === l.href ? "page" : undefined}>
                {l.label}
              </Link>
            ))}
        </nav>
        <Link href="/" className="pub-mark" aria-label="Zoom Out home">
          <Image src="/brand/logo.jpg" alt="" width={30} height={30} />
          <span>
            ZOOM<em>OUT</em>
          </span>
        </Link>
        <div className="pub-top-cta">
          <Link className="pill" href={cta.href}>
            {cta.label}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function AdminTopbar() {
  return (
    <Shell home="/admin" links={ADMIN_LINKS}>
      <span className="who-chip">
        HQ <b>Owner</b>
      </span>
      <ViewSwitcher />
    </Shell>
  );
}

export function MemberTopbar({ pid }: { pid: string }) {
  const { people } = useStore();
  const p = people[pid];
  return (
    <Shell home="/club" links={MEMBER_LINKS}>
      {p && (
        <span className="who-chip">
          {p.name.split(" ")[0]} <TierBadge tier={p.tier} />
        </span>
      )}
      <ViewSwitcher />
    </Shell>
  );
}
