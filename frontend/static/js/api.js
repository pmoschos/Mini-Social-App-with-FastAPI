const API_URL = "/api";

async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem("access_token");
    const headers = options.headers || {};

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    // If body is FormData (image upload), don't set Content-Type header manually
    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const config = {
        ...options,
        headers: headers
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);

        if (response.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem("access_token");
            window.location.href = "/login";
            return;
        }

        return response;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}
