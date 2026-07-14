import type { Metadata } from "next";
import { SignIn } from "@/components/signin";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <main className="wrap">
      <SignIn />
    </main>
  );
}
