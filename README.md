# Financial Transaction & Expense Tracker REST API

> **YR NOVATECH Task 3: REST API & Backend Development**  
> An enterprise-grade, lightweight RESTful backend built with **Node.js**, **Express**, **SQLite3**, **Express-Validator**, and interactive **Swagger (OpenAPI 3.0)** documentation.

[![Node.js](https://img.shields.io/badge/Node.js-18.x%2B-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.21.x-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com)
[![SQLite3](https://img.shields.io/badge/SQLite-3.x-003B57?style=flat&logo=sqlite&logoColor=white)](https://sqlite.org)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI_3.0-85EA2D?style=flat&logo=swagger&logoColor=black)](http://localhost:5000/api-docs)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📌 1. Project Overview

This repository contains the complete implementation for **YR NOVATECH Task 3: REST API & Backend Development**. It implements a resilient, production-ready **Financial Transaction & Expense Tracker** backend service designed to record, categorize, validate, and query monetary operations.

### Key Architectural Highlights
- **Persistent Embedded Storage**: Utilizes SQLite3 with foreign keys enabled, WAL-mode compatibility, and automatic initial seeding of 3 financial transactions on cold start.
- **Strict Input Validation & Sanitization**: Powered by `express-validator` to reject malformed payloads with descriptive `400 Bad Request` validation schemas before touching the database layer.
- **RESTful Resource Design**: Supports 5 core CRUD endpoints (exceeding the 4-endpoint requirement), alongside root health monitoring and interactive Swagger UI.
- **Centralized Error Handling**: Unhandled exceptions and undefined routes are gracefully caught and normalized into predictable JSON error responses.
- **Interactive Documentation**: Embedded OpenAPI 3.0 specification available out of the box at `/api-docs`.

---

## 🗄️ 2. Database Schema (SQLite)

The database file `database.sqlite` automatically initializes the `transactions` table upon server boot:

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` | Unique identifier for each transaction |
| `title` | `TEXT` | `NOT NULL` | Description/title of the transaction (2–150 chars) |
| `amount` | `REAL` | `NOT NULL` | Monetary value, strictly positive float (`> 0`) |
| `type` | `TEXT` | `NOT NULL CHECK(type IN ('income', 'expense'))` | Transaction category direction |
| `category` | `TEXT` | `NOT NULL` | Categorization tag (e.g. `DevOps`, `Consulting`) |
| `created_at` | `DATETIME` | `DEFAULT CURRENT_TIMESTAMP` | UTC timestamp of record creation |

### Automatic Seeding
If the `transactions` table is empty upon server initialization, the service automatically seeds 3 initial financial transactions:
1. **Income**: *"Freelance Full-Stack Development"* ($1,250.00, `Software Consulting`)
2. **Expense**: *"Cloud Server Infrastructure & VPS"* ($45.50, `DevOps & Hosting`)
3. **Expense**: *"Algorithmic Financial Data Subscription"* ($120.00, `Market Data`)

---

## 🚀 3. API Endpoints Reference

The API is fully documented via interactive Swagger UI at `http://localhost:5000/api-docs`.

| Method | Endpoint | Description | Request Body | Status Code |
|--------|----------|-------------|--------------|-------------|
| `GET` | `/` | Service health check, route catalog, Swagger link | None | `200 OK` |
| `GET` | `/api-docs` | Interactive Swagger OpenAPI 3.0 documentation | None | `200 OK` |
| `GET` | `/api/transactions` | Retrieve all transactions (optional `?type=` & `?category=`) | None | `200 OK` |
| `GET` | `/api/transactions/:id` | Retrieve single transaction by ID | None | `200 OK` / `404 Not Found` |
| `POST` | `/api/transactions` | Create a new financial transaction | JSON Payload | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/transactions/:id` | Update an existing transaction by ID | JSON Payload | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/transactions/:id` | Permanently delete a transaction by ID | None | `200 OK` / `404 Not Found` |

---

## 🛡️ 4. Input Validation & Error Handling Architecture

### Strict Input Rules
Using `express-validator`, every incoming request is subjected to rigorous boundary checks:
- **`title`**: Must be a non-empty string between 2 and 150 characters. Whitespace is automatically trimmed.
- **`amount`**: Must be a positive numeric value strictly greater than 0 (`isFloat({ gt: 0 })`). Stored to 2 decimal places.
- **`type`**: Must be strictly either `'income'` or `'expense'`. Case-normalized before persistence.
- **`category`**: Must be a non-empty string between 2 and 80 characters.
- **`:id` param**: Must be a positive integer (`isInt({ min: 1 })`).

### Structured Validation Error Output (`400 Bad Request`)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "amount",
      "message": "Amount must be a positive number greater than 0",
      "value": -15.5
    },
    {
      "field": "type",
      "message": "Type must be either 'income' or 'expense'",
      "value": "crypto"
    }
  ]
}
```

### Centralized 404 & 500 Error Resiliency
- **404 Route Catch-All**: Any undefined route returns a clean JSON error with a pointer to `/api-docs`.
- **Global Error Middleware**: Unhandled exceptions are logged to console and returned as sanitized JSON:
  ```json
  {
    "success": false,
    "error": "Internal Server Error"
  }
  ```

---

## 💻 5. Local Setup & Installation

### Prerequisites
- **Node.js**: v16.x or newer (tested on Node v20/v22)
- **npm**: v8.x or newer

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Obraims/yr-novatech-rest-api.git
   cd yr-novatech-rest-api
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment (Optional)**:
   A default port of `5000` is used automatically. You can customize variables via `.env`:
   ```bash
   cp .env.example .env
   ```

4. **Start the API Server**:
   ```bash
   npm start
   ```

5. **Development Mode (Auto-Reloading)**:
   ```bash
   npm run dev
   ```

The server will boot on `http://localhost:5000`. Navigate to `http://localhost:5000/api-docs` to test endpoints interactively in your browser.

---

## 🧪 6. Sample cURL Commands

### Create a New Transaction
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "FinTech Mobile App Retainer",
    "amount": 2500.00,
    "type": "income",
    "category": "Client Work"
  }'
