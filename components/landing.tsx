"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useRef, useState } from "react";
import { useSession } from "./session";
import { tripCounts, useStore } from "./store";
import { TierBadge } from "./ui";
import { perksFor, TIER_LADDER, TIER_PITCH, tierRequirement } from "@/lib/tiers";

/* The public face of the club: what a follower sees when they tap the link in
   the @zoomouteg bio. Structure is ported from the Yonder template (Tanker
   caps, Courier field labels, polaroids, ridge edges, pine blocks on sand);
   the colours are Zoom Out's own. Trip numbers are read from the same store
   the owner works in, so accepting someone in HQ moves "spots open" here. */

const STEPS = [
  {
    n: "01",
    t: "Apply in 30 seconds",
    d: "Name, Instagram handle, the trip you want. That is the whole form, and it lives on the link in our bio.",
  },
  {
    n: "02",
    t: "We read every application",
    d: "A real person looks at it, not a bot. We come back to you on WhatsApp, the same as always. Nothing moves to a new app.",
  },
  {
    n: "03",
    t: "Travel, and your card levels up",
    d: "Every trip you take, and every friend who travels on your code, moves you up the club.",
  },
];

const FAQS = [
  {
    q: "Can I come on my own?",
    a: "Most people do. Groups are capped and half the crew arrives solo, so you will not be the only one. By the second morning nobody remembers who came with whom.",
  },
  {
    q: "How do the tiers work?",
    a: "Every trip you take, and every friend who travels on your code, moves you up. Insiders see trip drops 48 hours before the grid does. Legends travel free on their 8th trip and vote on where we go next.",
  },
  {
    q: "Do I pay on this site?",
    a: "No. We confirm your spot first, then send payment details on WhatsApp. Nothing is charged here, and we never ask for card details in a DM.",
  },
  {
    q: "What happens if a trip is full?",
    a: "Join the waitlist, and mean it. Spots open more often than you would think, and we work the list in order. Insiders get bumped first.",
  },
  {
    q: "Where do you actually talk to me?",
    a: "WhatsApp, and that does not change. This is just the place that remembers where you stand, so nothing gets lost in a group chat.",
  },
];

function Meta({ items }: { items: string[] }) {
  return (
    <div className="meta">
      {items.map((item, i) => (
        <Fragment key={item}>
          {i > 0 && (
            <i className="sep" aria-hidden="true">
              ▶
            </i>
          )}
          <span>{item}</span>
        </Fragment>
      ))}
    </div>
  );
}

