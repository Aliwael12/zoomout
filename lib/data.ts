import type { Person, Referral, Tier, Trip, TripLogEntry } from "./types";

/* ------------------------------------------------------------------ */
/* Dummy data for the pitch. Trip names, prices, and photos are real   */
/* (from @zoomouteg); every person and number here is invented.        */
/* ------------------------------------------------------------------ */

function person(o: Partial<Person> & { name: string; handle: string; tier: Tier }): Person {
  return {
    tripsCount: 0,
    joined: "2025",
    source: "Instagram DM",
    rating: 0,
    notes: "",
    referredBy: null,
    tripLog: [],
    referrals: [],
    ...o,
  };
}

const log = (entries: [string, string][]): TripLogEntry[] =>
  entries.map(([name, when]) => ({ name, when }));
const refs = (entries: [string, Referral["status"]][]): Referral[] =>
  entries.map(([name, status]) => ({ name, status }));

export const PEOPLE: Record<string, Person> = {
  nour: person({
    name: "Nour Amr", handle: "@nour.amr", tier: "legend", tripsCount: 9,
    joined: "2023", source: "Founding member", rating: 5,
    tripLog: log([
      ["Nuweiba & Taba", "Jul '26"], ["Island Hopping", "Jun '26"],
      ["White Desert", "Mar '26"], ["Aswan & Nuba", "Feb '26"],
      ["Siwa", "Nov '25"], ["Dahab", "Sep '25"],
    ]),
    referrals: refs([
      ["Youssef Khaled", "traveled"], ["Nadine Fawzy", "traveled"],
      ["Menna Adel", "traveled"], ["Aly Ragab", "applied"],
    ]),
    notes: "The community anchor. Brings 3 to 4 people every season, and the front-of-bus mic is hers.",
  }),
  malak: person({
    name: "Malak Adel", handle: "@malak.adl", tier: "insider", tripsCount: 4,
    joined: "2024", source: "Referral", rating: 5,
    tripLog: log([
      ["Island Hopping", "Jun '26"], ["Nuweiba & Taba", "Jun '26"],
      ["White Desert", "Mar '26"], ["Dahab", "Nov '25"],
    ]),
    referrals: refs([
      ["Farida Hassan", "applied"], ["Omar Naguib", "traveled"],
      ["Sara Hany", "traveled"], ["Yehia Kamel", "traveled"],
    ]),
    notes: "Campfire energy. Vegetarian. Wants to co-host a trip someday. Good Legend candidate.",
  }),
  salma: person({
    name: "Salma Ibrahim", handle: "@salma.ib", tier: "insider", tripsCount: 5,
    joined: "2024", rating: 5,
    tripLog: log([
      ["Nuweiba & Taba", "Jul '26"], ["Island Hopping", "Jun '26"], ["Siwa", "Nov '25"],
    ]),
    referrals: refs([["Seif Eldin", "applied"], ["Nada Ashraf", "traveled"]]),
    notes: "Always pays same-day. Great with first-timers.",
  }),
  mariam: person({
    name: "Mariam Wael", handle: "@mariamw", tier: "insider", tripsCount: 6,
    joined: "2024", rating: 5,
    tripLog: log([
      ["Nuweiba & Taba", "Jun '26"], ["White Desert", "Mar '26"], ["Dahab", "Sep '25"],
    ]),
    referrals: refs([["Hazem Ali", "traveled"], ["Farah Samy", "accepted"]]),
    notes: "Window seat, always. Legend in the making.",
  }),
  yasmin: person({
    name: "Yasmin Nabil", handle: "@yasmin.nbl", tier: "insider", tripsCount: 5,
    joined: "2024", rating: 5,
    tripLog: log([
      ["Nuweiba & Taba", "Jul '26"], ["Island Hopping", "Jun '26"], ["Siwa", "Nov '25"],
    ]),
    referrals: refs([["Tarek Lotfy", "applied"]]),
    notes: "Asked for a double cabin. Travels with her sister.",
  }),
  hana: person({
    name: "Hana Sameh", handle: "@hana.sameh", tier: "explorer", tripsCount: 3,
    joined: "2025", rating: 4,
    tripLog: log([["Aswan & Nuba", "Feb '26"], ["Dahab", "Sep '25"]]),
    referrals: refs([["Dina Samir", "traveled"]]),
  }),
  rana: person({
    name: "Rana Magdy", handle: "@rana.mgd", tier: "explorer", tripsCount: 3,
    joined: "2025", rating: 4,
    tripLog: log([["White Desert", "Mar '26"], ["Cairo by Night", "Jan '26"]]),
  }),
  jana: person({
    name: "Jana Sherif", handle: "@jana.shrf", tier: "explorer", tripsCount: 3,
    joined: "2025", rating: 4,
    tripLog: log([["Island Hopping", "Jun '26"], ["Ras Mohamed", "Oct '25"]]),
  }),
  youssef: person({
    name: "Youssef Khaled", handle: "@yousseftravels", tier: "explorer", tripsCount: 2,
    joined: "2025", source: "Referral", referredBy: "Nour Amr", rating: 4,
    tripLog: log([["Nuweiba & Taba", "Jun '26"], ["Dahab", "Sep '25"]]),
    notes: "Great on Dahab. Asked about a photography slot this time.",
  }),
  omar: person({
    name: "Omar Tarek", handle: "@omar.trk", tier: "explorer", tripsCount: 3,
    joined: "2024", rating: 3,
    tripLog: log([
      ["Aswan & Nuba", "Feb '26"], ["Cairo by Night", "Jan '26"], ["Siwa", "Nov '25"],
    ]),
    notes: "Paid late on Aswan. Confirm deposit early this time.",
  }),
  nadine: person({
    name: "Nadine Fawzy", handle: "@nadine.fwz", tier: "explorer", tripsCount: 2,
    joined: "2025", source: "Referral", referredBy: "Nour Amr", rating: 4,
    tripLog: log([["Island Hopping", "Jun '26"], ["White Desert", "Mar '26"]]),
  }),
  laila: person({
    name: "Laila Mansour", handle: "@lailamans", tier: "explorer", tripsCount: 2,
    joined: "2025", rating: 4,
    tripLog: log([["Cairo by Night", "Jan '26"], ["Ras Mohamed", "Oct '25"]]),
    notes: "Waitlisted on capacity only. Bump first if a spot opens.",
  }),
  hussein: person({
    name: "Hussein Adel", handle: "@husseinadel", tier: "explorer", tripsCount: 2,
    joined: "2025", rating: 4,
    tripLog: log([["Aswan & Nuba", "Feb '26"], ["Ras Mohamed", "Oct '25"]]),
  }),
  habiba: person({
    name: "Habiba Osman", handle: "@habiba.osm", tier: "explorer", tripsCount: 2,
    joined: "2025", rating: 4,
    tripLog: log([["Cairo by Night", "Jan '26"], ["Dahab", "Sep '25"]]),
  }),
  ahmed: person({
    name: "Ahmed Fathy", handle: "@ahmedfat7y", tier: "new", tripsCount: 1,
    joined: "2025", rating: 3,
    tripLog: log([["Ras Mohamed", "Oct '25"]]),
    notes: "Quiet on Ras Mohamed, warmed up by day 2.",
  }),
  dina: person({
    name: "Dina Samir", handle: "@dinasamir", tier: "new", tripsCount: 1,
    joined: "2025", source: "Referral", referredBy: "Hana Sameh", rating: 3,
    tripLog: log([["Dahab", "Sep '25"]]),
  }),
  adam: person({
    name: "Adam Zaki", handle: "@adamzaki", tier: "new", tripsCount: 1,
    joined: "2025", rating: 3,
    tripLog: log([["Ras Mohamed", "Oct '25"]]),
  }),
  ziad: person({
    name: "Ziad Hesham", handle: "@ziadhsh", tier: "new", tripsCount: 1,
    joined: "2025", rating: 2,
    tripLog: log([["Cairo by Night", "Jan '26"]]),
    notes: "No-showed the meetup twice. Not this season.",
  }),
  farida: person({
    name: "Farida Hassan", handle: "@faridah.h", tier: "new",
    joined: "2026", source: "Referral", referredBy: "Malak Adel",
  }),
  karim: person({
    name: "Karim Mostafa", handle: "@karim.mst", tier: "new",
    joined: "2026", source: "Referral", referredBy: "Youssef Khaled",
  }),
  mostafa: person({ name: "Mostafa Gamal", handle: "@mgamal", tier: "new", joined: "2026" }),
  seif: person({
    name: "Seif Eldin", handle: "@seif.eldin", tier: "new",
    joined: "2026", source: "Referral", referredBy: "Salma Ibrahim",
  }),
  tarek: person({
    name: "Tarek Lotfy", handle: "@tareklot", tier: "new",
    joined: "2026", source: "Referral", referredBy: "Yasmin Nabil",
  }),
  aly: person({
    name: "Aly Ragab", handle: "@aly.rgb", tier: "new",
    joined: "2026", source: "Referral", referredBy: "Nour Amr",
  }),
};

