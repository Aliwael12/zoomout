import { refsTraveled, TIER_ORDER, type Person, type Tier } from "./types";

/* ------------------------------------------------------------------ */
/* The club ladder. One source of truth, read by the member card, the  */
/* member trips list, and the public landing page.                     */
/*                                                                     */
/* Thresholds are the ones implied by the approved card copy: Malak    */
/* (4 trips, 3 referrals traveled) is "2 more trips or 3 referrals"    */
/* away from Legend, so Legend sits at 6 trips or 6 referrals.         */
/*                                                                     */
/* Tiers are earned, not auto-granted: the owner still assigns the     */
/* tier on the person record. This ladder only answers the member's    */
/* question, "what unlocks next".                                      */
/* ------------------------------------------------------------------ */

export const TIER_LADDER: Tier[] = ["new", "explorer", "insider", "legend"];

export const TIER_REQS: Record<Exclude<Tier, "new">, { trips: number; refs: number }> = {
  explorer: { trips: 2, refs: 2 },
  insider: { trips: 4, refs: 4 },
  legend: { trips: 6, refs: 6 },
};

export const TIER_PITCH: Record<Tier, string> = {
  new: "You applied. Every application gets read by a human.",
  explorer: "You have traveled with us. You are in the room.",
  insider: "The core. You get the trip before the grid does.",
  legend: "You built this. You travel on the house and you pick where we go.",
};

export function tierRequirement(tier: Tier): string {
  if (tier === "new") return "Apply once";
  const r = TIER_REQS[tier];
  return `${r.trips} trips, or ${r.refs} friends who traveled`;
}

/** The rung above `tier`, or null at the top. Never "new": that is the floor. */
export function nextTier(tier: Tier): Exclude<Tier, "new"> | null {
  const i = TIER_LADDER.indexOf(tier);
  return i < TIER_LADDER.length - 1 ? (TIER_LADDER[i + 1] as Exclude<Tier, "new">) : null;
}

export interface TierProgress {
  next: Exclude<Tier, "new">;
  tripsToGo: number;
  refsToGo: number;
  pct: number;
  /** Requirements met. The owner still confirms the promotion. */
  earned: boolean;
}

/** Progress toward the next rung. `null` once a member is a Legend. */
export function tierProgress(p: Person): TierProgress | null {
  const next = nextTier(p.tier);
  if (!next) return null;

  const req = TIER_REQS[next];
  const trips = p.tripsCount;
  const refs = refsTraveled(p);
  const pct = Math.min(100, Math.round(Math.max(trips / req.trips, refs / req.refs) * 100));

  const tripsToGo = Math.max(0, req.trips - trips);
  const refsToGo = Math.max(0, req.refs - refs);

  return { next, tripsToGo, refsToGo, pct, earned: tripsToGo === 0 || refsToGo === 0 };
}

const plural = (n: number, word: string) => `${n} more ${word}${n === 1 ? "" : "s"}`;

/** "2 more trips or 3 referrals", for the member card. */
export function progressCopy(pr: TierProgress): string {
  if (pr.earned) return "requirements met, we confirm it on your next trip";
  return `${plural(pr.tripsToGo, "trip")} or ${plural(pr.refsToGo, "referral")}`;
}

export interface Perk {
  /** Lowest tier that has this perk. */
  tier: Tier;
  text: string;
}

export const PERKS: Perk[] = [
  { tier: "new", text: "Apply to any open trip, every application gets read" },
  { tier: "explorer", text: "Your application is reviewed before new signups" },
  { tier: "insider", text: "48-hour early access to trip drops" },
  { tier: "insider", text: "+1 guest priority when a trip is full" },
  { tier: "insider", text: "Insider-only secret trips" },
  { tier: "legend", text: "Free spot on your 8th trip" },
  { tier: "legend", text: "Vote on the next destination" },
];

/** TIER_ORDER runs legend 0 to new 3, so "senior enough" is a <= test. */
export function hasPerk(tier: Tier, perk: Perk): boolean {
  return TIER_ORDER[tier] <= TIER_ORDER[perk.tier];
}

export function perksFor(tier: Tier): Perk[] {
  return PERKS.filter((p) => p.tier === tier);
}

/** A member's referral code. Malak Adel becomes MALAK-ZO. */
export function referralCode(p: Person): string {
  return `${p.name.split(" ")[0].toUpperCase()}-ZO`;
}
