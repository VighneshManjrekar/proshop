# ProShop E-commerce Platform

proshop is a full-stack MERN (MongoDB, Express.js, React, Node.js) application with Redux Toolkit for state management. The platform allows users to buy and sell products, integrating PayPal for seamless transactions. It includes an admin dashboard for managing products, users, and orders.

## Features

### Admin

- **Manage Products:**
  - View, edit, add, and delete products.
- **Manage Users:**
  - Edit user information.
- **Order Processing:**
  - View and process orders.
  - Mark orders as delivered.

### User

- **Authentication:**
  - User authentication using JSON Web Tokens (JWT).
- **Shopping:**
  - Browse and buy products.
  - Pay securely using PayPal integration.
- **Account Management:**
  - View and update own information.
- **Order History:**
  - View a list of past orders.

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/VighneshManjrekar/proshop
   cd proshop
   ```

2. **Install dependencies:**

   ```bash
   # Install client dependencies
   npm install --prefix frontend

   # Install server dependencies
   npm install
   ```

3. **Set up environment variables:**
   Rename a `example.env` file and add the necessary variables.

4. **Run the application:**

   ```bash
   # Run the server
   npm run dev
   ```

5. Open your browser and go to [http://localhost:5173](http://localhost:5173) to access ProShop.

## Database seed

To import default data to you database use followin commands

```bash
# delete data
npm run data:destroy

# import data
npm run data:import
```
