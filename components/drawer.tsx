"use client";

import { useEffect } from "react";
import { useStore } from "./store";
import { Avatar, TierBadge } from "./ui";
import { TIER_LABELS, type Payment } from "@/lib/types";

const PAY_OPTIONS: { value: Payment; label: string }[] = [
  { value: "none", label: "Not paid" },
  { value: "deposit", label: "Deposit" },
  { value: "paid", label: "Paid in full" },
];

export function Drawer() {
  const { drawer, trips, people, closeDrawer, setStatus, setPayment, setRating, setNotes } = useStore();

  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawer, closeDrawer]);

  const p = drawer ? people[drawer.pid] : null;
  const trip = drawer?.tripId ? trips.find((t) => t.id === drawer.tripId) : null;
  const applicant = trip && drawer ? trip.applicants.find((a) => a.pid === drawer.pid) : null;

  return (
    <>
      <div className={`overlay${drawer ? " open" : ""}`} onClick={closeDrawer} />
      <aside className={`drawer${drawer ? " open" : ""}`} role="dialog" aria-modal="true" aria-label="Traveler profile">
        {drawer && p && (
          <>
            <button className="d-close" onClick={closeDrawer} aria-label="Close profile">
              ✕
            </button>
            <div className="d-head">
              <Avatar person={p} size="lg" />
              <div>
                <div className="d-name">{p.name}</div>
                <div className="d-sub">
                  {p.handle} · <TierBadge tier={p.tier} /> · {p.tripsCount} trips
                </div>
              </div>
            </div>

            {trip && applicant && (
              <>
                <div className="d-context">Application · {trip.name}</div>
                <div className="d-actions">
                  <button
                    className="act accept"
                    aria-pressed={applicant.status === "accepted"}
                    onClick={() => setStatus(trip.id, drawer.pid, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className={`act waitlist${applicant.status === "waitlist" ? " wl-on" : ""}`}
                    aria-pressed={applicant.status === "waitlist"}
                    onClick={() => setStatus(trip.id, drawer.pid, "waitlist")}
                  >
                    Waitlist
                  </button>
                  <button
                    className={`act decline${applicant.status === "declined" ? " dc-on" : ""}`}
                    aria-pressed={applicant.status === "declined"}
                    onClick={() => setStatus(trip.id, drawer.pid, "declined")}
                  >
                    Decline
                  </button>
                </div>
              </>
            )}

            <div className="d-section">
              <div className="d-label">Trips with Zoom Out</div>
              {p.tripLog.length ? (
                p.tripLog.map((h) => (
                  <div className="hist-item" key={`${h.name}-${h.when}`}>
                    <span>{h.name}</span>
                    <span className="when">{h.when}</span>
                  </div>
                ))
              ) : (
                <div className="none-note">
                  First application, no trips yet{p.referredBy ? `, but vouched for by ${p.referredBy}` : ""}.
                </div>
              )}
            </div>

            <div className="d-section">
              <div className="d-label">Referrals given</div>
              {p.referrals.length ? (
                p.referrals.map((r) => (
                  <div className="ref-line" key={r.name}>
                    <span>{r.name}</span>
                    <span className={`ref-status rs-${r.status}`}>{r.status}</span>
                  </div>
                ))
              ) : (
                <div className="none-note">None yet.</div>
              )}
              {p.referredBy && (
                <div className="ref-line" style={{ borderTop: "1px solid var(--line)", marginTop: 4 }}>
                  <span className="who">Referred here by</span>
                  <span className="by">{p.referredBy}</span>
                </div>
              )}
            </div>

            {trip && applicant && (
              <div className="d-section">
                <div className="d-label">
                  Payment · this trip <span className="priv">manual entry</span>
                </div>
                <div className="pay-set">
                  {PAY_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      data-pay={o.value}
                      aria-pressed={applicant.payment === o.value}
                      onClick={() => setPayment(trip.id, drawer.pid, o.value)}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
                <div className="pay-note">v1 tracks status only, no payment processing.</div>
              </div>
            )}

            <div className="d-section">
              <div className="d-label">
                Private rating <span className="priv">only you see this</span>
              </div>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    className={p.rating >= n ? "on" : undefined}
                    aria-label={`Rate ${n} of 5`}
                    onClick={() => setRating(drawer.pid, n)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="d-section">
              <div className="d-label">
                Private notes <span className="priv">never shown to the member</span>
              </div>
              <textarea
                className="notes"
                key={drawer.pid}
                defaultValue={p.notes}
                placeholder="Anything future-you should know…"
                onChange={(e) => setNotes(drawer.pid, e.target.value)}
              />
            </div>

            <div className="d-meta">
              <span>Joined {p.joined}</span>
              <span>Source: {p.source}</span>
              <span>Tier: {TIER_LABELS[p.tier]}</span>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
