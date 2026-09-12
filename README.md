# Kumar & Co — Civil Engineers & Builders

A static, no-build-step website. Open `index.html` in a browser, or serve the
folder with any static file server.

```
python3 -m http.server 8000
```

## Structure

```
index.html              All markup and content
css/style.css           Design system + all styles
js/config.js            Company details, contact info, WhatsApp number
js/main.js              Nav, scroll effects, reveals, WhatsApp form logic
assets/images/          Optimized site photography
```

## What's in `js/config.js` already

Populated from the company brochure (`Kumar & Co Commercial Brochure 2025`):
WhatsApp/mobile number, email, office + branch address, GST number and UDYAM
registration number. Update any of these if they've changed; clear a field to
hide it from the site.

## Things to still confirm

1. **Service descriptions** (Services section) — currently placeholders
   derived from the highway-maintenance site photos. Replace with final
   wording once confirmed.
2. **Project names** (Projects section) — captions are the original site,
   date and chainage tags burned into the photos themselves. Replace with
   final project names if you'd like something more polished.
3. **Client testimonials** — the Clients & Recognition section shows real
   certificates and a real client list from the brochure, but has no written
   quotes yet. Add these to `.clients-list` / a new testimonial block once a
   client sends one — don't fabricate these.
4. **Logo** — the nav mark is a simple blue "KC" monogram built to match the
   ink color on the company's own letterhead/logo sketch. If you have a
   vector/high-res version of the real logo, swap the inline SVG in
   `index.html` (`.nav-logo svg`) for an `<img>` pointing at it.

## Our Works gallery

The "Our Works" section (`#works`) shows a preview grid pulled from
`GALLERY` in `js/main.js`; clicking any tile — or "View the full gallery" —
opens a fullscreen collage of all 32 site photos (11 highway-maintenance +
21 from the brochure's project slides: Srirangam Infra BC relaying, the
Karimangalam truck lay-bay, Thoppur Ghat road widening, IVRCL NH-47 repair
work and the BHGE PEB buildings). Click any collage photo to enlarge it with
next/prev navigation. To add or remove photos, edit the `GALLERY` array —
nothing else needs to change.

## Notes

- No build tools or frameworks — plain HTML/CSS/JS, so it can be hosted
  anywhere (GitHub Pages, Netlify, a shared host, etc.) with no build step.
- Fonts (Archivo, IBM Plex Sans/Mono) load from Google Fonts via `@import` in
  `style.css`; swap this out if you need a fully self-hosted font setup.
- Respects `prefers-reduced-motion`.
