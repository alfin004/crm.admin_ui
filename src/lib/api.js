import { clearStoredToken, getStoredToken } from "./authStorage";

const rawBaseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:8000";
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

export async function apiRequest(path, options = {}) {
  const { auth = true, body, headers = {}, skipUnauthorizedRedirect = false, ...rest } = options;
  const token = getStoredToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) {
    clearStoredToken();
    if (!skipUnauthorizedRedirect) {
      if (unauthorizedHandler) unauthorizedHandler();
      else window.location.assign("/login");
    }
    throw new Error("Unauthorized");
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  const data = text ? parseJson(text) : null;

  if (!response.ok) {
    const message = data?.detail || data?.message || "Request failed";
    throw new Error(Array.isArray(message) ? message.map((item) => item.msg || item.message || item).join(", ") : message);
  }

  return data;
}

export const authApi = {
  login: (credentials) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: credentials,
      auth: false,
      skipUnauthorizedRedirect: true,
    }),
  me: () => apiRequest("/auth/me"),
  logout: () => apiRequest("/auth/logout", { method: "POST" }),
  resetPassword: (newPassword) =>
    apiRequest("/auth/reset-password", {
      method: "POST",
      body: { new_password: newPassword },
    }),
};

export const usersApi = {
  list: ({ roles, search, isActive, limit, offset }) => {
    const params = new URLSearchParams();
    if (roles) params.set("roles", roles);
    if (search) params.set("search", search);
    if (isActive !== "" && isActive !== undefined) params.set("is_active", isActive);
    params.set("limit", limit);
    params.set("offset", offset);
    return apiRequest(`/users?${params.toString()}`);
  },
  create: (payload) => apiRequest("/users", { method: "POST", body: payload }),
  update: (id, payload) => apiRequest(`/users/${id}`, { method: "PUT", body: payload }),
  delete: (id) => apiRequest(`/users/${id}`, { method: "DELETE" }),
  resetPassword: (id) => apiRequest(`/users/${id}/reset-password`, { method: "POST" }),
};

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}
