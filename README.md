# Gridwave GEO — Marketing Site

Static, bilingual (EN/ES) marketing site for Gridwave GEO. No build step, no backend — plain HTML/CSS/JS.

## Structure

```
index.html        Page markup
css/style.css      Styles (design tokens at the top)
js/i18n.js         EN/ES translation dictionary + language switcher
js/main.js         Nav, scroll reveal, hero globe canvas animation
assets/            favicon, apple-touch-icon, Open Graph share image
robots.txt         Crawler rules + sitemap pointer
sitemap.xml        Single-page sitemap
```

## Local preview

```
python3 -m http.server 8080
```
then open http://localhost:8080/

## Deploy

Push this folder to a GitHub repo, then import it into Vercel, Netlify, or Cloudflare Pages —
no build command or output directory needed, it's already static.

Before going live, replace the placeholder domain `https://www.gridwavegeo.com/` in
`index.html` (canonical + Open Graph/Twitter tags), `robots.txt`, and `sitemap.xml`
with your real domain.
