# StreamShare — Streaming Service Rental Marketplace 🎬🎵🎮

_A Multi-User Subscription Sharing Platform with CRUD Operations_

---

## 📋 Table of Contents

- [About The Project](#about-the-project)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
- [Project Structure](#project-structure)
- [Features](#features)
- [User Roles & Permissions](#user-roles--permissions)
- [API Endpoints](#api-endpoints)
- [Validation Rules](#validation-rules)
- [Edge Cases Handled](#edge-cases-handled)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)
- [Contact](#contact)

---

## 🎯 About The Project

StreamShare is a **streaming service rental marketplace** that allows users to share subscription-based services (like Netflix, Spotify, Disney+, etc.) by renting individual seats on shared accounts. Inspired by how Netflix allows multiple profiles per account, this platform connects **sellers** (who have extra seats) with **buyers** (who want affordable access).

The system is built as a **CRUD-focused web application** using vanilla JavaScript, PHP, and Tailwind CSS — designed to be clean, presentable, and easy to understand for beginners while demonstrating solid full-stack development practices.

### Key Highlights

- ✅ Full CRUD operations for subscriptions and user management
- ✅ Multi-user account sharing (one subscription, multiple renters)
- ✅ Role-based access control (Buyer, Seller, Admin)
- ✅ Client-side and server-side validation
- ✅ AJAX-powered interactions (no page reloads for core actions)
- ✅ Responsive design with Tailwind CSS
- ✅ Session-based authentication
- ✅ Clean, modular JavaScript architecture

---

## 🛠 Built With

| Layer               | Technology                | Purpose                            |
| ------------------- | ------------------------- | ---------------------------------- |
| **Frontend**        | HTML5                     | Page structure                     |
| **Styling**         | Tailwind CSS v3           | Utility-first responsive styling   |
| **Interactivity**   | Vanilla JavaScript (ES6+) | DOM manipulation, AJAX, validation |
| **Backend**         | PHP 8.x                   | Server-side logic, API endpoints   |
| **Database**        | MySQL / MariaDB           | Data persistence                   |
| **Server**          | Apache (XAMPP)            | Local development server           |
| **Version Control** | Git                       | Source code management             |

### Why These Choices?

- **No frameworks** — Demonstrates core understanding of JavaScript, PHP, and HTTP
- **Tailwind CSS** — Rapid, consistent styling without writing custom CSS
- **Vanilla JS** — Focus on DOM API, Fetch API, and modern ES6+ patterns
- **PHP Sessions** — Simple, secure authentication without JWT complexity
- **PDO** — Secure database queries with prepared statements (SQL injection prevention)

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [XAMPP](https://www.apachefriends.org/) (or any Apache + PHP + MySQL stack)
- PHP >= 8.0
- MySQL >= 5.7 (or MariaDB >= 10.3)
- Git
- A modern web browser (Chrome, Firefox, Edge)

### Installation

#### 1. Clone the Repository

```bash
# Navigate to your XAMPP htdocs directory
cd /path/to/xampp/htdocs

# Clone the repository
git clone https://github.com/yourusername/streamshare.git

# Enter the project directory
cd streamshare
```

#### 2. Start XAMPP Services

1. Open XAMPP Control Panel
2. Start **Apache**
3. Start **MySQL**

#### 3. Configure the Project

Update the database configuration in `includes/db.php`:

```php
$host = 'localhost';
$dbname = 'streamshare';
$username = 'root';      // Default XAMPP username
$password = '';          // Default XAMPP password (empty)
$charset = 'utf8mb4';
```

> **Note:** If you changed your MySQL root password in XAMPP, update it here.

### Database Setup

#### Option A: Using phpMyAdmin (Recommended for Beginners)

1. Open your browser and go to `http://localhost/phpmyadmin`
2. Click **New** to create a database
3. Name it `streamshare` and click **Create**
4. Click on the `streamshare` database
5. Go to the **SQL** tab
6. Copy the contents of `sql/setup.sql` and paste it
7. Click **Go** to execute

#### Option B: Using MySQL Command Line

```bash
# Login to MySQL
mysql -u root -p
```

```sql
-- Create database
CREATE DATABASE streamshare CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE streamshare;

-- Run the setup script
SOURCE /path/to/xampp/htdocs/streamshare/sql/setup.sql;
```

#### Seed Data (Optional)

The `sql/setup.sql` file includes sample data:

- 3 streaming services (Netflix, Spotify, Disney+)
- 1 admin account
- 1 seller account
- 1 buyer account

Default credentials:

| Role   | Email                   | Password    |
| ------ | ----------------------- | ----------- |
| Admin  | `admin@streamshare.com` | `admin123`  |
| Seller | `seller@example.com`    | `seller123` |
| Buyer  | `buyer@example.com`     | `buyer123`  |

> ⚠️ **Warning:** Change these passwords in production!

#### 4. Access the Application

Open your browser and navigate to:

```
http://localhost/streamshare/
```

---

## 📁 Project Structure

```text
streamshare/
|-- index.php                   # Landing page / marketplace overview
|-- login.php                   # User login page
|-- register.php                # User registration page
|-- marketplace.php             # Browse all active subscription listings
|-- my-listings.php             # Seller: manage my subscription listings
|-- create-listing.php          # Seller: create a new listing
|-- edit-listing.php            # Seller: edit an existing listing
|-- my-rentals.php              # Buyer: view my rented seats
|-- admin-dashboard.php         # Admin: platform overview & statistics
|-- .htaccess                   # Apache URL rewriting rules
|-- README.md                   # This file
|-- .gitignore                  # Git ignore rules
|
|-- includes/                   # Shared PHP components
|   |-- db.php                  # Database connection (PDO)
|   |-- header.php              # Shared HTML head & navbar
|   |-- footer.php              # Shared footer & script tags
|   |-- auth.php                # Session authentication helpers
|   |-- functions.php           # Reusable PHP utility functions
|   |-- response.php            # Standardized JSON response helper
|   |-- validators.php          # Server-side validation functions
|
|-- api/                        # AJAX API endpoints (PHP)
|   |-- auth-login.php          # POST: authenticate user
|   |-- auth-register.php       # POST: create new user
|   |-- auth-logout.php         # POST: destroy session
|   |-- auth-check.php          # GET: check current session
|   |-- get-listings.php        # GET: all active listings
|   |-- get-my-listings.php     # GET: seller's own listings
|   |-- get-listing-detail.php  # GET: single listing details
|   |-- create-listing.php      # POST: create new listing
|   |-- update-listing.php      # POST: update listing
|   |-- delete-listing.php      # POST: soft-delete listing
|   |-- rent-seat.php           # POST: rent a seat
|   |-- cancel-rental.php       # POST: cancel a rental
|   |-- get-my-rentals.php      # GET: buyer's rentals
|   |-- toggle-payment.php      # POST: mock payment toggle
|   |-- search-listings.php     # GET: search & filter listings
|
|-- assets/                     # Static assets
|   |-- css/
|   |   |-- custom.css          # Tailwind overrides & custom styles
|   |-- js/
|   |   |-- main.js             # Shared: navbar, auth state, logout
|   |   |-- auth.js             # Login & register form handling
|   |   |-- marketplace.js      # Browse listings, search, rent
|   |   |-- listings.js         # Seller: CRUD operations
|   |   |-- rentals.js          # Buyer: view & cancel rentals
|   |   |-- validation.js       # Shared client-side validation engine
|   |   |-- ui.js               # Reusable UI components (toast, modal, spinner)
|   |   |-- utils.js            # Utility functions (debounce, formatters)
|   |-- images/
|   |   |-- services/           # Streaming service logos
|   |   |-- placeholders/       # Placeholder images
|
|-- sql/                        # Database files
|   |-- setup.sql               # Complete database schema + seed data
|
|-- docs/                       # Documentation (optional)
|   |-- ERD.png                 # Entity Relationship Diagram
|   |-- wireframes/             # UI wireframe images
```

---

## ✨ Features

### Authentication & Authorization

- [x] User registration with validation
- [x] Secure login with PHP sessions
- [x] Role-based access control (Buyer, Seller, Admin)
- [x] Session timeout handling
- [x] Logout functionality

### Marketplace (Browse)

- [x] View all active subscription listings
- [x] Search listings by service name or title
- [x] Filter by price range
- [x] View listing details (price, available seats, seller info)
- [x] Responsive card-based layout

### Seller Features (CRUD)

- [x] **Create** new subscription listings
- [x] **Read** my listings with status overview
- [x] **Update** existing listings (price, seats, status)
- [x] **Delete** listings (soft delete — inactive status)
- [x] View seat occupancy per listing

### Buyer Features

- [x] Rent a seat on available subscriptions
- [x] View my active rentals
- [x] Cancel rentals (seat becomes available again)
- [x] Mock payment system (toggle payment status)
- [x] Seat number assignment (1, 2, 3, 4...)

### Admin Dashboard

- [x] View total users, listings, and rentals
- [x] View all platform activity
- [x] User management overview

### UI/UX

- [x] Responsive design (mobile, tablet, desktop)
- [x] Loading spinners on AJAX requests
- [x] Toast notifications for success/error feedback
- [x] Modal confirmations for destructive actions
- [x] Real-time form validation
- [x] Empty states with friendly messaging
- [x] Clean, modern card-based interface

---

## 👤 User Roles & Permissions

| Feature                | Guest | Buyer | Seller | Admin |
| ---------------------- | ----- | ----- | ------ | ----- |
| View marketplace       | ✅    | ✅    | ✅     | ✅    |
| Search listings        | ✅    | ✅    | ✅     | ✅    |
| Rent a seat            | ❌    | ✅    | ✅     | ✅    |
| View my rentals        | ❌    | ✅    | ✅     | ✅    |
| Create listings        | ❌    | ❌    | ✅     | ✅    |
| Manage my listings     | ❌    | ❌    | ✅     | ✅    |
| Cancel my rental       | ❌    | ✅    | ✅     | ✅    |
| Access admin dashboard | ❌    | ❌    | ❌     | ✅    |
| View all users/data    | ❌    | ❌    | ❌     | ✅    |

### Role Details

- **Guest** — Can browse the marketplace but cannot rent seats
- **Buyer** — Can rent seats and manage their rentals
- **Seller** — Can create and manage listings; can also rent seats as a buyer
- **Admin** — Full access to all data and platform statistics

---

## 🔌 API Endpoints

All API endpoints return JSON in this format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Authentication

| Endpoint                 | Method | Auth | Description                       |
| ------------------------ | ------ | ---- | --------------------------------- |
| `/api/auth-login.php`    | `POST` | No   | Authenticate user, create session |
| `/api/auth-register.php` | `POST` | No   | Register new user                 |
| `/api/auth-logout.php`   | `POST` | Yes  | Destroy session                   |
| `/api/auth-check.php`    | `GET`  | Yes  | Check current auth state          |

### Listings (Marketplace)

| Endpoint                      | Method | Auth   | Description                |
| ----------------------------- | ------ | ------ | -------------------------- |
| `/api/get-listings.php`       | `GET`  | No     | Get all active listings    |
| `/api/get-listing-detail.php` | `GET`  | No     | Get single listing details |
| `/api/search-listings.php`    | `GET`  | No     | Search listings by query   |
| `/api/get-my-listings.php`    | `GET`  | Seller | Get seller's listings      |
| `/api/create-listing.php`     | `POST` | Seller | Create new listing         |
| `/api/update-listing.php`     | `POST` | Seller | Update own listing         |
| `/api/delete-listing.php`     | `POST` | Seller | Soft-delete listing        |

### Rentals

| Endpoint                  | Method | Auth  | Description                  |
| ------------------------- | ------ | ----- | ---------------------------- |
| `/api/rent-seat.php`      | `POST` | Buyer | Rent a seat on a listing     |
| `/api/cancel-rental.php`  | `POST` | Buyer | Cancel a rental              |
| `/api/get-my-rentals.php` | `GET`  | Buyer | Get buyer's rentals          |
| `/api/toggle-payment.php` | `POST` | Buyer | Toggle payment status (mock) |

---

## 🛡 Validation Rules

### Client-Side (JavaScript) + Server-Side (PHP)

All forms validate on **both** client and server. Never trust client input.

### Registration Form

| Field            | Rules                                     | Error Message                                             |
| ---------------- | ----------------------------------------- | --------------------------------------------------------- |
| Full Name        | Required, 2–50 chars, letters/spaces only | "Please enter a valid name"                               |
| Email            | Required, valid email format, unique      | "Please enter a valid email" / "Email already registered" |
| Password         | Required, min 8 characters                | "Password must be at least 8 characters"                  |
| Confirm Password | Must match password                       | "Passwords do not match"                                  |
| Role             | Required, one of: `buyer`, `seller`       | "Please select a role"                                    |

### Login Form

| Field    | Rules                  | Error Message                |
| -------- | ---------------------- | ---------------------------- |
| Email    | Required, valid format | "Please enter your email"    |
| Password | Required               | "Please enter your password" |

### Create Listing Form

| Field       | Rules                      | Error Message                    |
| ----------- | -------------------------- | -------------------------------- |
| Title       | Required, 5–100 characters | "Title must be 5–100 characters" |
| Service     | Required, valid service ID | "Please select a service"        |
| Seat Price  | Required, number > 0       | "Price must be greater than 0"   |
| Total Seats | Required, integer, 1–10    | "Seats must be between 1 and 10" |

### Rent Seat

| Check               | Handling                 |
| ------------------- | ------------------------ |
| Available seats > 0 | Block if sold out        |
| Not already rented  | Block duplicate rentals  |
| User is logged in   | Redirect to login if not |

---

## 🧩 Edge Cases Handled

| Scenario                                                         | Solution                                                               |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Race Condition** — Two users click "Rent" for the last seat    | PHP checks `available_seats > 0` in a single query before decrementing |
| **Duplicate Rental** — Buyer tries to rent same listing twice    | Check `subscription_users` table before allowing                       |
| **Soft Delete** — Seller deletes listing with active renters     | Set `status = 'inactive'` only; renters keep access                    |
| **Session Expiry** — User's session expires during AJAX call     | Return 401, JS redirects to login with message                         |
| **Negative Price** — Seller enters negative seat price           | JS + PHP validation blocks negative values                             |
| **Zero Seats** — Seller tries to create listing with 0 seats     | Minimum 1 seat enforced on both sides                                  |
| **Unauthorized Access** — Non-seller tries to access seller page | PHP redirects to marketplace                                           |
| **SQL Injection**                                                | All queries use PDO prepared statements                                |
| **XSS**                                                          | All output escaped with `htmlspecialchars()`                           |
| **CSRF**                                                         | Token validation on state-changing operations                          |

---

## 📸 Screenshots

> _Screenshots will be added as the project develops._

| Page            | Description                            |
| --------------- | -------------------------------------- |
| Landing Page    | Hero section with featured listings    |
| Marketplace     | Grid of subscription cards with search |
| Login           | Clean login form with validation       |
| Register        | Registration with role selection       |
| My Listings     | Seller dashboard with CRUD actions     |
| Create Listing  | Form to add new subscription           |
| My Rentals      | Buyer view of rented seats             |
| Admin Dashboard | Platform statistics overview           |

---

## 🗺 Roadmap

- [x] Project planning & database design
- [x] README & repository setup
- [ ] Database setup (SQL schema)
- [ ] Shared PHP includes (db, header, footer, auth)
- [ ] Authentication system (login, register, logout)
- [ ] Marketplace page (browse listings)
- [ ] Seller CRUD (create, read, update, delete listings)
- [ ] Buyer rental system (rent, cancel, view)
- [ ] Admin dashboard
- [ ] JavaScript validation engine
- [ ] UI components (toast, modal, spinner)
- [ ] Search & filter functionality
- [ ] Responsive design polish
- [ ] Testing & bug fixes
- [ ] Final documentation

### Future Enhancements (Post-Submission)

- [ ] Real payment integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Rating & review system
- [ ] Subscription renewal reminders
- [ ] Dark mode toggle
- [ ] Progressive Web App (PWA)

---

## 🤝 Contributing

This is a student project, but contributions and suggestions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) — For making styling enjoyable
- [XAMPP](https://www.apachefriends.org/) — For the local development environment
- [Font Awesome](https://fontawesome.com/) — For icons (planned)
- Netflix, Spotify, Disney+ — For the inspiration behind shared subscriptions
- My instructor — For guidance and project requirements

---

## 📞 Contact

Your Name — [your-email@example.com](mailto:your-email@example.com)

Project Link: [https://github.com/yourusername/streamshare](https://github.com/yourusername/streamshare)

---

<p align="center">Built with intention for learning full-stack web development</p>
