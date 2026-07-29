import { redirect } from 'next/navigation';

/**
 * The atlas index is the product entry point. `/` redirects to `/atlas`.
 */
export default function HomePage() {
  redirect('/atlas');
}
