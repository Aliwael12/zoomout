# Zoom Out HQ: project context

Pitch demo (and future v1 pilot) for Zoom Out (@zoomouteg), an Egyptian Instagram-native travel community (~24k followers). Product: traveler CRM + access-based membership club. Positioning: **WhatsApp stays the chat; this app is the system of record + status layer.** The demo gets pitched to the brand owner; if he says yes, this repo grows into the real v1.

## Current state

- Next.js 16 (App Router) + TypeScript, no UI libraries, no Tailwind. The design system is hand-rolled CSS custom properties in `app/globals.css`, ported 1:1 from the approved artifact demo.
- 100% dummy data, in-memory only (`lib/data.ts` + `components/store.tsx`). Reload = reset. This is intentional for the pitch.
- Photos/logo are real brand assets pulled from the Instagram grid (owner pitch use).
- Copy style rule from the user: **no em dashes in any text**. Use commas, colons, periods, or the middot separator instead. This applies to UI copy, docs, and generated text in this repo.

## Structure

- `app/` has 4 routes: `/` (Trips, the trip-selection workflow), `/travelers` (CRM directory), `/insights` (metrics), `/club` (member card preview). Trips + Travelers are client pages (interactive); Insights + Club render statically.
- `components/store.tsx`: `DataProvider` context with trips/people state, `setStatus` (auto-waitlists when at capacity), `undo`, `setPayment`, `setRating`, `setNotes`, toast state, drawer state. All shared UI state lives here.
- `components/ui.tsx`: Avatar, TierBadge, StatusChip, PayChip primitives.
- `components/drawer.tsx`: traveler profile drawer. Trip-context mode shows accept/waitlist/decline + payment; global mode (opened from the directory) hides per-trip controls.
- `components/tooltip.tsx`: global `[data-tip]` hover/focus tooltip layer (used by insights charts).
- Theme: light + dark via `prefers-color-scheme` **and** a `data-theme` attribute on `<html>` (toggle in topbar, persisted to localStorage, no-flash inline script in `app/layout.tsx`).

## Design system (do not drift)

- Brand: gold `#F2C230` (CTAs, active-nav underline) + pine green `#24573F` (ink accents, primary buttons) on warm sand. Display font: Bricolage Grotesque via `next/font/google`.
- Tier palette is **CVD-validated** (dataviz skill validator, both modes): New blue `#506FC4`/`#6C86D4`, Explorer teal `#069186`/`#23A18F`, Insider orange `#D2622F`/`#D26A45`, Legend gold `#99660A`/`#B3882A`. Every tier appearance must carry a text label (that is what makes the near-pair orange/gold legal).
- Semantic status colors (ok/warn/bad) are separate from tiers; never reuse one for the other.

## Verify a change

`npm run build` must pass, then `npm run dev` and click through all 4 routes: accept someone on `/` (meter + tabs update, toast with undo appears), open a profile drawer from both `/` and `/travelers`, hover an insights bar (tooltip), and check dark mode via the topbar toggle.

## v1 pilot roadmap (after the owner meeting)

Firestore + security rules (private notes/ratings must be structurally unreachable from the member surface) · owner auth + member auth (phone OTP vs magic link vs invite links, undecided) · trip application form links for the IG bio · announcements-lite (compose once, send to a WhatsApp broadcast list + Resend email) · Vercel deploy. **Out of v1:** payment processing, WhatsApp Business API, leaderboard, native app.
