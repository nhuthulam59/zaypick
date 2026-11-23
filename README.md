# ZayPick — Amazon Affiliate Superstore

ZayPick is a premium Amazon affiliate superstore for **all** product categories —
Electronics, Fashion, Home, Beauty and Sports. It is **affiliate-only**: there is
no cart, no checkout, no account, no wishlist and no compare. Every buy action
is a prominent **“Buy on Amazon”** button that opens Amazon in a new tab with
your Amazon Associate Tag appended, records the click, and shows
“Price as of <date>” under the price.

> **Disclosure:** As an Amazon Associate I earn from qualifying purchases.

## What is included

- **Frontend:** Home (Seasonal Savings hero, Shop by Category, Best Deals grid),
  Shop with department / price / rating filters + sorting, product pages
  (gallery, price/buy box, highlights, description, pros & cons, related
  products, ASIN), category pages, Buying Guides, About, Contact, Privacy
  Policy, Affiliate Disclosure.
- **Backend:** API routes under `/api` — products, categories, guides,
  settings, clicks, subscribers, and a whole-database export/import
  (`/api/db`). Data lives in `data/db.json`, seeded with 15 products across
  all 5 categories.
- **Admin panel:** `/admin` — password-protected dashboard with stats and a
  click leaderboard, add/edit/delete products, categories and guides, edit
  hero text / site name / Associate Tag in Settings, view deal-alert
  subscribers, Export/Import JSON, and a Refresh Prices button.

## Admin login

- URL: `/admin` (you are redirected to `/admin/login` if not logged in)
- **There is no default password.** Admin login is disabled until you set
  `ADMIN_PASSWORD` to a strong password (in Vercel: Settings → Environment
  Variables), then redeploy. Never commit a real password to GitHub.
- After 5 wrong password attempts from one IP in 15 minutes, login is
  blocked for a while. The session lasts 12 hours.
- Your Amazon Associate Tag is set in Admin → Settings, or in
  `.env.local` as `NEXT_PUBLIC_AMAZON_TAG` (default in the seed data is
  `zaypick-20` — replace it with your real tag).

## Run locally

```bash
npm install
cp .env.example .env.local   # then edit ADMIN_PASSWORD
npm run dev                  # http://localhost:3000
npm run build                # production build check
npm start
```

## Upload to GitHub (step by step)

1. On GitHub, create a new repository named **`zaypick`** (public, add a
   README — or leave it empty; either works).
2. On your computer, in this project folder, run:
   ```bash
   git init
   git add .
   git commit -m "ZayPick v1"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/zaypick.git
   git push -u origin main
   ```
   Replace `YOUR-USERNAME` with your GitHub username.
   Or upload the files with GitHub's web uploader: open the new repository
   → **Add file → Upload files** → drag this whole folder in → Commit.
3. Do **not** upload `node_modules`, `.next` or `.env` — they are already
   in `.gitignore`.

## Deploy on Vercel (step by step)

1. Go to [vercel.com](https://vercel.com) and sign in (use the same account
   you connected — GitHub sign-in is easiest).
2. Click **Add New → Project**, choose **Import** next to the `zaypick`
   repository, and click **Deploy**. No extra settings are needed — Vercel
   detects Next.js automatically.
3. Set the admin password: in the Vercel dashboard go to your project →
   **Settings → Environment Variables**, add `ADMIN_PASSWORD` with a strong
   password, then **Deployments → Redeploy**.
4. Your free live address will be **`https://zaypick.vercel.app`**
   (Vercel's free subdomain is `.vercel.app`, not `.vercel.com`).
   The project name in Vercel must be `zaypick` for that exact address —
   if Vercel suggests another name, rename the project to `zaypick` in
   Settings → General.
5. To add your own domain later: Vercel project → Settings → Domains →
   add your domain and follow the DNS instructions Vercel shows.

Every `git push` to `main` on GitHub automatically redeploys on Vercel.

## Honest limitation — data storage on Vercel

Admin edits are stored in `data/db.json`, read/written with the filesystem.
That works locally and in development, but **on Vercel serverless hosting
the filesystem is per-instance / read-only**, so admin edits made on the
live site may not survive a redeploy or be seen by every visitor.

**How to never lose edits:**
- After changing anything in the admin panel, go to Admin → Export / Import
  → **Export JSON**, save `zaypick-db.json`, and replace `data/db.json` in
  your GitHub repository with it, then push — Vercel redeploys with the
  new data.
- For durable, shared admin edits, later connect a real database
  (Vercel Postgres or Vercel KV) and move the `lib/db.ts` read/write
  functions to it. The API shape (`/api/products`, etc.) is designed so
  that swap is a small change.

## Amazon price auto-update — NOT built yet

The admin panel has a **Refresh Prices** button and Amazon API settings
fields, but they show **“not connected”** until an API key is set, and
auto price update is deliberately **not** implemented in this version.
Amazon only grants Product Advertising API access after your Associates
account has qualifying sales. Until then, update prices by hand in
Admin → Products, and keep the “Price as of” date current.

## Tech

Next.js 14 (App Router) + TypeScript + Tailwind CSS. No database server
required to run. Deploy target: Vercel.
