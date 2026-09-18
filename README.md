# Night Lights

Responsive nightlife guest-list visual prototype. Includes glass venue cards, six colour-changing figures, LINE/Instagram/TikTok form, simulated waitlist confirmation, floating refractive logo, and timed footer artwork.

## Run

Run `python3 -m http.server 8779 --bind 127.0.0.1` in this folder. Open `/` for the responsive website, `/mobile-preview.html` for a phone frame, or `/screen-preview.html?view=ipad` and `?view=desktop` for larger previews. No build or dependency installation required.

## Status

This is a design demo: no guest information is sent or saved, no venue place is reserved, and no LINE message is sent. Venues, perks, availability and attendance requirements are examples. Dedicated Supabase project exists but is not connected. Booking identity, real submissions, venue approval and attendance verification remain future work.

Motion respects reduced-motion preferences. Floating logo ignores pointer input and pauses while typing. Footer eyes appear after two seconds in view; logo moves at 22px/s horizontally and 16px/s vertically.

Private source: her-3000/nightlights. Asset provenance is retained alongside the eyes image. No credentials or private business records included.

After simulated booking submission, an optional bilingual newsletter dialog blurs the page. Email format validation and dismissal are implemented; no email is saved or sent. A newsletter backend remains required.
