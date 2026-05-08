# Sri Subramaniyar Temple — Donation Portal

Bilingual (Tamil / English) temple website with QR-based UPI donation flow,
admin content management, donation log with PDF / Excel export, and automatic
email receipts.

## Quick start

```bash
# 1. install deps (uses bun.lockb if you have bun, otherwise plain npm/yarn)
bun install        # or: npm install

# 2. configure email — copy and edit
cp .env.example .env
# open .env and set ONE of:
#   VITE_WEB3FORMS_KEY=...           (recommended, 30 sec signup)
#   VITE_EMAILJS_SERVICE_ID + ...    (also browser-only)
#   RESEND_API_KEY (server-side, via Netlify / Vercel function)

# 3. dev server
bun run dev        # or: npm run dev

# 4. production build
bun run build      # or: npm run build
# output is in dist/  -> deploy to Netlify, Vercel, or any static host.
```

The default admin login is `admin` / `temple@123`. Change it inside the
admin panel under the **கணக்கு / Account** tab.

## Admin panel

Navigate to `/admin/login` and sign in. New tab: **தான பதிவு / Donations**.

* Lists every donation form submission with donor name, phone, email, amount,
  receipt #, submitted timestamp, and email-delivery status.
* Search box across donor name / phone / email / receipt #.
* Filter by email status (Sent / Failed / Pending).
* **Export buttons** — PDF (themed multi-page register), Excel (.xlsx), CSV.
* Per-row delete + "clear all" with confirmation.

## How email delivery works

When a donor submits the form:

1. The donation is logged to the admin panel **immediately** (synchronous).
2. The thank-you screen appears **instantly** — no spinner, no waiting.
3. In the background:
   * a themed PDF receipt is generated (jsPDF, loaded once on page mount);
   * the receipt is emailed via the first configured provider;
   * the success screen updates with PDF "Ready" and Email "Sent" pills as
     each step completes.
4. If the email fails, the donor still has:
   * a "Download Receipt" button (PDF in their browser),
   * a "Open in Email Client" button (`mailto:` with everything pre-filled).

The form **never** freezes — every async step has a hard timeout.

## Setting up Web3Forms (recommended)

1. Go to <https://web3forms.com> → **Create your Access Key**.
2. Enter your temple email (e.g. `gokulsaravanana663@gmail.com`).
3. Confirm the email Web3Forms sends you.
4. Copy the access key into `.env`:

   ```
   VITE_WEB3FORMS_KEY=abcd1234-ef56-...
   VITE_ADMIN_EMAIL=gokulsaravanana663@gmail.com
   ```

5. Restart the dev server. The next donation will email automatically and
   the temple admin will be BCC'd on every receipt.

## Deploying to Netlify

1. `git push` the project to GitHub.
2. In Netlify, "New site from Git" → pick the repo.
3. **Build command:** `npm run build`  **Publish directory:** `dist`
4. Add the same env vars from `.env` to the Netlify site's
   *Environment variables* panel.
5. Deploy. The site is now live; the donate form works immediately.

The included `netlify.toml` already wires up the SPA fallback and the
optional `/api/send-receipt` Resend function (used only if you go with
Option 3 in `.env`).

## File map

```
src/
├── main.jsx                     React entry, providers
├── routes/
│   ├── donate.jsx               Donation form + instant success screen
│   ├── admin.jsx                Admin panel + Donations log tab
│   └── ...
├── lib/
│   ├── donation-log.jsx         localStorage donation register
│   ├── donation-email.js        Web3Forms → EmailJS → serverless cascade
│   ├── donation-export.js       PDF + XLSX + CSV export of the log
│   ├── pdf-receipt.js           Themed PDF receipt (jsPDF)
│   └── ...
└── styles.css                   Tailwind 4 + design tokens
netlify/functions/send-receipt.js Optional Resend integration
```
