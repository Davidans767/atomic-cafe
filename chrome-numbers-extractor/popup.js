// popup.js — reads the form, persists config, and talks to the service worker.

const DEFAULT_CONFIG = {
  destination: 'sheets',
  column: 'A',
  includeInputs: true,
  visibleOnly: true,
  valueMode: 'numeric',
  excelFolder: 'tik/111',
  timer: { enabled: false, intervalSec: 60 },
};

const $ = (id) => document.getElementById(id);
const els = {
  destination: $('destination'),
  column: $('column'),
  valueMode: $('valueMode'),
  excelOptions: $('excelOptions'),
  excelFolder: $('excelFolder'),
  excelPathHint: $('excelPathHint'),
  includeInputs: $('includeInputs'),
  visibleOnly: $('visibleOnly'),
  timerEnabled: $('timerEnabled'),
  timerRow: $('timerRow'),
  intervalSec: $('intervalSec'),
  runBtn: $('runBtn'),
  previewBtn: $('previewBtn'),
  timerToggle: $('timerToggle'),
  status: $('status'),
  preview: $('preview'),
  previewCount: $('previewCount'),
  previewBody: $('previewBody'),
  previewClose: $('previewClose'),
  previewNote: $('previewNote'),
};

const PREVIEW_LIMIT = 500;

let destination = DEFAULT_CONFIG.destination;

function readConfig() {
  return {
    destination,
    column: (els.column.value || 'A').trim() || 'A',
    includeInputs: els.includeInputs.checked,
    visibleOnly: els.visibleOnly.checked,
    valueMode: els.valueMode.value,
    excelFolder: (els.excelFolder.value || '').trim(),
    timer: {
      enabled: els.timerEnabled.checked,
      intervalSec: Math.max(30, Number(els.intervalSec.value) || 60),
    },
  };
}

function applyConfig(cfg) {
  destination = cfg.destination || 'sheets';
  els.column.value = cfg.column || 'A';
  els.valueMode.value = cfg.valueMode || 'numeric';
  els.excelFolder.value = cfg.excelFolder ?? 'tik/111';
  els.includeInputs.checked = cfg.includeInputs !== false;
  els.visibleOnly.checked = cfg.visibleOnly !== false;
  els.timerEnabled.checked = !!cfg.timer?.enabled;
  els.intervalSec.value = cfg.timer?.intervalSec || 60;
  syncUi();
}

function syncUi() {
  for (const b of els.destination.querySelectorAll('.seg')) {
    b.classList.toggle('active', b.dataset.value === destination);
  }
  els.excelOptions.hidden = destination !== 'excel';
  els.timerRow.hidden = !els.timerEnabled.checked;
  els.timerToggle.hidden = !els.timerEnabled.checked;
  const folder = (els.excelFolder.value || '').replace(/^[a-zA-Z]:[\\/]*/, '').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
  els.excelPathHint.textContent = `יישמר בפועל ב: Downloads/${folder ? folder + '/' : ''}<שם הדף>.xlsx`;
}

function persist() {
  chrome.storage.local.set({ config: readConfig() });
}

function setStatus(kind, html) {
  els.status.hidden = false;
  els.status.className = `status ${kind}`;
  els.status.innerHTML = html;
}

async function activeTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function send(message) {
  return new Promise((resolve) => chrome.runtime.sendMessage(message, resolve));
}

async function refreshTimerButton() {
  const state = await send({ type: 'getState' });
  const active = state?.timerState?.active;
  els.timerToggle.textContent = active ? 'עצור טיימר' : 'הפעל טיימר';
  els.timerToggle.dataset.active = active ? '1' : '0';
}

// ---- events --------------------------------------------------------------

els.destination.addEventListener('click', (e) => {
  const btn = e.target.closest('.seg');
  if (!btn) return;
  destination = btn.dataset.value;
  syncUi();
  persist();
});

