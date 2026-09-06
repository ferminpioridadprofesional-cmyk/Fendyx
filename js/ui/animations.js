document.addEventListener('mousemove', (e) => {
  const bg = document.querySelector('.auth-bg');
  if (!bg) return;
  bg.style.transform = `translate(${(e.clientX / window.innerWidth - 0.5) * 20}px, ${(e.clientY / window.innerHeight - 0.5) * 20}px)`;
});
window.addEventListener('route:changed', () => {
  setTimeout(() => {
    document.querySelectorAll('.form-group, .role-card').forEach((el, i) => {
      el.style.opacity = '0'; el.style.transform = 'translateY(15px)'; el.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 80 * i);
    });
  }, 100);
});
