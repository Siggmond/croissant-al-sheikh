const VERSION = 5;
const SIZE = 17 + VERSION * 4;
const QUIET_ZONE = 4;
const DATA_CODEWORDS = 108;
const EC_CODEWORDS = 26;
const MAX_BYTE_LENGTH = 106;

function appendBits(bits: boolean[], value: number, length: number) {
  for (let i = length - 1; i >= 0; i--) bits.push(((value >>> i) & 1) !== 0);
}

function utf8Bytes(value: string): number[] {
  return Array.from(new TextEncoder().encode(value));
}

function gfMultiply(x: number, y: number) {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    if (((y >>> i) & 1) !== 0) z ^= x;
  }
  return z & 0xff;
}

function reedSolomonDivisor(degree: number) {
  const result = Array<number>(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < degree; j++) {
      result[j] = gfMultiply(result[j], root);
      if (j + 1 < degree) result[j] ^= result[j + 1];
    }
    root = gfMultiply(root, 0x02);
  }
  return result;
}

function reedSolomonRemainder(data: number[], degree: number) {
  const divisor = reedSolomonDivisor(degree);
  const result = Array<number>(degree).fill(0);

  for (const byte of data) {
    const factor = byte ^ (result.shift() ?? 0);
    result.push(0);
    for (let i = 0; i < degree; i++) result[i] = (result[i] ?? 0) ^ gfMultiply(divisor[i] ?? 0, factor);
  }

  return result;
}

function createDataCodewords(value: string) {
  const bytes = utf8Bytes(value);
  const sourceBytes = bytes.length > MAX_BYTE_LENGTH ? utf8Bytes('https://centercroissantalsheikh.lb') : bytes;
  const bits: boolean[] = [];

  appendBits(bits, 0b0100, 4); // Byte mode
  appendBits(bits, sourceBytes.length, 8);
  for (const byte of sourceBytes) appendBits(bits, byte, 8);

  const capacity = DATA_CODEWORDS * 8;
  appendBits(bits, 0, Math.min(4, capacity - bits.length));
  while (bits.length % 8 !== 0) bits.push(false);

  const result: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | (bits[i + j] ? 1 : 0);
    result.push(byte);
  }

  for (let pad = 0xec; result.length < DATA_CODEWORDS; pad ^= 0xec ^ 0x11) result.push(pad);
  return result;
}

function createFormatBits() {
  const errorCorrectionLevelLow = 1;
  const maskPattern = 0;
  const data = (errorCorrectionLevelLow << 3) | maskPattern;
  let remainder = data;

  for (let i = 0; i < 10; i++) {
    remainder = (remainder << 1) ^ (((remainder >>> 9) & 1) * 0x537);
  }

  return ((data << 10) | (remainder & 0x3ff)) ^ 0x5412;
}

function createQrModules(value: string) {
  const modules = Array.from({ length: SIZE }, () => Array<boolean>(SIZE).fill(false));
  const reserved = Array.from({ length: SIZE }, () => Array<boolean>(SIZE).fill(false));

  const set = (x: number, y: number, dark: boolean, reserve = true) => {
    if (x < 0 || x >= SIZE || y < 0 || y >= SIZE) return;
    modules[y][x] = dark;
    if (reserve) reserved[y][x] = true;
  };
  const reserve = (x: number, y: number) => {
    if (x >= 0 && x < SIZE && y >= 0 && y < SIZE) reserved[y][x] = true;
  };

  const finder = (left: number, top: number) => {
    for (let y = -1; y <= 7; y++) {
      for (let x = -1; x <= 7; x++) {
        const xx = left + x;
        const yy = top + y;
        const dark =
          x >= 0 && x <= 6 && y >= 0 && y <= 6 &&
          (x === 0 || x === 6 || y === 0 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4));
        set(xx, yy, dark, true);
      }
    }
  };

  finder(0, 0);
  finder(SIZE - 7, 0);
  finder(0, SIZE - 7);

  for (let i = 0; i < SIZE; i++) {
    if (!reserved[6][i]) set(i, 6, i % 2 === 0, true);
    if (!reserved[i][6]) set(6, i, i % 2 === 0, true);
  }

  for (let y = -2; y <= 2; y++) {
    for (let x = -2; x <= 2; x++) set(30 + x, 30 + y, Math.max(Math.abs(x), Math.abs(y)) !== 1, true);
  }

  set(8, 4 * VERSION + 9, true, true);
  for (let i = 0; i < 9; i++) {
    reserve(8, i);
    reserve(i, 8);
  }
  for (let i = 0; i < 8; i++) {
    reserve(SIZE - 1 - i, 8);
    reserve(8, SIZE - 1 - i);
  }

  const data = createDataCodewords(value);
  const codewords = data.concat(reedSolomonRemainder(data, EC_CODEWORDS));
  const bits: boolean[] = [];
  for (const byte of codewords) appendBits(bits, byte, 8);

  let bitIndex = 0;
  let upward = true;
  for (let right = SIZE - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vertical = 0; vertical < SIZE; vertical++) {
      const y = upward ? SIZE - 1 - vertical : vertical;
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        if (reserved[y][x]) continue;
        let dark = bitIndex < bits.length ? bits[bitIndex++] : false;
        if ((x + y) % 2 === 0) dark = !dark;
        modules[y][x] = dark;
      }
    }
    upward = !upward;
  }

  const format = createFormatBits();
  const bit = (index: number) => ((format >>> index) & 1) !== 0;
  for (let i = 0; i < 6; i++) set(8, i, bit(i), true);
  set(8, 7, bit(6), true);
  set(8, 8, bit(7), true);
  set(7, 8, bit(8), true);
  for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i), true);
  for (let i = 0; i < 8; i++) set(SIZE - 1 - i, 8, bit(i), true);
  for (let i = 8; i < 15; i++) set(8, SIZE - 15 + i, bit(i), true);
  set(8, SIZE - 8, true, true);

  return modules;
}

export function SimpleQr({ value }: { value: string }) {
  const modules = createQrModules(value);
  const svgSize = SIZE + QUIET_ZONE * 2;

  return (
    <svg className="qr" viewBox={`0 0 ${svgSize} ${svgSize}`} role="img" aria-label={`QR code for ${value}`} shapeRendering="crispEdges">
      <rect width={svgSize} height={svgSize} fill="white" />
      {modules.map((row, y) => row.map((on, x) => on ? (
        <rect key={`${x}-${y}`} x={x + QUIET_ZONE} y={y + QUIET_ZONE} width="1" height="1" fill="#111" />
      ) : null))}
    </svg>
  );
}
