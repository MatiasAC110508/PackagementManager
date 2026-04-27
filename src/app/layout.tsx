import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IronHaul | Heavy Cargo Shipping",
  description:
    "Minimal heavy cargo shipping portal for oversized freight planning, client access, and shipment visibility.",
  other: {
    google: "notranslate",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      translate="no"
      suppressHydrationWarning
      className="notranslate"
      data-scroll-behavior="smooth"
    >
      <body suppressHydrationWarning className="notranslate antialiased">
        <div className="app-shell">
          <main className="flex flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="container mx-auto flex w-full flex-1">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
