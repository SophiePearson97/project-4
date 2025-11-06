// 1) Footer year
(() => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// 2) Image fallback handler
(() => {
  const imgs = document.querySelectorAll('img[data-fallback]');
  imgs.forEach(img => {
    const fbk = img.getAttribute('data-fallback');
    if (!fbk) return;

    // Avoid infinite loops if the fallback also fails
    const handler = () => {
      if (img.dataset.fbkApplied) return;
      img.dataset.fbkApplied = '1';
      img.src = fbk;
    };

    img.addEventListener('error', handler, { once: true });
  });
})();