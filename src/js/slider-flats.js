/* src/js/slider-flats.js */
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

/* ----- базовые каталоги (от корня live-сервера) ----- */
const PUBLIC = '/public';                       // ← меняется в одном месте
const IMG    = `${PUBLIC}/images/flats`;
const DATA   = `${PUBLIC}/data/galleryData.json`;

/* ----- размеры исходников ----- */
const SIZE = {
  desktop: { folder: 'desktop', suffix: '_900', w: 900 },
  tablet : { folder: 'tablet',  suffix: '_576', w: 576 },
  mobile : { folder: 'mobile',  suffix: '_360', w: 360 },
};

/* ----- <picture> ----- */
const mkPicture = (flat, name) => /* html */ `
  <picture>
    <!-- AVIF -->
    <source type="image/avif"
      srcset="
        ${IMG}/${flat}/${SIZE.desktop.folder}/avif/${name}${SIZE.desktop.suffix}.avif ${SIZE.desktop.w}w,
        ${IMG}/${flat}/${SIZE.tablet .folder}/avif/${name}${SIZE.tablet .suffix}.avif ${SIZE.tablet .w}w,
        ${IMG}/${flat}/${SIZE.mobile .folder}/avif/${name}${SIZE.mobile .suffix}.avif ${SIZE.mobile .w}w">
    <!-- WebP -->
    <source type="image/webp"
      srcset="
        ${IMG}/${flat}/${SIZE.desktop.folder}/webp/${name}${SIZE.desktop.suffix}.webp ${SIZE.desktop.w}w,
        ${IMG}/${flat}/${SIZE.tablet .folder}/webp/${name}${SIZE.tablet .suffix}.webp ${SIZE.tablet .w}w,
        ${IMG}/${flat}/${SIZE.mobile .folder}/webp/${name}${SIZE.mobile .suffix}.webp ${SIZE.mobile .w}w">
    <!-- JPG fallback -->
    <img loading="lazy"
      src="${IMG}/${flat}/${SIZE.desktop.folder}/${name}${SIZE.desktop.suffix}.jpg"
      srcset="
        ${IMG}/${flat}/${SIZE.desktop.folder}/${name}${SIZE.desktop.suffix}.jpg ${SIZE.desktop.w}w,
        ${IMG}/${flat}/${SIZE.tablet .folder}/${name}${SIZE.tablet .suffix}.jpg ${SIZE.tablet .w}w,
        ${IMG}/${flat}/${SIZE.mobile .folder}/${name}${SIZE.mobile .suffix}.jpg ${SIZE.mobile .w}w"
      sizes="(max-width:360px) 360px,
             (max-width:576px) 576px,
             900px"
      alt="">
  </picture>
`;

/* ----- запуск галерей ----- */
window.addEventListener('DOMContentLoaded', async () => {
  /* 1. грузим JSON; если ошибка — выводим в консоль и выходим */
  let galleries = {};
  try {
    galleries = await fetch(DATA).then(r => r.json());
  } catch (e) {
    console.error(`Не смог загрузить ${DATA}`, e);
    return;
  }

  /* 2. инициализируем все контейнеры .js-gallery */
  document.querySelectorAll('.js-gallery').forEach(($root) => {
    const flat   = $root.dataset.id;                       // rose37
    const wrap   = $root.querySelector('.swiper-wrapper');
    const slides = galleries[flat] ?? [];

    slides.forEach(name =>
      wrap.insertAdjacentHTML('beforeend',
        `<div class="swiper-slide">${mkPicture(flat, name)}</div>`));

    const container = $root.matches('.swiper')
      ? $root
      : $root.querySelector('.swiper');

    if (!container) {
      console.warn('Не найден .swiper внутри .js-gallery');
      return;
    }

    new Swiper(container, {
      loop: true,
      navigation: {
        nextEl: $root.querySelector('.swiper-button-next'),
        prevEl: $root.querySelector('.swiper-button-prev'),
      },
      pagination: {
        el  : $root.querySelector('.swiper-pagination'),
        type: 'fraction',
      },
    });
  });
});
