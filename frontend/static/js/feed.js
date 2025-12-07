document.addEventListener("DOMContentLoaded", () => {
    loadFeed();
});

async function loadFeed() {
    const feedContainer = document.getElementById("feed-container");
    try {
        const response = await apiFetch("/posts/");
        if (response.ok) {
            const posts = await response.json();
            feedContainer.innerHTML = "";
            for (const post of posts) {
                const postElement = createPostElement(post);
                feedContainer.appendChild(postElement);
                // Load like count
                updateLikeCount(post.id);
            }
        } else {
            feedContainer.innerHTML = "<p>Please login to view the feed.</p>";
        }
    } catch (err) {
        console.error(err);
    }
}

function createPostElement(post) {
    const div = document.createElement("div");
    div.className = "post-card";

    // Header & Image
    div.innerHTML = `
        <div class="post-header">
            <div class="user-info" style="display: flex; align-items: center; gap: 0.5rem;">
                <img src="${post.user.profile_picture_url || '/static/default_pfp.png'}" 
                     style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover; background: #eee;">
                <span style="font-weight: bold;">${escapeHtml(post.user.username || 'User ' + post.user_id)}</span>
            </div>
            <div class="post-title" style="margin-top: 0.5rem;">${escapeHtml(post.title)}</div>
            <div style="font-size: 0.8rem; color: #666;">${new Date(post.created_at).toLocaleString()}</div>
        </div>
        <img src="${post.image_url}" class="post-image" alt="${escapeHtml(post.title)}">
        <div class="post-actions">
            <button class="like-btn" id="like-btn-${post.id}" onclick="toggleLike(${post.id})">
                Like <span id="like-count-${post.id}">0</span>
            </button>
            <button class="comment-toggle" onclick="toggleComments(${post.id})">
                Comments
            </button>
        </div>
        <div class="comments-section" id="comments-section-${post.id}" style="display: none;">
            <div id="comments-list-${post.id}"></div>
            <form onsubmit="postComment(event, ${post.id})" style="margin-top: 1rem;">
                <div class="form-group">
                    <input type="text" id="comment-input-${post.id}" placeholder="Write a comment..." required>
                </div>
                <button type="submit" style="width: auto; padding: 0.5rem 1rem;">Post</button>
            </form>
        </div>
    `;
    return div;
}

// Optimistic Like Toggle
async function toggleLike(postId) {
    const btn = document.getElementById(`like-btn-${postId}`);
    const countSpan = document.getElementById(`like-count-${postId}`);

    // Toggle visual state immediately (optimistic)
    const isLiked = btn.classList.contains("liked");
    if (isLiked) {
        btn.classList.remove("liked");
        countSpan.textContent = parseInt(countSpan.textContent) - 1;
    } else {
        btn.classList.add("liked");
        countSpan.textContent = parseInt(countSpan.textContent) + 1;
    }

    try {
        const response = await apiFetch(`/likes/${postId}`, { method: "POST" });
        if (response.ok) {
            const data = await response.json();
            // Correct state from server
            if (data.liked) {
                btn.classList.add("liked");
            } else {
                btn.classList.remove("liked");
            }
            countSpan.textContent = data.count;
        } else {
            // Revert on error
            if (isLiked) {
                btn.classList.add("liked");
                countSpan.textContent = parseInt(countSpan.textContent) + 1;
            } else {
                btn.classList.remove("liked");
                countSpan.textContent = parseInt(countSpan.textContent) - 1;
            }
        }
    } catch (err) {
        console.error(err);
    }
}

async function updateLikeCount(postId) {
    try {
        const response = await apiFetch(`/likes/${postId}/count`);
        if (response.ok) {
            const data = await response.json();
            document.getElementById(`like-count-${postId}`).textContent = data.count;
        }
    } catch (err) { }
}

async function toggleComments(postId) {
    const section = document.getElementById(`comments-section-${postId}`);
    if (section.style.display === "none") {
        section.style.display = "block";
        loadComments(postId);
    } else {
        section.style.display = "none";
    }
}

async function loadComments(postId) {
    const list = document.getElementById(`comments-list-${postId}`);
    list.innerHTML = "Loading...";
    try {
        const response = await apiFetch(`/comments/${postId}`);
        if (response.ok) {
            const comments = await response.json();
            list.innerHTML = "";
            if (comments.length === 0) {
                list.innerHTML = "<p>No comments yet.</p>";
            } else {
                comments.forEach(c => {
                    const cDiv = document.createElement("div");
                    cDiv.className = "comment";
                    cDiv.innerHTML = `
                        <div class="comment-author" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.2rem;">
                            <img src="${c.user.profile_picture_url || '/static/default_pfp.png'}" 
                                 style="width: 20px; height: 20px; border-radius: 50%; object-fit: cover; background: #eee;">
                            <span style="font-weight: bold; font-size: 0.9rem;">${escapeHtml(c.user.username || 'User ' + c.user_id)}</span>
                        </div>
                        <div class="comment-text">${escapeHtml(c.text)}</div>
                    `;
                    list.appendChild(cDiv);
                });
            }
        }
    } catch (err) {
        list.innerHTML = "Error loading comments";
    }
}

async function postComment(event, postId) {
    event.preventDefault();
    const input = document.getElementById(`comment-input-${postId}`);
    const text = input.value;

    try {
        const response = await apiFetch(`/comments/${postId}`, {
            method: "POST",
            body: JSON.stringify({ text })
        });

        if (response.ok) {
            input.value = "";
            loadComments(postId); // Refresh
        }
    } catch (err) {
        alert("Failed to post comment");
    }
}

function escapeHtml(text) {
    if (!text) return "";
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
