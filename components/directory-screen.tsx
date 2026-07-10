"use client";

import { useMemo, useState } from "react";
import { useStore } from "./store";
import { Avatar, SearchIcon, TierBadge } from "./ui";
import { refsTraveled, type Person, type Tier } from "@/lib/types";

type SortKey = "trips" | "refs" | "rating" | "name";

const SORTERS: Record<SortKey, (a: { p: Person }, b: { p: Person }) => number> = {
  trips: (a, b) => b.p.tripsCount - a.p.tripsCount || a.p.name.localeCompare(b.p.name),
  refs: (a, b) => refsTraveled(b.p) - refsTraveled(a.p) || b.p.tripsCount - a.p.tripsCount,
  rating: (a, b) => b.p.rating - a.p.rating || b.p.tripsCount - a.p.tripsCount,
  name: (a, b) => a.p.name.localeCompare(b.p.name),
};

export function DirectoryScreen() {
  const { people, openDrawer, showToast } = useStore();
  const [q, setQ] = useState("");
  const [tier, setTier] = useState<Tier | "all">("all");
  const [sort, setSort] = useState<SortKey>("trips");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return Object.entries(people)
      .map(([pid, p]) => ({ pid, p }))
      .filter(
        ({ p }) =>
          (tier === "all" || p.tier === tier) &&
          (!needle || p.name.toLowerCase().includes(needle) || p.handle.toLowerCase().includes(needle)),
      )
      .sort(SORTERS[sort]);
  }, [people, q, tier, sort]);

  return (
    <>
      <div className="section-eyebrow">Travelers · the whole community in one place</div>
      <div className="toolbar" style={{ marginTop: 0 }}>
        <div className="search">
          <SearchIcon />
          <input
            type="search"
            placeholder="Search travelers…"
            aria-label="Search travelers"
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
        <select className="ctrl" aria-label="Sort travelers" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
          <option value="trips">Most trips</option>
          <option value="refs">Most referrals traveled</option>
          <option value="rating">Highest rated</option>
          <option value="name">Name A-Z</option>
        </select>
        <button
          className="btn primary"
          onClick={() => showToast("In v1: quick-add with name, phone, IG handle, or a one-time import from a sheet.")}
        >
          + Add traveler
        </button>
      </div>

      <div className="dir-head" aria-hidden="true">
        <span />
        <span>Traveler</span>
        <span>Tier</span>
        <span>Trips</span>
        <span>Refs ✈</span>
        <span>Last trip</span>
        <span>Rating</span>
      </div>
      <div className="list">
        {rows.length === 0 && <div className="empty">No travelers match.</div>}
        {rows.map(({ pid, p }) => (
          <div
            key={pid}
            className="dir-row"
            tabIndex={0}
            role="button"
            aria-label={`Open ${p.name}'s profile`}
            onClick={() => openDrawer({ pid, tripId: null })}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target === e.currentTarget) openDrawer({ pid, tripId: null });
            }}
          >
            <Avatar person={p} />
            <div className="cell-id">
              <div className="p-name">{p.name}</div>
              <div className="p-handle">{p.handle}</div>
            </div>
            <TierBadge tier={p.tier} />
            <span className="dir-num d-hide">{p.tripsCount}</span>
            <span className="dir-num d-hide">{refsTraveled(p)}</span>
            <span className="dir-sub d-hide">
              {p.tripLog[0] ? `${p.tripLog[0].name} ${p.tripLog[0].when}` : "-"}
            </span>
            <span className="dir-num">{p.rating ? `★ ${p.rating}` : "-"}</span>
          </div>
        ))}
      </div>
    </>
  );
}
