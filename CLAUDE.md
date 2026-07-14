# Zoom Out HQ: project context

Pitch demo (and future v1 pilot) for Zoom Out (@zoomouteg), an Egyptian Instagram-native travel community (~24k followers). Product: traveler CRM + access-based membership club. Positioning: **WhatsApp stays the chat; this app is the system of record + status layer.** The demo gets pitched to the brand owner; if he says yes, this repo grows into the real v1.

## Current state

- Next.js 16 (App Router) + TypeScript, no UI libraries, no Tailwind. Hand-rolled CSS custom properties in `app/globals.css`.
- **Three surfaces, one dataset**: a public landing page (signed out), the owner's HQ (`/admin`), and the member area (`/club`).
- 100% dummy data, in-memory only (`lib/data.ts` + `components/store.tsx`). Reload = reset. This is intentional for the pitch.
- Photos/logo are real brand assets pulled from the Instagram grid (owner pitch use). **They are only 640px wide**, so never stretch one across a full-bleed banner: at that scale it visibly upscales. Use them at or below native size (cards, polaroids, tiles). `public/scenery/` holds the two people-free crops (sea, sunset) cut out of `rasmo.jpg`.
- Copy style rule from the user: **no em dashes in any text**. Use commas, colons, periods, or the middot separator instead. This applies to UI copy, docs, and generated text in this repo.
- Pinned to the light palette (`<html data-theme="light">`, no theme toggle). The dark tokens stay in `globals.css` because they are CVD-validated, but nothing reaches them.

## The demo loop (the thing to protect)

A stranger applies on the landing page, and that application lands in the owner's HQ as a pending applicant. The owner accepts them, and the traveler's club card flips to "You're in". That loop is the pitch. `store.applyNew()` creates the person and the application; `newcomers` keeps them in the topbar view switcher so you can hop back to the card you just accepted.

## Structure

- Routes: `app/(public)/` = `/` (landing) + `/signin`; `app/admin/` = trips, `/admin/travelers`, `/admin/insights`; `app/club/` = member card + `/club/trips`.
- `components/session.tsx`: demo auth. A "session" is a role (`admin`, or `member` + pid) in React state, mirrored to localStorage. No backend, so the gate is client-side: it decides what renders, not what the server sends.
- `components/shell.tsx`: `PublicShell`, `AdminShell`, `MemberShell`. Each surface's chrome + its route guard. **The `Drawer` (private rating and notes) is mounted only inside `AdminShell`**, so the member surface has no way to render it. Keep it that way.
- `components/store.tsx`: `DataProvider` with trips/people/newcomers, `setStatus` (auto-waitlists at capacity), `undo`, `setPayment`, `setRating`, `setNotes`, `apply`, `applyNew`, toast + drawer state.
- `lib/tiers.ts`: the club ladder (Explorer 2 trips, Insider 4, Legend 6, or the same count of referrals who traveled), progress, and perks. One source of truth for the member card and the landing page's club section.
- `components/ui.tsx`: Avatar, TierBadge, StatusChip, PayChip. `components/tooltip.tsx`: global `[data-tip]` layer (insights charts).

## Design system (do not drift)

Two design languages, deliberately:

- **HQ + member card**: the approved system. Gold `#F2C230` + pine green `#24573F` on warm sand. Display font Bricolage Grotesque.
- **Public site** (landing + sign-in, everything under `.landing`): structure and motifs ported from the Yonder Framer template, recoloured to Zoom Out. Tanker (self-hosted, `app/fonts/`) for caps headings, DM Sans body, Courier Prime for field labels and meta rows, Reenie Beanie for polaroid captions. Pine green blocks on sand ground, gold pills instead of Yonder's orange, torn ridge edges (`.ridge`), polaroids, contour-line panels, `▶` separators.
- Tier palette is **CVD-validated**: New blue `#506FC4`, Explorer teal `#069186`, Insider orange `#D2622F`, Legend gold `#99660A`. Every tier appearance must carry a text label (that is what makes the near-pair orange/gold legal).
- Semantic status colors (ok/warn/bad) are separate from tiers; never reuse one for the other.

### Two traps in `globals.css`

1. `--display` is `var(--font-bricolage)`, and a custom property can only resolve others defined **at or above its own element**. The `next/font` variables must therefore go on `<html>`, not `<body>`, or `--display` silently computes to nothing and every heading falls back to the inherited font.
2. **Never edit this file with PowerShell `Get-Content`/`Set-Content`.** PS 5.1 reads as Windows-1252 and writes a BOM: the BOM eats the whole first `:root` block, and non-ASCII glyphs (`▶`, `✓`) turn to mojibake. Use the editor tools.

## Verify a change

`npm run build`, then `npm run dev` and walk the loop: apply on `/` as a new name, open the member card from the success panel, switch to Owner in the topbar switcher, find them in the trip's Pending tab, Accept (meter + tabs move, toast with undo), switch back to their card and confirm it reads "You're in". Then check `/admin/travelers` (drawer opens), `/admin/insights` (hover a bar for a tooltip), and `/club/trips`. **Use in-app navigation**: a full page reload resets the in-memory store.

## v1 pilot roadmap (after the owner meeting)

Firestore + security rules (private notes/ratings must be structurally unreachable from the member surface, which the shell split already models on the client) · real owner auth + member auth (phone OTP vs magic link vs invite links, undecided) · the landing apply form posting for real · announcements-lite (compose once, send to a WhatsApp broadcast list + Resend email) · Vercel deploy. **Out of v1:** payment processing, WhatsApp Business API, leaderboard, native app.
