import { initials, TIER_LABELS, type Payment, type Person, type Status, type Tier } from "@/lib/types";

export function Avatar({ person, size }: { person: Person; size?: "sm" | "lg" }) {
  return (
    <div className={`avatar av-${person.tier}${size ? ` ${size}` : ""}`} aria-hidden="true">
      {initials(person.name)}
    </div>
  );
}

export function TierBadge({ tier, style }: { tier: Tier; style?: React.CSSProperties }) {
  return (
    <span className={`tier-badge tb-${tier}`} style={style}>
      {TIER_LABELS[tier]}
    </span>
  );
}

const STATUS_LABELS: Record<Exclude<Status, "pending">, string> = {
  accepted: "Accepted",
  waitlist: "Waitlist",
  declined: "Declined",
};

export function StatusChip({ status }: { status: Exclude<Status, "pending"> }) {
  return <span className={`status-chip st-${status}`}>{STATUS_LABELS[status]}</span>;
}

const PAY_LABELS: Record<Payment, string> = { none: "-", deposit: "Deposit", paid: "Paid" };

export function PayChip({ payment }: { payment: Payment }) {
  return (
    <span className={`pay-chip pay-${payment}`}>
      <i />
      {PAY_LABELS[payment]}
    </span>
  );
}

export function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
