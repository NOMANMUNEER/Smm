# SMM Panel Application

A premium, scalable MERN-stack Social Media Marketing (SMM) Panel built with Next.js 16 (App Router). 

## 🚀 Tech Stack

- **Frontend:** Next.js 16 (React 19), Custom CSS Modules (Premium Dark Mode UI)
- **Backend:** Next.js Route Handlers (API)
- **Database:** MongoDB (via Mongoose)
- **Authentication:** Custom JWT-based authentication
- **Rich Text:** React-Quill (for Admin Service descriptions)

## 📦 Project Structure

```text
src/
├── app/
│   ├── (auth)/               # Login & Signup pages
│   ├── (user)/               # Protected user routes (New Order, My Orders)
│   ├── (admin)/              # Protected admin routes (Manage Services, All Orders)
│   ├── api/                  # Backend API Route Handlers
│   ├── globals.css           # Global design system & CSS variables
│   ├── layout.js             # Root layout with shared metadata
│   └── page.js               # Public Landing Page
├── components/
│   ├── shared/               # Navbar, MobileSidebar
│   └── ui/                   # Reusable components (Button, Input, Select)
├── lib/                      # Utilities (dbConnect.js, auth.js)
└── models/                   # Mongoose Schemas (User, Category, Service, Order)
```

## 🛠️ Setup & Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/smm-panel
   JWT_SECRET=your_super_secret_jwt_key
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   *The app will run on `http://localhost:3000`*

## 🧑‍💻 User Roles & Access

By default, newly signed up users get the `user` role.
To grant **Admin Access**, you must manually update a user's role in the MongoDB database:
```json
{
  "_id": ObjectId("..."),
  "userName": "admin",
  "role": "admin"
}
```

## ✨ Key Features
- **JWT Authentication:** Secure role-based routing and API protection.
- **Dynamic Services:** Categories and Services loaded via AJAX from the database.
- **Custom Comment Processing:** Dynamic frontend forms tailored to the type of service selected.
- **Admin Dashboard:** Complete CRUD capabilities for Categories and Services. Features a Rich Text editor for rules formatting.
- **Wallet System:** Dedicated user balance tracking and deduction per order.

---
*For in-depth architectural details and modification instructions, refer to `DEVELOPER_GUIDE.md`.*
