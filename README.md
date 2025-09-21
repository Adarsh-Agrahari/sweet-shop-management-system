## 🍬 Sweet Shop Management System

A full-stack web application for managing a sweet shop. Customers can browse and order sweets, while admins can manage inventory, orders, and users.

Frontend : https://sweet-shop-management-system-fe.vercel.app/

Backend : https://sweet-shop-management-system-be.vercel.app/

---
### ✨ Features

##### 👩‍🍳 For Customers

- Register & Login (JWT-based authentication)
- Browse available sweets with categories & stock
- Place orders (stock is validated in real-time)
- View order history with status updates

##### 🛠️ For Admins

- Manage sweets (CRUD operations with stock & pricing)
- View and update all customer orders
- Track order statuses (Pending, Confirmed, Cancelled)
- Role-based access (admins vs normal users)

##### 📦 System Features

- State management via Zustand
- Validation & error handling on both client & server
- Fully type-safe with TypeScript
- Clean UI with Tailwind CSS
- Persistent login with JWT tokens
- Database schema managed via Prisma ORM
- Automated linting & Git hooks with Husky
- Tested with Jest & Supertest

---
### 🏗️ Tech Stack

##### Backend

- Express.js (TypeScript)
- PostgreSQL (Database)
- Prisma ORM
- JWT for authentication
- Zod for input validation

##### Frontend

- React (Vite + TypeScript)
- Zustand for state management
- React Router for navigation
- Tailwind CSS for styling

##### DevOps & Tooling

- Docker (containerization)
- Husky + Lint-Staged (pre-commit checks)
- ESLint + Prettier (code quality)
- Jest + React Testing Library (testing)

---
### 📸 Screenshots

##### Customer Dashboard

##### Admin Order Management

---
### 🚀 Getting Started

##### 1️⃣ Clone the Repo

```terminal
git clone https://github.com/Adarsh-Agrahari/sweet-shop-management-system
cd sweet-shop-management-system
```

##### 2️⃣ Setup Backend

```terminal
cd backend
cp .env.example .env # update DATABASE_URL & JWT_SECRET
npm install
npx prisma migrate dev
npm run dev
```

Backend runs at: http://localhost:3000

##### 3️⃣ Setup Frontend

cd frontend

```terminal
npm install
npm run dev
```


Frontend runs at: http://localhost:5173

##### 🔑 Environment Variables

###### Backend .env:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/sweetshop"
JWT_SECRET="supersecretkey"
```

###### Frontend .env:

```env
VITE_API_URL="http://localhost:4000/api"
```

##### 🧪 Testing

###### Run backend tests

```terminal
>>> cd backend
>>> npm test
```

###### Run frontend tests

```terminal
cd frontend
npm test
```

##### 📦 Deployment

- Backend and Frontend can be deployed on Vercel or Netlify.

---
### 📌 Milestones Completed

- ✅ Project setup (Express + React + TypeScript + Husky)
- ✅ User authentication (JWT, login, register)
- ✅ Sweet management (CRUD, stock tracking)
- ✅ Order system (place, list, update status)
- ✅ Admin dashboard (manage sweets & orders)
- ✅ Role-based access (admin vs user)
- ✅ Stock updates on order placement
- ✅ UI/UX enhancements (tables, toasts, loaders)
- ✅ Validation & error handling
- ✅ Testing & deployment

### 👨‍💻 Author

Developed by [Adarsh Agrahari](https://github.com/Adarsh-Agrahari)