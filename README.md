# Social Media Platform Documentation

![Total Views](https://views.whatilearened.today/views/github/pmoschos/Mini-Social-App-with-FastAPI.svg)![Python](https://img.shields.io/badge/language-Python-blue.svg) ![GitHub last commit](https://img.shields.io/github/last-commit/pmoschos/Mini-Social-App-with-FastAPI) ![License](https://img.shields.io/badge/license-MIT-green.svg)

Welcome to the comprehensive documentation for the Social Media Platform. This project is a production-grade, full-stack application built using **FastAPI** for the high-performance backend and **Vanilla JavaScript** for a lightweight, dependency-free frontend.

This document serves as a complete reference for developers, DevOps engineers, and contributors. It covers every aspect of the system, from the database schema and API specifications to the frontend architecture and deployment instructions.

---

## 📚 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Directory Structure](#project-directory-structure)
4. [Installation & Setup](#installation--setup)
5. [Configuration](#configuration)
6. [Database Schema](#database-schema)
7. [Application Architecture](#application-architecture)
8. [API Reference](#api-reference)
9. [Frontend Documentation](#frontend-documentation)
10. [Troubleshooting](#troubleshooting)

---

## 🚀 Project Overview

The Social Media Platform is designed to ensure strict separation of concerns while maintaining simplicity.

- **Backend**: Serves a RESTful API and handles static file serving. It uses strict typing with Pydantic and asynchronous database operations for maximum performance.
- **Frontend**: Utilizes Jinja2 for server-side template rendering (SEO friendly and fast initial load) combined with Vanilla JavaScript for dynamic, client-side interactions (Single Page Application feel).
- **Security**: Implements industry-standard JWT authentication and bcrypt password hashing.

---

## 🛠 Technology Stack

The project relies on a carefully selected set of robust technologies.

### Backend Core
- **Language**: Python 3.8+
- **Web Framework**: [FastAPI](https://fastapi.tiangolo.com/) - Chosen for its speed and auto-generated documentation.
- **ASGI Server**: [Uvicorn](https://www.uvicorn.org/) - A lightning-fast ASGI server implementation.
- **Templating**: [Jinja2](https://jinja.palletsprojects.com/) - for rendering HTML templates.

### Database & ORM
- **Database**: [SQLite](https://www.sqlite.org/index.html) - Lightweight, file-based database.
- **Async Driver**: `aiosqlite` - Allows non-blocking database queries.
- **ORM**: [SQLAlchemy](https://www.sqlalchemy.org/) (Async mode) - For Pythonic database interactions.

### Authentication & Security
- **JWT Handling**: `python-jose` with `cryptography` backend.
- **Password Hashing**: `passlib` with `bcrypt`.
- **Form Handling**: `python-multipart` - For parsing form-data and file uploads.

### Frontend
- **Languages**: HTML5, CSS3, ES6+ JavaScript.
- **Dependencies**: None. Pure Native Web APIs.

---

## 📂 Project Directory Structure

The codebase is organized to promote scalability.

```text
project/
├── backend/
│   ├── auth/                       # Authentication Module
│   │   ├── models.py               # User DB Model
│   │   ├── router.py               # Auth API Endpoints
│   │   └── schemas.py              # Pydantic Schemas
│   ├── comments/                   # Comments Module
│   │   ├── models.py               # Comment DB Model
│   │   ├── router.py               # Comment Endpoints
│   │   └── schemas.py              # Comment Schemas
│   ├── core/                       # Core Infrastructure
│   │   ├── config.py               # Settings management
│   │   ├── database.py             # DB Connection & Session
│   │   └── security.py             # Hashing & Token utils
│   ├── likes/                      # Likes Module
│   │   ├── models.py               # Like DB Model
│   │   └── router.py               # Like Endpoints
│   ├── posts/                      # Posts Module
│   │   ├── models.py               # Post DB Model
│   │   ├── router.py               # Post CRUD & Uploads
│   │   └── schemas.py              # Post Schemas
│   ├── main.py                     # Application Entry Point
│   ├── sql_app.db                  # SQLite Database (Auto-created)
│   └── .env                        # Environment Variables
├── frontend/
│   ├── static/                     # Static Assets
│   │   ├── css/
│   │   │   └── style.css           # Global Stylesheet
│   │   └── js/
│   │       ├── api.js              # Fetch Wrapper
│   │       ├── auth.js             # Login/Register Logic
│   │       ├── feed.js             # Feed Rendering
│   │       └── post.js             # Post Creation Logic
│   └── templates/                  # HTML Templates
│       ├── base.html               # Base Layout
│       ├── create_post.html        # Post Create Page
│       ├── feed.html               # Main Feed Page
│       ├── login.html              # Login Page
│       ├── profile.html            # Profile Page
│       └── register.html           # Registration Page
├── uploads/                        # User Uploaded Media Store
└── requirements.txt                # Python Dependencies
```

---

## 📥 Installation & Setup

Follow these steps to get the environment running locally.

### 1. Prerequisites
Ensure you have the following installed:
- **Python** (version 3.8 or higher)
- **pip** (Python package installer)

### 2. Clone the Repository
Assuming you have the source code, navigate to the project root:
```bash
cd project
```

### 3. Virtual Environment (Recommended)
It is best practice to run Python projects in a virtual environment.
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 4. Install Dependencies
Install all required packages from `requirements.txt`.
```bash
pip install -r requirements.txt
```

### 5. Initialize the System
No manual database migration is required. The application automatically detects if `sql_app.db` is missing and creates the tables on the first run.

---

## ⚙️ Configuration

The application uses **Environment Variables** for configuration. These are loaded from a `.env` file in the `backend/` directory using `python-dotenv`.

### `.env` File Reference

Create a file named `.env` in `project/backend/`.

| Variable | Description | Default Value |
| :--- | :--- | :--- |
| `SECRET_KEY` | Key used to sign JWT tokens. **Change this in prod!** | `"supersecret"` |
| `ALGORITHM` | Hashing algorithm for JWT. | `"HS256"` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token validity duration. | `30` |
| `DATABASE_URL` | SQLAlchemy connection string. | `"sqlite+aiosqlite:///./sql_app.db"` |

**Example `.env` content:**
```ini
SECRET_KEY=948503958dh349058340958309485
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
DATABASE_URL=sqlite+aiosqlite:///./sql_app.db
```

---

## 🗄 Database Schema

The application uses a relational schema. Below are the details for each entity.

### 1. Users Table (`users`)
Stores user credentials and profile information.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key, Index | Unique User ID |
| `email` | String | Unique, Index, Not Null | User's email address |
| `username` | String | Index, Nullable | Display name |
| `profile_picture_url` | String | Nullable | URL to stored image |
| `password_hash` | String | Not Null | Bcrypt hashed password |
| `created_at` | DateTime | Default Now | Timestamp of registration |

### 2. Posts Table (`posts`)
Stores user-generated content.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key, Index | Unique Post ID |
| `title` | String | Not Null | Post caption/title |
| `image_url` | String | Not Null | Path to uploaded image |
| `user_id` | Integer | ForeignKey(`users.id`) | Author of the post |
| `created_at` | DateTime | Default Now | Creation timestamp |

### 3. Comments Table (`comments`)
Stores comments on posts.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key, Index | Unique Comment ID |
| `text` | String | Not Null | Content of the comment |
| `user_id` | Integer | ForeignKey(`users.id`) | Comment author |
| `post_id` | Integer | ForeignKey(`posts.id`) | Relates to parent post |
| `created_at` | DateTime | Default Now | Creation timestamp |

### 4. Likes Table (`likes`)
Join table for many-to-many relationship between Users and Posts.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | Integer | Primary Key, ForeignKey | User who liked |
| `post_id` | Integer | Primary Key, ForeignKey | Post that was liked |

> **Note**: Both columns form a Composite Primary Key, preventing duplicate likes.

---

## 🏗 Application Architecture

### Backend Architecture
The backend is structured using the **Router Pattern**.
- **AuthRouter**: Handles `/auth/*` -> `auth/router.py`
- **PostsRouter**: Handles `/posts/*` -> `posts/router.py`
- **CommentsRouter**: Handles `/comments/*` -> `comments/router.py`
- **LikesRouter**: Handles `/likes/*` -> `likes/router.py`

**Data Flow**:
1. **Request** hits `main.py`.
2. **FastAPI** routes to the specific module router.
3. **Dependency Injection** (`Depends(get_db)`) provides an Async Database Session.
4. **Router** calls SQLAlchemy to query/mutate data.
5. **Pydantic Models** (`schemas.py`) validate and serialize the response.
6. **JSON Response** is sent back.

### Frontend Architecture
The frontend uses a **Hybrid Templating + SPA** approach.

1. **Initial Load**:
    - The server renders `base.html` + `page.html` using Jinja2.
    - This provides fast "First Contentful Paint".
2. **Dynamic Data**:
    - Once loaded, JavaScript modules (`feed.js`, etc.) fetch data via JSON APIs.
    - They manipulate the DOM to insert Posts, Comments, and Likes.
3. **State Management**:
    - `api.js` manages the JWT token in `localStorage`.
    - Local state (like "isLiked") is handled simplistically in the DOM or JS variables.

---

## 📖 API Reference

### Authentication

#### Register a new user
**Endpoint**: `POST /api/auth/register`

- **Request Body** (JSON):
    ```json
    {
        "email": "user@example.com",
        "username": "cooluser123", /* Optional */
        "password": "securepassword"
    }
    ```
- **Response** (201 Created):
    ```json
    {
        "id": 1,
        "email": "user@example.com",
        "username": "cooluser123",
        "profile_picture_url": null,
        "created_at": "2023-10-27T10:00:00"
    }
    ```

#### Login
**Endpoint**: `POST /api/auth/login`

- **Request Body** (JSON):
    ```json
    {
        "email": "user@example.com",
        "password": "securepassword"
    }
    ```
- **Response** (200 OK):
    ```json
    {
        "access_token": "eyJhbGciOiJIUzI1Ni...",
        "token_type": "bearer"
    }
    ```

#### Update Profile
**Endpoint**: `PUT /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body** (FormData):
    - `username`: (Text, Optional)
    - `profile_picture`: (File, Optional)
- **Response** (200 OK): Returns updated User object.

---

### Posts

#### Create Post
**Endpoint**: `POST /api/posts/`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body** (FormData):
    - `title`: "My new photo"
    - `image`: (Binary File)
- **Response** (201 Created):
    ```json
    {
        "id": 5,
        "title": "My new photo",
        "image_url": "/uploads/uuid.png",
        "user_id": 1,
        "created_at": "...",
        "user": { ...UserObj... }
    }
    ```

#### Get Feed
**Endpoint**: `GET /api/posts/`
- **Query Params**:
    - `skip`: (int) default 0
    - `limit`: (int) default 100
- **Response** (200 OK): List of Post objects.

---

### Interactions

#### Toggle Like
**Endpoint**: `POST /api/likes/{post_id}`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
    ```json
    {
        "liked": true,
        "count": 42
    }
    ```

#### Add Comment
**Endpoint**: `POST /api/comments/{post_id}`
- **Request Body**:
    ```json
    { "text": "Great post!" }
    ```
- **Response**: Comment object with User details.

---

## 💻 Frontend Documentation

### `static/js/api.js`
This is the core network utility for the application.

- **`apiFetch(endpoint, options)`**: 
    - A wrapper around the native `fetch` API.
    - Automatically injects the `Authorization` header if a token exists in `localStorage`.
    - Handles 401 (Unauthorized) errors by redirecting to `/login`.
    - Returns the native Promise.

### `static/js/feed.js`
Handles the main feed logic.

- **`loadFeed()`**: Fetches posts from `/api/posts/` and clears the loader.
- **`createPostElement(post)`**: Generates the HTML card for a post. It handles escaping HTML to prevent XSS.
- **`toggleLike(postId)`**: Implements **Optimistic UI**. It updates the heart icon and number immediately before the server responds, providing a snappy experience. If the server fails, it reverts the change.

### `static/js/auth.js`
Manages User Sessions.

- Listens for form submissions on Login and Register pages.
- Stores the received JWT in `localStorage`.
- Redirects users upon success.

---

## ❓ Troubleshooting

### 1. "No such column: users.username"
**Cause**: The database file `sql_app.db` was created before the "User Profile" update and has an old schema.
**Solution**:
1. Stop the server `CTRL+C`.
2. Delete the file `backend/sql_app.db`.
3. Restart the server. It will recreate the DB with the new columns.

### 2. Images not loading
**Cause**: The static mount path might be incorrect or the file doesn't exist.
**Solution**:
- Ensure the `uploads/` directory exists in the project root.
- The path stored in the DB is relative (`/uploads/...`).
- `main.py` mounts this directory to serve files.

### 3. Changes not reflecting (Frontend)
**Cause**: Browser caching JavaScript files.
**Solution**:
- We implement cache busting via `?v=3` in the HTML templates.
- If issues persist, perform a **Hard Reload**:
    - Windows: `Ctrl + F5`
    - Mac: `Cmd + Shift + R`

### 4. `AttributeError: type object 'Post' has no attribute 'user'`
**Cause**: A mismatch between the SQLAlchemy Relationship name and the code using it.
**Solution**:
- This was strictly fixed in `posts/models.py`.
- Ensure the relationship is defined as:
  ```python
  user = relationship("auth.models.User")
  ```
  (It was previously named `owner`).

---

## Simple Steps

1. git clone https://github.com/pmoschos/Mini-Social-App-with-FastAPI.git
2. cd mini-social-app-with-fastapi
3. python -m venv venv
4. venv\Scripts\activate
5. pip install -r requirements.txt
6. cd backend
7. uvicorn main:app --reload --host 0.0.0.0 --port 8000

Open browser: http://0.0.0.0:8000 

## 📢 Stay Updated

Be sure to ⭐ this repository to stay updated with new examples and enhancements!

## 📄 License
🔐 This project is protected under the [MIT License](https://mit-license.org/).


## Contact 📧
Panagiotis Moschos - pan.moschos86@gmail.com

🔗 *Note: This is a Python script and requires a Python interpreter to run.*

---
<h1 align=center>Happy Coding 👨‍💻 </h1>

<p align="center">
  Made with ❤️ by 
  <a href="https://www.linkedin.com/in/panagiotis-moschos" target="_blank">
  Panagiotis Moschos</a>
</p>
