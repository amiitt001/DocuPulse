const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPng(width, height, drawPixel) {
  // 8 bytes PNG signature
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type (RGBA)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Scanlines with 0x00 filter byte per line
  const rawData = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawPixel(x, y, width, height);
      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crcData = chunk.subarray(4, 8 + len);
  const crc = zlib.crc32(crcData);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

// Pixel rendering logic for DocuPulse icon
function docuPulseShader(isMaskable) {
  return (x, y, w, h) => {
    // Normalized coordinates -1 to 1
    const nx = (x / w) * 2 - 1;
    const ny = (y / h) * 2 - 1;
    const r = Math.sqrt(nx * nx + ny * ny);

    // Full-bleed dark zinc background for maskable, rounded squircle for standard
    const cornerRadius = isMaskable ? 2.0 : 0.75;
    const squircleDist = Math.pow(Math.abs(nx), 4) + Math.pow(Math.abs(ny), 4);

    if (!isMaskable && squircleDist > 0.85) {
      return [0, 0, 0, 0]; // Transparent outside squircle
    }

    // Background color #18181b (24, 24, 27) with subtle gradient
    let bgR = 24 + Math.round((1 - ny) * 8);
    let bgG = 24 + Math.round((1 - ny) * 8);
    let bgB = 27 + Math.round((1 - ny) * 8);

    // Document sheet dimensions in normalized space
    const scale = isMaskable ? 0.65 : 0.8; // safe zone inset for maskable
    const docLeft = -0.38 * scale;
    const docRight = 0.38 * scale;
    const docTop = -0.52 * scale;
    const docBottom = 0.52 * scale;

    // Check if within document sheet (white)
    const inDoc = (nx >= docLeft && nx <= docRight && ny >= docTop && ny <= docBottom);

    if (inDoc) {
      // White document paper with subtle gray lines
      let pR = 255, pG = 255, pB = 255;

      // Text line 1
      if (ny >= (-0.2 * scale) && ny <= (-0.14 * scale) && nx >= (-0.28 * scale) && nx <= (0.28 * scale)) {
        pR = 113; pG = 113; pB = 122; // zinc-500
      }
      // Text line 2
      else if (ny >= (-0.06 * scale) && ny <= (0.0 * scale) && nx >= (-0.28 * scale) && nx <= (0.2 * scale)) {
        pR = 212; pG = 212; pB = 216; // zinc-300
      }
      // Text line 3
      else if (ny >= (0.08 * scale) && ny <= (0.14 * scale) && nx >= (-0.28 * scale) && nx <= (0.24 * scale)) {
        pR = 212; pG = 212; pB = 216;
      }
      // Text line 4
      else if (ny >= (0.22 * scale) && ny <= (0.28 * scale) && nx >= (-0.28 * scale) && nx <= (0.1 * scale)) {
        pR = 212; pG = 212; pB = 216;
      }

      // Cyan scan laser line across document center
      const laserDist = Math.abs(ny);
      if (laserDist < 0.04 * scale) {
        return [56, 189, 248, 255]; // vivid cyan #38bdf8
      } else if (laserDist < 0.09 * scale) {
        const t = (laserDist - 0.04 * scale) / (0.05 * scale);
        return [
          Math.round(56 * (1 - t) + pR * t),
          Math.round(189 * (1 - t) + pG * t),
          Math.round(248 * (1 - t) + pB * t),
          255
        ];
      }

      return [pR, pG, pB, 255];
    }

    // Laser beam extending beyond the document
    const laserDist = Math.abs(ny);
    if (laserDist < 0.03 * scale && Math.abs(nx) < 0.65 * scale) {
      const alpha = Math.max(0, 1 - Math.abs(nx) / (0.65 * scale));
      return [
        Math.round(56 * alpha + bgR * (1 - alpha)),
        Math.round(189 * alpha + bgG * (1 - alpha)),
        Math.round(248 * alpha + bgB * (1 - alpha)),
        255
      ];
    }

    // Corner viewfinder brackets
    const bW = 0.04 * scale;
    const bCornerX = 0.52 * scale;
    const bCornerY = 0.65 * scale;
    const bLen = 0.18 * scale;

    const nearCornerX = Math.abs(Math.abs(nx) - bCornerX);
    const nearCornerY = Math.abs(Math.abs(ny) - bCornerY);

    const isBracket =
      (nearCornerX < bW && Math.abs(ny) >= (bCornerY - bLen) && Math.abs(ny) <= bCornerY) ||
      (nearCornerY < bW && Math.abs(nx) >= (bCornerX - bLen) && Math.abs(nx) <= bCornerX);

    if (isBracket) {
      return [113, 113, 122, 255]; // zinc-500 bracket lines
    }

    return [bgR, bgG, bgB, 255];
  };
}

const publicDir = path.resolve(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating PWA PNG icons...');

// 1. pwa-192x192.png
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, docuPulseShader(false)));
console.log('Created public/pwa-192x192.png');

// 2. pwa-512x512.png
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, docuPulseShader(false)));
console.log('Created public/pwa-512x512.png');

// 3. pwa-maskable-512x512.png (safe-zone padding, full-bleed)
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, docuPulseShader(true)));
console.log('Created public/pwa-maskable-512x512.png');

// 4. apple-touch-icon.png (180x180 iOS Safari standard)
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, docuPulseShader(false)));
console.log('Created public/apple-touch-icon.png');

// 5. favicon.ico (can be a 64x64 PNG renamed or referenced)
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPng(64, 64, docuPulseShader(false)));
console.log('Created public/favicon.ico');

console.log('All PWA icons generated successfully!');
