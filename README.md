# Escape Views Resort website

Plain HTML + CSS + JavaScript with Bootstrap 5 (loaded from a CDN). No Node.js or build step needed.

## Open in VS Code
1. Install VS Code, then the **Live Server** extension (Ritwick Dey).
2. File > Open Folder > choose `escape-views-resort`.
3. Right-click `index.html` > **Open with Live Server**. The page reloads when you save.

## Add your photos
Put JPG files in `images/` with these exact names (or edit the `--img:url(...)` in `index.html`):
`hero.jpg, exterior.jpg, room.jpg, food.jpg, exp1.jpg–exp4.jpg, g1.jpg–g6.jpg`, plus `logo.png`.
Until a file exists, a grey gradient shows. Compress photos (about 200–400 KB, ideally WebP) for speed.

## Logo
In `index.html`, replace the `<svg>` in the navbar with `<img src="images/logo.png" alt="Escape Views Resort" height="44">`.

## Settings you may change (js/main.js)
`MAX_ROOMS`, `MAX_ADULTS`, `MAX_CHILDREN` control the guest picker limits.

## Go live (free options)
- **Netlify Drop**: drag the whole folder onto app.netlify.com/drop.
- **Cloudflare Pages / GitHub Pages**: upload or push the folder; no build command, output folder `/`.
Then connect your own domain in the host's settings.

## Still to connect
Booking engine (see the TODO in `js/main.js`), Google Maps embed, Facebook and Telegram links, Google Analytics, `sitemap.xml` and `robots.txt`.
