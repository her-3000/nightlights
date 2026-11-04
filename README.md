# Night Lights

Night Lights is a static visual prototype of a Bangkok nightlife guest-list page. A visitor picks an example venue, turns a glass card, enters LINE, Instagram, and TikTok handles plus dates, and sees a simulated confirmation. Nothing in this repository sends or stores those entries.

Repository: [her-3000/nightlights](https://github.com/her-3000/nightlights). Default branch: `main`. GitHub’s description is “Night Lights — guest-list website prototype and brand assets.”

## People

- **Owner:** Cal. The asset notes record the name Callum for the Sailor Moon references selected on 19 September 2026. The GitHub account that owns the repo, and the only admin returned by the collaborators API, is [her-3000](https://github.com/her-3000). Every commit currently on `main` is authored under the display name `her`. The string `Cal` does not appear in the files; the Callum link is the asset notes plus this handoff.
- **Collaborator:** Sophie, GitHub login [sst11-99](https://github.com/sst11-99). That login exists. It does not appear in tracked files or commit authors. On 4 November 2026 the collaborators API listed only `her-3000`. Invitations returned HTTP 403, so a pending invite is **unverified**. `guest-list.css` contains the comment `SOPHS-style language slider`; that is a style label, not an identity record.

## What the page does

`index.html` is the site. It hard-codes three example venues in Bangkok. Copy, perks, times, and Maps queries are examples.

| `id` | Name | Area line | Start | Maps query |
| --- | --- | --- | --- | --- |
| `sugar` | Sugar | Soi 11 · Hip-hop | 22:00 | Sugar Club Bangkok Sukhumvit Soi 11 |
| `mira` | MIRA | Soi 11 · Nightclub | 22:30 | MIRA Club Bangkok Sukhumvit Soi 11 |
| `tichuca` | Tichuca | Sukhumvit 40 · Rooftop | 23:00 | Tichuca Rooftop Bar Bangkok |

Each object also has `base`, `accent`, `perk`, `spots`, and `status`. The card template renders name, area, colours, perk, start time, and a public Google Maps search link (`https://www.google.com/maps/search/?api=1&query=...`, no API key). `spots` and `status` are unused by the template.

Behaviour that is implemented in the scripts:

- Cards flip on the axis nearest the pointer. Reduced motion swaps faces with no animation.
- Below 700px the rail is a snap carousel. Only the current card’s availability block is shown (`.venue:not(.is-current) .availability`).
- “Join guest list” opens an in-card form: LINE ID, Instagram, TikTok, and one or more dates. Dates use `Asia/Bangkok`, from today through nine days ahead (`date-picker.js`). At least one handle that is non-empty and not `@`, and at least one date, are required.
- Submit waits 2.8 seconds, then shows an in-page “Submitted” state. Values stay in the DOM for that page load. There is no `fetch`, XHR, WebSocket, or `sendBeacon`.
- A completed card can offer its handles to the other cards still in memory.
- About 650ms after that confirmation, `newsletter.js` opens one optional email dialog. A valid email clears the field and shows “Email signup is coming soon.” The script comment says the prototype must not transmit or persist the email.
- `language.js` adds an English / ไทย control. The choice is the only `localStorage` key: `nightlights-language` (`en` or `th`). Translation changes visible copy and does not rebuild forms or rewrite typed account values.
- Six silhouettes, masked with `assets/Sailor Moon.png`, cycle through `#9DF1A3`, `#A0D7FA`, `#FDCFBC`, `#FC7276`, `#C8A0FA`, and `#F9E58F` unless the tab is hidden or reduced motion is on.
- The floating logo copies the header logo, ignores pointer input (`pointer-events: none`), and moves at 22px/s horizontally and 16px/s vertically. It fades while an input, textarea, select, or contenteditable is focused, and it stops under reduced motion.
- Footer eyes (`assets/sailor-moon-eyes.jpg`) are injected into `.steps`. They become visible after the section has been at least 60% in view for two seconds.
- `dialog#booking` in `index.html` has a close handler only. No script opens it. The live forms come from `guest-list.js`.

Custom events: `venue-front` (card returned to the front), `nightlights-submitted` (newsletter may open), `nightlights-language` (dates re-render).

## Layout

There is no `package.json`, `src/`, `supabase/`, `.github/`, or test directory. Top-level files on `main`:

| Path | Role |
| --- | --- |
| `index.html` | Page, inline layout CSS, venue data, card markup, flip/drag, figure colours. One long document. Loads the files below, in this order. |
| `guest-list.css` | Guest-list, glass, calendar, newsletter, language switch, floating logo, footer eyes. Linked as `guest-list.css?v=34`. |
| `date-picker.js` | `window.createNightDates`. Linked as `date-picker.js?v=3`. |
| `guest-list.js` | Forms, simulated submit, scroll glass, footer eyes. Calls `createNightDates` and `startFigureColours`, so it must stay after those scripts. Linked as `guest-list.js?v=31`. |
| `floating-logo.js` | Drifting logo. Linked as `floating-logo.js?v=3`. |
| `newsletter.js` | Post-submit dialog. Linked as `newsletter.js?v=1`. |
| `language.js` | EN/TH switch. Load last so the first translation walk sees the page. Linked as `language.js?v=3`. |
| `mobile-preview.html` | Phone frame. Iframe is `min(390px, 100vw)` by `min(844px, 100dvh)`, source `index.html?v=nightlights-calendar-v20`. |
| `screen-preview.html` | `?view=ipad` (also the default) is 834×1194. `?view=desktop` is 1440×900. Same iframe source as the phone preview. The frame scales down to the window. |
| `vercel.json` | Static hosting config. See Deploy. |
| `.gitignore` | Ignores `.DS_Store`, `.env*`, `.vercel/`, `node_modules/`, `__pycache__/`. |
| `assets/` | Images and two provenance notes. |

Assets:

| File | Used by |
| --- | --- |
| `assets/nightlights-26-chrome-transparent-v1.png` | Header logo (and the floating copy). |
| `assets/tonight-english-heavy-clean-v1.png` | Hero image, alt text “Tonight with Your friends”. |
| `assets/pixel-rings.svg` | Card ring background in `guest-list.css`. |
| `assets/Sailor Moon.png` | Silhouette mask. The filename contains a space; URLs must encode it. |
| `assets/sailor-moon-eyes.jpg` | Footer eyes, injected by `guest-list.js`. |
| `assets/sailor-moon-eyes-source.md` | Provenance. Selected by Callum, 19 September 2026. Pinterest pin and image URL. No licensing claim. |
| `assets/sailor-moon-application.jpg` | Present on disk. No HTML, CSS, or JS reference on `main`. |
| `assets/sailor-moon-application-source.md` | Provenance for that unused JPEG. Selected by Callum, 19 September 2026. |

`guest-list.css` still has rules for `.guest-sheet > .application-art` and `.form-eyes`. No script creates those elements. The pointing application portrait is off the live form. Commit `2c4de7a` is titled “approved layout without booking portrait”.

Query strings such as `?v=34` are cache-busters written into the HTML. Change the string when the matching file should refresh on a host that caches aggressively.

`origin/margiela-style-checkpoint` is the other remote branch. It is not the default. Against `main` it adds `assets/white-pink-plastic-desktop.webp`, `assets/white-pink-plastic-phone.webp`, and `assets/white-pink-plastic-tablet.webp`, and it changes `guest-list.css`, `index.html`, and `screen-preview.html` to use those backgrounds. Those webp files are absent on `main`.

No tracked file is a typography study page. Git history of added paths has the same set as `main` plus those three webp files.

## Tech stack

- HTML, CSS, and browser JavaScript. Classic scripts, no modules, no bundler, no framework, no TypeScript.
- Fonts are `system-ui` and `ui-monospace`.
- Browser features in use: `dialog`, `IntersectionObserver`, `ResizeObserver`, `localStorage`, `Intl.DateTimeFormat`, `matchMedia('(prefers-reduced-motion: reduce)')`, `visualViewport`, pointer events, Web Animations.
- Python’s standard-library HTTP server is a local preview tool only. It is not imported by the site.
- `vercel.json` is the only hosting config. See Deploy for what is and is not verified.

## Install, run, build, test

**Install.** There is nothing to install. No `package.json`, lockfile, `requirements.txt`, `Makefile`, or `Dockerfile` has been committed (`git log --all --diff-filter=A --name-only`).

**Run.** From this directory:

```bash
python3 -m http.server 8779 --bind 127.0.0.1
```

Then open:

- `http://127.0.0.1:8779/` — the responsive page
- `http://127.0.0.1:8779/mobile-preview.html` — phone frame
- `http://127.0.0.1:8779/screen-preview.html?view=ipad` — iPad frame
- `http://127.0.0.1:8779/screen-preview.html?view=desktop` — 1440×900 frame

Verified on 4 November 2026 with Python 3.12.3. That command returned HTTP 200 for `/`, `/index.html`, both preview pages (including `?view=desktop`), `guest-list.css`, all five scripts, `vercel.json`, and the asset files listed above (the Sailor Moon PNG via `/assets/Sailor%20Moon.png`). This is the only run command. It is not declared in a package script because there is no package file.

**Build.** There is no build. `vercel.json` sets `buildCommand` to `null` and `outputDirectory` to `.` (the repo root).

**Test.** There is no test runner, test file, or GitHub Actions workflow (`repos/her-3000/nightlights/actions/workflows` returned `total_count: 0`). The HTTP check above is the only automated check recorded here. Card flip, forms, language, and motion were read from source and were not exercised in a browser for this README.

## Data, backend, and environment

Supabase is not used. Tracked source has no Supabase client, project URL, project ref, table, database function, or edge function, and it names no environment variable. The only mention in history is README prose, starting in the first commit, that a separate Night Lights Supabase project existed and was not connected. No config supports that sentence. Treat an external Supabase project as **unverified**.

No other backend, database, or auth client is referenced. The Maps links are normal browser navigation to Google’s public search URL.

Environment variables: none are read. Names: none. `.gitignore` would ignore a future `.env*` file. No `.env` example is in the repo. Do not add secrets.

The only persisted client value is `localStorage['nightlights-language']`.

## Deploy

`vercel.json` is the only deploy file:

```json
{
  "buildCommand": null,
  "outputDirectory": ".",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [{ "key": "X-Robots-Tag", "value": "noindex" }]
    }
  ]
}
```

If Vercel is serving this repo, that file says: publish the repository root as static files, run no build, and send `X-Robots-Tag: noindex` on every path.

These items are **unverified**:

- A Vercel project id, team, or production URL. None are in the repo. `homepageUrl` on GitHub is empty.
- Whether GitHub is connected to Vercel, and whether a push redeploys anything. The GitHub deployments API returned `[]`. `.vercel/` is gitignored and is not in the tree.
- That any public site matches `main`. Updating GitHub is not evidence of a redeploy.

There is no `netlify.toml`, `wrangler.toml`, `fly.toml`, Docker file, or GitHub Actions workflow.

## Visual baseline

Site files on `main` match commit [`2c4de7a1b9980350d47b351b803e61717ce5139f`](https://github.com/her-3000/nightlights/commit/2c4de7a1b9980350d47b351b803e61717ce5139f) (“Checkpoint 2026-09-21: approved layout without booking portrait”, 21 September 2026). The only later commit before this README, `afd41c7`, changed the previous README text. The iPhone layout (carousel, next-card behaviour, forms, centred language switch, mobile spacing) is part of that page, which uses the same HTML at every width. Preview pages frame that same `index.html`.

## Visibility

On 4 November 2026 the GitHub API reported this repository as **public** (`isPrivate: false`). This handoff says the repo is about to become private. That change is **unverified** until GitHub shows it private. Keep credentials and personal data out of the tree either way. Asset notes name a person and public image URLs; they do not contain keys.
