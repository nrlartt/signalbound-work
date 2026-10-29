(() => {
  const decode = (value) => typeof value === "string"
    ? value.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", '"').replaceAll("&#39;", "'").replaceAll("&#x27;", "'").replaceAll("&amp;", "&")
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
      try { await nativeWrite(text); return; } catch { /* fall back */ }
    }
    fallback(text);
  };
  try {
    if (navigator.clipboard) navigator.clipboard.writeText = writeText;
    else Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
  } catch { /* read-only clipboard prototype */ }
})();
// Lila #6630 Signalbound Pump — Live Data Renderer
function renderLive(data) {
  const el = {
    priceUsd: document.getElementById('priceUsd'),
    marketCapUsd: document.getElementById('marketCapUsd'),
    progressPct: document.getElementById('progressPct'),
    reserveUsd: document.getElementById('reserveUsd'),
    feePct: document.getElementById('feePct'),
    holdersCount: document.getElementById('holdersCount'),
    topHoldersCount: document.getElementById('topHoldersCount'),
    recentTradesCount: document.getElementById('recentTradesCount'),
    topHoldersList: document.getElementById('topHoldersList'),
    recentTradesList: document.getElementById('recentTradesList')
  };
  if (!data) return;
  el.priceUsd.textContent = Number(data.priceUsd).toFixed(8);
  el.marketCapUsd.textContent = Number(data.marketCapUsd).toFixed(2);
  el.progressPct.textContent = data.progressPct != null ? Number(data.progressPct).toFixed(2) : '—';
  el.reserveUsd.textContent = data.reservePair != null ? Number(data.reservePair.reserveUsd).toFixed(2) : '—';
  el.feePct.textContent = data.feePct != null ? Number(data.feePct).toFixed(2) : '—';
  el.holdersCount.textContent = data.holdersCount != null ? String(data.holdersCount) : '—';
  el.topHoldersCount.textContent = data.topHolders != null ? String(data.topHolders.length) : '—';
  el.recentTradesCount.textContent = data.recentTrades != null ? String(data.recentTrades.length) : '—';
  const topHolders = data.topHolders || [];
  el.topHoldersList.innerHTML = '';
  topHolders.slice(0,5).forEach((h,i)=>{
    const li=document.createElement('li');
    li.textContent=`${i+1}. ${h.address||'—'} — ${Number(h.amount).toFixed(2)}`;
    el.topHoldersList.appendChild(li);
  });
  const recentTrades = data.recentTrades || [];
  el.recentTradesList.innerHTML = '';
  recentTrades.slice(0,5).forEach((t,i)=>{
    const li=document.createElement('li');
    li.textContent=`${i+1}. ${t.type||'—'} ${Number(t.amount||0).toFixed(4)} at ${Number(t.priceUsd||0).toFixed(8)} USD`;
    el.recentTradesList.appendChild(li);
  });
}
function fetchLive() {
  if (window.SignalboundPump && window.SignalboundPump.getLive) {
    try {
      const live = window.SignalboundPump.getLive();
      if (live && live.priceUsd != null) { renderLive(live); return; }
    } catch (e) { }
  }
  fetch('./live.json')
    .then(r=>r.json())
    .then(data=>{ renderLive(data); })
    .catch(err=>{ console.error('Failed to fetch live data:', err); });
}
function openTrade(action, amount) {
  if (window.SignalboundPump && window.SignalboundPump.openTrade) {
    window.SignalboundPump.openTrade(action, amount);
  } else {
    alert('Signalbound Pump API not available. Open the trade manually at https://signalbound.fun/token/0xa4E5CEa87EE7199851f0cDBAa5932A9892d65cd7');
  }
}
window.addEventListener('load',()=>{
  fetchLive();
  setInterval(fetchLive,15000);
  const buyBtn=document.getElementById('buyBtn');
  const sellBtn=document.getElementById('sellBtn');
  if (buyBtn) buyBtn.addEventListener('click',()=>openTrade('buy'));
  if (sellBtn) sellBtn.addEventListener('click',()=>openTrade('sell',0.1));
});