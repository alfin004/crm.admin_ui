import { clearStoredToken, getStoredToken } from "./authStorage";

const rawBaseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:8000";
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");
const rawDashboardBaseUrl = import.meta.env.VITE_DASHBOARD_API_BASE_URL || rawBaseUrl;
export const DASHBOARD_API_BASE_URL = rawDashboardBaseUrl.replace(/\/+$/, "");

let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

export async function apiRequest(path, options = {}) {
  return request(API_BASE_URL, path, options);
}

async function request(baseUrl, path, options = {}) {
  const { auth = true, body, headers = {}, skipUnauthorizedRedirect = false, ...rest } = options;
  const token = getStoredToken();

  const response = await fetch(`${baseUrl}${path}`, {
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

export function dashboardRequest(path, options = {}) {
  return request(DASHBOARD_API_BASE_URL, path, options);
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

function query(params) {
  const search = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") search.set(key, value);
  });
  const value = search.toString();
  return value ? `?${value}` : "";
}

export const dashboardApi = {
  customers: {
    list: (params) => dashboardRequest(`/customers${query(params)}`),
    get: (id) => dashboardRequest(`/customers/${id}`),
    create: (payload) => dashboardRequest("/customers", { method: "POST", body: payload }),
    update: (id, payload) => dashboardRequest(`/customers/${id}`, { method: "PUT", body: payload }),
    delete: (id) => dashboardRequest(`/customers/${id}`, { method: "DELETE" }),
    products: (id, params) => dashboardRequest(`/customers/${id}/products${query(params)}`),
  },
  products: {
    list: (params) => dashboardRequest(`/products${query(params)}`),
    get: (id) => dashboardRequest(`/products/${id}`),
    create: (payload) => dashboardRequest("/products", { method: "POST", body: payload }),
    update: (id, payload) => dashboardRequest(`/products/${id}`, { method: "PUT", body: payload }),
    delete: (id) => dashboardRequest(`/products/${id}`, { method: "DELETE" }),
    customers: (id, params) => dashboardRequest(`/products/${id}/customers${query(params)}`),
    assignCustomer: (productId, customerId) => dashboardRequest(`/products/${productId}/customers/${customerId}`, { method: "POST" }),
    unassignCustomer: (productId, customerId) => dashboardRequest(`/products/${productId}/customers/${customerId}`, { method: "DELETE" }),
  },
  followUps: {
    list: (customerId, params) => dashboardRequest(`/customers/${customerId}/follow-ups${query(params)}`),
    create: (customerId, payload) => dashboardRequest(`/customers/${customerId}/follow-ups`, { method: "POST", body: payload }),
    report: (params) => dashboardRequest(`/reports/follow-ups${query(params)}`),
  },
  staff: { dropdown: () => dashboardRequest("/staff/dropdown") },
  reports: {
    customers: (params) => dashboardRequest(`/reports/customers${query(params)}`),
    products: (params) => dashboardRequest(`/reports/products${query(params)}`),
    followUps: (params) => dashboardRequest(`/reports/follow-ups${query(params)}`),
  },
};

export const reportsApi = {
  customers: (params) => dashboardRequest(`/reports/customers${query(params)}`),
  products: (params) => dashboardRequest(`/reports/products${query(params)}`),
  followUps: (params) => dashboardRequest(`/reports/follow-ups${query(params)}`),
  // Reports live with the dashboard API, so keep export on that authenticated origin.
  export: async (path, params) => {
    const token = getStoredToken();
    const response = await fetch(`${DASHBOARD_API_BASE_URL}${path}${query(params)}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    if (!response.ok) throw new Error((await response.json().catch(() => null))?.message || "Export failed");
    return { blob: await response.blob(), contentDisposition: response.headers.get("content-disposition"), contentType: response.headers.get("content-type") };
  },
};

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}
