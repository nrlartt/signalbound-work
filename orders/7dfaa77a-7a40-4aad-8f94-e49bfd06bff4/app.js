(() => {
  const decode = (value) => typeof value === "string"
    ? value.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", "\"").replaceAll("&#39;", "'").replaceAll("&#x27;", "'").replaceAll("&amp;", "&")
    : String(value ?? "");
  const fallback = (text) => {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0";
    (document.body || document.documentElement).appendChild(area);
    area.focus();
    area.select();
    area.setSelectionRange(0, text.length);
    const copied = typeof document.execCommand === "function" && document.execCommand("copy");
    area.remove();
    if (!copied) throw new Error("Copy failed");
  };
  const nativeWrite = navigator.clipboard && typeof navigator.clipboard.writeText === "function"
    ? navigator.clipboard.writeText.bind(navigator.clipboard)
    : null;
  const writeText = async (raw) => {
    const text = decode(raw);
    if (nativeWrite) {
      try { await nativeWrite(text); return; } catch { /* fall back inside sandboxed frame */ }
    }
    fallback(text);
  };
  try {
    if (navigator.clipboard) navigator.clipboard.writeText = writeText;
    else Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
  } catch { /* read-only clipboard prototype */ }
})();
// Helper to safely access nested properties
function safeGet(obj, path, fallback = '—') {
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), obj) || fallback;
}

function renderLiveData(data) {
  document.getElementById('priceUsd').textContent = safeGet(data, 'priceUsd');
  document.getElementById('marketCapUsd').textContent = safeGet(data, 'marketCapUsd');
  document.getElementById('progressPct').textContent = safeGet(data, 'progressPct');
  document.getElementById('reservePair').textContent = safeGet(data, 'reservePair');
  document.getElementById('feePct').textContent = safeGet(data, 'feePct');
  document.getElementById('holdersCount').textContent = safeGet(data, 'holdersCount');

  const topHolders = safeGet(data, 'topHolders', []);
  const topList = document.getElementById('topHoldersList');
  topList.innerHTML = '';
  topHolders.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.address}: ${item.balance}`;
    topList.appendChild(li);
  });

  const recentTrades = safeGet(data, 'recentTrades', []);
  const tradesList = document.getElementById('recentTradesList');
  tradesList.innerHTML = '';
  recentTrades.forEach(trade => {
    const li = document.createElement('li');
    li.textContent = `${trade.type} ${trade.amount} @ ${trade.price}`;
    tradesList.appendChild(li);
  });
}

async function fetchLiveJson() {
  try {
    const resp = await fetch('./live.json', { cache: 'no-store' });
    if (!resp.ok) throw new Error('Network response was not ok');
    return await resp.json();
  } catch (e) {
    console.warn('Failed to fetch live.json, falling back to SignalboundPump API', e);
    return null;
  }
}

async function getLiveData() {
  // Prefer the global SignalboundPump API if available
  if (window.SignalboundPump && typeof window.SignalboundPump.getLive === 'function') {
    try {
      const apiData = await window.SignalboundPump.getLive();
      if (apiData) return apiData;
    } catch (e) {
      console.warn('SignalboundPump.getLive() failed', e);
    }
  }
  // Fallback to the static JSON file
  const jsonData = await fetchLiveJson();
  return jsonData || {};
}

async function update() {
  const data = await getLiveData();
  renderLiveData(data);
}

// Initial paint using any static snapshot (none provided, so we show loading placeholders)
update();

// Refresh every 15 seconds
setInterval(update, 15000);

// Trade button handlers – no inline attributes per spec
document.addEventListener('DOMContentLoaded', () => {
  const buyBtn = document.getElementById('buyBtn');
  const sellBtn = document.getElementById('sellBtn');

  if (buyBtn) {
    buyBtn.addEventListener('click', () => {
      if (window.SignalboundPump && typeof window.SignalboundPump.openTrade === 'function') {
        window.SignalboundPump.openTrade('buy');
      } else {
        console.warn('SignalboundPump.openTrade not available');
      }
    });
  }

  if (sellBtn) {
    sellBtn.addEventListener('click', () => {
      if (window.SignalboundPump && typeof window.SignalboundPump.openTrade === 'function') {
        // Amount can be omitted; the Pump UI will ask the user.
        window.SignalboundPump.openTrade('sell');
      } else {
        console.warn('SignalboundPump.openTrade not available');
      }
    });
  }
});