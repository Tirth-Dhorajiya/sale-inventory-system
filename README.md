# Sale Inventory System

Welcome to the Sale Inventory System! This project is a full-stack e-commerce application designed to demonstrate clean architecture, secure authentication, and advanced concurrency handling.

## 👥 Test Accounts

The database has been seeded with two accounts so you can test the different roles in the system.

**1. System Admin** (Can create new products)
- **Email:** `admin@example.com`
- **Password:** `password123`

**2. Regular User** (Can browse and purchase products)
- **Email:** `user@example.com`
- **Password:** `password123`

---

## 🚀 Step-by-Step Testing Flow

If you are reviewing this project, here is the exact step-by-step flow to see all features in action:

### Step 1: The Admin Experience
1. **Log in** using the Admin credentials (`admin@example.com`).
2. Notice the **+ Add Product** button automatically appears in the navigation bar. (Regular users cannot see or access this).
3. Click **+ Add Product** to access the premium Inventory Management dashboard.
4. Create a few test products (e.g., "Wireless Mouse", "Mechanical Keyboard", "Gaming Monitor"). 
5. Click **Products** in the navbar to return home. You will see your new products have instantly appeared on the storefront.

### Step 2: The User Shopping Experience
1. Click **Logout** to sign out of the Admin account.
2. **Log in** using the Regular User credentials (`user@example.com`).
3. Browse the main storefront. You can use the search bar or category dropdown to filter the items dynamically.
4. Click the **Add to Cart** button on a few items. You will see the cart indicator in the top right update instantly.

### Step 3: Managing the Cart
1. Click on **Cart** in the navigation bar.
2. Inside the cart, you can use the **+** and **-** buttons to easily adjust the quantities. 
3. *Note:* The system automatically prevents you from adding more items than the current `stockQuantity` available in the database. If you drop an item's quantity to `0`, it is seamlessly removed from your cart.

### Step 4: Secure Purchasing & Concurrency
1. In your cart, click the **Purchase All** button. 
2. **Under the hood:** The backend executes an *atomic database transaction*. It simultaneously verifies that the stock is still available and decrements the inventory in a single MongoDB operation. This completely eliminates "race conditions" if two users try to buy the last item at the exact same millisecond during high traffic.
3. You will receive a success notification, and your cart will be emptied!
4. If you navigate back to the main Products page, you will notice the available stock numbers have accurately decreased.

---

## 🛠️ Technical Highlights
- **Backend:** Node.js, Express, MongoDB (Atlas).
- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Vite.
- **Security:** Passwords are securely hashed via Mongoose pre-save hooks using bcrypt (12 salt rounds), and sessions are managed statelessly via JWTs.
- **Architecture:** Complete separation of concerns between Controllers, Routes, and Models. Centralized async error handling wraps all controllers, keeping the codebase completely free of repetitive `try/catch` blocks.
