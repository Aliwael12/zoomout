export type Tier = "new" | "explorer" | "insider" | "legend";
export type Status = "pending" | "accepted" | "waitlist" | "declined";
export type Payment = "none" | "deposit" | "paid";
export type ReferralStatus = "traveled" | "accepted" | "applied";

export interface TripLogEntry {
  name: string;
  when: string;
}

export interface Referral {
  name: string;
  status: ReferralStatus;
}

export interface Person {
  name: string;
  handle: string;
  tier: Tier;
  tripsCount: number;
  joined: string;
  source: string;
  rating: number;
  notes: string;
  referredBy: string | null;
  tripLog: TripLogEntry[];
  referrals: Referral[];
}

export interface Applicant {
  pid: string;
  status: Status;
  payment: Payment;
}

export interface Trip {
  id: string;
  name: string;
  dates: string;
  nightsLabel: string;
  price: string;
  capacity: number;
  vibe: string;
  chip: string;
  img: string;
  pos: string;
  /** Shown on the public trip cards: "Hurghada" / "Red Sea". */
  place: string;
  region: string;
  applicants: Applicant[];
}

export const TIER_LABELS: Record<Tier, string> = {
  new: "New",
  explorer: "Explorer",
  insider: "Insider",
  legend: "Legend",
};

export const STATUS_ORDER: Record<Status, number> = {
  pending: 0,
  waitlist: 1,
  accepted: 2,
  declined: 3,
};

export const TIER_ORDER: Record<Tier, number> = {
  legend: 0,
  insider: 1,
  explorer: 2,
  new: 3,
};

export function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function refsTraveled(p: Person): number {
  return p.referrals.filter((r) => r.status === "traveled").length;
}
