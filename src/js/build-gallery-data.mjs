import { readdirSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join, extname, basename } from 'node:path';

/** абсолютный путь к каталогу проекта ( ..\website_with_bnovo ) */
const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

/** где лежат фото */
const ROOT      = resolve(PROJECT_ROOT, 'public/images/flats');     // …/public/images/flats
const OUT_FILE  = resolve(PROJECT_ROOT, 'public/data/galleryData.json');

const SIZES_DIR = ['desktop', 'tablet', 'mobile']; // подпапки, в которых ищем
const VALID_EXT = new Set(['.jpg', '.jpeg']);

const galleries = {};

// ────────────────────────────────────────────────
for (const dir of readdirSync(ROOT, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;               // пропускаем файлы
  const flat = dir.name;                          // rose37, ostrovskogo37 …

  const bases = new Set();

  for (const size of SIZES_DIR) {
    const folder = join(ROOT, flat, size);
    if (!existsSync(folder)) continue;

    for (const file of readdirSync(folder)) {
      const filePath = join(folder, file);
      if (statSync(filePath).isDirectory()) continue; // webp/avif подпапки

      const ext = extname(file).toLowerCase();
      if (!VALID_EXT.has(ext)) continue;

      // убираем «_900»/«_576» в конце
      const base = basename(file, ext).replace(/_\d+$/, '');
      bases.add(base);
    }
  }

  // сортируем «по-человечески»: 1, 2, 10 …
  galleries[flat] = [...bases].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );
}

// ─────────── запись JSON
writeFileSync(OUT_FILE, JSON.stringify(galleries, null, 2), 'utf8');
console.log(`✔  galleryData.json обновлён → ${OUT_FILE}`);
