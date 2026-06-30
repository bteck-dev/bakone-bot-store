export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

const TOKEN_KEY = "bakone_admin_token";
const AUTH_EXPIRED_EVENT = "bakone:auth-expired";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
  error?: {
    code?: string;
    details?: unknown;
  };
  timestamp: string;
};

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function onAuthExpired(callback: () => void) {
  window.addEventListener(AUTH_EXPIRED_EVENT, callback);
  return () => window.removeEventListener(AUTH_EXPIRED_EVENT, callback);
}

function handleExpiredSession() {
  if (!getAuthToken()) return;

  clearAuthToken();
  window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));

  if (window.location.pathname.startsWith("/admin")) {
    window.history.replaceState(null, "", "/admin");
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new Error("Backend server is unreachable. Make sure the API is running on localhost:5000.");
  }

  const body = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (response.status === 401 || response.status === 403) {
    handleExpiredSession();
  }

  if (!body) {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok || !body.success) {
    throw new Error(body.message || "Request failed.");
  }

  return body.data;
}

export function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

export async function authRequest<T>(path: string, options: RequestInit = {}) {
  return apiRequest<T>(path, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
}