export function Landing() {
  const { trips, applyNew } = useStore();
  const { signInAsMember } = useSession();
  const router = useRouter();

  const [tripId, setTripId] = useState(trips[0].id);
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [sentPid, setSentPid] = useState<string | null>(null);

  const applyRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const pickTrip = (id: string) => {
    setTripId(id);
    setSentPid(null);
    applyRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    nameRef.current?.focus({ preventScroll: true });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSentPid(applyNew({ name, handle, tripId }));
    setName("");
    setHandle("");
  };

  const sentTrip = trips.find((t) => t.id === tripId) ?? trips[0];

  return (
    <>
      {/* ---------------- hero ---------------- */}
      <header className="hero">
        <div className="wrap hero-in">
          <div className="hero-copy">
            <span className="mono-label">▶ Egypt · small groups · since Nov &apos;24</span>
            <h1>
              Zoom out of routine.
              <br />
              <span className="gold">Zoom into life.</span>
            </h1>
            <p className="hero-lede">
              Trips around Egypt for people who would rather be in the water than in a meeting. Capped groups, the same
              crew every season, and a club that gets better the more you travel.
            </p>
            <div className="hero-cta">
              <a className="pill" href="#trips">
                See what is open
              </a>
              <a className="pill ghost" href="#club">
                How the club works
              </a>
            </div>
            <Meta items={["238 in the club", "12 trips run", "92% average fill"]} />
          </div>

          {/* Polaroids, not a banner: the source photos are 640px wide, so they
              stay sharp at this size instead of being stretched across the page. */}
          <div className="polaroids" aria-hidden="false">
            <figure className="polaroid p-1">
              <Image src="/scenery/sea.jpg" alt="Turquoise water and a boat off Ras Mohamed" width={275} height={275} quality={95} priority />
              <figcaption>ras mohamed, noon</figcaption>
            </figure>
            <figure className="polaroid p-2">
              <Image src="/scenery/sunset.jpg" alt="A yacht on the water at sunset" width={280} height={245} quality={95} />
              <figcaption>the 8pm run</figcaption>
            </figure>
          </div>
        </div>
        <div className="ridge ridge-down" aria-hidden="true" />
      </header>

      <main>
        {/* ---------------- trips ---------------- */}
        <section id="trips" className="sec wrap">
          <div className="sec-head">
            <div>
              <span className="mono-label">▶ Open now</span>
              <h2>
                Three trips taking
                <br />
                applications
              </h2>
            </div>
            <p className="sec-note">
              Groups are capped on purpose. When a trip fills, the waitlist is real, and Insiders get the next drop
              first.
            </p>
          </div>

          <div className="trip-grid">
            {trips.map((t) => {
              const c = tripCounts(t);
              const open = Math.max(0, t.capacity - c.accepted);
              const full = open === 0;
              const meta = [
                ...t.nightsLabel.split("·").map((s) => s.trim()),
                full ? "waitlist only" : `${open} spots open`,
              ];

              return (
                <article key={t.id} className="tcard">
                  <div className="tcard-photo">
                    <Image
                      src={t.img}
                      alt={`${t.name}, photo from @zoomouteg`}
                      fill
                      sizes="(max-width: 900px) 100vw, 350px"
                      style={{ objectFit: "cover", objectPosition: t.pos }}
                    />
                    <span className={`tcard-chip${full ? " full" : ""}`}>{full ? "Full" : t.chip}</span>
                    <div className="tcard-place">
                      <span className="pin" aria-hidden="true">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
                        </svg>
                      </span>
                      <span className="tcard-place-txt">
                        <b>{t.place}</b>
                        {t.region}
                      </span>
                    </div>
                  </div>

                  <div className="tcard-body">
                    <h3>{t.name}</h3>
                    <Meta items={meta} />
                    <p>{t.vibe}</p>
                    <div className="tcard-foot">
                      <span className="price">
                        {t.price}
                        <small>/person</small>
                      </span>
                      <button className="pill sm" onClick={() => pickTrip(t.id)}>
                        {full ? "Join waitlist →" : "Apply →"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ---------------- quote ---------------- */}
        <section className="sec wrap quote">
          <blockquote>
            <h2 className="gold">&ldquo;The same crew, every season.&rdquo;</h2>
            <p>
              I came on one trip in 2023 and I have not missed a season since. Half the people I call friends now are
              people I met on a bus to Siwa.
            </p>
            <cite>Nour Amr · Legend · 9 trips</cite>
          </blockquote>
        </section>

        {/* ---------------- the club ---------------- */}
        <section id="club" className="sec wrap">
          <div className="sec-head center">
            <div>
              <span className="mono-label">▶ The club</span>
              <h2>
                Travel more,
                <br />
                <span className="gold">get more access</span>
              </h2>
              <p className="sec-note">
                Tiers are earned by traveling, and by bringing people who travel. Not by paying more. Your card moves up
                on its own.
              </p>
            </div>
          </div>

          <div className="tier-grid">
            {TIER_LADDER.map((t) => (
              <article key={t} className={`tier-card tc-${t}`}>
                <div className="tc-top">
                  <TierBadge tier={t} />
                </div>
                <div className="tc-req mono">{tierRequirement(t)}</div>
                <p className="tc-pitch">{TIER_PITCH[t]}</p>
                <ul className="tc-perks">
                  {perksFor(t).map((p) => (
                    <li key={p.text}>{p.text}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* ---------------- how it works ---------------- */}
        <section id="how" className="sec wrap">
          <div className="sec-head center">
            <div>
              <span className="mono-label">▶ How it works</span>
              <h2>
                Apply once.
                <br />
                Stay in the loop.
              </h2>
              <p className="sec-note">
                The chat stays on WhatsApp, where it already is. This is just the place that remembers you.
              </p>
            </div>
          </div>

          <div className="steps">
            {STEPS.map((s) => (
              <div className="step" key={s.n}>
                <span className="step-n">{s.n}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- apply ---------------- */}
        <section id="apply" className="apply-block" ref={applyRef}>
          <div className="ridge ridge-up" aria-hidden="true" />
          <div className="wrap apply-in">
            <figure className="polaroid p-apply" aria-hidden="true">
              <Image src="/scenery/sea.jpg" alt="" width={275} height={275} quality={90} />
              <figcaption>see you out there</figcaption>
            </figure>

            {sentPid ? (
              <div className="apply-done">
                <span className="mono-label">▶ Application sent</span>
                <h2>
                  You&rsquo;re in <span className="gold">the queue</span>
                </h2>
                <p>
                  We have you down for <b>{sentTrip.name}</b>. We read every application, then come back to you on
                  WhatsApp. Your card is live already.
                </p>
                <div className="apply-actions">
                  <button
                    className="pill"
                    onClick={() => {
                      signInAsMember(sentPid);
                      router.push("/club");
                    }}
                  >
                    Open your member card →
                  </button>
                  <button className="pill ghost" onClick={() => setSentPid(null)}>
                    Apply for another trip
                  </button>
                </div>
                <p className="demo-note">
                  Demo: that application is now sitting in the owner&rsquo;s HQ, in the pending tab of {sentTrip.name}.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="apply-form">
                <span className="mono-label">▶ Apply</span>
                <h2>
                  Come <span className="gold">with us</span>
                </h2>
                <p className="apply-sub">
                  No account, no password. Tell us who you are and which trip, and we take it from there.
                </p>

                <div className="fields">
                  <label className="field">
                    <span>Your name</span>
                    <input
                      ref={nameRef}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Sara Hany"
                      required
                    />
                  </label>
                  <label className="field">
                    <span>Instagram handle</span>
                    <input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@sarahany" />
                  </label>
                  <label className="field">
                    <span>Which trip</span>
                    <select value={tripId} onChange={(e) => setTripId(e.target.value)}>
                      {trips.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} · {t.dates}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <button className="pill" type="submit">
                  Send application →
                </button>
                <p className="demo-note">
                  Demo: this drops straight into the owner&rsquo;s HQ as a pending application. Nothing is emailed, and
                  nothing is stored.
                </p>
              </form>
            )}
          </div>
          <div className="ridge ridge-down" aria-hidden="true" />
        </section>

        {/* ---------------- questions ---------------- */}
        <section id="faq" className="sec wrap">
          <div className="sec-head center">
            <div>
              <span className="mono-label">▶ Before you ask</span>
              <h2>Common questions</h2>
            </div>
          </div>

          <div className="faq">
            {FAQS.map((f) => (
              <details key={f.q}>
                <summary>
                  <span>{f.q}</span>
                  <i aria-hidden="true">+</i>
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ---------------- instagram + member strip ---------------- */}
        <section className="sec wrap">
          <div className="sec-head center">
            <div>
              <span className="mono-label">▶ The grid</span>
              <h2 className="ig-head">@zoomouteg</h2>
            </div>
          </div>
          <div className="ig-grid">
            {["/trips/canyon.jpg", "/trips/hurghada.jpg", "/scenery/sea.jpg", "/scenery/sunset.jpg"].map((src) => (
              <a key={src} href="https://instagram.com/zoomouteg" target="_blank" rel="noreferrer" className="ig-tile">
                <Image src={src} alt="" width={260} height={260} style={{ objectFit: "cover" }} />
              </a>
            ))}
          </div>

          <div className="member-strip">
            <div>
              <h2>Already traveled with us?</h2>
              <p>Your card, your tier, and what unlocks next are waiting.</p>
            </div>
            <Link className="pill" href="/signin">
              Sign in to your card →
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
