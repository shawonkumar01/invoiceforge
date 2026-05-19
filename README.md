# InvoiceForge

A zero-investment freelancer invoice SaaS. Create professional PDF invoices, freemium limits, and Pro upgrades.

## Why this idea?

| Factor | InvoiceForge |
|--------|----------------|
| Market | 70M+ freelancers globally need simple invoicing |
| Competition | FreshBooks/QuickBooks are heavy; micro-SaaS wins on speed |
| Monetization | $12/mo Pro — 50 users ≈ **$600/mo** (minus ~5% fees) |
| Cost | **$0** — Vercel + GitHub + browser storage |

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy free (GitHub → Vercel)

### 1. Push to GitHub

```bash
cd invoiceforge
git add .
git commit -m "Initial InvoiceForge SaaS"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/invoiceforge.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub (free)
2. **Add New Project** → Import `invoiceforge` repo
3. Add environment variable:
   - `NEXT_PUBLIC_PRO_CHECKOUT_URL` = your Lemon Squeezy checkout URL
4. Click **Deploy**

Your app will be live at `https://invoiceforge-xxx.vercel.app`

## Earn money (zero upfront investment)

### Payment setup (pick one)

| Platform | Cost | Best for |
|----------|------|----------|
| [Lemon Squeezy](https://lemonsqueezy.com) | 5% + $0.50 | Solo devs, handles tax/VAT |
| [Stripe](https://stripe.com) | 2.9% + 30¢ | If you have a business entity |
| [Gumroad](https://gumroad.com) | 10% | One-time lifetime deals |

**Steps:**

1. Create a **$12/month subscription** product on Lemon Squeezy
2. Copy the checkout URL → set `NEXT_PUBLIC_PRO_CHECKOUT_URL` in Vercel
3. After payment, use Lemon Squeezy webhooks to unlock Pro (or manual for MVP)

### Marketing (free channels)

- **Reddit:** r/freelance, r/forhire, r/webdev, r/Entrepreneur
- **Product Hunt:** Launch with "free invoice tool for freelancers"
- **X/Twitter:** "#freelance #invoicing" threads
- **SEO:** Blog posts like "free invoice generator for Upwork freelancers"
- **Facebook groups:** Freelancer communities in your country

### Revenue math

| Pro users | Monthly revenue |
|-----------|-----------------|
| 10 | ~$120 |
| 50 | ~$600 |
| 200 | ~$2,400 |

## Features

- Landing page + pricing
- Invoice CRUD (localStorage)
- PDF export (jsPDF)
- Free: 5 invoices/month + PDF branding
- Pro: unlimited + no branding

## Next steps (optional upgrades)

- [ ] Supabase auth + cloud sync
- [ ] Lemon Squeezy webhook for auto Pro unlock
- [ ] Custom logo upload (Pro)
- [ ] Email invoice to client
- [ ] Recurring invoices

## License

MIT — build and monetize freely.
