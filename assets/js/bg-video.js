(function () {
  'use strict';

  var a = document.getElementById('bg-video-a');
  var b = document.getElementById('bg-video-b');
  if (!a || !b) return;

  var FADE_BEFORE_END = 0.7;
  var SWAP_COOLDOWN_MS = 1200;

  var active = a;
  var inactive = b;
  var swapping = false;

  function tryPlay(v) {
    try {
      var p = v.play();
      if (p && typeof p.catch === 'function') p.catch(function () {});
    } catch (_) {}
  }

  function onTimeUpdate(e) {
    var v = e.target;
    if (v !== active || swapping) return;
    var dur = v.duration;
    if (!isFinite(dur) || dur <= 0) return;
    var remaining = dur - v.currentTime;
    if (remaining > 0 && remaining <= FADE_BEFORE_END) {
      swapping = true;
      try { inactive.currentTime = 0; } catch (_) {}
      tryPlay(inactive);
      inactive.classList.add('is-active');
      active.classList.remove('is-active');
      var prev = active;
      active = inactive;
      inactive = prev;
      setTimeout(function () { swapping = false; }, SWAP_COOLDOWN_MS);
    }
  }

  function onEnded(e) {
    if (e.target === active && !swapping) {
      try { e.target.currentTime = 0; } catch (_) {}
      tryPlay(e.target);
    }
  }

  a.addEventListener('timeupdate', onTimeUpdate);
  b.addEventListener('timeupdate', onTimeUpdate);
  a.addEventListener('ended', onEnded);
  b.addEventListener('ended', onEnded);

  a.addEventListener('playing', function upgradeInactive() {
    b.preload = 'auto';
    try { b.load(); } catch (_) {}
  }, { once: true });

  tryPlay(a);

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      a.pause(); b.pause();
    } else {
      tryPlay(active);
    }
  });
})();
