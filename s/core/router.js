import { CONFIG } from './config.js';

class Router {
  constructor() {
    this.root = document.getElementById('app');
    this.currentRoute = null;
    this.routes = { login: 'views/auth/login.html', register: 'views/auth/register.html', recover: 'views/auth/recover.html' };
    this.init();
  }
  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-route]');
      if (link) { e.preventDefault(); window.location.hash = link.dataset.route; }
    });
    if (!window.location.hash) window.location.hash = CONFIG.DEFAULT_ROUTE;
    else this.handleRoute();
  }
  async handleRoute() {
    const route = window.location.hash.replace('#', '') || CONFIG.DEFAULT_ROUTE;
    if (route === this.currentRoute) return;
    const path = this.routes[route];
    if (!path) { window.location.hash = CONFIG.DEFAULT_ROUTE; return; }
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error('404');
      this.root.innerHTML = await res.text();
      this.currentRoute = route;
      window.dispatchEvent(new CustomEvent('route:changed', { detail: { route } }));
    } catch (err) {
      this.root.innerHTML = `<div class="auth-screen"><div class="card-glass"><p>Error cargando vista: ${path}</p></div></div>`;
    }
  }
}
window.router = new Router();
