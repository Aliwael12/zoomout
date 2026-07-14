"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Drawer } from "./drawer";
import { homeFor, useSession } from "./session";
import { useStore } from "./store";
import { AdminTopbar, MemberTopbar, PublicTopbar } from "./topbar";

/* ------------------------------------------------------------------ */
/* The two signed-in surfaces. Everything private to the owner lives   */
/* inside AdminShell: the Drawer (with the rating and the private      */
/* notes) is mounted here and nowhere else, so the member surface has  */
/* no way to render it. In v1 the same line is drawn again on the      */
/* server, in Firestore rules.                                         */
/* ------------------------------------------------------------------ */

function Gate() {
  return (
    <div className="gate" role="status">
      Checking your session…
    </div>
  );
}

function Footer({ note }: { note: string }) {
  return (
    <footer className="site wrap">
      <span>
        <strong>Pitch demo</strong>: dummy data, photos from @zoomouteg, no backend yet.
      </span>
      <span>{note}</span>
    </footer>
  );
}

const FOOT_LINKS: { head: string; links: { href: string; label: string }[] }[] = [
  {
    head: "Trips",
    links: [
      { href: "/#trips", label: "What is open" },
      { href: "/#apply", label: "Apply" },
      { href: "/#faq", label: "Questions" },
    ],
  },
  {
    head: "Club",
    links: [
      { href: "/#club", label: "The four tiers" },
      { href: "/#how", label: "How it works" },
      { href: "/signin", label: "Member sign in" },
    ],
  },
];

/** The signed-out surface: the landing page and the sign-in doors. */
export function PublicShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { trips } = useStore();
  const newest = trips[trips.length - 1];

  return (
    <div className="landing">
      <div className="announce">
        <div className="wrap announce-in">
          <span className="mono-label">▶ Trip drop:</span>
          <span>
            {newest.name} is open for applications, {newest.dates}.
          </span>
          <Link href="/#trips" className="announce-cta">
            Apply today →
          </Link>
        </div>
      </div>

      <PublicTopbar nav={pathname === "/"} />
      {children}

      <footer className="pub-foot">
        <div className="ridge ridge-up" aria-hidden="true" />
        <div className="wrap pub-foot-in">
          <div className="pub-foot-brand">
            <div className="pub-mark static">
              <span>
                ZOOM<em>OUT</em>
              </span>
            </div>
            <p>Small-group trips around Egypt. Zoom out of routine, zoom into life.</p>
            <a className="ig-link" href="https://instagram.com/zoomouteg" target="_blank" rel="noreferrer">
              @zoomouteg
            </a>
          </div>

          {FOOT_LINKS.map((col) => (
            <nav key={col.head} className="pub-foot-col" aria-label={col.head}>
              <h3>{col.head}</h3>
              {col.links.map((l) => (
                <Link key={l.href + l.label} href={l.href}>
                  {l.label}
                </Link>
              ))}
            </nav>
          ))}

          <div className="pub-foot-col">
            <h3>The list</h3>
            <p className="foot-note">
              Trip drops go out on WhatsApp and Instagram first. The club sees them 48 hours earlier.
            </p>
          </div>
        </div>

        <div className="wrap pub-foot-note">
          <strong>Pitch demo</strong>: dummy data, photos from @zoomouteg, no backend yet. An application sent here
          lands in the owner&rsquo;s HQ, in memory, until you reload.
        </div>
      </footer>
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const { session, ready } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!session) router.replace("/signin");
    else if (session.role !== "admin") router.replace(homeFor(session));
  }, [ready, session, router]);

  if (!ready || session?.role !== "admin") return <Gate />;

  return (
    <>
      <AdminTopbar />
      <main className="wrap">{children}</main>
      <Footer note="WhatsApp stays the chat; this is the system of record." />
      <Drawer />
    </>
  );
}

export function MemberShell({ children }: { children: ReactNode }) {
  const { session, ready, signOut } = useSession();
  const { people } = useStore();
  const router = useRouter();

  const pid = session?.role === "member" ? session.pid : null;
  /* A member who applied from the landing page only exists in memory, so a
     refresh can leave the session pointing at nobody. Sign them back out. */
  const orphaned = pid !== null && !people[pid];

  useEffect(() => {
    if (!ready) return;
    if (!session) router.replace("/signin");
    else if (session.role !== "member") router.replace(homeFor(session));
    else if (orphaned) {
      signOut();
      router.replace("/signin");
    }
  }, [ready, session, orphaned, router, signOut]);

  if (!ready || !pid || orphaned) return <Gate />;

  return (
    <>
      <MemberTopbar pid={pid} />
      <main className="wrap">{children}</main>
      <Footer note="Your rating and the owner's notes are not part of this view. They never leave HQ." />
    </>
  );
}
