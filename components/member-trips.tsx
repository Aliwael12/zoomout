"use client";

import Image from "next/image";
import { useSession } from "./session";
import { tripCounts, useStore } from "./store";
import { TIER_ORDER, type Applicant } from "@/lib/types";

/* What a member sees of the trips: their own row in each one, and nothing
   about anybody else. No applicant list, no capacity breakdown, no notes. */

const PAY_COPY = {
  paid: "Paid in full",
  deposit: "Deposit received, balance due before we go",
  none: "Deposit not received yet",
} as const;

function MyState({ applicant }: { applicant: Applicant }) {
  if (applicant.status === "accepted") {
    return (
      <div className="m-state ok">
        <span className="status-chip st-accepted">You&rsquo;re in</span>
        <span className="m-state-sub">{PAY_COPY[applicant.payment]} · details on WhatsApp</span>
      </div>
    );
  }
  if (applicant.status === "waitlist") {
    return (
      <div className="m-state">
        <span className="status-chip st-waitlist">Waitlist</span>
        <span className="m-state-sub">You&rsquo;re next in line. We&rsquo;ll message you the moment a spot opens.</span>
      </div>
    );
  }
  if (applicant.status === "declined") {
    return (
      <div className="m-state">
        <span className="m-state-flat">Not this time</span>
        <span className="m-state-sub">This one did not work out. We hope to see you on the next trip.</span>
      </div>
    );
  }
  return (
    <div className="m-state">
      <span className="m-state-flat">Under review</span>
      <span className="m-state-sub">We&rsquo;ve got your application. We&rsquo;ll come back to you on WhatsApp soon.</span>
    </div>
  );
}

export function MemberTripsScreen() {
  const { session } = useSession();
  const { trips, people, apply, showToast } = useStore();

  const pid = session?.role === "member" ? session.pid : null;
  const p = pid ? people[pid] : null;
  if (!pid || !p) return null;

  const early = TIER_ORDER[p.tier] <= TIER_ORDER.insider;

  return (
    <>
      <div className="section-eyebrow">Trips</div>
      <h1 className="sec-h">What is open</h1>
      <p className="sec-sub">
        {early
          ? "You are an Insider, so you are seeing these 48 hours before they hit the grid."
          : "Apply for any of these. Travel twice and the next drop reaches you before the grid sees it."}
      </p>

      <div className="m-trips">
        {trips.map((t) => {
          const mine = t.applicants.find((a) => a.pid === pid);
          const c = tripCounts(t);
          const open = Math.max(0, t.capacity - c.accepted);
          const full = open === 0;

          return (
            <article key={t.id} className="m-trip">
              <Image
                src={t.img}
                alt={`${t.name}, photo from @zoomouteg`}
                width={96}
                height={96}
                style={{ objectFit: "cover", objectPosition: t.pos }}
              />
              <div className="m-trip-body">
                <h3>{t.name}</h3>
                <div className="m-trip-when">
                  {t.dates} · {t.nightsLabel} · {t.price}
                </div>
                <div className={`spots${full ? " full" : ""}`}>
                  {full ? "Full, waitlist only" : `${open} of ${t.capacity} spots open`}
                </div>
              </div>

              {mine ? (
                <MyState applicant={mine} />
              ) : (
                <div className="m-state">
                  <button
                    className="btn primary"
                    onClick={() => {
                      apply(t.id, pid);
                      showToast(
                        <span>
                          You&rsquo;re in the queue for <b>{t.name}</b>. We&rsquo;ll message you on WhatsApp soon.
                        </span>,
                      );
                    }}
                  >
                    {full ? "Join the waitlist" : "Apply"}
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}
