const trades = [
{ date: "2026-03-02", symbol: "ALFA", side: "long", entry: 100, exit: 112, qty: 10 },
{ date: "2026-03-05", symbol: "BETA", side: "short", entry: 50, exit: 46, qty: 20 },
{ date: "2026-03-09", symbol: "ALFA", side: "long", entry: 115, exit: 109, qty: 10 },
{ date: "2026-03-12", symbol: "GAMA", side: "long", entry: 20, exit: 25, qty: 40 },
{ date: "2026-03-16", symbol: "BETA", side: "short", entry: 44, exit: 47, qty: 20 },
{ date: "2026-03-19", symbol: "GAMA", side: "long", entry: 26, exit: 24, qty: 40 },
{ date: "2026-03-23", symbol: "ALFA", side: "long", entry: 108, exit: 120, qty: 10 },
{ date: "2026-03-26", symbol: "BETA", side: "short", entry: 49, exit: 41, qty: 20 }
];

function pnl(trade) {
return trade.side === "long"
? (trade.exit - trade.entry) * trade.qty
: (trade.entry - trade.exit) * trade.qty;
}

function formatPnl(value) {
return value < 0 ? "-" + Math.abs(value) : String(value);
}

const body = document.getElementById("trade-body");
const summary = document.getElementById("summary");
const empty = document.getElementById("empty");
const buttons = {
all: document.getElementById("filter-all"),
wins: document.getElementById("filter-wins"),
losses: document.getElementById("filter-losses")
};
const copyBtn = document.getElementById("copy-csv");
let active = "all";

function render() {
const filtered = trades.filter(t => {
let p = pnl(t);
if (active === "wins") return p > 0;
if (active === "losses") return p < 0;
return true;
});

body.innerHTML = "";

if (filtered.length === 0) {
empty.hidden = false;
summary.textContent = "0 trades, 0 wins, net P&L 0";
return;
}

empty.hidden = true;

let wins = 0;
let net = 0;

for (const t of filtered) {
const p = pnl(t);
if (p > 0) wins += 1;
net += p;

const row = document.createElement("tr");
row.innerHTML =
`<td>${t.date}</td>` +
`<td>${t.symbol}</td>` +
`<td class="side-${t.side}">${t.side}</td>` +
`<td>${t.entry}</td>` +
`<td>${t.exit}</td>` +
`<td>${t.qty}</td>` +
`<td class="${p < 0 ? "loss" : ""}">${formatPnl(p)}</td>`;
body.appendChild(row);
}

summary.textContent =
`${filtered.length} trades, ${wins} wins, net P&L ${formatPnl(net)}`;
}

function setPressed(key) {
for (const [k, el] of Object.entries(buttons)) {
el.setAttribute("aria-pressed", k === key ? "true" : "false");
}
}

for (const [key, el] of Object.entries(buttons)) {
el.addEventListener("click", () => {
active = key;
setPressed(key);
render();
});
}

copyBtn.addEventListener("click", () => {
const rows = [];
rows.push("Date,Symbol,Side,Entry,Exit,Qty,PnL");

for (const t of trades) {
if (active === "wins" && pnl(t) <= 0) continue;
if (active === "losses" && pnl(t) >= 0) continue;
rows.push([
t.date,
t.symbol,
t.side,
t.entry,
t.exit,
t.qty,
formatPnl(pnl(t))
].join(","));
}

const text = rows.join("\n");
const ta = document.createElement("textarea");
ta.value = text;
ta.setAttribute("readonly", "");
ta.style.position = "absolute";
ta.style.left = "-9999px";
document.body.appendChild(ta);
ta.select();
let ok = false;
try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
document.body.removeChild(ta);

copyBtn.textContent = ok ? "Copied" : "Copy failed";
setTimeout(() => { copyBtn.textContent = "Copy CSV"; }, 2000);
});

setPressed("all");
render();
