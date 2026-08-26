/**
 * Thin API client for the Nirmala Foundation backend.
 *
 * The admin panel currently reads/writes a local (frontend-only) store.
 * This client is the single integration point for switching to the real
 * backend: point components at these helpers instead of the local store.
 */

const BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:5000/api/v1";

const TOKEN_KEY = "nf_auth_token";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Mongo timestamps, present on every record the API returns.
 *
 * Optional because the admin store seeds itself with local fallback content
 * so public pages render before the first fetch resolves — those seeded
 * records have no server timestamps until the real data replaces them.
 */
export type Stamped = {
  createdAt?: string;
  updatedAt?: string;
};

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

type Options = Omit<RequestInit, "body"> & { body?: unknown; auth?: boolean };

export async function api<T = unknown>(path: string, options: Options = {}): Promise<T> {
  const { body, auth = true, headers, ...rest } = options;
  const token = auth ? getToken() : null;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const message =
      (payload && typeof payload === "object" && "message" in payload
        ? String((payload as { message: unknown }).message)
        : `Request failed (${res.status})`) || "Request failed";
    throw new ApiError(message, res.status, payload);
  }

  // Backend wraps data as { success, data } — unwrap when present.
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

/** Pagination envelope returned alongside a list. */
export type ListMeta = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type Paged<T> = {
  items: T[];
  meta: ListMeta;
};

/**
 * GET a list and keep its pagination `meta`.
 *
 * `api()` unwraps to `data` for convenience, which throws the page counts
 * away — this keeps them, so a listing can render real pager controls.
 */
export async function apiList<T = unknown>(path: string, options: Options = {}): Promise<Paged<T>> {
  const { body, auth = true, headers, ...rest } = options;
  const token = auth ? getToken() : null;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? String((payload as { message: unknown }).message)
        : `Request failed (${res.status})`;
    throw new ApiError(message, res.status, payload);
  }

  const items = (payload?.data ?? []) as T[];
  const meta = (payload?.meta ?? {
    total: items.length,
    page: 1,
    limit: items.length,
    pages: 1,
  }) as ListMeta;

  return { items, meta };
}

export const http = {
  get: <T = unknown>(path: string, opts?: Options) => api<T>(path, { ...opts, method: "GET" }),
  post: <T = unknown>(path: string, body?: unknown, opts?: Options) =>
    api<T>(path, { ...opts, method: "POST", body }),
  patch: <T = unknown>(path: string, body?: unknown, opts?: Options) =>
    api<T>(path, { ...opts, method: "PATCH", body }),
  put: <T = unknown>(path: string, body?: unknown, opts?: Options) =>
    api<T>(path, { ...opts, method: "PUT", body }),
  delete: <T = unknown>(path: string, opts?: Options) =>
    api<T>(path, { ...opts, method: "DELETE" }),
  /** GET a paginated list, preserving its `meta`. */
  list: <T = unknown>(path: string, opts?: Options) => apiList<T>(path, opts),
};
