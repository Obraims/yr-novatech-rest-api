# Financial Transaction & Expense Tracker REST API — Endpoint Documentation

**Project**: YR NOVATECH Task 3: REST API & Backend Development  
**Base URL**: `http://localhost:5000`  
**Interactive Swagger UI**: `http://localhost:5000/api-docs`  
**Content-Type**: `application/json`

---

## 📑 Summary of Endpoints

| HTTP Method | Route | Description | Success Code |
|-------------|-------|-------------|--------------|
| `GET` | `/` | API Health Check, service metadata & routes overview | `200 OK` |
| `GET` | `/api-docs` | Interactive Swagger UI API documentation | `200 OK` |
| `GET` | `/api/transactions` | Retrieve all transactions (optional `?type=` & `?category=`) | `200 OK` |
| `GET` | `/api/transactions/:id` | Retrieve single transaction by ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/transactions` | Create a new transaction with input validation | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/transactions/:id` | Update an existing transaction with input validation | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/transactions/:id` | Delete an existing transaction by ID | `200 OK` / `404 Not Found` |

---

## 1. Health Check & API Welcome

### Request
```bash
curl -X GET http://localhost:5000/
```

### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Welcome to the Financial Transaction & Expense Tracker REST API",
  "version": "1.0.0",
  "documentation": "/api-docs",
  "timestamp": "2026-10-19T16:15:00.000Z",
  "endpoints": {
    "healthCheck": "GET /",
    "swaggerDocs": "GET /api-docs",
    "getAllTransactions": "GET /api/transactions",
    "getTransactionsFiltered": "GET /api/transactions?type={income|expense}&category={name}",
    "getTransactionById": "GET /api/transactions/:id",
    "createTransaction": "POST /api/transactions",
    "updateTransaction": "PUT /api/transactions/:id",
    "deleteTransaction": "DELETE /api/transactions/:id"
  }
}
```

---

## 2. Get All Transactions (With Optional Filtering)

### Request: Retrieve All
```bash
curl -X GET http://localhost:5000/api/transactions
```

### Response (`200 OK`)
```json
{
  "success": true,
  "count": 3,
  "filtersApplied": {
    "type": null,
    "category": null
  },
  "data": [
    {
      "id": 1,
      "title": "Freelance Full-Stack Development",
      "amount": 1250.00,
      "type": "income",
      "category": "Software Consulting",
      "created_at": "2026-10-17 16:10:00"
    },
    {
      "id": 2,
      "title": "Cloud Server Infrastructure & VPS",
      "amount": 45.50,
      "type": "expense",
      "category": "DevOps & Hosting",
      "created_at": "2026-10-18 16:10:00"
    },
    {
      "id": 3,
      "title": "Algorithmic Financial Data Subscription",
      "amount": 120.00,
      "type": "expense",
      "category": "Market Data",
      "created_at": "2026-10-19 16:10:00"
    }
  ]
}
```

### Request: Filter by Type
```bash
curl -X GET "http://localhost:5000/api/transactions?type=expense"
```

### Request: Filter by Category
```bash
curl -X GET "http://localhost:5000/api/transactions?category=Hosting"
```

---

## 3. Get Single Transaction by ID

### Request: Existing ID
```bash
curl -X GET http://localhost:5000/api/transactions/1
```

### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Freelance Full-Stack Development",
    "amount": 1250.00,
    "type": "income",
    "category": "Software Consulting",
    "created_at": "2026-10-17 16:10:00"
  }
}
```

### Request: Non-Existent ID
```bash
curl -X GET http://localhost:5000/api/transactions/999
```

### Response (`404 Not Found`)
```json
{
  "success": false,
  "error": "Transaction with ID 999 not found"
}
```

---

## 4. Create New Transaction (POST)

### Request: Valid Payload
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

### Response (`201 Created`)
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "id": 4,
    "title": "FinTech Mobile App Retainer",
    "amount": 2500.00,
    "type": "income",
    "category": "Client Work",
    "created_at": "2026-10-19 16:15:30"
  }
}
```

### Request: Invalid Payload (Validation Error Test)
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "",
    "amount": -50.00,
    "type": "investment",
    "category": ""
  }'
```

### Response (`400 Bad Request`)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required and cannot be empty",
      "value": ""
    },
    {
      "field": "amount",
      "message": "Amount must be a positive number greater than 0",
      "value": -50.00
    },
    {
      "field": "type",
      "message": "Type must be either 'income' or 'expense'",
      "value": "investment"
    },
    {
      "field": "category",
      "message": "Category is required and cannot be empty",
      "value": ""
    }
  ]
}
```

---

## 5. Update Existing Transaction (PUT)

### Request: Valid Update
```bash
curl -X PUT http://localhost:5000/api/transactions/2 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Cloud Server Infrastructure (Upgraded 8-Core Dedicated)",
    "amount": 89.99,
    "type": "expense",
    "category": "DevOps & Infrastructure"
  }'
```

### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Transaction updated successfully",
  "data": {
    "id": 2,
    "title": "Cloud Server Infrastructure (Upgraded 8-Core Dedicated)",
    "amount": 89.99,
    "type": "expense",
    "category": "DevOps & Infrastructure",
    "created_at": "2026-10-18 16:10:00"
  }
}
```

---

## 6. Delete Transaction (DELETE)

### Request: Delete by ID
```bash
curl -X DELETE http://localhost:5000/api/transactions/3
```

### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Transaction with ID 3 deleted successfully",
  "deletedId": 3,
  "deletedRecord": {
    "id": 3,
    "title": "Algorithmic Financial Data Subscription",
    "amount": 120.00,
    "type": "expense",
    "category": "Market Data",
    "created_at": "2026-10-19 16:10:00"
  }
}
```

### Request: Delete Non-Existent ID
```bash
curl -X DELETE http://localhost:5000/api/transactions/999
```

### Response (`404 Not Found`)
```json
{
  "success": false,
  "error": "Transaction with ID 999 not found"
}
```

---

## 7. Global 404 Route Catch-All

### Request: Undefined Route
```bash
curl -X GET http://localhost:5000/api/unknown-endpoint
```

### Response (`404 Not Found`)
```json
{
  "success": false,
  "error": "Route GET /api/unknown-endpoint not found",
  "documentation": "/api-docs"
}
```
