import type { Metadata } from "next";
import { Bricolage_Grotesque, Courier_Prime, DM_Sans, Reenie_Beanie } from "next/font/google";
import localFont from "next/font/local";
import { SessionProvider } from "@/components/session";
import { DataProvider } from "@/components/store";
import { ToastLayer } from "@/components/toast";
import { TooltipLayer } from "@/components/tooltip";
import "./globals.css";

/* HQ and the member card keep Bricolage (the approved system). The public
   site runs the Yonder type stack: Tanker display, DM Sans body, Courier
   Prime for field-note labels, Reenie Beanie for the polaroid scribbles. */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const tanker = localFont({
  src: "./fonts/Tanker-Regular.woff2",
  variable: "--font-tanker",
  display: "swap",
});

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm", display: "swap" });

const courier = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

const reenie = Reenie_Beanie({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-hand",
  display: "swap",
});

const fontVars = [bricolage, tanker, dmSans, courier, reenie].map((f) => f.variable).join(" ");

export const metadata: Metadata = {
  title: {
    default: "Zoom Out · Small-group trips around Egypt",
    template: "%s · Zoom Out",
  },
  description:
    "Zoom Out (@zoomouteg) runs capped, small-group trips around Egypt. Apply once, travel with the same crew, move up the club. Pitch demo: dummy data, no backend.",
};

/**
 * Root holds the providers only. Each surface brings its own chrome:
 * the public landing, the owner's HQ (/admin), and the member area (/club).
 *
 * The app is pinned to the light palette. The dark tokens stay in
 * globals.css (they are CVD-validated and may come back in v1), but
 * data-theme="light" keeps prefers-color-scheme from reaching them.
 */
/*
 * The font variables go on <html>, not <body>. `--display` is declared on
 * :root as var(--font-bricolage), and a custom property can only resolve
 * others defined at or above its own element. On <body> it resolved to
 * nothing, which quietly invalidated every font-family that used it.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" data-scroll-behavior="smooth" className={fontVars}>
      <body>
        <SessionProvider>
          <DataProvider>
            {children}
            <ToastLayer />
            <TooltipLayer />
          </DataProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
