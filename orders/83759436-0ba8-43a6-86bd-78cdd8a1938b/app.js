const PROGRAMS = [
  { name: "Bisque Low", cone: "cone 06", fire: "low" },
  { name: "Bisque Mid", cone: "cone 04", fire: "low" },
  { name: "Earthenware", cone: "cone 04", fire: "low" },
  { name: "Stoneware Ox", cone: "cone 6", fire: "high" },
  { name: "Stoneware Red", cone: "cone 6", fire: "high" },
  { name: "Cone 8 Hold", cone: "cone 8", fire: "high" },
  { name: "Crystal Soak", cone: "cone 8", fire: "high" },
  { name: "Luster", cone: "cone 018", fire: "low" },
  { name: "Overglaze", cone: "cone 018", fire: "low" }
];

const TARGET = 1803859200000;

function renderPrograms(filter) {
  const list = document.getElementById("program-list");
  list.innerHTML = "";
  let shown = 0;
  for (const p of PROGRAMS) {
    if (filter === "all" || p.fire === filter) {
      const li = document.createElement("li");
      li.textContent = p.name + " — " + p.cone;
      list.appendChild(li);
      shown++;
    }
  }
  document.getElementById("count-value").textContent = shown;
}

function setPressed(filter) {
  let buttons = document.querySelectorAll(".filter-btn");
  for (const b of buttons) {
    const active = b.dataset.filter === filter;
    b.classList.toggle("active", active);
    b.setAttribute("aria-pressed", active ? "true" : "false");
  }
}

function updateCountdown() {
  const now = Date.now();
  const el = document.getElementById("next-load-text");
  if (now >= TARGET) {
    el.textContent = "Booking closed";
    return;
  }
  const diff = TARGET - now;
  const totalSec = Math.floor(diff / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  el.textContent = "Next load in " + h + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

function init() {
  renderPrograms("all");
  setPressed("all");
  const buttons = document.querySelectorAll(".filter-btn");
  for (const b of buttons) {
    b.addEventListener("click", function() {
      renderPrograms(this.dataset.filter);
      setPressed(this.dataset.filter);
    });
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

document.addEventListener("DOMContentLoaded", init);