```

### Filter Transactions by Type
```bash
curl -X GET "http://localhost:5000/api/transactions?type=expense"
```

### Update a Transaction
```bash
curl -X PUT http://localhost:5000/api/transactions/2 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Cloud Server Infrastructure (Upgraded Dedicated VPS)",
    "amount": 89.99,
    "type": "expense",
    "category": "DevOps & Infrastructure"
  }'
```

### Delete a Transaction
```bash
curl -X DELETE http://localhost:5000/api/transactions/3
```

*For more detailed cURL examples and payload responses, refer to [`API_DOCUMENTATION.md`](API_DOCUMENTATION.md).*

---

## 📂 7. Project Directory Structure

```
yr-novatech-rest-api/
├── .env.example            # Environment configuration template
├── .gitignore              # Ignores node_modules, .env, and SQLite binaries
├── API_DOCUMENTATION.md    # Comprehensive endpoint documentation with cURL
├── database.js             # SQLite connection, table DDL, and automatic seeder
├── database.sqlite         # SQLite database file (generated at runtime)
├── package.json            # Node.js project manifest & scripts
├── README.md               # Main project overview and evaluation guide
├── server.js               # Express application, routes, validation, and error handlers
└── swagger.json            # OpenAPI 3.0 specification for Swagger UI
```

---

## 👤 8. Author & Evaluation Metadata

- **Developer**: Stephen Baraka Kakui
- **GitHub**: [@Obraims](https://github.com/Obraims)
- **Email**: [stephenbaraka9283@gmail.com](mailto:stephenbaraka9283@gmail.com)
- **Role**: Full-Stack Software Engineer & FinTech Innovator
- **Evaluation**: YR NOVATECH Task 3: REST API & Backend Development
