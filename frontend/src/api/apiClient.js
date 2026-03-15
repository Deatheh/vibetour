const API_BASE = "/api";

class ApiClient {
	constructor() {
		this.baseURL = API_BASE;
	}

	async request(endpoint, options = {}) {
		const url = `${this.baseURL}${endpoint}`;
		const config = {
			...options,
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
		};

		// Добавляем токен авторизации если есть
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		try {
			const response = await fetch(url, config);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new ApiError(
					response.status,
					errorData.message || "Request failed",
				);
			}

			// Для 204 No Content
			if (response.status === 204) {
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("API Error:", error);
			throw error;
		}
	}

	// Public endpoints
	async getEvents(params = {}) {
		const queryString = new URLSearchParams(params).toString();
		return this.request(
			`/events${queryString ? "?" + queryString : ""}`,
		);
	}

	async getEventById(id) {
		return this.request(`/events/${id}`);
	}

	// Admin endpoints
	async createTour(data) {
		return this.request("/admin/tours", {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	async updateTour(id, data) {
		return this.request(`/admin/tours/${id}`, {
			method: "PUT",
			body: JSON.stringify(data),
		});
	}

	async deleteTour(id) {
		return this.request(`/admin/tours/${id}`, {
			method: "DELETE",
		});
	}

	async generateTourDescription(id, language = "ru") {
		return this.request(`/admin/tours/${id}/generate-description`, {
			method: "POST",
			body: JSON.stringify({ language }),
		});
	}
}

class ApiError extends Error {
	constructor(status, message) {
		super(message);
		this.status = status;
		this.name = "ApiError";
	}
}

export const apiClient = new ApiClient();
export { ApiError };

