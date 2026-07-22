# Zambia Tungsten Assay OS

XRF assay capture, grade control and QA/QC for the Zambian tungsten project. Turns raw **Thermo Niton
XL2** handheld-XRF readings into a shared, controlled, auditable grade database.

- **Dashboard:** `public/index.html` — self-contained HTML/CSS/JS, no build step.
- **Backend (optional):** Supabase — logins, roles, one shared live database. See [`SETUP.md`](SETUP.md).
- **Runs with zero setup** in *local mode* (per-device browser storage); add `config.js` to go multi-user.

## What it does

- One record per reading — Niton #, sample label, site / feature / depth, prep state, count time,
  QA/QC tag, and the full element panel (value % + ±2σ).
- **Tungsten grade:** `WO₃ % = W % × 1.2611`; `MTU/t = WO₃ %`; grade tier + a value-vs-2σ confidence flag.
- **Crushed vs uncrushed** tagging; uncrushed treated as indicative and kept out of grade averages.
- **QA/QC** per sample: mean W̄ / WO₃, spread (RSD), heterogeneity flag, CRM / blank / duplicate tags.
- **Gold guard:** Au Lα (9.71 keV) overlaps the tungsten Lβ line (9.67 keV), so a W-rich sample reports
  phantom gold. The dashboard shows the live Au↔W correlation, flags every suspect Au reading, and
  never uses it for grade. **Gold is proven only by fire assay.**
- **Import** the Niton NDT CSV export or paste the on-screen panel; **export** register + sample-summary CSVs.
- In-app **Field & data protocol** tab: labeling, prep workflow, QA/QC program, and decision guidance.

## Roles (backend mode)

| Role | Add | Edit any | Delete |
|---|:--:|:--:|:--:|
| capturer | ✓ | — (own only) | — |
| geologist | ✓ | ✓ | — |
| manager | ✓ | ✓ | ✓ |

## Layout

```
public/index.html          the dashboard
public/config.example.js   copy to config.js, add your Supabase keys
supabase/schema.sql        tables + roles + row-level security  (run once)
supabase/seed.sql          the real 22 Jul 2026 batch (11 readings)
data/                      committed CSV snapshots — the audit trail
SETUP.md                   step-by-step: logins, deploy, roles
netlify.toml               one-click static deploy
```

## Data provenance

Seeded with the real **Niton XL2-108297** batch of **22 Jul 2026** — 11 valid crushed readings across
four samples (W-CRUSHED-1/2/4/5). Reading 1648 (a 0.24 s misfire) and the spreadsheet average row are
excluded. Grades run **1.9–8.3 % WO₃** — high-grade tungsten, with a coherent wolframite (Fe-Mn-W) +
cassiterite (Sn) signature.

_Zambian tungsten division._
