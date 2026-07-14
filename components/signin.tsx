"use client";

import { useRouter } from "next/navigation";
import { useSession } from "./session";
import { useStore } from "./store";
import { Avatar, TierBadge } from "./ui";

/* Two doors, no passwords. v1 replaces this with email for the team and
   phone OTP (or an invite link) for members. */

const OWNER_POINTS = [
  "Every applicant and every past traveler, on one list you own",
  "Accept, waitlist or decline, and watch capacity move",
  "Private notes and ratings that only you can see",
  "Insights: repeat rate, referral funnel, trip fill",
];

const DEMO_MEMBERS: { pid: string; why: string }[] = [
  { pid: "malak", why: "Insider, four trips in, accepted on Hurghada" },
  { pid: "nour", why: "Legend, the top of the ladder" },
  { pid: "farida", why: "New, first application still pending" },
];

export function SignIn() {
  const router = useRouter();
  const { signInAsOwner, signInAsMember } = useSession();
  const { people } = useStore();

  return (
    <div className="signin">
      <span className="mono-label">▶ Sign in</span>
      <h1>
        Two doors into <span className="gold">the same data</span>
      </h1>
      <p className="sec-note">
        The owner sees the whole community. A member sees only themselves. Pick a door to walk the demo.
      </p>

      <div className="doors">
        <section className="door">
          <div className="door-kicker">For the team</div>
          <h2>Zoom Out HQ</h2>
          <p className="door-sub">The system of record: trips, travelers, and the numbers behind them.</p>
          <ul className="door-list">
            {OWNER_POINTS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <button
            className="pill door-cta"
            onClick={() => {
              signInAsOwner();
              router.push("/admin");
            }}
          >
            Enter HQ →
          </button>
        </section>

        <section className="door">
          <div className="door-kicker">For travelers</div>
          <h2>Your club card</h2>
          <p className="door-sub">Where you stand, what unlocks next, and the trip you are on. Nothing else.</p>
          <div className="door-people">
            {DEMO_MEMBERS.map(({ pid, why }) => {
              const p = people[pid];
              if (!p) return null;
              return (
                <button
                  key={pid}
                  className="door-person"
                  onClick={() => {
                    signInAsMember(pid);
                    router.push("/club");
                  }}
                >
                  <Avatar person={p} />
                  <span className="dp-id">
                    <span className="dp-name">
                      {p.name} <TierBadge tier={p.tier} />
                    </span>
                    <span className="dp-why">{why}</span>
                  </span>
                  <span className="dp-go" aria-hidden="true">
                    →
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <p className="signin-note">
        Demo doors, no passwords. In v1: an email link for the team, phone OTP or an invite link for members.
      </p>
    </div>
  );
}
