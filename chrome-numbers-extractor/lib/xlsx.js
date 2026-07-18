// xlsx.js — a tiny, dependency-free .xlsx writer.
// Produces a valid Office Open XML workbook as a Uint8Array using a
// store-method (uncompressed) ZIP container. Good enough for writing a
// grid of numbers/strings; no styles, formulas, or shared strings.

const enc = new TextEncoder();

// ---- ZIP (store method) --------------------------------------------------

function crc32(bytes) {
  let crc = ~0;
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (~crc) >>> 0;
}

function u16(n) { return [n & 0xff, (n >>> 8) & 0xff]; }
function u32(n) { return [n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff]; }

// Fixed DOS timestamp (2020-01-01 00:00:00) keeps output deterministic.
const DOS_TIME = 0;
const DOS_DATE = ((2020 - 1980) << 9) | (1 << 5) | 1;

/**
 * @param {{name:string, data:Uint8Array}[]} files
 * @returns {Uint8Array}
 */
function zipStore(files) {
  const chunks = [];
  const central = [];
  let offset = 0;

  for (const f of files) {
    const nameBytes = enc.encode(f.name);
    const crc = crc32(f.data);
    const size = f.data.length;

    const local = [
      ...u32(0x04034b50), ...u16(20), ...u16(0), ...u16(0),
      ...u16(DOS_TIME), ...u16(DOS_DATE),
      ...u32(crc), ...u32(size), ...u32(size),
      ...u16(nameBytes.length), ...u16(0),
    ];
    const localHeader = new Uint8Array(local);
    chunks.push(localHeader, nameBytes, f.data);

    central.push({
      nameBytes, crc, size, offset,
    });
    offset += localHeader.length + nameBytes.length + size;
  }

  const centralChunks = [];
  let centralSize = 0;
  for (const c of central) {
    const rec = [
      ...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0), ...u16(0),
      ...u16(DOS_TIME), ...u16(DOS_DATE),
      ...u32(c.crc), ...u32(c.size), ...u32(c.size),
      ...u16(c.nameBytes.length), ...u16(0), ...u16(0),
      ...u16(0), ...u16(0), ...u32(0),
      ...u32(c.offset),
    ];
    const recBytes = new Uint8Array(rec);
    centralChunks.push(recBytes, c.nameBytes);
    centralSize += recBytes.length + c.nameBytes.length;
  }

  const eocd = new Uint8Array([
    ...u32(0x06054b50), ...u16(0), ...u16(0),
    ...u16(central.length), ...u16(central.length),
    ...u32(centralSize), ...u32(offset), ...u16(0),
  ]);

  const total = offset + centralSize + eocd.length;
  const out = new Uint8Array(total);
  let p = 0;
  for (const ch of [...chunks, ...centralChunks, eocd]) {
    out.set(ch, p);
    p += ch.length;
  }
  return out;
}

// ---- XLSX ----------------------------------------------------------------

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function colLetter(i) {
  let s = '';
  i += 1;
  while (i > 0) {
    const rem = (i - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    i = Math.floor((i - 1) / 26);
  }
  return s;
}

export function sanitizeSheetName(name) {
  let n = String(name || 'Sheet1').replace(/[[\]:*?/\\]/g, ' ').trim();
  if (!n) n = 'Sheet1';
  return n.slice(0, 31);
}

function sheetXml(rows) {
  let body = '';
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r] || [];
    let cells = '';
    for (let c = 0; c < row.length; c++) {
      const v = row[c];
      if (v === null || v === undefined || v === '') continue;
      const ref = colLetter(c) + (r + 1);
      if (typeof v === 'number' && Number.isFinite(v)) {
        cells += `<c r="${ref}"><v>${v}</v></c>`;
      } else {
        cells += `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${xmlEscape(v)}</t></is></c>`;
      }
    }
    if (cells) body += `<row r="${r + 1}">${cells}</row>`;
  }
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${body}</sheetData></worksheet>`;
}

/**
 * Build an .xlsx file from a 2D grid.
 * @param {(number|string|null)[][]} rows
 * @param {string} sheetName
 * @returns {Uint8Array}
 */
export function buildXlsx(rows, sheetName) {
  const name = sanitizeSheetName(sheetName);

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`;

  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;

  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${xmlEscape(name)}" sheetId="1" r:id="rId1"/></sheets></workbook>`;

  const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`;

  const files = [
    { name: '[Content_Types].xml', data: enc.encode(contentTypes) },
    { name: '_rels/.rels', data: enc.encode(rootRels) },
    { name: 'xl/workbook.xml', data: enc.encode(workbook) },
    { name: 'xl/_rels/workbook.xml.rels', data: enc.encode(workbookRels) },
    { name: 'xl/worksheets/sheet1.xml', data: enc.encode(sheetXml(rows)) },
  ];
  return zipStore(files);
}

/** Encode bytes to a base64 string (for data: URLs in the service worker). */
export function bytesToBase64(bytes) {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}
