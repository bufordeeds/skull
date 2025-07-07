import { API_CONFIG } from './config';

/**
 * API Service for making HTTP requests to the server
 */
class ApiService {
	private baseUrl: string;
	private defaultHeaders: HeadersInit;
	private timeout: number;

	constructor() {
		this.baseUrl = API_CONFIG.BASE_URL;
		this.timeout = API_CONFIG.TIMEOUT;
		this.defaultHeaders = {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		};
	}

	/**
	 * Make a GET request to the specified endpoint
	 */
	async get<T>(
		endpoint: string,
		params?: Record<string, string>
	): Promise<T> {
		const url = this.buildUrl(endpoint, params);
		return this.request<T>(url, {
			method: 'GET',
			headers: this.defaultHeaders
		});
	}

	/**
	 * Make a POST request to the specified endpoint
	 */
	async post<T, D = any>(endpoint: string, data?: D): Promise<T> {
		const url = this.buildUrl(endpoint);
		return this.request<T>(url, {
			method: 'POST',
			headers: this.defaultHeaders,
			body: data ? JSON.stringify(data) : undefined
		});
	}

	/**
	 * Make a PUT request to the specified endpoint
	 */
	async put<T, D = any>(endpoint: string, data?: D): Promise<T> {
		const url = this.buildUrl(endpoint);
		return this.request<T>(url, {
			method: 'PUT',
			headers: this.defaultHeaders,
			body: data ? JSON.stringify(data) : undefined
		});
	}

	/**
	 * Make a DELETE request to the specified endpoint
	 */
	async delete<T>(endpoint: string): Promise<T> {
		const url = this.buildUrl(endpoint);
		return this.request<T>(url, {
			method: 'DELETE',
			headers: this.defaultHeaders
		});
	}

	/**
	 * Check the health of the API server
	 */
	async checkHealth(): Promise<{ status: string; version: string }> {
		return this.get(API_CONFIG.ENDPOINTS.HEALTH);
	}

	/**
	 * Get all available rooms
	 */
	async getRooms(): Promise<any[]> {
		return this.get(API_CONFIG.ENDPOINTS.ROOMS);
	}

	/**
	 * Get a specific room by code
	 */
	async getRoomByCode(code: string): Promise<any> {
		return this.get(`${API_CONFIG.ENDPOINTS.ROOMS}/${code}`);
	}

	/**
	 * Build a URL with the base URL and optional query parameters
	 */
	private buildUrl(
		endpoint: string,
		params?: Record<string, string>
	): string {
		const url = new URL(`${this.baseUrl}${endpoint}`);

		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				url.searchParams.append(key, value);
			});
		}

		return url.toString();
	}

	/**
	 * Make a request with timeout and error handling
	 */
	private async request<T>(url: string, options: RequestInit): Promise<T> {
		try {
			const controller = new AbortController();
			const id = setTimeout(() => controller.abort(), this.timeout);

			const response = await fetch(url, {
				...options,
				signal: controller.signal
			});

			clearTimeout(id);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new ApiError(
					response.status,
					errorData.message || response.statusText,
					errorData
				);
			}

			// Handle empty responses
			if (response.status === 204) {
				return {} as T;
			}

			return await response.json();
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}

			if (error instanceof DOMException && error.name === 'AbortError') {
				throw new ApiError(408, 'Request timeout', {
					timeout: this.timeout
				});
			}

			throw new ApiError(500, 'Network error', { originalError: error });
		}
	}
}

/**
 * Custom API error class
 */
export class ApiError extends Error {
	status: number;
	data: any;

	constructor(status: number, message: string, data: any = {}) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.data = data;
	}
}

// Create singleton instance
export const apiService = new ApiService();
export default apiService;
