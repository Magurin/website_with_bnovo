import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

/* ---------- Константа с параметрами размеров ---------- */
const SIZE = {
  desktop: { folder: 'desktop', suffix: '_900', w: 900 },
  tablet : { folder: 'tablet',  suffix: '_576', w: 576 },
  mobile : { folder: 'mobile',  suffix: '_360', w: 360 },
};

/**
 * Формирует строку HTML с тегом <picture> для нужной квартиры/фото
 * @param {string} flat  — идентификатор квартиры (папка)
 * @param {string} name  — базовое имя файла без суффикса
 * @returns {string}     — готовая разметка <picture> … </picture>
 */
const mkPicture = (flat, name) => /* HTML */ `
  <picture>
    <!-- AVIF -->
    <source type="image/avif"
      srcset="
        ../../public/images/flats/${flat}/${SIZE.desktop.folder}/avif/${name}${SIZE.desktop.suffix}.avif ${SIZE.desktop.w}w,
        ../../public/images/flats/${flat}/${SIZE.tablet .folder}/avif/${name}${SIZE.tablet .suffix}.avif ${SIZE.tablet .w}w,
        ../../public/images/flats/${flat}/${SIZE.mobile .folder}/avif/${name}${SIZE.mobile .suffix}.avif ${SIZE.mobile .w}w">
    <!-- WebP -->
    <source type="image/webp"
      srcset="
        ../../public/images/flats/${flat}/${SIZE.desktop.folder}/webp/${name}${SIZE.desktop.suffix}.webp ${SIZE.desktop.w}w,
        ../../public/images/flats/${flat}/${SIZE.tablet .folder}/webp/${name}${SIZE.tablet .suffix}.webp ${SIZE.tablet .w}w,
        ../../public/images/flats/${flat}/${SIZE.mobile .folder}/webp/${name}${SIZE.mobile .suffix}.webp ${SIZE.mobile .w}w">
    <!-- JPG fallback -->
    <img loading="lazy"
      src="../../public/images/flats/${flat}/${SIZE.desktop.folder}/${name}${SIZE.desktop.suffix}.jpg"
      srcset="
        ../../public/images/flats/${flat}/${SIZE.desktop.folder}/${name}${SIZE.desktop.suffix}.jpg ${SIZE.desktop.w}w,
        ../../public/images/flats/${flat}/${SIZE.tablet .folder}/${name}${SIZE.tablet .suffix}.jpg ${SIZE.tablet .w}w,
        ../../public/images/flats/${flat}/${SIZE.mobile .folder}/${name}${SIZE.mobile .suffix}.jpg ${SIZE.mobile .w}w"
      sizes="(max-width:360px) 360px,
             (max-width:576px) 576px,
             900px"
      alt="">
  </picture>
`;

/* ---------- Основной скрипт ---------- */
window.addEventListener('DOMContentLoaded', async () => {
  /* 1. Загружаем JSON со списками файлов */
  const galleries = await fetch('../../public/data/galleryData.json').then(r => r.json());

  /* 2. Находим все контейнеры с классом .js-gallery */
  document.querySelectorAll('.js-gallery').forEach(($root) => {
    const flat   = $root.dataset.id;                  // id квартиры = ключ в JSON
    const wrap   = $root.querySelector('.swiper-wrapper');
    const slides = galleries[flat] ?? [];             // массив имён файлов

    /* 2.1. Для каждого фото генерируем слайд */
    slides.forEach((name) => {
      wrap.insertAdjacentHTML(
        'beforeend',
        /* html */ `
          <div class="swiper-slide">
            ${mkPicture(flat, name)}
          </div>
        `,
      );
    });

    /* 3. Определяем элемент-контейнер для Swiper */
    const container = $root.matches('.swiper') ? $root : $root.querySelector('.swiper');
    if (!container) {
      console.warn('Не найден .swiper внутри .js-gallery');
      return;
    }

    /* 4. Запускаем Swiper */
    new Swiper(container, {
      loop: true,
      lazy: true,

      navigation: {
        nextEl: $root.querySelector('.swiper-button-next'),
        prevEl: $root.querySelector('.swiper-button-prev'),
      },

      pagination: {
        el  : $root.querySelector('.swiper-pagination'),
        type: 'fraction',            // «1 / 5»
      },
    });
  });
});