(function () {
  const targets = document.querySelectorAll('.reveal');
  if (targets.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    targets.forEach((el) => io.observe(el));
  }

  const iframes = document.querySelectorAll('iframe[data-lazy-src]');
  if (iframes.length) {
    const io2 = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const f = e.target;
            const src = f.getAttribute('data-lazy-src');
            if (src) f.setAttribute('src', src);
            io2.unobserve(f);
          }
        });
      },
      { rootMargin: '300px' }
    );
    iframes.forEach((el) => io2.observe(el));
  }
})();
