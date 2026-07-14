import type { Metadata } from "next";
import { InsightsScreen } from "@/components/insights";

export const metadata: Metadata = { title: "Insights · HQ" };

export default function AdminInsightsPage() {
  return <InsightsScreen />;
}
