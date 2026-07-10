import type { Metadata } from "next";
import { InsightsScreen } from "@/components/insights";

export const metadata: Metadata = { title: "Insights" };

export default function InsightsPage() {
  return <InsightsScreen />;
}
