# SMARTMEC Service Motors — Static Website

Premium automotive business website for SMARTMEC Service Motors (Southerton, Harare): multi-page company presence plus an interactive quotation request workflow.

## Run locally

Open `index.html` in a modern browser, or serve the folder:

```bash
npx --yes serve .
```

No build step is required. Hosting target: **GitHub Pages**.

## Recommended technology (why not React/Next?)

For SMARTMEC, the **best** stack that still keeps **GitHub sufficient** is:

| Layer | Choice | Why |
|-------|--------|-----|
| Hosting | **GitHub Pages** | Free HTTPS + custom domain |
| Site | **Static HTML + vanilla JS** | Fast, SEO-friendly, no build pipeline |
| Quotation engine | **Browser JS** (`js/quote.js`) | Rates, VAT, drafts, PDF — all client-side |
| PDF | **jsPDF** (CDN) | Branded downloadable PDF without a server |
| Delivery | **WhatsApp** + optional **Formspree/EmailJS** | Inbox delivery without owning a backend |
| Pricing | **`js/rates-config.js`** | Turn on when SMARTMEC supplies tariffs |

React, Next.js, or Node servers do **not** buy extra capability here — they add deploy complexity while GitHub Pages cannot run a custom API anyway. This architecture already does quotations, PDFs, and enquiry delivery from a static host.

## Deploy on GitHub Pages + custom domain

### 1. Create the GitHub repository
1. Sign in at [github.com](https://github.com) → **New repository**
2. Name it e.g. `smartmec-website` (public)
3. Do **not** add a README (this folder already has one)
4. Create the repo, then run locally from this folder:

```bash
git init
git add .
git commit -m "Initial SMARTMEC Service Motors website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smartmec-website.git
git push -u origin main
```

### 2. Turn on GitHub Pages
1. Repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** / folder: **/ (root)** → Save
4. Wait 1–2 minutes. Temporary URL: `https://YOUR_USERNAME.github.io/smartmec-website/`

> If the site is in a project repo (not `username.github.io`), links already use relative paths (`css/…`, `about.html`) so they work on both `github.io` and a custom domain.

### 3. Point your domain (e.g. www.smartmecmotors.co.zw)
This repo includes a `CNAME` file set to `www.smartmecmotors.co.zw`. Change that file if your live hostname is different.

**In GitHub:** Settings → Pages → Custom domain → enter `www.smartmecmotors.co.zw` → Save → enable **Enforce HTTPS** once DNS is ready.

**At your domain registrar (DNS):**

| Type | Host / Name | Value |
|------|-------------|--------|
| `CNAME` | `www` | `YOUR_USERNAME.github.io` |
| `A` (optional, apex) | `@` | `185.199.108.153` |
| `A` (optional, apex) | `@` | `185.199.109.153` |
| `A` (optional, apex) | `@` | `185.199.110.153` |
| `A` (optional, apex) | `@` | `185.199.111.153` |

DNS can take from a few minutes up to 24–48 hours. After it resolves, turn on **Enforce HTTPS** in Pages settings.

### Why this setup
- Matches the current static site and quotation form
- Free HTTPS via GitHub
- Easy updates: edit files → `git push`
- Later you can keep this front end and only add a small backend for storing quotations — no rewrite required

## Pages

| Page | File | Purpose |
|------|------|---------|
| Home | `index.html` | Hero, trust bar, services, process, CTAs |
| About | `about.html` | Profile, facilities, standards |
| Mechanical | `mechanical.html` | Repairs, servicing, diagnostics, hybrid |
| Autobody | `autobody.html` | Panel beating, chassis, spray painting |
| Additional | `additional.html` | Polishing, suspension, windscreens, towing |
| Insurance | `insurance.html` | Partners and claims assistance |
| Gallery | `gallery.html` | Filterable workshop imagery |
| Request a Quote | `quote.html` | Multi-step quotation request |
| Contact | `contact.html` | Form, map, phone, WhatsApp, email |

## Quotation workflow

1. Customer details  
2. Vehicle details  
3. Service selection  
4. Problem description + local photo selection  
5. Summary → WhatsApp, branded PDF, print, email; optional inbox send  

Drafts auto-save in the browser (`localStorage`). Reference IDs like `SMQ-…` appear on summaries and PDFs.

**Important:** No labour rates were supplied. `js/rates-config.js` stays `enabled: false` until SMARTMEC provides tariffs — then turn it on for **indicative** estimates (never invent prices).

### Optional: email into Gmail without a server

Edit `js/submit-config.js`:

1. Create a free form at [formspree.io](https://formspree.io)  
2. Set `provider: "formspree"` and paste the form ID  
3. “Send to SMARTMEC inbox” appears on the quote summary  

Photos are still best sent via WhatsApp (size limits on free email APIs).

## Package layout

```
css/styles.css
js/site.js          Shared chrome (nav/footer), WhatsApp helpers
js/quote.js         Multi-step quotation wizard
js/rates-config.js  Configurable pricing (off by default)
*.html              Site pages
```

## Before publishing

1. Replace stock photography with approved SMARTMEC images.  
2. Confirm insurance partner names and approval status.  
3. Confirm warranty wording per service.  
4. Verify address spelling, phone, email and domain.  
5. Add hosting, HTTPS and a privacy notice for customer data.  
6. Update social links in `js/site.js` when accounts are confirmed.

## Contact (from company materials)

- **Phone / WhatsApp:** +263 78 534 0515  
- **Email:** smartmecmotors@gmail.com  
- **Address:** 47 Leyland Road, New Ardbennie, Southerton, Harare, Zimbabwe  
- **Web:** www.smartmecmotors.co.zw  
