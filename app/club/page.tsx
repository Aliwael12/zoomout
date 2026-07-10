import type { Metadata } from "next";
import { ClubScreen } from "@/components/club-card";

export const metadata: Metadata = { title: "Club" };

export default function ClubPage() {
  return <ClubScreen />;
}
