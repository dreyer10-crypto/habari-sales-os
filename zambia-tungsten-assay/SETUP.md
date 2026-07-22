# Setup — going live with logins (Supabase)

The dashboard works **immediately with no setup** (local mode — data lives in the browser on that
device). To turn it into a **shared, multi-user, controlled database with logins**, do the five steps
below once. Budget ~15 minutes. The only things I can't do for you are the ones needing your own
account — they're all here.

---

### 1. Create a free Supabase project
- Go to <https://supabase.com> → sign in → **New project**.
- Name it e.g. `zambia-tungsten-assay`, pick a region close to Zambia (e.g. `eu-central` or
  `af-south` if offered), set a database password (save it), and create. Free tier is plenty.

### 2. Create the tables & security
- In the project: **SQL Editor → New query**.
- Paste the entire contents of [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
  This builds the `readings` table, the `profiles`/roles table, and the row-level security that
  controls who can read, add, edit and delete.

### 3. Load the existing 22 Jul readings (optional but recommended)
- SQL Editor → New query → paste [`supabase/seed.sql`](supabase/seed.sql) → **Run**.
  Your 11 real readings are now in the shared database.

### 4. Point the dashboard at your project
- In Supabase: **Project Settings → API**. Copy two values:
  - **Project URL** (e.g. `https://abcdxyz.supabase.co`)
  - **anon public** key (the long one labelled `anon` / `public`)
- Copy `public/config.example.js` to **`public/config.js`** and paste those two values in.
  > The anon key is *public by design* — it's safe in the browser and safe to commit. All real
  > protection comes from the row-level security in step 2.
- Reload the dashboard. You'll now get a **login screen**, and the sidebar shows a green “Live —
  synced” dot.

### 5. Create users & set roles
- Open the dashboard → **Create account** (email + password + name). Do this for each team member,
  **or** invite them from Supabase → **Authentication → Users**.
- Make yourself the manager: Supabase → SQL Editor →
  ```sql
  update public.profiles set role = 'manager' where email = 'you@example.com';
  ```
- Roles:
  | Role | Can do |
  |---|---|
  | `capturer` | add readings, edit their own |
  | `geologist` | add + edit any reading |
  | `manager` | add + edit any reading, **delete**, admin |

  New sign-ups default to `capturer`. Change anyone's role with the same `update` statement.

> **Email confirmation:** by default Supabase emails a confirm link on sign-up. For a small internal
> team you can turn it off at **Authentication → Providers → Email → “Confirm email” = off** so people
> can log in straight away.

---

## Deploy the dashboard to a shared link (Netlify)
1. <https://app.netlify.com> → **Add new site → Import from Git** → pick this repo.
2. `netlify.toml` already sets publish dir = `public`; nothing else to configure. Deploy.
3. Share the URL with the team. Because `config.js` points at your Supabase project, everyone who
   logs in sees the same live database.

(Drag-and-drop also works: drag the `public/` folder onto Netlify — just make sure `config.js` is in
it.)

---

## Everyday workflow once live
- **Capture** readings in the dashboard (manual panel, *Paste panel*, or *Import Niton CSV*) — they
  sync to the shared database instantly.
- **Export CSV** whenever you want a point-in-time snapshot; commit it to `data/` for an audit trail.
- **Umpire assays:** send decision-critical / high-grade samples (and anything with the gold ⚠ flag)
  to a certified lab, and reconcile against the XRF numbers.

## A note on DB mode testing
Local mode is fully tested. The login + sync code follows standard Supabase patterns but has **not**
been run against a live project here (it needs your credentials). If anything errors on first run,
send me the exact message from the browser and I'll fix it fast — it'll be a small policy or field
tweak, not a redesign.
