import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { DataProvider } from "@/components/store";
import { Topbar } from "@/components/topbar";
import { Drawer } from "@/components/drawer";
import { ToastLayer } from "@/components/toast";
import { TooltipLayer } from "@/components/tooltip";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Zoom Out HQ · Pitch Demo",
    template: "%s · Zoom Out HQ",
  },
  description:
    "Traveler CRM + membership club pitch demo for Zoom Out (@zoomouteg). Dummy data, no backend. WhatsApp stays the chat; this is the system of record.",
};

const themeScript = `(function(){try{var t=localStorage.getItem('zo-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={bricolage.variable}>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <DataProvider>
          <Topbar />
          <main className="wrap">{children}</main>
          <footer className="site wrap">
            <span>
              <strong>Pitch demo</strong>: dummy data, photos from @zoomouteg, no backend yet.
            </span>
            <span>WhatsApp stays the chat; this is the system of record.</span>
          </footer>
          <Drawer />
          <ToastLayer />
          <TooltipLayer />
        </DataProvider>
      </body>
    </html>
  );
}
