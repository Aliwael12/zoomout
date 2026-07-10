import type { Metadata } from "next";
import { DirectoryScreen } from "@/components/directory-screen";

export const metadata: Metadata = { title: "Travelers" };

export default function TravelersPage() {
  return <DirectoryScreen />;
}
