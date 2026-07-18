// extractor.js
// A self-contained function injected into the page via chrome.scripting.
// IMPORTANT: it must not reference anything outside its own body, because
// Chrome serializes the function source and runs it in the page context.

/**
 * Extract every number that appears on the page, in document order.
 *
 * @param {Object} opts
 * @param {boolean} opts.includeInputs  Also read values typed into <input>/<textarea>.
 * @param {boolean} opts.visibleOnly    Skip text inside hidden elements.
 * @returns {{ raw: string[], values: number[], title: string, url: string }}
 */
export function extractNumbersFromPage(opts) {
  const options = Object.assign({ includeInputs: true, visibleOnly: true }, opts || {});

  // Matches: 1,234.56  |  1.234  |  42  |  -5  |  3.14
  // Grouped-thousands form first so it wins over the plain-integer form.
  const NUM = /-?\d{1,3}(?:,\d{3})+(?:\.\d+)?|-?\d+(?:\.\d+)?/g;

  const raw = [];

  const isVisible = (node) => {
    if (!options.visibleOnly) return true;
    const el = node.nodeType === 3 ? node.parentElement : node;
    if (!el) return false;
    if (typeof el.checkVisibility === 'function') {
      return el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
    }
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  };

  const pushMatches = (text) => {
    if (!text) return;
    const found = text.match(NUM);
    if (found) for (const m of found) raw.push(m);
  };

  // Walk the document in order. Treat text nodes and form-control values as we reach them.
  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE']);
  const walker = document.createTreeWalker(
    document.body || document.documentElement,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode(node) {
        if (node.nodeType === 1) {
          // element: form controls carry their value here; everything else just recurse
          if (SKIP_TAGS.has(node.tagName)) return NodeFilter.FILTER_REJECT;
          const tag = node.tagName;
          if (options.includeInputs && (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT')) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_SKIP; // descend into children, don't emit the element itself
        }
        // text node
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  let node;
  while ((node = walker.nextNode())) {
    if (!isVisible(node)) continue;
    if (node.nodeType === 1) {
      const tag = node.tagName;
      if (tag === 'SELECT') {
        const sel = node.selectedOptions && node.selectedOptions[0];
        pushMatches(sel ? sel.textContent : node.value);
      } else {
        pushMatches(node.value);
      }
    } else {
      pushMatches(node.nodeValue);
    }
  }

  const values = raw.map((s) => Number(s.replace(/,/g, '')));

  return {
    raw,
    values,
    title: (document.title || location.hostname || 'page').trim(),
    url: location.href,
  };
}
