"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { INITIAL_TRIPS, PEOPLE } from "@/lib/data";
import type { Payment, Person, Status, Trip } from "@/lib/types";

export interface TripCounts {
  pending: number;
  accepted: number;
  waitlist: number;
  declined: number;
  paid: number;
  deposit: number;
}

export function tripCounts(t: Trip): TripCounts {
  const c: TripCounts = { pending: 0, accepted: 0, waitlist: 0, declined: 0, paid: 0, deposit: 0 };
  for (const a of t.applicants) {
    c[a.status]++;
    if (a.status === "accepted") {
      if (a.payment === "paid") c.paid++;
      if (a.payment === "deposit") c.deposit++;
    }
  }
  return c;
}

interface ToastState {
  msg: ReactNode;
  undoable: boolean;
}

export interface DrawerTarget {
  pid: string;
  /** null = opened from the directory, no per-trip controls */
  tripId: string | null;
}

export interface NewApplication {
  name: string;
  handle: string;
  tripId: string;
}

interface StoreValue {
  trips: Trip[];
  people: Record<string, Person>;
  /** Anyone who applied from the landing page this session, newest first. */
  newcomers: string[];
  toast: ToastState | null;
  drawer: DrawerTarget | null;
  setStatus: (tripId: string, pid: string, next: Status) => void;
  undo: () => void;
  setPayment: (tripId: string, pid: string, payment: Payment) => void;
  setRating: (pid: string, rating: number) => void;
  setNotes: (pid: string, notes: string) => void;
  /** An existing member applies to a trip from the member area. */
  apply: (tripId: string, pid: string) => void;
  /** A stranger applies from the public landing page. Returns the new pid. */
  applyNew: (input: NewApplication) => string;
  openDrawer: (target: DrawerTarget) => void;
  closeDrawer: () => void;
  showToast: (msg: ReactNode, undoable?: boolean) => void;
  dismissToast: () => void;
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const addApplicant = (trips: Trip[], tripId: string, pid: string): Trip[] =>
  trips.map((t) =>
    t.id === tripId && !t.applicants.some((a) => a.pid === pid)
      ? { ...t, applicants: [...t.applicants, { pid, status: "pending", payment: "none" }] }
      : t,
  );

const StoreContext = createContext<StoreValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);
  const [people, setPeople] = useState<Record<string, Person>>(PEOPLE);
  const [newcomers, setNewcomers] = useState<string[]>([]);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [drawer, setDrawer] = useState<DrawerTarget | null>(null);
  const lastAction = useRef<{ tripId: string; pid: string; prev: Status } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: ReactNode, undoable = false) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, undoable });
    toastTimer.current = setTimeout(() => setToast(null), 4500);
  }, []);

  const dismissToast = useCallback(() => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(null);
  }, []);

  const applyStatus = useCallback((tripId: string, pid: string, status: Status) => {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId
          ? { ...t, applicants: t.applicants.map((a) => (a.pid === pid ? { ...a, status } : a)) }
          : t,
      ),
    );
  }, []);

  const setStatus = useCallback(
    (tripId: string, pid: string, next: Status) => {
      const trip = trips.find((t) => t.id === tripId);
      const applicant = trip?.applicants.find((a) => a.pid === pid);
      if (!trip || !applicant || applicant.status === next) return;

      const p = people[pid];
      const c = tripCounts(trip);
      lastAction.current = { tripId, pid, prev: applicant.status };

      if (next === "accepted" && c.accepted >= trip.capacity) {
        applyStatus(tripId, pid, "waitlist");
        showToast(
          <span>
            {trip.name} is full, so <b>{p.name}</b> moved to the waitlist instead
          </span>,
          true,
        );
        return;
      }

      applyStatus(tripId, pid, next);
      const verb =
        next === "accepted" ? "accepted ✓" : next === "waitlist" ? "moved to the waitlist" : "declined";
      showToast(
        <span>
          <b>{p.name}</b> {verb}
        </span>,
        true,
      );
    },
    [trips, people, applyStatus, showToast],
  );

  const undo = useCallback(() => {
    const la = lastAction.current;
    if (!la) return;
    lastAction.current = null;
    applyStatus(la.tripId, la.pid, la.prev);
    showToast("Undone.");
  }, [applyStatus, showToast]);

  const setPayment = useCallback((tripId: string, pid: string, payment: Payment) => {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId
          ? { ...t, applicants: t.applicants.map((a) => (a.pid === pid ? { ...a, payment } : a)) }
          : t,
      ),
    );
  }, []);

  const setRating = useCallback((pid: string, rating: number) => {
    setPeople((prev) => ({ ...prev, [pid]: { ...prev[pid], rating } }));
  }, []);

  const setNotes = useCallback((pid: string, notes: string) => {
    setPeople((prev) => ({ ...prev, [pid]: { ...prev[pid], notes } }));
  }, []);

  const apply = useCallback((tripId: string, pid: string) => {
    setTrips((prev) => addApplicant(prev, tripId, pid));
  }, []);

  const applyNew = useCallback(
    ({ name, handle, tripId }: NewApplication) => {
      const clean = name.trim().replace(/\s+/g, " ");
      const base = slugify(clean.split(" ")[0]) || "traveler";
      let pid = base;
      for (let n = 2; people[pid]; n++) pid = `${base}${n}`;

      const at = handle.trim().replace(/^@+/, "");
      setPeople((prev) => ({
        ...prev,
        [pid]: {
          name: clean,
          handle: at ? `@${at}` : "@pending",
          tier: "new",
          tripsCount: 0,
          joined: "2026",
          source: "Trip form · Instagram bio",
          rating: 0,
          notes: "",
          referredBy: null,
          tripLog: [],
          referrals: [],
        },
      }));
      setTrips((prev) => addApplicant(prev, tripId, pid));
      setNewcomers((prev) => [pid, ...prev]);
      return pid;
    },
    [people],
  );

  const openDrawer = useCallback((target: DrawerTarget) => setDrawer(target), []);
  const closeDrawer = useCallback(() => setDrawer(null), []);

  const value = useMemo<StoreValue>(
    () => ({
      trips, people, newcomers, toast, drawer,
      setStatus, undo, setPayment, setRating, setNotes, apply, applyNew,
      openDrawer, closeDrawer, showToast, dismissToast,
    }),
    [trips, people, newcomers, toast, drawer, setStatus, undo, setPayment, setRating, setNotes, apply, applyNew, openDrawer, closeDrawer, showToast, dismissToast],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <DataProvider>");
  return ctx;
}
