const STAGES = [
  { name: "Adit", seconds: 12 },
  { name: "Sump", seconds: 15 },
  { name: "Drift", seconds: 18 },
  { name: "Stope", seconds: 14 },
  { name: "Winze", seconds: 20 },
  { name: "Raise", seconds: 16 },
  { name: "Crosscut", seconds: 13 },
  { name: "Orepass", seconds: 19 },
  { name: "Chute", seconds: 11 },
  { name: "Skip", seconds: 17 },
  { name: "Headframe", seconds: 22 },
  { name: "Portal", seconds: 21 },
  { name: "Tailings", seconds: 15 },
  { name: "Spiral", seconds: 18 }
];

const HEAT_TARGET = 1767225600;

let filter = "all";

function formatSeconds(seconds){
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

function totalFor(filterValue){
  let sum = 0;
  for (const stage of STAGES) {
    if (filterValue === "all") {
      sum += stage.seconds;
    } else if (filterValue === "short" && stage.seconds < 16) {
      sum += stage.seconds;
    } else if (filterValue === "long" && stage.seconds >= 16) {
      sum += stage.seconds;
    }
  }
  return sum;
}

function renderStages(){
  const list = document.getElementById("stages-list");
  const totalEl = document.getElementById("stages-total-value");
  list.innerHTML = "";
  let sum = 0;
  for (const stage of STAGES) {
    if (filter === "all" || (filter === "short" && stage.seconds < 16) || (filter === "long" && stage.seconds >= 16)) {
      const li = document.createElement("li");
      li.textContent = stage.name + " — " + stage.seconds + " s";
      list.appendChild(li);
      sum += stage.seconds;
    }
  }
  totalEl.textContent = sum;
}

function setFilter(value){
  filter = value;
  const buttons = {
    all: document.getElementById("filter-all"),
    short: document.getElementById("filter-short"),
    long: document.getElementById("filter-long")
  };
  for (const key in buttons) {
    buttons[key].setAttribute("aria-pressed", key === value ? "true" : "false");
  }
  renderStages();
}

function updateHeatClock(){
  const el = document.getElementById("next-heat");
  const now = Math.floor(Date.now() / 1000);
  if (now < HEAT_TARGET) {
    const remaining = HEAT_TARGET - now;
    el.textContent = "Next heat in " + formatSeconds(remaining);
  } else {
    el.textContent = "Heat window closed";
  }
}

function init(){
  renderStages();
  setFilter("all");
  updateHeatClock();
  setInterval(updateHeatClock, 1000);

  document.getElementById("filter-all").addEventListener("click", () => setFilter("all"));
  document.getElementById("filter-short").addEventListener("click", () => setFilter("short"));
  document.getElementById("filter-long").addEventListener("click", () => setFilter("long"));
}

document.addEventListener("DOMContentLoaded", init);