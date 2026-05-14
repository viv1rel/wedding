(function () {
  const audio = document.getElementById('audio');
  const btn = document.getElementById('music-btn');
  const iconNote = document.getElementById('icon-note');
  const iconWave = document.getElementById('icon-wave');
  if (!audio || !btn) return;

  window.__musicState = window.__musicState || { playing: false };

  audio.addEventListener('play',  () => {
    window.__musicState.playing = true;
    btn.setAttribute('aria-pressed', 'true');
    iconNote.classList.add('hidden');
    iconWave.classList.remove('hidden');
  });
  audio.addEventListener('pause', () => {
    window.__musicState.playing = false;
    btn.setAttribute('aria-pressed', 'false');
    iconNote.classList.remove('hidden');
    iconWave.classList.add('hidden');
  });

  btn.addEventListener('click', () => {
    if (!audio.getAttribute('src')) return;
    if (window.__musicState.playing) audio.pause();
    else audio.play().catch(() => {});
  });
})();
