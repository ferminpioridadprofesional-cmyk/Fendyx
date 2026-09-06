import { supabase } from '../core/supabase-client.js';
import { validators } from '../utils/validators.js';
import { helpers } from '../utils/helpers.js';

class AuthModule {
  constructor() {
    this.selectedRole = null;
    this.init();
  }
  init() {
    window.addEventListener('route:changed', (e) => {
      if (e.detail.route === 'login') this.setupLogin();
      if (e.detail.route === 'register') this.setupRegister();
      if (e.detail.route === 'recover') this.setupRecover();
    });
    if (window.location.hash === '#login' || !window.location.hash) setTimeout(() => this.setupLogin(), 300);
  }
  setupPasswordToggles() {
    document.querySelectorAll('.toggle-password').forEach(btn => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.target);
        if (!input) return;
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.querySelector('.icon-eye').style.display = isPassword ? 'none' : 'block';
        btn.querySelector('.icon-eye-off').style.display = isPassword ? 'block' : 'none';
      });
    });
  }
  setupLogin() {
    this.setupPasswordToggles();
    const form = document.getElementById('loginForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      helpers.clearAllErrors();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      if (!validators.email(email)) return helpers.showFieldError('loginEmail', 'loginEmailError', 'Correo inválido');
      if (!password) return helpers.showFieldError('loginPassword', 'loginPasswordError', 'Requerida');
      
      const btn = document.getElementById('loginBtn');
      helpers.setLoading(btn, true);
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        helpers.toast('¡Bienvenido a Fendyx! 🎉', 'success');
      } catch (err) {
        helpers.toast('Credenciales incorrectas', 'error');
      } finally {
        helpers.setLoading(btn, false);
      }
    });
  }
  setupRegister() {
    this.setupPasswordToggles();
    document.querySelectorAll('.role-card').forEach(card => {
      if (card.dataset.bound) return;
      card.dataset.bound = 'true';
      card.addEventListener('click', () => {
        document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        document.querySelectorAll('.role-fields').forEach(f => f.classList.remove('active'));
        this.selectedRole = card.dataset.role;
        const fields = document.querySelector(`[data-role-fields="${this.selectedRole}"]`);
        if (fields) fields.classList.add('active');
      });
    });
    const form = document.getElementById('registerForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      helpers.clearAllErrors();
      if (!this.selectedRole) return helpers.toast('Selecciona un tipo de cuenta', 'warning');
      
      const email = document.getElementById('regEmail').value.trim();
      const birthdate = document.getElementById('regBirthdate').value;
      const password = document.getElementById('regPassword').value;
      const terms = document.getElementById('termsAccepted').checked;

      if (!validators.email(email)) return helpers.toast('Correo inválido', 'error');
      if (!birthdate || !validators.isAdult(birthdate)) return helpers.toast('Debes ser mayor de 18 años', 'error');
      if (!validators.password(password)) return helpers.toast('Contraseña mín. 8 caracteres', 'error');
      if (!terms) return helpers.toast('Acepta los términos', 'warning');

      const btn = document.getElementById('registerBtn');
      helpers.setLoading(btn, true);
      try {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { role: this.selectedRole, first_name: document.getElementById('regFirstName').value } }
        });
        if (error) throw error;
        helpers.toast('¡Cuenta creada! Revisa tu correo 📧', 'success');
        setTimeout(() => { window.location.hash = 'login'; }, 2000);
      } catch (err) {
        helpers.toast(err.message || 'Error al registrar', 'error');
      } finally {
        helpers.setLoading(btn, false);
      }
    });
  }
  setupRecover() {
    const form = document.getElementById('recoverForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('recoverEmail').value.trim();
      if (!validators.email(email)) return helpers.showFieldError('recoverEmail', 'recoverEmailError', 'Correo inválido');
      const btn = form.querySelector('button');
      helpers.setLoading(btn, true);
      try {
        await supabase.auth.resetPasswordForEmail(email);
        helpers.toast('Enlace enviado a tu correo 📧', 'success');
      } catch (err) {
        helpers.toast('Error enviando enlace', 'error');
      } finally {
        helpers.setLoading(btn, false);
      }
    });
  }
}
new AuthModule();
