const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

export async function apiClient(path, options = {}) {
  const token = JSON.parse(localStorage.getItem('reqsphere-session') ?? 'null')?.token;
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const response = await fetch(`${baseUrl}${path}`, {
    headers,
    ...options,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? `Request failed (${response.status})`);
  }
  return response.status === 204 ? null : response.json();
}

export const useMockData = import.meta.env.VITE_USE_MOCK_DATA !== 'false';
