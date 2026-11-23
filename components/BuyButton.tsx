'use client';

// "Buy on Amazon" button for the product detail page.
// Records the click (linked to this browser's visitor id) and then
// opens Amazon in a new tab, like the ProductCard button does.
export default function BuyButton({ productId, href, className }: { productId: string; href: string; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener"
      onClick={() => {
        try {
          const visitorId = sessionStorage.getItem('zaypick_vid') || '';
          fetch('/api/clicks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId, visitorId }) }).catch(() => {});
        } catch { /* never block the Amazon link */ }
      }}
      className={className}
    >
      Buy on Amazon →
    </a>
  );
}
