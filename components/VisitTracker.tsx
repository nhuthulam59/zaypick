'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Records one page view per page load (not the admin panel itself).
// The visitor id lives only in this browser's sessionStorage.
export default function VisitTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    try {
      let vid = sessionStorage.getItem('zaypick_vid');
      if (!vid) {
        vid = `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
        sessionStorage.setItem('zaypick_vid', vid);
      }
      fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId: vid,
          path: window.location.pathname,
          referrer: document.referrer || '',
          device: window.innerWidth < 768 ? 'mobile' : 'desktop',
        }),
      }).catch(() => {});
    } catch {
      // Tracking must never break the page.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  return null;
}
