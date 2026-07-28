# XRF assay data — version-controlled snapshots

This folder is the **control point** for the Zambian tungsten XRF readings. The dashboard
(`public/xrf-assay-register.html`) captures and works with data in the browser; this folder is where
that data is committed to Git so it is **shared, auditable and backed up** — every change tracked, every
version recoverable.

## The workflow

```
Niton XL2 export ──▶ Dashboard (capture / import) ──▶ Export CSV ──▶ commit here ──▶ push / PR
        (raw)              (enrich: WO₃, tier, QA)        (snapshot)      (control)     (review)
```

1. **Capture** readings in the dashboard (manual panel, paste, or *Import Niton CSV*).
2. **Export CSV** from the Assay register.
3. **Drop the file in this folder**, commit with a dated message, and push. Open a PR if you want the
   change reviewed before it lands on `main`.
4. The file name carries the batch date, e.g. `xrf-assay-register-2026-07-22.csv`.

## Files

| File | Batch | Notes |
|---|---|---|
| `xrf-assay-register-2026-07-22.csv` | 22 Jul 2026 | Niton XL2-108297. 11 valid crushed readings, 4 samples. Reading 1648 (0.24 s misfire) marked `Excluded`. Enriched with WO₃ %, MTU/t, tier, W-confidence, and the Au fire-assay flag. |

## Column notes

- `WO3_pct = W_pct × 1.2611`; `MTU_per_t = WO3_pct`.
- `W_confidence` — from the value-vs-2σ ratio (strong / robust / caution / < LOD).
- `Au_ppm` is the raw XRF number (1 ppm = 1 g/t). `Au_flag` marks it **SUSPECT** wherever tungsten is
  present: Au Lα (9.71 keV) overlaps the W Lβ line (9.67 keV), so apparent gold in a W-rich sample is a
  spectral artifact. **Gold is confirmed only by fire assay at a certified lab** — never from this column.
