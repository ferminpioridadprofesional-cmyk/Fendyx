export const helpers = {
  toast: (message, type = 'success', duration = 3500) => {
    const toast = document.getElementById('toast');
    if (!toast) return;
    const icons = { success: '✅', error: '❌', warning: '⚠️' };
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type] || ''}</span><span>${message}</span>`;
    toast.classList.add('show');
    clearTimeout(helpers._toastTimer);
    helpers._toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
  },
  setLoading: (btn, isLoading) => {
    if (!btn) return;
    const textEl = btn.querySelector('.btn-text');
    if (isLoading) {
      btn.disabled = true;
      btn.dataset.originalText = textEl?.textContent || '';
      if (textEl) textEl.textContent = 'Procesando...';
      const spinner = document.createElement('span');
      spinner.className = 'spinner';
      spinner.dataset.spinner = 'true';
      btn.appendChild(spinner);
    } else {
      btn.disabled = false;
      if (textEl && btn.dataset.originalText) textEl.textContent = btn.dataset.originalText;
      const spinner = btn.querySelector('[data-spinner]');
      if (spinner) spinner.remove();
    }
  },
  showFieldError: (inputId, errorId, message) => {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.add('error');
    if (error) { error.textContent = message; error.classList.add('visible'); }
  },
  clearAllErrors: () => {
    document.querySelectorAll('.input.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.input-error.visible').forEach(el => el.classList.remove('visible'));
  }
};
window.helpers = helpers;
