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
      try { await nativeWrite(text); return; } catch { /* fall back inside sandboxed frame */ }
    }
    fallback(text);
  };
  try {
    if (navigator.clipboard) navigator.clipboard.writeText = writeText;
    else Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
  } catch { /* read-only clipboard prototype */ }
})();
const SELECTORS={owner:"0x8da5cb5b",poolManager:"0xdc4c90d3",paused:"0x5c975abb",maximum:"0xb4a0083d",setPaused:"0x16c38b3c",setMaximum:"0x99be46e3"};
let config=null;let account=null;let owner=null;let paused=false;let busy=false;
const byId=(id)=>document.getElementById(id);
const provider=()=>window.ethereum&&typeof window.ethereum.request==="function"?window.ethereum:null;
const setStatus=(message,error=false)=>{byId("connectionStatus").textContent=message;byId("connectionStatus").style.color=error?"#ff735f":"";};
const word=(value)=>String(value||"").replace(/^0x/,"").padStart(64,"0");
const decodeAddress=(value)=>"0x"+word(value).slice(-40);
const decodeUint=(value)=>BigInt(value||"0x0");
const decimal=(value)=>{const [whole="0",fraction=""]=String(value).trim().split(".");if(!/^\d+$/.test(whole)||!/^\d*$/.test(fraction)||fraction.length>18)throw new Error("Enter a positive number with up to 18 decimal places.");const out=BigInt(whole)*10n**18n+BigInt((fraction+"0".repeat(18)).slice(0,18));if(out<=0n)throw new Error("Maximum must be greater than zero.");return out;};
const formatUnits=(value)=>{const raw=BigInt(value);const whole=raw/10n**18n;const part=String(raw%10n**18n).padStart(18,"0").replace(/0+$/,"").slice(0,6);return part?String(whole)+"."+part:String(whole);};
async function call(data){return provider().request({method:"eth_call",params:[{to:config.contractAddress,data},"latest"]});}
function syncControls(){const isOwner=account&&owner&&account.toLowerCase()===owner.toLowerCase();byId("ownerControls").classList.toggle("locked",!isOwner);byId("updateMaximum").disabled=!isOwner||busy;byId("togglePause").disabled=!isOwner||busy;byId("togglePause").textContent=paused?"Unpause hook":"Pause hook";}
async function ensureChain(allowSwitch=false){const current=await provider().request({method:"eth_chainId"});if(current.toLowerCase()===config.chainId)return;if(!allowSwitch)throw new Error("Select Ethereum Sepolia in the wallet to read live state.");await provider().request({method:"wallet_switchEthereumChain",params:[{chainId:config.chainId}]});}
async function refresh(){if(!provider()){setStatus("No browser wallet was detected. The verified address and explorer link remain available.",true);return;}try{await ensureChain(false);const values=await Promise.all([call(SELECTORS.owner),call(SELECTORS.poolManager),call(SELECTORS.paused),call(SELECTORS.maximum)]);owner=decodeAddress(values[0]);const manager=decodeAddress(values[1]);paused=decodeUint(values[2])!==0n;const maximum=decodeUint(values[3]);byId("ownerState").textContent=owner;byId("managerState").textContent=manager;byId("pausedState").textContent=paused?"Paused":"Active";byId("pausedState").style.color=paused?"#ff735f":"#b7f34a";byId("maximumState").textContent=formatUnits(maximum)+" ETH units";syncControls();setStatus(account?"Live state loaded. Wallet connected.":"Live state loaded. Connect the owner wallet to manage settings.");}catch(error){setStatus(error&&error.message?error.message:"Live state could not be read.",true);}}
async function connect(){if(!provider()){setStatus("Install or open a browser wallet to connect.",true);return;}if(busy)return;busy=true;syncControls();try{await ensureChain(true);const accounts=await provider().request({method:"eth_requestAccounts"});account=accounts&&accounts[0]?accounts[0]:null;byId("accountState").textContent=account||"Not connected";await refresh();}catch(error){setStatus(error&&error.message?error.message:"Wallet connection was cancelled.",true);}finally{busy=false;syncControls();}}
async function send(data,label){if(!provider()||!account||busy)return;busy=true;syncControls();byId("transactionStatus").textContent="Confirm "+label+" in the wallet.";try{await ensureChain(true);const hash=await provider().request({method:"eth_sendTransaction",params:[{from:account,to:config.contractAddress,data}]});byId("transactionStatus").textContent="Submitted: "+hash;await refresh();}catch(error){byId("transactionStatus").textContent=error&&error.message?error.message:"The transaction was not submitted.";}finally{busy=false;syncControls();}}
async function boot(){config=await fetch("./live.json",{cache:"no-store"}).then((response)=>{if(!response.ok)throw new Error("Configuration could not be loaded.");return response.json();});byId("contractAddress").textContent=config.contractAddress;byId("network").textContent=config.chainName;byId("explorerLink").href=config.explorerUrl;byId("connectWallet").addEventListener("click",connect);byId("refreshState").addEventListener("click",refresh);byId("copyAddress").addEventListener("click",async()=>{await navigator.clipboard.writeText(config.contractAddress);byId("copyAddress").textContent="Copied";});byId("togglePause").addEventListener("click",()=>send(SELECTORS.setPaused+word(paused?0:1),paused?"unpause":"pause"));byId("updateMaximum").addEventListener("click",()=>{try{send(SELECTORS.setMaximum+word(decimal(byId("maximumInput").value).toString(16)),"maximum update");}catch(error){byId("transactionStatus").textContent=error.message;}});if(provider()){provider().on&&provider().on("accountsChanged",(accounts)=>{account=accounts&&accounts[0]?accounts[0]:null;byId("accountState").textContent=account||"Not connected";refresh();});provider().on&&provider().on("chainChanged",refresh);await refresh();}else await refresh();setInterval(refresh,15000);}
boot().catch((error)=>setStatus(error.message||"The panel could not start.",true));
