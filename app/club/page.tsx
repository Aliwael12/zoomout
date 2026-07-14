import type { Metadata } from "next";
import { ClubScreen } from "@/components/club-card";

export const metadata: Metadata = { title: "Your card" };

export default function ClubPage() {
  return <ClubScreen />;
}
