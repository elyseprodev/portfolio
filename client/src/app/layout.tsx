import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import "./globals.css";

import { AnimatedBackground } from "@/components/effects/AnimatedBackground";
import { EffectsRoot } from "@/components/effects/EffectsRoot";
import { PageTransition } from "@/components/effects/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { site } from "@/content/site";

export const metadata: Metadata = {
  ...(site.url ? { metadataBase: new URL(site.url) } : {}),
  title: {
    default: `${site.name} — ${site.developerName}, ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.developerName, url: site.github }],
  creator: site.developerName,
  publisher: site.developerName,
  category: "technology",
  keywords: [...site.keywords],
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.name,
    title: `${site.name} — ${site.developerName}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.developerName}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#08080b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="relative min-h-dvh antialiased">
        {/* Keeps content readable if JavaScript never runs. */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html:
                ".reveal{opacity:1 !important;transform:none !important}.page-transition{animation:none !important}",
            }}
          />
        </noscript>

        <AnimatedBackground />
        <EffectsRoot />
        <Navbar />

        <PageTransition>
          <main id="main-content" className="relative pt-24 pb-4 sm:pt-28">
            {children}
          </main>
        </PageTransition>

        <Footer />
      </body>
    </html>
  );
}