const a = (pid: string, status: Trip["applicants"][number]["status"], payment: Trip["applicants"][number]["payment"] = "none") =>
  ({ pid, status, payment });

export const INITIAL_TRIPS: Trip[] = [
  {
    id: "hurghada",
    name: "Hurghada Island Hopping",
    dates: "Jul 23-26",
    nightsLabel: "4 days · 3 islands",
    price: "EGP 8,500",
    capacity: 16,
    vibe: "Boat days · zero stress · round 2",
    chip: "Selection open",
    img: "/trips/hurghada.jpg",
    pos: "center 62%",
    applicants: [
      a("nour", "accepted", "paid"), a("malak", "accepted", "deposit"),
      a("salma", "accepted", "paid"), a("mariam", "accepted", "paid"),
      a("yasmin", "accepted", "paid"), a("hana", "accepted", "deposit"),
      a("rana", "accepted", "deposit"), a("jana", "accepted", "paid"),
      a("laila", "waitlist"), a("seif", "waitlist"),
      a("ziad", "declined"),
      a("youssef", "pending"), a("farida", "pending"), a("omar", "pending"),
      a("karim", "pending"), a("ahmed", "pending"), a("mostafa", "pending"),
      a("nadine", "pending"), a("dina", "pending"),
    ],
  },
  {
    id: "nuweiba",
    name: "Nuweiba & Taba",
    dates: "Aug 13-16",
    nightsLabel: "3 nights · camps",
    price: "EGP 9,000",
    capacity: 14,
    vibe: "Lagoons · long weekend · solo-traveler friendly",
    chip: "Filling up",
    img: "/trips/nuweiba.jpg",
    pos: "center 30%",
    applicants: [
      a("hussein", "accepted", "deposit"),
      a("habiba", "pending"), a("adam", "pending"), a("tarek", "pending"), a("aly", "pending"),
    ],
  },
  {
    id: "rasmo",
    name: "Ras Mohamed Yacht Day",
    dates: "Sep 4-5",
    nightsLabel: "overnight on the water",
    price: "EGP 6,500",
    capacity: 12,
    vibe: "Reef mornings · deck sunsets",
    chip: "Announced yesterday",
    img: "/trips/rasmo.jpg",
    pos: "center 40%",
    applicants: [a("jana", "pending"), a("adam", "pending"), a("mostafa", "pending")],
  },
];

