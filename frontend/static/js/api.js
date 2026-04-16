const API_BASE = "";

async function apiFetch(endpoint, options = {}) {
        const token = localStorage.getItem("access_token");
        if (token) {
                    options.headers = {
                                    ...options.headers,
                                    "Authorization": `Bearer ${token}`
                    };
        }

    let response = await fetch(API_BASE + endpoint, options);

    // Access token expired — attempt a silent refresh
    if (response.status === 401) {
                const refreshToken = localStorage.getItem("refresh_token");
                if (!refreshToken) {
                                // No refresh token available, force login
                    window.location.href = "/login";
                                return;
                }

            const refreshResponse = await fetch(`${API_BASE}/api/auth/refresh`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(refreshToken)
            });

            if (!refreshResponse.ok) {
                            // Refresh token also invalid/expired, force login
                    localStorage.removeItem("access_token");
                            localStorage.removeItem("refresh_token");
                            window.location.href = "/login";
                            return;
            }

            const data = await refreshResponse.json();
                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("refresh_token", data.refresh_token);

            // Retry the original request with the new access token
            options.headers["Authorization"] = `Bearer ${data.access_token}`;
                response = await fetch(API_BASE + endpoint, options);
    }

    return response;
}
