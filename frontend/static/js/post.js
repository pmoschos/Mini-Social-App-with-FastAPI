document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("create-post-form");
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const title = document.getElementById("title").value;
            const fileInput = document.getElementById("image");
            const file = fileInput.files[0];

            if (!file) {
                alert("Please select an image");
                return;
            }

            const formData = new FormData();
            formData.append("title", title);
            formData.append("image", file);

            try {
                const response = await apiFetch("/posts/", {
                    method: "POST",
                    body: formData
                });

                if (response.ok) {
                    window.location.href = "/";
                } else {
                    alert("Failed to create post");
                }
            } catch (err) {
                console.error(err);
                alert("Error creating post");
            }
        });
    }
});
