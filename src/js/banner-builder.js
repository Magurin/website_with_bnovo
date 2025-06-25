/* ---------- 1. Актуальные брейкпойнты ---------- */
const BREAKPOINTS = [
  { width: 1920 },   // десктоп Retina / 4k
  { width: 1280 },   // стандартный десктоп
  { width: 768  },   // tablet
  { width: 480  },   // mobile
];

/* ---------- 2. Абсолютный путь от корня ---------- */
function makeSrcset(name, sub, ext) {
  const base = `/public/images/banners/${name}${sub ? `/${sub}` : ''}`;
  return BREAKPOINTS
    .map(({ width }) => `${base}/banner__${name}-${width}.${ext} ${width}w`)
    .join(', ');
}

function buildBanner(pic) {
  const name = pic.dataset.banner;

  pic.innerHTML = `
    <source type="image/avif"
            srcset="${makeSrcset(name, 'avif', 'avif')}"
            sizes="100vw">
    <source type="image/webp"
            srcset="${makeSrcset(name, 'webp', 'webp')}"
            sizes="100vw">
    <img class="header__banner-img"
         src="/public/images/banners/${name}/banner__${name}-1280.jpg"
         srcset="${makeSrcset(name, '', 'jpg')}"
         sizes="100vw"
         alt="">
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('picture[data-banner]').forEach(buildBanner);
});
