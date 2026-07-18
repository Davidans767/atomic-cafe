// sheets.js — thin Google Sheets + Drive REST helpers.
// Every function takes an OAuth access token; auth itself lives in background.js.

const SHEETS = 'https://sheets.googleapis.com/v4/spreadsheets';
const DRIVE = 'https://www.googleapis.com/drive/v3/files';

async function api(url, token, init) {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init && init.headers),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
    err.status = res.status;
    throw err;
  }
  return res.status === 204 ? null : res.json();
}

/** Confirm a spreadsheet id still exists and is reachable. */
export async function spreadsheetExists(token, id) {
  try {
    await api(`${SHEETS}/${id}?fields=spreadsheetId`, token, { method: 'GET' });
    return true;
  } catch (e) {
    if (e.status === 404 || e.status === 403) return false;
    throw e;
  }
}

/** Search Drive (app-created files, drive.file scope) for a spreadsheet by exact name. */
export async function findSpreadsheetByName(token, name) {
  const q = encodeURIComponent(
    `name='${name.replace(/'/g, "\\'")}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`
  );
  const data = await api(
    `${DRIVE}?q=${q}&spaces=drive&fields=files(id,name)&pageSize=1`,
    token,
    { method: 'GET' }
  );
  return data.files && data.files.length ? data.files[0].id : null;
}

export async function createSpreadsheet(token, title) {
  const data = await api(SHEETS, token, {
    method: 'POST',
    body: JSON.stringify({ properties: { title } }),
  });
  return data.spreadsheetId;
}

/** Name of the first sheet/tab inside the workbook (needed for A1 ranges). */
export async function firstSheetTitle(token, id) {
  const data = await api(
    `${SHEETS}/${id}?fields=sheets(properties(title))`,
    token,
    { method: 'GET' }
  );
  return (data.sheets && data.sheets[0] && data.sheets[0].properties.title) || 'Sheet1';
}

/**
 * Rewrite a single column: clear the whole column first, then write values from row 1 down.
 * Other columns are never touched.
 */
export async function rewriteColumn(token, id, sheetTitle, column, values) {
  const col = column.toUpperCase();
  const tab = /[^A-Za-z0-9]/.test(sheetTitle) ? `'${sheetTitle.replace(/'/g, "''")}'` : sheetTitle;

  // 1) clear the entire target column
  await api(
    `${SHEETS}/${id}/values/${encodeURIComponent(`${tab}!${col}:${col}`)}:clear`,
    token,
    { method: 'POST', body: '{}' }
  );

  // 2) write the new values down the column (majorDimension COLUMNS)
  const range = `${tab}!${col}1`;
  await api(
    `${SHEETS}/${id}/values/${encodeURIComponent(range)}?valueInputOption=RAW`,
    token,
    {
      method: 'PUT',
      body: JSON.stringify({
        range,
        majorDimension: 'COLUMNS',
        values: [values],
      }),
    }
  );
}
