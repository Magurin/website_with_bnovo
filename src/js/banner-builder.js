/* ---------- 1. Актуальные брейкпойнты ---------- */
const BREAKPOINTS = [
  { width: 1920 },
  { width: 1600 },
  { width: 1280 },
  { width: 1024 },
  { width:  768 },
  { width:  560 },
  { width:  420 },
];

/* ---------- 2. srcset: /public/images/banners/<path>/<basename>-<w>.<ext> ---------- */
function makeSrcset(path, subDir, ext) {
  const dir      = `/public/images/banners/${path}${subDir ? `/${subDir}` : ''}`;
  const basename = path.split('/').pop();           // home  |  rose41  |  flats/…
  return BREAKPOINTS
    .map(({ width }) => `${dir}/${basename}-${width}.${ext} ${width}w`)
    .join(', ');
}

function buildBanner(pic) {
  const path     = pic.dataset.banner;              // напр. "home" или "flats/rose41"
  const basename = path.split('/').pop();

  pic.innerHTML = `
    <source type="image/avif"
            srcset="${makeSrcset(path, 'avif', 'avif')}"
            sizes="100vw">
    <source type="image/webp"
            srcset="${makeSrcset(path, 'webp', 'webp')}"
            sizes="100vw">
    <img class="header__banner-img"
         src="/public/images/banners/${path}/${basename}-1280.jpg"
         srcset="${makeSrcset(path, '', 'jpg')}"
         sizes="100vw"
         alt="">
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('picture[data-banner]').forEach(buildBanner);
});
