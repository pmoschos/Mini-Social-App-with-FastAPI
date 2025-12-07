document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const errorDiv = document.getElementById("error-msg");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await apiFetch("/auth/login", {
                    method: "POST",
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem("access_token", data.access_token);
                    window.location.href = "/";
                } else {
                    const err = await response.json();
                    showError(err.detail || "Login failed");
                }
            } catch (err) {
                showError("Network error");
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm-password").value;

            if (password !== confirmPassword) {
                showError("Passwords do not match");
                return;
            }

            try {
                const response = await apiFetch("/auth/register", {
                    method: "POST",
                    body: JSON.stringify({ email, password, username })
                });

                if (response.ok) {
                    // Auto login after register or redirect to login
                    window.location.href = "/login";
                } else {
                    const err = await response.json();
                    showError(err.detail || "Registration failed");
                }
            } catch (err) {
                showError("Network error");
            }
        });
    }

    function showError(msg) {
        if (errorDiv) {
            errorDiv.textContent = msg;
            errorDiv.style.display = "block";
        }
    }
});
