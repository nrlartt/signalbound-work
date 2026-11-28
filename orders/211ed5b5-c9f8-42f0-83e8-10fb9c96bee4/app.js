const MARKS = [
  { name: "Bar", depth: 3 },
  { name: "Gut", depth: 5 },
  { name: "Hole", depth: 12 },
  { name: "Reach", depth: 8 },
  { name: "Flats", depth: 2 },
  { name: "Cut", depth: 7 },
  { name: "Race", depth: 15 },
  { name: "Pool", depth: 4 }
];

const WATCH_START = 1811808000;

const listEl = document.getElementById("marks-list");
const shownEl = document.getElementById("marks-shown");
const watchEl = document.getElementById("watch-strip");
const buttons = {
  all: document.getElementById("filter-all"),
  deep: document.getElementById("filter-deep"),
  shallow: document.getElementById("filter-shallow")
};

let activeFilter = "all";

function renderMarks() {
  listEl.innerHTML = "";
  let visible = 0;
  for (const mark of MARKS) {
    let show = true;
    if (activeFilter === "deep") show = mark.depth >= 8;
    if (activeFilter === "shallow") show = mark.depth < 8;
    if (show) {
      const li = document.createElement("li");
      li.textContent = mark.name + " — " + mark.depth + " fathoms";
      listEl.appendChild(li);
      visible += 1;
    }
  }
  shownEl.textContent = "Marks shown: " + visible;
}

function setPressed(filter) {
  activeFilter = filter;
  buttons.all.setAttribute("aria-pressed", filter === "all");
  buttons.deep.setAttribute("aria-pressed", filter === "deep");
  buttons.shallow.setAttribute("aria-pressed", filter === "shallow");
  renderMarks();
}

buttons.all.addEventListener("click", () => setPressed("all"));
buttons.deep.addEventListener("click", () => setPressed("deep"));
buttons.shallow.addEventListener("click", () => setPressed("shallow"));

function pad(n) {
  return n < 10 ? "0" + n : String(n);
}

function updateWatch() {
  const now = Math.floor(Date.now() / 1000);
  const remaining = WATCH_START - now;
  if (remaining <= 0) {
    watchEl.textContent = "Watch closed";
    return;
  }
  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  watchEl.textContent = "Next watch in " + h + ":" + pad(m) + ":" + pad(s);
}

setInterval(updateWatch, 1000);
updateWatch();
renderMarks();
setPressed("all");