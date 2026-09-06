class Theme {
  constructor() {
    this.current = localStorage.getItem('theme') || 'dark';
    document.documentElement.dataset.theme = this.current;
  }
}
window.theme = new Theme();
