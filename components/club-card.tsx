"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "./session";
import { useStore } from "./store";
import { TierBadge } from "./ui";
import { hasPerk, PERKS, progressCopy, referralCode, tierProgress } from "@/lib/tiers";
import { refsTraveled, TIER_LABELS, type Applicant, type Trip } from "@/lib/types";

function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
        } catch {
          /* clipboard unavailable; demo only */
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}

const PAY_COPY = {
  paid: "paid in full",
  deposit: "deposit received",
  none: "deposit still due",
} as const;

/** The one trip that matters to a member right now, and what to say about it. */
function currentTrip(trips: Trip[], pid: string): { trip: Trip; applicant: Applicant } | null {
  const mine = trips
    .map((trip) => ({ trip, applicant: trip.applicants.find((a) => a.pid === pid) }))
    .filter((x): x is { trip: Trip; applicant: Applicant } => Boolean(x.applicant));

  return (
    mine.find((x) => x.applicant.status === "accepted") ??
    mine.find((x) => x.applicant.status === "pending") ??
    mine.find((x) => x.applicant.status === "waitlist") ??
    null
  );
}

export function ClubScreen() {
  const { session } = useSession();
  const { people, trips } = useStore();

  const pid = session?.role === "member" ? session.pid : null;
  const p = pid ? people[pid] : null;
  if (!pid || !p) return null;

  const refs = refsTraveled(p);
  const pr = tierProgress(p);
  const now = currentTrip(trips, pid);
  const code = referralCode(p);

  return (
    <div className="member-stage">
      <p className="member-note">
        One card, one question: <em>where do I stand, and what unlocks next.</em> The rating and the notes the owner
        keeps are not in this view, and not in the data it can reach.
      </p>

      <div className="club-card">
        <div className="cc-photo">
          <Image
            src="/trips/canyon.jpg"
            alt="Zoom Out travelers in a sandstone canyon, photo from @zoomouteg"
            fill
            priority
            sizes="400px"
            style={{ objectFit: "cover", objectPosition: "center 35%" }}
          />
        </div>

        <div className="cc-head">
          <Image className="cc-logo" src="/brand/logo.jpg" alt="" width={56} height={56} />
          <div className="cc-brand">Zoom Out Club</div>
          <div className="cc-name-row">
            <div>
              <div className="cc-name">{p.name}</div>
              <div className="cc-handle">
                {p.handle} · member since {p.joined}
              </div>
            </div>
            <TierBadge tier={p.tier} style={{ marginLeft: "auto" }} />
          </div>
        </div>

        <div className="cc-body">
          <div className="cc-stats">
            <div className="cc-stat">
              <b>{p.tripsCount}</b>
              <span>Trips</span>
            </div>
            <div className="cc-stat">
              <b>{refs}</b>
              <span>Refs traveled</span>
            </div>
            <div className="cc-stat">
              <b>{pr ? (pr.earned ? "✓" : pr.tripsToGo) : "✦"}</b>
              <span>{pr ? `To ${TIER_LABELS[pr.next]}` : "Top tier"}</span>
            </div>
          </div>

          <div>
            <div className="cc-progress-bar">
              <i style={{ width: `${pr ? pr.pct : 100}%` }} />
            </div>
            <div className="cc-progress-text">
              <span>{TIER_LABELS[p.tier]}</span>
              {pr ? (
                <span>
                  <b>{TIER_LABELS[pr.next]}</b> · {progressCopy(pr)}
                </span>
              ) : (
                <span>
                  <b>Top of the club.</b> Thank you for building it.
                </span>
              )}
            </div>
          </div>

          <div className="cc-next-trip">
            {now ? (
              <>
                <Image src={now.trip.img} alt="" width={52} height={52} style={{ objectFit: "cover", objectPosition: now.trip.pos }} />
                <div>
                  <div className="t">
                    {now.trip.name} · {now.trip.dates}
                  </div>
                  <div className="s">
                    {now.applicant.status === "accepted" && (
                      <>
                        <span className="yes">You&rsquo;re in ✓</span> · {PAY_COPY[now.applicant.payment]} · details on
                        WhatsApp
                      </>
                    )}
                    {now.applicant.status === "pending" && (
                      <>Application under review · we&rsquo;ll come back to you on WhatsApp</>
                    )}
                    {now.applicant.status === "waitlist" && (
                      <>On the waitlist · we&rsquo;ll message you the moment a spot opens</>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Image src={trips[0].img} alt="" width={52} height={52} style={{ objectFit: "cover", objectPosition: trips[0].pos }} />
                <div>
                  <div className="t">No trip booked yet</div>
                  <div className="s">
                    <Link href="/club/trips" className="cc-link">
                      See what is open →
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          <div>
            <div className="d-label" style={{ marginBottom: 4 }}>
              Your perks
            </div>
            {PERKS.map((perk) => {
              const on = hasPerk(p.tier, perk);
              return (
                <div className={`perk ${on ? "on" : "off"}`} key={perk.text}>
                  <span className="pk">{on ? "✓" : "🔒"}</span>
                  <span>
                    {perk.text}
                    {!on && <span className={`tag-tier tt-${perk.tier}`}>{TIER_LABELS[perk.tier]}</span>}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="cc-code">
            <div>
              <div className="code">{code}</div>
              <div className="sub">
                {refs === 0
                  ? "Nobody has traveled on your code yet"
                  : `${refs} friend${refs === 1 ? "" : "s"} traveled with your code`}
              </div>
            </div>
            <CopyCodeButton code={code} />
          </div>
        </div>

        <div className="cc-foot">Zoom out of routine. Zoom into life.</div>
      </div>
    </div>
  );
}
