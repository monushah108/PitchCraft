// generate-icons.js
// Creates standard 16, 48, 128 PNG icons for the extension using pure Node.js
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPng(width, height, colorFn) {
  const rowSize = width * 4;
  const rawData = Buffer.alloc((rowSize + 1) * height);
  
  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = colorFn(x, y, width, height);
      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  function createChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(12 + len);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);

    // CRC32
    let crc = 0xffffffff;
    for (let i = 4; i < 8 + len; i++) {
      const byte = buf[i];
      for (let j = 0; j < 8; j++) {
        const bit = (crc ^ byte) & 1;
        crc = (crc >>> 1) ^ (bit ? 0xedb88320 : 0);
      }
    }
    buf.writeInt32BE(~crc, 8 + len);
    return buf;
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const chunks = [
    header,
    createChunk('IHDR', ihdr),
    createChunk('IDAT', deflated),
    createChunk('IEND', Buffer.alloc(0))
  ];

  return Buffer.concat(chunks);
}

function iconShader(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
  const maxR = w * 0.46;
  
  if (r > maxR) {
    return [0, 0, 0, 0]; // Transparent outer
  }
  
  // Sleek gradient from indigo/violet (#6366f1) to cyan/teal (#06b6d4)
  const t = (x + y) / (w + h);
  const rCol = Math.round(99 + (6 - 99) * t);
  const gCol = Math.round(102 + (182 - 102) * t);
  const bCol = Math.round(241 + (212 - 241) * t);
  
  // Envelope / paper airplane icon inside
  const nx = (x - cx) / (w * 0.4);
  const ny = (y - cy) / (h * 0.4);
  
  // Simple envelope or star/lightning glyph
  const inLetter = (Math.abs(nx) < 0.55 && Math.abs(ny) < 0.4);
  const isVLine = (inLetter && Math.abs(Math.abs(nx) - (ny + 0.4) * 0.6) < 0.12 && ny < 0.2);

  if (isVLine || (inLetter && (Math.abs(nx) > 0.48 || Math.abs(ny) > 0.35))) {
    return [255, 255, 255, 240];
  }

  // Smooth antialias border
  const alpha = Math.min(255, Math.max(0, Math.round((maxR - r) * 255)));
  return [rCol, gCol, bCol, alpha];
}

const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

[16, 48, 128].forEach(size => {
  const buf = createPng(size, size, iconShader);
  fs.writeFileSync(path.join(iconsDir, `icon${size}.png`), buf);
  console.log(`Generated icon${size}.png`);
});
