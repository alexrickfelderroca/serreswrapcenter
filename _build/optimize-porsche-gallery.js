/* Optimiza las fotos RAW de uploads/ (Porsche Cayenne + 911 Carrera GTS)
   al formato de assets/gallery/: full 1800px lado largo + thumb -s 900px.
   Uso:  node _build/optimize-porsche-gallery.js
   Requiere el sharp del proyecto vecino "serres wrap center app". */
const sharp = require('C:/Users/Rickfelder/Desktop/serres wrap center app/node_modules/sharp');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'uploads');
const OUT = path.join(ROOT, 'assets', 'gallery');

const MAP = [
  ['IMG_0530.PNG', 'cayenne-front'],   // Cayenne frontal bajo la luz hexagonal
  ['IMG_0533.PNG', 'cayenne-quarter'], // Cayenne 3/4 delantero, pinzas verde acido
  ['IMG_0525.PNG', 'cayenne-crest'],   // Escudo Porsche sobre capo satinado
  ['IMG_0843.JPG', 'gts-quarter'],     // 911 GTS 3/4 delantero
  ['IMG_0848.JPG', 'gts-front'],       // 911 GTS frontal
  ['IMG_0847.JPG', 'gts-rear'],        // 911 GTS 3/4 trasero, pared verde
  ['IMG_0846.JPG', 'gts-tail'],        // 911 GTS detalle de la barra de luz
];

(async () => {
  for (const [src, name] of MAP) {
    const input = path.join(SRC, src);
    const base = sharp(input, { limitInputPixels: false }).rotate();
    await base.clone()
      .resize({ width: 1800, height: 1800, fit: 'inside' })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(OUT, name + '.jpg'));
    await base.clone()
      .resize({ width: 900, height: 900, fit: 'inside' })
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(path.join(OUT, name + '-s.jpg'));
    console.log(src, '->', name + '.jpg + ' + name + '-s.jpg');
  }
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
