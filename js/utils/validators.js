export const validators = {
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).toLowerCase()),
  password: (v) => typeof v === 'string' && v.length >= 8,
  calculateAge: (birthdate) => {
    const today = new Date(), birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  },
  isAdult: (birthdate) => validators.calculateAge(birthdate) >= 18
};
window.validators = validators;
