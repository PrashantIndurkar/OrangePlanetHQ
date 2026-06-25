# OrangePlanet API Testing Guide

This guide details all API routes, payload formats, query parameters, validation rules, and step-by-step testing flows. You can use this with API clients like **Bruno**, **Postman**, **Insomnia**, or **curl**.

---

## 🚀 Getting Started

### 1. Start the API Server
Ensure the database is running, then start the Express development server:
```bash
# In the orangeplanet root directory
pnpm --filter api dev
```
The server starts on `http://localhost:3002`.

### 2. Authorization Header Setup
All route endpoints under `/api/v1/tasks` and `/api/v1/auth/me` require a valid JSON Web Token (JWT).
Add the following header to your requests after logging in:
*   **Header Key**: `Authorization`
*   **Header Value**: `Bearer <your_jwt_token_here>`

---

## 🔑 Authentication Endpoints

### 1. Register a New Account
Create a new user account.
*   **Method**: `POST`
*   **URL**: `http://localhost:3002/api/v1/auth/signup`
*   **Body (JSON)**:
    ```json
    {
      "email": "user@example.com",
      "password": "password123",
      "name": "Prashant Indurkar"
    }
    ```
*   **Success Response (`201 Created`)**:
    ```json
    {
      "user": {
        "id": "e8d64115-4fa7-4f6c-9411-825501fb33c2",
        "email": "user@example.com",
        "name": "Prashant Indurkar",
        "role": "user"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

### 2. Login User
Authenticate and receive a JWT access token.
*   **Method**: `POST`
*   **URL**: `http://localhost:3002/api/v1/auth/login`
*   **Body (JSON)**:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
*   **Success Response (`200 OK`)**:
    ```json
    {
      "user": {
        "id": "e8d64115-4fa7-4f6c-9411-825501fb33c2",
        "email": "user@example.com",
        "name": "Prashant Indurkar",
        "role": "user"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

### 3. Get User Profile (Auth Required)
Retrieve details of the currently authenticated user.
*   **Method**: `GET`
*   **URL**: `http://localhost:3002/api/v1/auth/me`
*   **Headers**: `Authorization: Bearer <token>`
*   **Success Response (`200 OK`)**:
    ```json
    {
      "user": {
        "id": "e8d64115-4fa7-4f6c-9411-825501fb33c2",
        "email": "user@example.com",
        "name": "Prashant Indurkar",
        "role": "user"
      }
    }
    ```

---

## 📋 Tasks Endpoints (Auth Required)

### 1. Create a Task
Creates a task owned by the authenticated user.
*   **Method**: `POST`
*   **URL**: `http://localhost:3002/api/v1/tasks`
*   **Headers**: `Authorization: Bearer <token>`
*   **Body (JSON)**:
    ```json
    {
      "title": "Configure Postgres Database Connection",
      "description": "Set up database connection pools and connection strings",
      "status": "in-progress",
      "priority": "high",
      "dueDate": "2026-06-25T12:00:00.000Z"
    }
    ```
    *Note: `status`, `priority`, `description`, and `dueDate` are optional. Default status is `todo` and default priority is `no-priority`.*
*   **Success Response (`201 Created`)**:
    ```json
    {
      "task": {
        "id": "4597e4a2-b7fa-495d-94a6-5cf8534858bc",
        "title": "Configure Postgres Database Connection",
        "description": "Set up database connection pools and connection strings",
        "status": "in-progress",
        "priority": "high",
        "dueDate": "2026-06-25T12:00:00.000Z",
        "userId": "e8d64115-4fa7-4f6c-9411-825501fb33c2",
        "createdAt": "2026-06-14T01:30:00.000Z",
        "updatedAt": "2026-06-14T01:30:00.000Z"
      }
    }
    ```

### 2. Get Task Details
Retrieve details of a single task. Returns `404 Not Found` if the task does not belong to the user.
*   **Method**: `GET`
*   **URL**: `http://localhost:3002/api/v1/tasks/:id`
*   **Headers**: `Authorization: Bearer <token>`
*   **Success Response (`200 OK`)**:
    ```json
    {
      "task": {
        "id": "4597e4a2-b7fa-495d-94a6-5cf8534858bc",
        "title": "Configure Postgres Database Connection",
        "description": "Set up database connection pools and connection strings",
        "status": "in-progress",
        "priority": "high",
        "dueDate": "2026-06-25T12:00:00.000Z",
        "userId": "e8d64115-4fa7-4f6c-9411-825501fb33c2",
        "createdAt": "2026-06-14T01:30:00.000Z",
        "updatedAt": "2026-06-14T01:30:00.000Z"
      }
    }
    ```

