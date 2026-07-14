import type { Metadata } from "next";
import { MemberTripsScreen } from "@/components/member-trips";

export const metadata: Metadata = { title: "Your trips" };

export default function ClubTripsPage() {
  return <MemberTripsScreen />;
}
