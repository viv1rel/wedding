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

  function setVal(el, val) {
    if (el.textContent === val) return;
    el.textContent = val;
    el.classList.remove('tick');
    void el.offsetWidth;
    el.classList.add('tick');
  }

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      setVal(els.d, '00'); setVal(els.h, '00'); setVal(els.m, '00'); setVal(els.s, '00');
      if (timerId) clearInterval(timerId);
      return;
    }
    setVal(els.d, pad(Math.floor(diff / 86400000)));
    setVal(els.h, pad(Math.floor(diff / 3600000) % 24));
    setVal(els.m, pad(Math.floor(diff / 60000) % 60));
    setVal(els.s, pad(Math.floor(diff / 1000) % 60));
  }

  tick();
  timerId = setInterval(tick, 1000);
})();
