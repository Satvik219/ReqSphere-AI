const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

export async function apiClient(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.status === 204 ? null : response.json();
}

export const useMockData = import.meta.env.VITE_USE_MOCK_DATA !== 'false';
