import type { Metadata } from "next";
import { DirectoryScreen } from "@/components/directory-screen";

export const metadata: Metadata = { title: "Travelers · HQ" };

export default function AdminTravelersPage() {
  return <DirectoryScreen />;
}