for (const el of [els.column, els.valueMode, els.excelFolder, els.includeInputs, els.visibleOnly, els.intervalSec]) {
  el.addEventListener('input', () => { syncUi(); persist(); });
}
els.timerEnabled.addEventListener('change', () => { syncUi(); persist(); });

els.runBtn.addEventListener('click', async () => {
  const tab = await activeTab();
  if (!tab) return setStatus('err', 'לא נמצאה כרטיסייה פעילה.');
  els.runBtn.disabled = true;
  setStatus('', 'מריץ…');
  const res = await send({ type: 'run', tabId: tab.id, config: readConfig() });
  els.runBtn.disabled = false;
  if (!res || res.ok === false) {
    setStatus('err', `שגיאה: ${res?.error || 'לא ידועה'}`);
  } else if (res.count === 0) {
    setStatus('ok', res.target);
  } else {
    const link = res.url ? ` — <a href="${res.url}" target="_blank" rel="noopener">פתח</a>` : '';
    setStatus('ok', `✓ הוזנו ${res.count} מספרים → ${res.target}${link}`);
  }
});

function renderPreview(raw, values) {
  els.previewBody.textContent = '';
  const shown = Math.min(raw.length, PREVIEW_LIMIT);
  const frag = document.createDocumentFragment();
  for (let i = 0; i < shown; i++) {
    const num = values[i];
    const tr = document.createElement('tr');
    const bad = !Number.isFinite(num);
    if (bad) tr.className = 'bad';
    else if (String(num) !== String(raw[i])) tr.className = 'changed';

    const cells = [
      { t: String(i + 1), c: 'idx' },
      { t: raw[i], c: '' },
      { t: bad ? '—' : String(num), c: 'num' },
    ];
    for (const cell of cells) {
      const td = document.createElement('td');
      td.textContent = cell.t;
      if (cell.c) td.className = cell.c;
      tr.appendChild(td);
    }
    frag.appendChild(tr);
  }
  els.previewBody.appendChild(frag);
  els.previewCount.textContent = `נמצאו ${raw.length} מספרים`;
  els.previewNote.hidden = raw.length <= PREVIEW_LIMIT;
  els.previewNote.textContent = `מוצגים ${PREVIEW_LIMIT} הראשונים מתוך ${raw.length}. כולם ייכתבו לגיליון.`;
  els.preview.hidden = false;
}

els.previewClose.addEventListener('click', () => { els.preview.hidden = true; });

els.previewBtn.addEventListener('click', async () => {
  const tab = await activeTab();
  if (!tab) return setStatus('err', 'לא נמצאה כרטיסייה פעילה.');
  els.previewBtn.disabled = true;
  setStatus('', 'סורק את הדף…');
  const res = await send({ type: 'preview', tabId: tab.id, config: readConfig() });
  els.previewBtn.disabled = false;
  if (!res || res.ok === false) {
    els.preview.hidden = true;
    return setStatus('err', `שגיאה: ${res?.error || 'לא ידועה'}`);
  }
  if (res.count === 0) {
    els.preview.hidden = true;
    return setStatus('ok', 'לא נמצאו מספרים בדף.');
  }
  els.status.hidden = true;
  renderPreview(res.raw, res.values);
});

els.timerToggle.addEventListener('click', async () => {
  const active = els.timerToggle.dataset.active === '1';
  if (active) {
    await send({ type: 'stopTimer' });
    setStatus('ok', 'הטיימר נעצר.');
  } else {
    const tab = await activeTab();
    if (!tab) return setStatus('err', 'לא נמצאה כרטיסייה פעילה.');
    const cfg = readConfig();
    await send({ type: 'startTimer', tabId: tab.id, config: cfg });
    setStatus('ok', `הטיימר פועל — כל ${cfg.timer.intervalSec} שניות על כרטיסייה זו.`);
  }
  await refreshTimerButton();
});

// ---- init ----------------------------------------------------------------

(async () => {
  const store = await chrome.storage.local.get('config');
  applyConfig({ ...DEFAULT_CONFIG, ...(store.config || {}) });
  await refreshTimerButton();
})();
