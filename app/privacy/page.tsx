import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy — ZayPick', description: 'How ZayPick handles your email, clicks and cookies. We do not sell your personal data.' };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl py-6">
      <h1 className="text-2xl font-black text-navy sm:text-3xl">Privacy Policy</h1>
      <p className="mt-4 leading-relaxed text-slate-700">ZayPick does not require an account, and we do not sell your personal data. This page explains what we collect, why, and what you can do about it.</p>
      <h2 className="mt-8 text-xl font-black text-navy">What we collect</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-slate-700">
        <li><strong>Deal-alert email:</strong> if you sign up for deal alerts, we store only your email address and the signup date, and use it only to send deal emails. You can unsubscribe at any time.</li>
        <li><strong>Visits and clicks:</strong> when you visit a page or click a &quot;Buy on Amazon&quot; link, we record the page, the time, your country and city, your device type, and a random visitor ID stored in your browser for this session, together with your IP address. This is only to count visitors, see which deals are popular, and spot abuse. It is visible only to the site admin, is never sold or shared, and is never linked to your name, email or Amazon account.</li>
        <li><strong>Nothing else:</strong> we do not ask for your name, address, payment details or phone number, and we do not run user accounts.</li>
      </ul>
      <h2 className="mt-8 text-xl font-black text-navy">Cookies and analytics</h2>
      <p className="mt-3 leading-relaxed text-slate-700">This site may use basic cookies and analytics as provided by its hosting platform, to keep the site working and to understand which pages are visited. We do not use advertising cookies to track you across other websites.</p>
      <h2 className="mt-8 text-xl font-black text-navy">Links to Amazon</h2>
      <p className="mt-3 leading-relaxed text-slate-700">When you click through to Amazon, Amazon&apos;s own privacy policy applies. Anything you do on Amazon — including signing in, searching and buying — is governed by Amazon, not by ZayPick.</p>
      <h2 className="mt-8 text-xl font-black text-navy">Your rights</h2>
      <p className="mt-3 leading-relaxed text-slate-700">You can unsubscribe from deal emails at any time using the link in the email, or by writing to us. If you would like us to delete the email address you signed up with, email <a className="font-bold text-blue-700 hover:underline" href="mailto:hello@zaypick.com">hello@zaypick.com</a> and we will remove it.</p>
      <h2 className="mt-8 text-xl font-black text-navy">Changes to this policy</h2>
      <p className="mt-3 leading-relaxed text-slate-700">If we change how we handle your data, we will update this page and change the date below.</p>
      <p className="mt-4 text-sm text-slate-500">Last updated: 23 November 2026. Contact: hello@zaypick.com.</p>
    </div>
  );
}
