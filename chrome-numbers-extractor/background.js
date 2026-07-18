// background.js — service worker orchestrating extraction, Google Sheets, and Excel export.

import { extractNumbersFromPage } from './lib/extractor.js';
import {
  spreadsheetExists,
  findSpreadsheetByName,
  createSpreadsheet,
  firstSheetTitle,
  rewriteColumn,
} from './lib/sheets.js';
import { buildXlsx, bytesToBase64, sanitizeSheetName } from './lib/xlsx.js';

const ALARM_NAME = 'numbers-extractor-timer';
const DEFAULT_CONFIG = {
  destination: 'sheets',      // 'sheets' | 'excel'
  column: 'A',
  includeInputs: true,
  visibleOnly: true,
  valueMode: 'numeric',       // 'numeric' | 'raw'
  excelFolder: 'tik/111',     // relative to the browser's Downloads folder (see README)
  timer: { enabled: false, intervalSec: 60 },
};

// ---- small utils ---------------------------------------------------------

function sanitizeFileName(name) {
  const n = String(name || 'page').replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim();
  return (n || 'page').slice(0, 120);
}

function columnToIndex(col) {
  const s = String(col || 'A').toUpperCase().replace(/[^A-Z]/g, '') || 'A';
  let idx = 0;
  for (const ch of s) idx = idx * 26 + (ch.charCodeAt(0) - 64);
  return idx - 1;
}

function getAuthToken(interactive) {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive }, (token) => {
      if (chrome.runtime.lastError || !token) {
        reject(new Error(chrome.runtime.lastError?.message || 'no_token'));
      } else {
        resolve(token);
      }
    });
  });
}

function removeCachedToken(token) {
  return new Promise((resolve) => chrome.identity.removeCachedAuthToken({ token }, resolve));
}

// ---- extraction ----------------------------------------------------------

async function extractFromTab(tabId, config) {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: extractNumbersFromPage,
    args: [{ includeInputs: config.includeInputs, visibleOnly: config.visibleOnly }],
  });
  const out = results && results[0] && results[0].result;
  if (!out) throw new Error('no_result');
  return out;
}

function pickValues(extracted, config) {
  return config.valueMode === 'raw' ? extracted.raw : extracted.values;
}

// ---- Google Sheets destination ------------------------------------------

async function withToken(interactive, fn) {
  let token = await getAuthToken(interactive);
  try {
    return await fn(token);
  } catch (e) {
    if (e.status === 401) {
      await removeCachedToken(token);
      token = await getAuthToken(interactive);
      return await fn(token);
    }
    throw e;
  }
}

async function resolveSpreadsheetId(token, name) {
  const mapKey = 'sheetMap';
  const store = await chrome.storage.local.get(mapKey);
  const map = store[mapKey] || {};

  if (map[name] && (await spreadsheetExists(token, map[name]))) {
    return map[name];
  }
  let id = await findSpreadsheetByName(token, name);
  if (!id) id = await createSpreadsheet(token, name);

  map[name] = id;
  await chrome.storage.local.set({ [mapKey]: map });
  return id;
}

async function sendToSheets(extracted, config, interactive) {
  const name = sanitizeFileName(extracted.title);
  const values = pickValues(extracted, config);

  return withToken(interactive, async (token) => {
    const id = await resolveSpreadsheetId(token, name);
    const tab = await firstSheetTitle(token, id);
    await rewriteColumn(token, id, tab, config.column, values);
    return {
      target: `Google Sheets · "${name}" · עמודה ${config.column.toUpperCase()}`,
      url: `https://docs.google.com/spreadsheets/d/${id}/edit`,
    };
  });
}

// ---- Excel destination ---------------------------------------------------
// Browsers cannot write to an arbitrary absolute path (e.g. C:/tik/111) or read
// an existing file back from disk. We therefore keep a "shadow" copy of the grid
// in extension storage so the non-selected columns the extension itself wrote are
// preserved, and save the workbook into Downloads/<excelFolder>/<file>.xlsx.

async function sendToExcel(extracted, config) {
  const baseName = sanitizeFileName(extracted.title);
  const fileName = `${baseName}.xlsx`;
  const folder = String(config.excelFolder || '')
    .replace(/^[a-zA-Z]:[\\/]*/, '')     // strip a Windows drive prefix if pasted
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '');
  const relPath = folder ? `${folder}/${fileName}` : fileName;
  const shadowKey = `excelShadow:${relPath}`;

  const values = pickValues(extracted, config);
  const colIdx = columnToIndex(config.column);

  // Load previously written grid (rows of arrays) for this file, if any.
  const store = await chrome.storage.local.get(shadowKey);
  const grid = Array.isArray(store[shadowKey]) ? store[shadowKey] : [];

  // Clear the selected column across existing rows, then write new values.
  const needed = Math.max(grid.length, values.length);
  for (let r = 0; r < needed; r++) {
    if (!grid[r]) grid[r] = [];
    grid[r][colIdx] = r < values.length ? values[r] : null;
  }
  // Trim rows that became fully empty at the tail.
  while (grid.length && grid[grid.length - 1].every((c) => c === null || c === undefined || c === '')) {
    grid.pop();
  }

  const bytes = buildXlsx(grid, sanitizeSheetName(baseName));
  const dataUrl =
    'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' +
    bytesToBase64(bytes);

  await new Promise((resolve, reject) => {
    chrome.downloads.download(
      { url: dataUrl, filename: relPath, conflictAction: 'overwrite', saveAs: false },
      (id) => {
        if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
        else resolve(id);
      }
    );
  });

  await chrome.storage.local.set({ [shadowKey]: grid });
  return { target: `Excel · Downloads/${relPath} · עמודה ${config.column.toUpperCase()}` };
}

