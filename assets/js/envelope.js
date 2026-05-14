(function () {
  const welcome = document.getElementById('welcome');
  const introVideo = document.getElementById('env-video');
  const audio = document.getElementById('audio');
  const bgVideo = document.getElementById('bg-video');
  const iconNote = document.getElementById('icon-note');
  const iconWave = document.getElementById('icon-wave');
  if (!welcome) return;

  document.body.style.overflow = 'hidden';
  let opened = false;

  function startMusic() {
    if (audio && audio.getAttribute('src')) {
      const p = audio.play();
      if (p && p.then) {
        p.then(() => {
          if (window.__musicState) window.__musicState.playing = true;
          iconNote?.classList.add('hidden');
          iconWave?.classList.remove('hidden');
        }).catch((err) => console.warn('Audio blocked:', err));
      }
    }
  }

  function startBgVideo() {
    if (!bgVideo) return;
    bgVideo.muted = true;
    const p = bgVideo.play();
    if (p && p.catch) p.catch(() => {});
  }

  function dismissWelcome() {
    welcome.classList.add('hidden-welcome');
    setTimeout(() => { document.body.style.overflow = ''; }, 1100);
  }

  function openEnvelope() {
    if (opened) return;
    opened = true;

    startMusic();
    startBgVideo();

    if (!introVideo) {
      welcome.classList.add('playing');
      setTimeout(dismissWelcome, 800);
      return;
    }

    // страховка: если 'ended' не сработает — гасим оверлей принудительно
    const safetyTimer = setTimeout(dismissWelcome, 12000);

    const onEnded = () => {
      clearTimeout(safetyTimer);
      dismissWelcome();
    };
    introVideo.addEventListener('ended', onEnded, { once: true });

    const tryPlay = () => {
      const playPromise = introVideo.play();
      if (playPromise && playPromise.then) {
        playPromise.then(() => {
          welcome.classList.add('playing');
        }).catch((err) => {
          console.warn('Intro video play failed:', err);
          welcome.classList.add('playing');
          clearTimeout(safetyTimer);
          setTimeout(dismissWelcome, 1500);
        });
      } else {
        welcome.classList.add('playing');
      }
    };

    if (introVideo.readyState >= 2 /* HAVE_CURRENT_DATA */) {
      tryPlay();
    } else {
      introVideo.addEventListener('canplay', tryPlay, { once: true });
      try { introVideo.load(); } catch (_) {}
      setTimeout(() => {
        if (!opened) return;
        if (introVideo.readyState < 2) tryPlay();
      }, 2500);
    }
  }

  welcome.addEventListener('click', openEnvelope);
  welcome.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope();
    }
  });
})();
