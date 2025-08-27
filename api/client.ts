import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'user_auth_token';
// For Android Emulator, 10.0.2.2 is the host machine's localhost.
// For iOS Simulator, 'http://localhost:8080' should work.
// For a physical device, use your machine's local network IP address.
const API_BASE_URL = 'http://10.0.2.2:8080';

interface ApiClientOptions extends RequestInit {
  // We can add custom options here in the future
}

async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.text().catch(() => 'Could not read error response');
    throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorData}`);
  }

  // Handle cases where the response body might be empty (e.g., for a 204 No Content)
  const responseText = await response.text();
  if (!responseText) {
    return Promise.resolve(null as T);
  }

  try {
    return JSON.parse(responseText) as T;
  } catch (e) {
    throw new Error('Failed to parse JSON response');
  }
}

export default apiClient;