/* ---------------- insights (illustrative) ---------------- */

export const TIER_DIST: { tier: Tier; label: string; count: number }[] = [
  { tier: "legend", label: "Legend", count: 8 },
  { tier: "insider", label: "Insider", count: 38 },
  { tier: "explorer", label: "Explorer", count: 74 },
  { tier: "new", label: "New", count: 118 },
];

export const FUNNEL: { label: string; count: number }[] = [
  { label: "Referred", count: 96 },
  { label: "Applied", count: 71 },
  { label: "Accepted", count: 58 },
  { label: "Traveled", count: 49 },
];

export const FILLS: { name: string; when: string; pct: number; live?: boolean }[] = [
  { name: "Aswan", when: "Feb '26", pct: 86 },
  { name: "W. Desert", when: "Mar '26", pct: 100 },
  { name: "Nuweiba", when: "Jun '26", pct: 92 },
  { name: "Hurghada", when: "Jun '26", pct: 100 },
  { name: "Nuweiba", when: "Jul '26", pct: 96 },
  { name: "Hurghada", when: "Jul '26", pct: 50, live: true },
];

export const TOP_REFERRERS: { pid: string; sent: number; traveled: number }[] = [
  { pid: "nour", sent: 11, traveled: 7 },
  { pid: "malak", sent: 4, traveled: 3 },
  { pid: "salma", sent: 3, traveled: 2 },
  { pid: "yasmin", sent: 2, traveled: 2 },
  { pid: "hana", sent: 2, traveled: 1 },
];
