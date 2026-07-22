/* Copy this file to  config.js  and paste your two Supabase values.
   Both are safe to commit / ship in the browser — the anon key is public by
   design and is protected by the row-level security in supabase/schema.sql.
   Leave config.js absent (or blank) to run the dashboard in LOCAL mode
   (per-device browser storage, no login) — useful offline or for a quick demo. */
window.XRF_CONFIG = {
  SUPABASE_URL:      "https://YOUR-PROJECT.supabase.co",
  SUPABASE_ANON_KEY: "YOUR-PUBLIC-ANON-KEY"
};