### 3. List, Filter, Sort, & Paginate Tasks
Get all tasks belonging to the user.
*   **Method**: `GET`
*   **URL**: `http://localhost:3002/api/v1/tasks`
*   **Headers**: `Authorization: Bearer <token>`
*   **Query Parameters**:
    | Parameter | Type | Default | Description |
    | :--- | :--- | :--- | :--- |
    | `status` | String | *None* | Comma-separated list of statuses to filter by: `backlog,todo,in-progress,in-review,done,canceled` |
    | `priority` | String | *None* | Comma-separated list of priorities to filter by: `urgent,high,medium,low,no-priority` |
    | `search` | String | *None* | Case-insensitive text search matching the `title` or `description` |
    | `sortBy` | Enum | `createdAt` | Field to sort by: `createdAt`, `dueDate`, `priority` |
    | `sortOrder`| Enum | `desc` | Sorting direction: `asc`, `desc` |
    | `page` | Integer| `1` | Pagination page number |
    | `limit` | Integer| `25` | Maximum items returned per page (maximum limit: `100`) |
*   **Example Request URL**:
    `http://localhost:3002/api/v1/tasks?status=todo,in-progress&sortBy=priority&sortOrder=desc&page=1&limit=10`
*   **Success Response (`200 OK`)**:
    ```json
    {
      "tasks": [
        {
          "id": "4597e4a2-b7fa-495d-94a6-5cf8534858bc",
          "title": "Configure Postgres Database Connection",
          "description": "Set up database connection pools and connection strings",
          "status": "in-progress",
          "priority": "high",
          "dueDate": "2026-06-25T12:00:00.000Z",
          "userId": "e8d64115-4fa7-4f6c-9411-825501fb33c2",
          "createdAt": "2026-06-14T01:30:00.000Z",
          "updatedAt": "2026-06-14T01:30:00.000Z"
        }
      ],
      "total": 1
    }
    ```

### 4. Update Task (Partial)
Update specific fields of a task. Restricting payload modifications to matching `userId` owners.
*   **Method**: `PATCH`
*   **URL**: `http://localhost:3002/api/v1/tasks/:id`
*   **Headers**: `Authorization: Bearer <token>`
*   **Body (JSON)**:
    ```json
    {
      "title": "Configured Connection Pools Successfully",
      "description": null,
      "status": "done"
    }
    ```
    *Note: Passing `null` to `description` or `dueDate` clears the values in the database.*
*   **Success Response (`200 OK`)**:
    ```json
    {
      "task": {
        "id": "4597e4a2-b7fa-495d-94a6-5cf8534858bc",
        "title": "Configured Connection Pools Successfully",
        "description": null,
        "status": "done",
        "priority": "high",
        "dueDate": "2026-06-25T12:00:00.000Z",
        "userId": "e8d64115-4fa7-4f6c-9411-825501fb33c2",
        "createdAt": "2026-06-14T01:30:00.000Z",
        "updatedAt": "2026-06-14T01:45:00.000Z"
      }
    }
    ```

### 5. Delete Task
Hard-deletes a task record. Returns `404 Not Found` if the task does not belong to the user.
*   **Method**: `DELETE`
*   **URL**: `http://localhost:3002/api/v1/tasks/:id`
*   **Headers**: `Authorization: Bearer <token>`
*   **Success Response (`204 No Content`)**:
    *(Empty response body)*

---

## 🚫 Validation Rules & Error Codes

All request parameters, paths, and body values are strictly validated using Zod. If a validation fails, the API returns a structured error envelope:

### Error Envelope Format
```json
{
  "error": {
    "code": 400,
    "message": "Error details go here",
    "stack": "Stack trace (Only visible when NODE_ENV === development)"
  }
}
```

### Common Validation Error Examples

#### 1. Invalid Task UUID format on request param
*   **Request**: `GET /api/v1/tasks/invalid-uuid-format`
*   **Response (`400 Bad Request`)**:
    ```json
    {
      "error": {
        "code": 400,
        "message": "id: Invalid task ID format"
      }
    }
    ```

#### 2. Invalid Status value on task creation
*   **Request Body**: `{ "title": "My Task", "status": "completed" }` *(Expected: `done`)*
*   **Response (`400 Bad Request`)**:
    ```json
    {
      "error": {
        "code": 400,
        "message": "status: Invalid enum value. Expected 'backlog' | 'todo' | 'in-progress' | 'in-review' | 'done' | 'canceled', received 'completed'"
      }
    }
    ```

#### 3. Unauthorized access
*   **Request**: `GET /api/v1/tasks` *(Without setting Authorization header)*
*   **Response (`401 Unauthorized`)**:
    ```json
    {
      "error": {
        "code": 401,
        "message": "Please authenticate"
      }
    }
    ```

#### 4. Stealth boundary guard (Querying another user's task)
*   **Request**: `GET /api/v1/tasks/10000000-0000-0000-0000-000000000000` *(Valid UUID belonging to User B, requested by User A)*
*   **Response (`404 Not Found`)**:
    ```json
    {
      "error": {
        "code": 404,
        "message": "Task not found"
      }
    }
    ```
    *Note: Returning a `404` instead of a `403` ensures resource stealth, preventing malicious users from probing for existing task IDs.*
