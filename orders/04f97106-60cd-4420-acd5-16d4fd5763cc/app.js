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
const toggle=document.querySelector('#navToggle');const mobile=document.querySelector('#mobileNav');toggle?.addEventListener('click',()=>{const open=!mobile.classList.contains('open');mobile.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));});const search=document.querySelector('#marketSearch');const grid=document.querySelector('#listingGrid');const count=document.querySelector('#resultCount');const empty=document.querySelector('#emptyState');const buttons=[...document.querySelectorAll('[data-action]')];let kind='all';function filterListings(){if(!grid)return;const query=(search?.value||'').trim().toLowerCase();let visible=0;for(const card of grid.querySelectorAll('article')){const show=(kind==='all'||card.dataset.kind===kind)&&(!query||(card.dataset.search||'').includes(query)||card.textContent.toLowerCase().includes(query));card.hidden=!show;if(show)visible+=1;}count.textContent=visible+' '+(visible===1?'release':'releases');empty.hidden=visible!==0;}for(const button of buttons)button.addEventListener('click',()=>{kind=button.dataset.action||'all';for(const item of buttons)item.classList.toggle('active',item===button);filterListings();});search?.addEventListener('input',filterListings);filterListings();