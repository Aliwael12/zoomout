"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ */
/* Demo auth. There is no backend, so a "session" is just a role held  */
/* in React state and mirrored to localStorage so a refresh does not   */
/* dump you back on the landing page.                                  */
/*                                                                     */
/* The gate is client-side: it decides what renders, not what the      */
/* server is willing to send. That is fine for a pitch built on dummy  */
/* data. In v1 this becomes real auth plus Firestore rules, and the    */
/* private fields (rating, notes) never leave the server for a member. */
/* ------------------------------------------------------------------ */

export type Role = "admin" | "member";

export type Session = { role: "admin" } | { role: "member"; pid: string };

const KEY = "zo-session";

interface SessionValue {
  session: Session | null;
  /** False until localStorage has been read. Guards wait for it. */
  ready: boolean;
  signInAsOwner: () => void;
  signInAsMember: (pid: string) => void;
  signOut: () => void;
}

const SessionContext = createContext<SessionValue | null>(null);

function read(): Session | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Session;
    if (s?.role === "admin") return { role: "admin" };
    if (s?.role === "member" && typeof s.pid === "string") return { role: "member", pid: s.pid };
  } catch {
    /* corrupt or unavailable, treat as signed out */
  }
  return null;
}

function write(s: Session | null) {
  try {
    if (s) localStorage.setItem(KEY, JSON.stringify(s));
    else localStorage.removeItem(KEY);
  } catch {
    /* private mode, session just will not survive a refresh */
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(read());
    setReady(true);
  }, []);

  const set = useCallback((s: Session | null) => {
    setSession(s);
    write(s);
  }, []);

  const value = useMemo<SessionValue>(
    () => ({
      session,
      ready,
      signInAsOwner: () => set({ role: "admin" }),
      signInAsMember: (pid: string) => set({ role: "member", pid }),
      signOut: () => set(null),
    }),
    [session, ready, set],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside <SessionProvider>");
  return ctx;
}

/** Where a given session belongs when it lands somewhere it should not be. */
export function homeFor(session: Session | null): string {
  if (!session) return "/";
  return session.role === "admin" ? "/admin" : "/club";
}
