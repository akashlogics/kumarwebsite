# Kumar & Co — Civil Engineers & Builders

Static website (no framework, no build step). Open `index.html` or deploy the folder as-is
(GitHub Pages, Netlify, Vercel, Cloudflare Pages).

## Structure
```
index.html          all content (about, services, projects, certificates, clients, contact)
css/style.css       design
js/config.js        ★ WhatsApp number & contact details — edit this
js/main.js          scroll animation, lightbox, WhatsApp enquiry
assets/frames/      249 WebP frames of the construction animation (f001 … f249)
assets/images/      project photos + logo mark
assets/certs/       certificates
assets/fonts/       Montserrat + Inter (self-hosted)
```

## Before going live
1. Set `whatsappNumber` in `js/config.js` (e.g. `"919876543210"`).
2. Confirm project names / captions in the "Our work" section of `index.html`.
3. Optional: phone, email, address, GST and UDYAM in `js/config.js`.

## How the animation works
The hero section is a tall scroll track with a sticky canvas. Scroll position maps to frame
number; five "pages" (Welcome, About, Services, Our promise, Completed) fade in and out over it.
Phones load every 2nd frame to save data.
