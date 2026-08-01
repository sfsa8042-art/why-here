import type { Metadata } from 'next';
import Link from 'next/link';
/**
 * DM Sans (variable) is self-hosted via the pinned @fontsource-variable/dm-sans
 * npm package — no build-time Google Fonts request, no manually committed font
 * files. The `wght.css` axis is imported here and consumed by --font in
 * globals.css as the "DM Sans Variable" family.
 */
import '@fontsource-variable/dm-sans/wght.css';
import './globals.css';
import { siteOrigin } from '@/lib/siteOrigin';

export const metadata: Metadata = {
  // Absolute base for canonical URLs + Open Graph / Twitter images (Stage 7.1).
  // Resolves NEXT_PUBLIC_SITE_URL → Vercel production domain → localhost.
  metadataBase: new URL(siteOrigin()),
  title: 'Why Here? — An Atlas of Industrial Advantage',
  description:
    'An evidence-based research instrument for how industrial advantage forms across places and over time.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="topbar">
          <Link href="/" className="wordmark">
            Why Here<span className="dot">.</span>
          </Link>
          <span className="tagline">Atlas of Industrial Advantage</span>
        </nav>
        <main className="wrap">{children}</main>
      </body>
    </html>
  );
}
