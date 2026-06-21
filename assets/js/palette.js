(function () {
  if (window.matchMedia && window.matchMedia('(hover: hover)').matches) return;
  const items = document.querySelectorAll('.palette-item');
  if (!items.length) return;

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const active = item.classList.contains('is-tapped');
      items.forEach((i) => i.classList.remove('is-tapped'));
      if (!active) item.classList.add('is-tapped');
    });
  });
})();
