(() => {
  'use strict';

  const WEEKLY_SCHEDULE = [
    { day: 'Monday', open: 10, close: 16 },
    { day: 'Tuesday', open: 10, close: 16 },
    { day: 'Wednesday', open: 10, close: 16 },
    { day: 'Thursday', open: 10, close: 16 },
    { day: 'Friday', open: 10, close: 16 },
    { day: 'Saturday', open: 11, close: 15 },
    { day: 'Sunday', open: null, close: null }
  ];

  const SPECIMENS = [
    { name: 'Boston fern', room: 'cool', waterDays: 2 },
    { name: 'Maidenhair fern', room: 'cool', waterDays: 1 },
    { name: 'Sheet moss', room: 'cool', waterDays: 1 },
    { name: 'Button fern', room: 'cool', waterDays: 3 },
    { name: 'Meyer lemon', room: 'warm', waterDays: 4 },
    { name: 'Calamondin orange', room: 'warm', waterDays: 3 },
    { name: 'Jade plant', room: 'warm', waterDays: 7 },
    { name: 'Aloe vera', room: 'warm', waterDays: 5 }
  ];

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function computeOpenStatus() {
    const now = new Date();
    const dayIndex = now.getDay(); // 0 = Sunday, 1 = Monday, ... 6 = Saturday
    const schedule = WEEKLY_SCHEDULE[dayIndex];
    const banner = document.getElementById('open-status');

    if (!schedule || schedule.open === null) {
      banner.textContent = 'Closed today';
      banner.className = 'closed';
      return;
    }

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const openMinutes = schedule.open * 60;
    const closeMinutes = schedule.close * 60;

    if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
      banner.textContent = 'Open now, closes at ' + pad2(schedule.close) + ':00';
      banner.className = 'open';
    } else {
      banner.textContent = 'Closed, opens at ' + pad2(schedule.open) + ':00';
      banner.className = 'closed';
    }
  }

  function renderSpecimens(filterRoom, sortKey) {
    const list = document.getElementById('specimen-list');
    if (!list) return;

    let filtered = SPECIMENS;
    if (filterRoom !== 'all') {
      filtered = SPECIMENS.filter(s => s.room === filterRoom);
    }

    filtered = [...filtered].sort((a, b) => {
      if (sortKey === 'name') {
        return a.name.localeCompare(b.name);
      }
      return a.waterDays - b.waterDays;
    });

    list.innerHTML = '';

    filtered.forEach(specimen => {
      const li = document.createElement('li');
      li.className = 'specimen-card';

      const nextWatering = specimen.waterDays === 1 ? 'today' : 'in ' + specimen.waterDays + ' days';

      li.innerHTML =
        '<h3>' + specimen.name + '</h3>' +
        '<p>Room: ' + specimen.room + '</p>' +
        '<p>Water every ' + specimen.waterDays + ' day' + (specimen.waterDays === 1 ? '' : 's') + '</p>' +
        '<p class="next-watering">Next watering: ' + nextWatering + '</p>';

      list.appendChild(li);
    });
  }

  function initControls() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortButtons = document.querySelectorAll('.sort-btn');

    let filterRoom = 'all';
    let sortKey = 'name';

    function updatePressed(group, activeValue, dataAttr) {
      group.forEach(btn => {
        const pressed = btn.getAttribute(dataAttr) === activeValue;
        btn.setAttribute('aria-pressed', pressed ? 'true' : 'false');
        if (pressed) btn.classList.add('active');
        else btn.classList.remove('active');
      });
    }

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterRoom = btn.getAttribute('data-room');
        updatePressed(filterButtons, filterRoom, 'data-room');
        renderSpecimens(filterRoom, sortKey);
      });
    });

    sortButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        sortKey = btn.getAttribute('data-sort');
        updatePressed(sortButtons, sortKey, 'data-sort');
        renderSpecimens(filterRoom, sortKey);
      });
    });
  }

  function init() {
    computeOpenStatus();
    renderSpecimens('all', 'name');
    initControls();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();