import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    // Legacy M1 routes → canonical Public Atlas V2 routes. These are permanent
    // replacements (308). The more specific `/atlas` route is listed first so it
    // can never be shadowed by the case route (the sources are exact paths, so
    // order is not strictly required, but this makes the intent explicit).
    // Query strings are preserved automatically by Next's redirect matching.
    return [
      {
        source: '/cases/netherlands-semiconductor-equipment/atlas',
        destination: '/atlas/netherlands-semiconductor-equipment/prototype',
        permanent: true,
      },
      {
        source: '/cases/netherlands-semiconductor-equipment',
        destination: '/evidence/netherlands-semiconductor-equipment',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