// ---- run one cycle -------------------------------------------------------

async function guardTab(tabId) {
  const tab = await chrome.tabs.get(tabId).catch(() => null);
  if (!tab) throw new Error('הכרטיסייה נסגרה / tab closed');
  if (/^(chrome|edge|about|chrome-extension|devtools):/i.test(tab.url || '')) {
    throw new Error('לא ניתן לקרוא מדף מערכת של הדפדפן / cannot read a browser system page');
  }
  return tab;
}

// Extract only, write nothing — powers the in-popup preview.
async function previewTab(tabId, config) {
  await guardTab(tabId);
  const extracted = await extractFromTab(tabId, config);
  return {
    ok: true,
    title: extracted.title,
    raw: extracted.raw,
    values: extracted.values,
    count: extracted.raw.length,
  };
}

// Write an already-built {title, raw, values} object to the chosen destination.
async function writeExtracted(extracted, config, interactive) {
  const values = pickValues(extracted, config);
  if (!values.length) {
    return { ok: true, count: 0, target: 'לא נמצאו מספרים / no numbers', url: null };
  }
  const dest = config.destination === 'excel'
    ? await sendToExcel(extracted, config)
    : await sendToSheets(extracted, config, interactive);
  return { ok: true, count: values.length, target: dest.target, url: dest.url || null };
}

async function runOnce(tabId, config, interactive) {
  await guardTab(tabId);
  const extracted = await extractFromTab(tabId, config);
  return writeExtracted(extracted, config, interactive);
}

// ---- timer ---------------------------------------------------------------

async function startTimer(tabId, config) {
  const intervalSec = Math.max(30, Number(config.timer?.intervalSec) || 60);
  await chrome.storage.local.set({ timerState: { tabId, config, intervalSec, active: true } });
  chrome.alarms.create(ALARM_NAME, { periodInMinutes: intervalSec / 60 });
}

async function stopTimer() {
  await chrome.alarms.clear(ALARM_NAME);
  const s = await chrome.storage.local.get('timerState');
  const ts = s.timerState || {};
  ts.active = false;
  await chrome.storage.local.set({ timerState: ts });
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) return;
  const s = await chrome.storage.local.get('timerState');
  const ts = s.timerState;
  if (!ts || !ts.active) return;
  try {
    const res = await runOnce(ts.tabId, ts.config, false); // non-interactive on ticks
    await chrome.storage.local.set({ lastRun: { ...res, at: Date.now(), timer: true } });
  } catch (e) {
    await chrome.storage.local.set({ lastRun: { ok: false, error: String(e.message || e), at: Date.now(), timer: true } });
    // If auth or tab is gone, stop the loop so we don't spin.
    if (/no_token|tab closed|נסגרה/.test(String(e.message))) await stopTimer();
  }
});

// ---- messaging -----------------------------------------------------------

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    try {
      if (msg.type === 'preview') {
        sendResponse(await previewTab(msg.tabId, msg.config));
      } else if (msg.type === 'writeValues') {
        const extracted = { title: msg.title, raw: msg.raw || [], values: msg.values || [] };
        const res = await writeExtracted(extracted, msg.config, true);
        await chrome.storage.local.set({ lastRun: { ...res, at: Date.now(), timer: false } });
        sendResponse(res);
      } else if (msg.type === 'run') {
        const res = await runOnce(msg.tabId, msg.config, true);
        await chrome.storage.local.set({ lastRun: { ...res, at: Date.now(), timer: false } });
        sendResponse(res);
      } else if (msg.type === 'startTimer') {
        await startTimer(msg.tabId, msg.config);
        sendResponse({ ok: true });
      } else if (msg.type === 'stopTimer') {
        await stopTimer();
        sendResponse({ ok: true });
      } else if (msg.type === 'getState') {
        const s = await chrome.storage.local.get(['timerState', 'lastRun']);
        sendResponse({ ok: true, timerState: s.timerState || null, lastRun: s.lastRun || null });
      } else {
        sendResponse({ ok: false, error: 'unknown_message' });
      }
    } catch (e) {
      sendResponse({ ok: false, error: String(e.message || e) });
    }
  })();
  return true; // async response
});

export { DEFAULT_CONFIG };
