export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const passwordRules = (password) => ({
  length: password.length >= 8,
  upper: /[A-Z]/.test(password),
  number: /\d/.test(password),
  special: /[@$!%*?&]/.test(password),
});