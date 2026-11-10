import { apiFetch, ApiError } from "./api";

export type UserRole = "USER" | "player" | "owner" | "admin" | string;

export interface User {
  id?: string;
  email: string;
  full_name: string;
  phone_number?: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface RegisterRequest {
  email: string;
  full_name: string;
  password: string;
  phone_number?: string;
  role?: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user?: User;
  token?: string;
  message?: string;
  [key: string]: unknown;
}

export type AuthResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status?: number };

/**
 * Normalizes error messages from thrown errors or network failures.
 */
function extractErrorMessage(err: unknown): { error: string; status?: number } {
  if (err instanceof ApiError) {
    if (err.status === 409) {
      return {
        error: err.message || "An account with this email address already exists.",
        status: err.status,
      };
    }
    if (err.status === 401) {
      return {
        error: err.message || "Invalid email or password.",
        status: err.status,
      };
    }
    if (err.status === 400 || err.status === 422) {
      return {
        error: err.message || "Please check your information and try again.",
        status: err.status,
      };
    }
    return {
      error: err.message || `Request failed (${err.status})`,
      status: err.status,
    };
  }

  if (err instanceof Error) {
    if (err.name === "TypeError" || err.message.toLowerCase().includes("fetch")) {
      return {
        error: "Unable to reach the server. Please check your connection and try again.",
      };
    }
    return { error: err.message };
  }

  return { error: "An unexpected error occurred. Please try again." };
}

/**
 * Register a new user account.
 * Calls relative endpoint `/api/v1/auth/register` with credentials: "include".
 * The HttpOnly cookie set by the backend is preserved by the proxy.
 */
export async function register(
  data: RegisterRequest
): Promise<AuthResult<AuthResponse>> {
  try {
    const response = await apiFetch<AuthResponse>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return { ok: true, data: response };
  } catch (error) {
    const { error: message, status } = extractErrorMessage(error);
    return { ok: false, error: message, status };
  }
}

/**
 * Log in an existing user.
 * Calls relative endpoint `/api/v1/auth/login` with credentials: "include".
 * Sets the backend's HttpOnly cookie. The client does not store the token in JS.
 */
export async function login(
  data: LoginRequest
): Promise<AuthResult<AuthResponse>> {
  try {
    const response = await apiFetch<AuthResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return { ok: true, data: response };
  } catch (error) {
    const { error: message, status } = extractErrorMessage(error);
    return { ok: false, error: message, status };
  }
}

/**
 * Log out the currently authenticated user.
 * Calls relative endpoint `/api/v1/auth/logout` with credentials: "include".
 * Backend clears the HttpOnly cookie.
 */
export async function logout(): Promise<AuthResult<{ success: boolean }>> {
  try {
    const response = await apiFetch<{ success: boolean }>(
      "/api/v1/auth/logout",
      {
        method: "POST",
      }
    );
    return { ok: true, data: response ?? { success: true } };
  } catch (error) {
    const { error: message, status } = extractErrorMessage(error);
    return { ok: false, error: message, status };
  }
}

