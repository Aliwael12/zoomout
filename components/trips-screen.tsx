"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { tripCounts, useStore } from "./store";
import { Avatar, PayChip, SearchIcon, StatusChip, TierBadge } from "./ui";
import {
  refsTraveled,
  STATUS_ORDER,
  TIER_ORDER,
  type Applicant,
  type Status,
  type Tier,
} from "@/lib/types";

type TabKey = "all" | Status;

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "waitlist", label: "Waitlist" },
  { key: "declined", label: "Declined" },
];

export function TripsScreen() {
  const { trips, people, setStatus, openDrawer, showToast } = useStore();
  const [tripId, setTripId] = useState(trips[0].id);
  const [tab, setTab] = useState<TabKey>("all");
  const [q, setQ] = useState("");
  const [tier, setTier] = useState<Tier | "all">("all");

  const trip = trips.find((t) => t.id === tripId) ?? trips[0];
  const c = tripCounts(trip);
  const remaining = Math.max(0, trip.capacity - c.accepted);
  const okPct = Math.min(100, (c.accepted / trip.capacity) * 100);
  const wlPct = Math.min(100 - okPct, (c.waitlist / trip.capacity) * 100);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const filtered = trip.applicants.filter((a) => {
      const p = people[a.pid];
      return (
        (tab === "all" || a.status === tab) &&
        (tier === "all" || p.tier === tier) &&
        (!needle ||
          p.name.toLowerCase().includes(needle) ||
          p.handle.toLowerCase().includes(needle) ||
          (p.referredBy ?? "").toLowerCase().includes(needle))
      );
    });
    return [...filtered].sort((x, y) => {
      const px = people[x.pid];
      const py = people[y.pid];
      return (
        STATUS_ORDER[x.status] - STATUS_ORDER[y.status] ||
        TIER_ORDER[px.tier] - TIER_ORDER[py.tier] ||
        px.name.localeCompare(py.name)
      );
    });
  }, [trip, people, tab, tier, q]);

  const switchTrip = (id: string) => {
    setTripId(id);
    setTab("all");
    setQ("");
  };

  const tabCount = (key: TabKey) => (key === "all" ? trip.applicants.length : c[key]);

  return (
    <>
      <div className="section-eyebrow">Trips</div>
      <div className="trip-cards">
        {trips.map((t) => {
          const tc = tripCounts(t);
          const pct = Math.min(100, (tc.accepted / t.capacity) * 100);
          return (
            <button key={t.id} className="trip-card" aria-pressed={t.id === tripId} onClick={() => switchTrip(t.id)}>
              <Image src={t.img} alt="" width={54} height={54} style={{ objectPosition: t.pos, objectFit: "cover" }} />
              <div className="t-body">
                <div className="t-name">{t.name}</div>
                <div className="t-meta">
                  {t.dates} · {tc.accepted}/{t.capacity} in · {tc.pending} pending
                </div>
                <div className="mini-meter">
                  <i style={{ width: `${pct}%` }} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="banner">
        <Image
          src={trip.img}
          alt={`${trip.name}, photo from @zoomouteg`}
          fill
          priority
          sizes="(max-width: 1100px) 100vw, 1060px"
          style={{ objectFit: "cover", objectPosition: trip.pos }}
        />
        <div className="shade" />
        <span className="ig-credit">photo · @zoomouteg</span>
        <div className="b-info">
          <div>
            <h1>{trip.name}</h1>
            <div className="b-sub">
              {trip.dates} · {trip.vibe}
            </div>
          </div>
          <span className="b-chip">{trip.chip}</span>
        </div>
      </div>

      <div className="trip-sub">
        <span>
          {trip.nightsLabel} · {trip.price} <span style={{ color: "var(--faint)" }}>· payments tracked manually</span>
        </span>
        <div className="head-actions">
          <button
            className="btn"
            onClick={() => showToast("In v1: compose once → WhatsApp broadcast list + email. No heavy comms build.")}
          >
            Broadcast
          </button>
          <button
            className="btn primary"
            onClick={() => showToast("In v1: a trip form that generates an application link for the Instagram bio / story.")}
          >
            New trip
          </button>
        </div>
      </div>

      <div className="meter-card">
        <div className="meter-top">
          <div className="meter-big">
            {c.accepted}
            <small> / {trip.capacity} confirmed</small>
          </div>
          <div className="meter-legend">
            <span className="lg">
              <i className="sw-ok" />
              <span>Confirmed {c.accepted}</span>
            </span>
            <span className="lg">
              <i className="sw-wl" />
              <span>Waitlist {c.waitlist}</span>
            </span>
            <span className="lg">
              <i className="sw-rm" />
              <span>Open {remaining}</span>
            </span>
          </div>
        </div>
        <div className="meter" role="img" aria-label={`Capacity: ${c.accepted} of ${trip.capacity} confirmed, ${c.waitlist} waitlisted`}>
          <div className="m-ok" style={{ width: `${okPct}%` }} />
          <div className="m-wl" style={{ width: `${wlPct}%` }} />
        </div>
        <div className="meter-foot">
          <span>{c.pending} pending review</span>
          <span>
            Deposits: {c.paid} paid in full, {c.deposit} partial
          </span>
          <span>{c.declined} declined</span>
        </div>
      </div>

      <div className="toolbar">
        <div className="tabs" role="group" aria-label="Filter by status">
          {TABS.map((t) => (
            <button key={t.key} aria-pressed={tab === t.key} onClick={() => setTab(t.key)}>
              {t.label} <b>{tabCount(t.key)}</b>
            </button>
          ))}
        </div>
        <div className="search">
          <SearchIcon />
          <input
            type="search"
            placeholder="Search name, handle, referrer…"
            aria-label="Search applicants"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select className="ctrl" aria-label="Filter by tier" value={tier} onChange={(e) => setTier(e.target.value as Tier | "all")}>
          <option value="all">All tiers</option>
          <option value="legend">Legend</option>
          <option value="insider">Insider</option>
          <option value="explorer">Explorer</option>
          <option value="new">New</option>
        </select>
      </div>

      <div className="list">
        {rows.length === 0 && <div className="empty">No one here. Try another filter, or go accept some travelers.</div>}
        {rows.map((a) => (
          <ApplicantRow
            key={a.pid}
            applicant={a}
            onOpen={() => openDrawer({ pid: a.pid, tripId: trip.id })}
            onSet={(status) => setStatus(trip.id, a.pid, status)}
          />
        ))}
      </div>
    </>
  );
}

function ApplicantRow({
  applicant,
  onOpen,
  onSet,
}: {
  applicant: Applicant;
  onOpen: () => void;
  onSet: (s: Status) => void;
}) {
  const { people } = useStore();
  const p = people[applicant.pid];
  const travs = refsTraveled(p);
  const lastTrip = p.tripLog[0]
    ? `· last ${p.tripLog[0].name} ${p.tripLog[0].when}`
    : "· first trip";

  return (
    <div
      className="row"
      tabIndex={0}
      role="button"
      aria-label={`Open ${p.name}'s profile`}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target === e.currentTarget) onOpen();
      }}
    >
      <Avatar person={p} />
      <div className="cell-id">
        <div className="p-name">
          {p.name} <TierBadge tier={p.tier} />
        </div>
        <div className="p-handle">{p.handle}</div>
      </div>
      <div className="cell-hist">
        <div className="h1">
          {p.tripsCount} trip{p.tripsCount === 1 ? "" : "s"} {lastTrip}
        </div>
        {p.referredBy ? (
          <span className="ref-chip">↗ via {p.referredBy}</span>
        ) : travs > 0 ? (
          <span className="ref-out">
            ★ {travs} referral{travs === 1 ? "" : "s"} traveled
          </span>
        ) : null}
      </div>
      <div className="cell-pay">
        <PayChip payment={applicant.payment} />
        {p.rating ? (
          <span className="rate">
            <b>★</b> {p.rating} · private
          </span>
        ) : (
          <span className="rate">unrated</span>
        )}
      </div>
      <div className="cell-act" onClick={(e) => e.stopPropagation()}>
        {applicant.status === "pending" ? (
          <>
            <button className="act accept" onClick={() => onSet("accepted")}>
              Accept
            </button>
            <button className="act waitlist" onClick={() => onSet("waitlist")}>
              Waitlist
            </button>
            <button className="act decline" aria-label={`Decline ${p.name}`} onClick={() => onSet("declined")}>
              ✕
            </button>
          </>
        ) : (
          <StatusChip status={applicant.status} />
        )}
      </div>
    </div>
  );
}
