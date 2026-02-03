# 💰 Spendy — Finance Tracker API

![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-Educational-blue?style=flat)
![Deployment](https://img.shields.io/badge/Deployed-Render-46E3B7?style=flat&logo=render&logoColor=white)

REST API for tracking personal income and expenses with categorization, monthly reports, and secure user authentication.

---

## 🚀 Live Demo

- **API Base URL:**
  https://spendy-expense-tracker-api.onrender.com

- **Swagger Documentation:**
  https://spendy-expense-tracker-api.onrender.com/api-docs

> ⚠️ The project is deployed on Render free tier.
> Cold start delays may occur after inactivity.

---

## 📖 About the Project

**Spendy** is a finance tracking API that allows users to:

- Register and authenticate securely
- Manage income and expense transactions
- Organize transactions by predefined categories
- **Automatic balance calculation** — balance updates automatically on every transaction
- **Balance validation** — prevents negative balance (insufficient funds protection)
- Generate monthly financial summaries
- Track spending patterns by category and period

The API is designed for browser-based clients and follows modern backend best practices.

---

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB**
- **JWT (JSON Web Tokens)**
- **Joi** — request validation
- **Swagger / OpenAPI 3.0** — API documentation
- **Render** — deployment

---

## 🔐 Authentication

The API uses **JWT-based authentication with HttpOnly cookies**.

After successful registration or login, the server sets the following cookies:

- **accessToken** — used for authenticating protected requests
- **refreshToken** — used to refresh the session
- **sessionId** — session identifier

All authentication cookies are configured with:

- `HttpOnly: true`
- `Secure: true`

This approach protects tokens from XSS attacks and eliminates the need to manually attach tokens to request headers.

### ✅ How authentication works

- Cookies are sent automatically with every request
- Protected endpoints are accessible only to authenticated users
- Authorization middleware validates the session on each request

---

## 🧪 Authentication in Postman & Swagger

When testing the API using **Postman** or **Swagger UI**:

- Cookies are stored automatically after login
- No `Authorization: Bearer` header is required
- Protected endpoints work out of the box after authentication
- To test unauthorized access, clear cookies or start a new session

---

## 📋 Available Endpoints

### Authentication

- `POST /auth/register` — Register a new user
- `POST /auth/login` — Login and start a session
- `POST /auth/logout` — Logout user
- `POST /auth/refresh` — Refresh authentication session

### User

- `GET /users/current` — Get current authenticated user

### Categories

- `GET /categories` — Get income and expense categories

### Transactions

- `POST /transactions` — Create a transaction (requires `categoryId`)
- `GET /transactions` — Get all user transactions
- `PATCH /transactions/:id` — Update transaction (requires `categoryId`)
- `DELETE /transactions/:id` — Delete transaction

> **Note:** Balance is automatically recalculated after every transaction operation.
> Transactions with insufficient funds will be rejected with a 400 error.

### Reports

- `GET /summary/:period` — Monthly financial summary
  **Format:** `YYYY-MM`

---

## 📊 Categories

### Income

- `Incomes`

### Expenses

- Main expenses
- Products
- Car
- Self care
- Child care
- Household products
- Education
- Leisure
- Other expenses
- Entertainment

---

## 💡 Quick Usage Example

### Register

```bash
curl -X POST https://spendy-expense-tracker-api.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"SecurePass123"}'
```

### Login

```bash
curl -X POST https://spendy-expense-tracker-api.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123"}'
```

> After login, authentication cookies are set automatically.

### Get current user

```bash
curl -X GET https://spendy-expense-tracker-api.onrender.com/users/current
```

---

## ⚠️ Error Handling

The API uses centralized error handling and returns standard HTTP status codes:

| Code | Description                            |
| ---: | -------------------------------------- |
|  200 | Success                                |
|  201 | Resource created                       |
|  204 | Success with no content (e.g., delete) |
|  400 | Validation error or insufficient funds |
|  401 | Unauthorized                           |
|  403 | Forbidden                              |
|  404 | Not found                              |
|  409 | Conflict (e.g. email already exists)   |
|  500 | Internal server error                  |

---

## 🧩 Architecture Highlights

- Modular Express structure
- Centralized error handling
- Request validation via Joi
- Cookie-based authentication
- **Automatic balance management** — real-time balance updates
- **Balance validation** — prevents negative balance
- Role-safe access to protected resources
- Fully documented API with Swagger
- All error messages in English

---

## 📄 License

This project was created for educational purposes.

## 👥 Team

Developed by a team of developers as part of an educational project.
Backend implementation follows production-oriented architectural principles.

👩‍💻 **Olena Akatieva** - Team Lead, Fullstack Developer ([LinkedIn](https://www.linkedin.com/in/olenaakatieva/)) <br>
👨‍💻 **Denis Shulga** - Scrum Master, Fullstack Developer ([LinkedIn](https://www.linkedin.com/in/denis-shullga/)) <br>
👨‍💻 **Roman Kniazhyk** - Fullstack Developer ([LinkedIn](https://www.linkedin.com/in/roman-kniazhyk/)) <br>
👩‍💻 **Faina Kusiaka** - Fullstack Developer ([LinkedIn](https://www.linkedin.com/in/faina-kusiaka-88008838b/)) <br>
👨‍💻 **Anton Shuvalov** - Fullstack Developer ([LinkedIn](https://www.linkedin.com/in/anton-shuvalov38/)) <br>
👩‍💻 **Anastasiia Mamatova** - Fullstack Developer ([LinkedIn](https://www.linkedin.com/in/anastasiia-mamatova/)) <br>
👨‍💻 **Artem Ivanichenko** - Fullstack Developer ([LinkedIn](https://www.linkedin.com/in/artem-ivanichenko/)) <br>
👨‍💻 **Dmytro Kravchenko** - Fullstack Developer ([LinkedIn](https://www.linkedin.com/in/dima-k-bb9386119/))

---

## ⭐ Final Note

This API is designed to be easily integrated with frontend applications and serves as a solid foundation for a full-featured finance tracking system.
