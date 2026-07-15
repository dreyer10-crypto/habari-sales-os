# Habari Media — Sales OS

A self-serve sales toolkit for the Habari Media desk: a **Leads Shout intake**, a **Proposal
Tracker** with follow-up alerts and roll-overs, a **manager dashboard**, a **rep operating
dashboard**, and a **campaign report / generator** that closes with the network upsell.

It is a **static site** (plain HTML/CSS/JS, no build step) that runs anywhere and deploys to
Netlify in one step. State is held per-device in the browser today; see
[Toward a real implementation](#toward-a-real-implementation) for the shared-backend path.

> **Confidential.** These tools hold a Habari sales pipeline and are marked `noindex, nofollow`.
> Do not forward the deployed URL outside Habari.

---

## The monthly sales cycle

```
Leads shout ──▶ Leads (per rep, per month) ──▶ Proposal sent ──▶ Follow-ups ──▶ Won / Lost
                     │                                                              ▲
                     └──────────── Roll over (with evidence) ───────────────────────┘
                                   carries the client to a future month
```

1. **Leads shout.** At the start of the month the shout goes out. On the **Leads Shout** tab each
   rep lists the clients they intend to engage — typed in, pasted from a list, or imported from the
   **CG LEADS** workbook (CSV). Rows land as *leads* tagged to the month.
2. **Lead → proposal.** A lead has no proposal out yet (no follow-up clock). **Send proposal**
   promotes it into the live pipeline (status *Sent*, follow-up flag five working days out) and
   generates the signed Habari advertising agreement + a pre-filled email.
3. **Roll-overs.** If a client won't close this month but the rep has **evidence** it will do
   business in a coming month (signed schedule, confirmed budget, email on file), **Roll over**
   carries it to a named month with the evidence stored on the record — instead of counting it as
   lost.

The manager dashboard reads the same store and adds a Leads KPI + funnel stage, a Rolled-over KPI,
and a **Roll-overs** table listing each carried client, its from→to month, and the evidence supplied.

---

## Files

The deployable site is in [`public/`](public/):

| File | Purpose |
|---|---|
| `index.html` | Landing page — "Tools & Scope" walk-through, embeds the tracker & dashboards |
| `habari-proposal-tracker.html` | **Proposal Tracker** — Leads Shout intake (CG LEADS import), pipeline, follow-ups, roll-overs, lead pool, agreement generator |
| `habari-media-dashboard.html` | **Manager Dashboard** — leads, funnel, hit rate, roll-overs, escalation ladder (access code: `habari2026`) |
| `habari-operating-dashboard.html` | **Sales Operating Dashboard** — the rep's desk: report generator, raise-a-booking, top-sheet library, rate card |
| `campaign-report.html` | Live campaign report (embeds the R25,000 Network Special) |
| `_headers` | `X-Robots-Tag: noindex, nofollow` applied to every page |

Repo root: `netlify.toml` (publish = `public`), `.gitignore`, this README.

---

## Run locally

No build step. Serve the `public/` folder with any static server, e.g.:

```bash
cd public
python3 -m http.server 8080
# open http://localhost:8080
```

Or just open `public/index.html` in a browser.

---

## Deploy to Netlify

**Git-linked (recommended):** connect this repo to a Netlify site. `netlify.toml` already sets the
publish directory to `public`, so every push to the default branch redeploys.

**Drag-and-drop:** drag the `public/` folder onto the Netlify "Sites" upload area.

The `_headers` file sits at the publish root (`public/_headers`) so Netlify applies the `noindex`
rule to every page.

---

## Data & the CG LEADS import

- The tracker and dashboard share one browser store (`localStorage: habari_proposals_v1`). Data is
  **per-device** and seeded with sample rows (including sample leads + one roll-over) until real
  proposals are entered. Clearing site data re-seeds.
- **CG LEADS import** (Leads Shout tab): paste rows copied from Excel (tab-separated) or the shout
  list (one client per line; optional `Client, Contact, Email, Publication, Est. value` columns), or
  export the *CG LEADS – DREYER* workbook as **CSV** and use *Import CG LEADS file*. A header row is
  auto-detected; the first column is always the client.
- CSV **Export** on the tracker includes `ShoutMonth, Source, Rolled, RolledTo, RolloverEvidence`.

---

## Toward a real implementation

This build is intentionally backend-free so it can be deployed and demoed instantly. For a
production rollout across the Habari desk, the shape of the work:

- **Shared data store.** Replace `localStorage` with a hosted store (e.g. Supabase / Postgres or a
  small API) so every rep and manager sees the same live pipeline, not a per-device copy.
- **Auth & roles.** Real login for reps vs managers (the dashboard's `habari2026` code is a light
  gate only). Scope each rep to their own leads; managers see the desk.
- **Live CG LEADS / SharePoint sync.** Two-way sync with the *CG LEADS* workbook via the Microsoft
  Graph API (server-side, so no credentials touch the page). The current CSV/paste import is the
  manual bridge until that connector exists.
- **Email & notifications.** The follow-up / escalation emails are pre-filled `mailto:` drafts today;
  a backend enables scheduled reminders and SLA timers.

None of the above is required to use the tools as they stand — it's the path to a multi-user,
always-in-sync product.

---

_Highbury Media (Pty) Ltd T/A Habari Media · www.habarimedia.com_
