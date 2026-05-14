(function () {
  const target = new Date('2026-08-14T17:30:00').getTime();

  const els = {
    d: document.getElementById('t-days'),
    h: document.getElementById('t-hours'),
    m: document.getElementById('t-mins'),
    s: document.getElementById('t-secs'),
  };
  if (!els.d) return;

  const pad = (n) => String(n).padStart(2, '0');

  let timerId = null;

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      els.d.textContent = els.h.textContent = els.m.textContent = els.s.textContent = '00';
      if (timerId) clearInterval(timerId);
      return;
    }
    els.d.textContent = pad(Math.floor(diff / 86400000));
    els.h.textContent = pad(Math.floor(diff / 3600000) % 24);
    els.m.textContent = pad(Math.floor(diff / 60000) % 60);
    els.s.textContent = pad(Math.floor(diff / 1000) % 60);
  }

  tick();
  timerId = setInterval(tick, 1000);
})();
