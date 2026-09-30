// Small, plain validation helpers shared by every form. Keeping them
// here (instead of copy-pasting regex into each page) so that the rules
// only need to be change in one place.

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhoneNumber(phoneNumber) {
  return /^\+?[1-9]\d{1,14}$/.test(phoneNumber);
}

export function isPasswordValid(password) {
  return password.length >= 8 && /\d/.test(password) && /[A-Z]/.test(password);
}

// This is to render the little checklist under password fields.
export function getPasswordChecklist(password) {
  return [
    { label: "At least 8 characters", passed: password.length >= 8 },
    { label: "One number", passed: /\d/.test(password) },
    { label: "One uppercase letter", passed: /[A-Z]/.test(password) },
  ];
}
