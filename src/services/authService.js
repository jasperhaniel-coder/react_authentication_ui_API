// Real API calls.

import { API_BASE_URL } from "../../config";

const TOKEN_KEY = "auth_token";
const SESSION_KEY = "auth_session";

async function parseApiError(response, fallbackMessage) {
  try {
    const data = await response.json();
    return data?.message || data?.error || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function requestOptions(options = {}) {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  return {
    ...options,
    headers,
  };
}

async function request(path, options, fallbackMessage) {
  const res = await fetch(`${API_BASE_URL}${path}`, requestOptions(options));
  if (!res.ok) throw new Error(await parseApiError(res, fallbackMessage));
  return res.status === 204 ? null : res.json();
}

function saveAuthResponse(data) {
  const token = data?.token || data?.accessToken || data?.data?.token || data?.data?.accessToken;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(SESSION_KEY, "true");
  return data;
}

export function isAuthenticated() {
  return Boolean(getToken() || localStorage.getItem(SESSION_KEY));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
}

export async function loginUser({ identifier, password, rememberMe }) {
  const data = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      identifier,
      password,
      rememberMe,
    }),
  }, "Login failed.");

  return saveAuthResponse(data);
}

export async function registerUser({ firstName, lastName, email, phoneNumber, password }) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ firstName, lastName, email, phoneNumber, password }),
  }, "Registration failed.");
}

export async function requestPasswordReset({ email }) {
  const data = await request("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  }, "Password reset request failed.");
  return data;
}

export async function verifyOtp({ email, code, context, resetToken }) {
  return request("/api/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ email, code, otp: code, context, resetToken }),
  }, "OTP verification failed.");
}

export async function resendOtp({ email }) {
  return request("/api/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  }, "Failed to resend verification code.");
}

export async function resetPassword({ email, password, code, resetToken }) {
  return request("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, password, code, otp: code, resetToken }),
  }, "Password reset failed.");
}

export async function logoutUser() {
  try {
    return await request("/api/auth/logout", { method: "POST", body: JSON.stringify({}) }, "Logout failed.");
  } finally {
    clearAuth();
  }
}

export async function getCurrentUser() {
  return request("/api/auth/me", { method: "GET" }, "Unable to load your account.");
}

export async function updateProfile(profile) {
  return request("/api/auth/profile", {
    method: "PUT",
    body: JSON.stringify(profile),
  }, "Unable to update your profile.");
}
