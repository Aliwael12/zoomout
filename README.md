# Zoom Out HQ: Pitch Demo

A clickable pitch demo for **Zoom Out** ([@zoomouteg](https://instagram.com/zoomouteg)), a traveler CRM + access-based membership club for an Instagram-native travel community. WhatsApp stays the chat; this is the system of record and status layer.

**Everything is dummy data.** No backend, no auth, no persistence. Statuses reset on reload. Trip names, prices, and photos are real (pulled from the brand's Instagram) so the demo lands as "this already exists for you."

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## The four screens

| Route | What it shows |
|---|---|
| `/` | **Trips**: the trip-selection workflow. Applicants with history, tier, referral source and private notes; accept / waitlist / decline with a live capacity meter |
| `/travelers` | **Travelers**: the CRM directory. Search, tier filter, sort; click anyone for their full profile |
| `/insights` | **Insights**: repeat rate, referral share, tier distribution, referral funnel, trip fill, top referrers |
| `/club` | **✦ Club**: the member-facing card. Status, progress to next tier, perks, referral code |

## Where things live

- `lib/data.ts`: all dummy people, trips, and insights numbers
- `lib/types.ts`: the data model
- `components/store.tsx`: client-side state (statuses, payments, ratings, notes, toasts, drawer)
- `app/globals.css`: the entire design system (brand tokens, light + dark themes)
- `public/brand`, `public/trips`: logo and photos from @zoomouteg

## After the pitch (v1 pilot roadmap)

- Firestore (data + security rules: private notes never reach the member surface)
- Auth: owner login + member auth (phone OTP vs magic link vs invite links; decision pending)
- Trip application links (Instagram bio/story to application form)
- Announcements-lite: compose once, send to a WhatsApp broadcast list + email (Resend)
- Deploy on Vercel

Explicitly **out** of v1: payment processing, WhatsApp API / automated comms, public leaderboard, native app.
