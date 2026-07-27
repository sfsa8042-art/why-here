import type { Metadata } from 'next';
import Link from 'next/link';
import { DM_Sans } from 'next/font/google';
import './globals.css';

/**
 * DM Sans is genuinely loaded and self-hosted via next/font/google (no
 * external font request at runtime, no local font file). Its generated CSS
 * variable is applied to <html> and consumed by --font in globals.css.
 */
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
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
    <html lang="en" className={dmSans.variable}>
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
