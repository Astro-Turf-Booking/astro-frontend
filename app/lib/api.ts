/**
 * API client configuration and fetch wrapper.
 */

export interface ApiFetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Handle 401 Unauthorized responses.
 *
 * TEMPORARILY DISABLED: Automatic login redirection.
 */
/*
function handleUnauthorized(): void {
  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname + window.location.search;
    const loginUrl = `/login?callbackUrl=${encodeURIComponent(currentPath)}`;
    window.location.href = loginUrl;
  }
}
*/

/**
 * Normalizes input endpoint to ensure it hits the relative API path.
 */
function normalizePath(endpoint: string): string {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    throw new Error(
      `Direct external URLs are not permitted in apiFetch. Use relative paths under /api (got: ${endpoint})`,
    );
  }

  const pathWithSlash = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  if (!pathWithSlash.startsWith("/api/")) {
    return `/api${pathWithSlash}`;
  }

  return pathWithSlash;
}

/**
 * Base fetch function with automatic cookie credentials and JSON handling.
 */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { params, headers, ...restOptions } = options;

  let url = normalizePath(endpoint);

  if (params) {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }

    const queryString = searchParams.toString();

    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const finalHeaders = new Headers(headers);

  if (
    restOptions.body &&
    typeof restOptions.body === "string" &&
    !finalHeaders.has("Content-Type")
  ) {
    try {
      JSON.parse(restOptions.body);
      finalHeaders.set("Content-Type", "application/json");
    } catch {
      // Not JSON, leave header alone
    }
  }

  const response = await fetch(url, {
    credentials: "include",
    headers: finalHeaders,
    ...restOptions,
  });

  // TEMPORARILY DISABLED: Automatic redirect on 401.
  /*
  if (response.status === 401) {
    handleUnauthorized();
    throw new ApiError(401, "Unauthorized");
  }
  */

  // Attempt to parse JSON response, fallback to text
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  let data: unknown;

  try {
    data = isJson ? await response.json() : await response.text();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMessage =
      (typeof data === "object" && data !== null && "message" in data
        ? String((data as { message: unknown }).message)
        : null) ||
      (typeof data === "object" && data !== null && "error" in data
        ? String((data as { error: unknown }).error)
        : null) ||
      (typeof data === "string" && data.trim() !== "" ? data : null) ||
      response.statusText ||
      `Request failed with status ${response.status}`;

    throw new ApiError(response.status, errorMessage, data);
  }

  return data as T;
}

/**
 * Helper object providing common HTTP method abstractions.
 */
export const api = {
  get<T = unknown>(endpoint: string, options?: ApiFetchOptions): Promise<T> {
    return apiFetch<T>(endpoint, { ...options, method: "GET" });
  },

  post<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: ApiFetchOptions,
  ): Promise<T> {
    return apiFetch<T>(endpoint, {
      ...options,
      method: "POST",
      body:
        body !== undefined
          ? typeof body === "string"
            ? body
            : JSON.stringify(body)
          : undefined,
    });
  },

  put<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: ApiFetchOptions,
  ): Promise<T> {
    return apiFetch<T>(endpoint, {
      ...options,
      method: "PUT",
      body:
        body !== undefined
          ? typeof body === "string"
            ? body
            : JSON.stringify(body)
          : undefined,
    });
  },

  patch<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: ApiFetchOptions,
  ): Promise<T> {
    return apiFetch<T>(endpoint, {
      ...options,
      method: "PATCH",
      body:
        body !== undefined
          ? typeof body === "string"
            ? body
            : JSON.stringify(body)
          : undefined,
    });
  },

  delete<T = unknown>(endpoint: string, options?: ApiFetchOptions): Promise<T> {
    return apiFetch<T>(endpoint, { ...options, method: "DELETE" });
  },
};
