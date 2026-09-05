# SubShare

## Digital Subscription Sharing Platform

SubShare is a web-based **Digital Subscription Sharing Platform** developed as a BCA academic project. Sellers create subscription slot listings, buyers browse and purchase available slots, and an administrator monitors users, subscriptions, and purchases.

Built with **PHP, MySQL, HTML, Tailwind CSS, and Vanilla JavaScript** — no frameworks, Composer, or npm required.

> **Note:** SubShare models generic subscription slots for academic demonstration (e.g. StreamFlix, MusicBox, MovieHub). It does not store, distribute, or manage real third-party service credentials.

---

## Features

### Buyer

- Register, login, and browse the public marketplace
- Purchase available subscription slots
- View purchase history with active/expired status

### Seller

- Create, edit, and delete own subscription listings
- View listings and slot availability from a seller dashboard

### Admin

- Monitor users, subscriptions, and purchases
- View platform statistics (users, listings, active purchases)

Purchase handling uses a **database transaction with row locking** (`FOR UPDATE`) so slot counts stay consistent, and purchases are automatically marked **expired** once their expiry date passes.

---

## Technology Stack

| Technology          | Purpose                       |
| ------------------- | ----------------------------- |
| PHP                 | Server-side logic             |
| MySQL + phpMyAdmin  | Database                      |
| HTML / Tailwind CSS | Structure & styling (via CDN) |
| Vanilla JavaScript  | Client-side interaction       |
| AJAX / Fetch API    | Purchase requests             |
| Apache / XAMPP      | Local server environment      |

---

## Quick Start

**Requirements:** XAMPP (Apache + MySQL)

1. **Start XAMPP** — enable Apache and MySQL.
2. **Create the database** — open `http://localhost/phpmyadmin/`, create a database named `subshare`, and import `database/subshare.sql`.
3. **Place the project** — copy the folder to `C:\xampp\htdocs\subshare`.
4. **Check the connection** — `includes/db.php` should match the XAMPP defaults: host `localhost`, user `root`, empty password, database `subshare`.
5. **Run it** — open `http://localhost/subshare/`.
6. **Create test accounts** — register one **Buyer** and one **Seller** via the Register page. Admin accounts are created manually (see below).

### Initial Admin Account (local development)

```
Email:    admin@subshare.com
Password: admin123
```

Admin registration is disabled on the public form — change these credentials before deploying anywhere beyond localhost.

---

## Project Structure

Current project structure:

```text
subshare/
│
├── index.php
├── login.php
├── register.php
├── logout.php
├── README.md
│
├── actions/
│   ├── register_action.php
│   ├── login_action.php
│   ├── create_listing_action.php
│   ├── edit_listing_action.php
│   └── delete_listing_action.php
│
├── includes/
│   ├── db.php
│   ├── header.php
│   ├── footer.php
│   └── auth.php
│
├── buyer/
│   ├── dashboard.php
│   ├── view_listing.php
│   └── purchases.php
│
├── seller/
│   ├── dashboard.php
│   ├── create_listing.php
│   ├── my_listings.php
│   └── edit_listing.php
│
├── admin/
│   ├── dashboard.php
│   ├── users.php
│   ├── subscriptions.php
│   └── purchases.php
│
├── ajax/
│   └── purchase.php
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
└── database/
    └── subshare.sql
```

---

## Main URLs

| Page             | URL                                              |
| ---------------- | ------------------------------------------------ |
| Home             | `http://localhost/subshare/`                     |
| Login            | `http://localhost/subshare/login.php`            |
| Register         | `http://localhost/subshare/register.php`         |
| Buyer Dashboard  | `http://localhost/subshare/buyer/dashboard.php`  |
| Seller Dashboard | `http://localhost/subshare/seller/dashboard.php` |
| Admin Dashboard  | `http://localhost/subshare/admin/dashboard.php`  |

---

## How It Works

```
Seller creates listing → Listing appears on Marketplace
        ↓
Buyer views subscription → Purchases slot
        ↓
Transaction: purchase recorded + available slots decrease
        ↓
Buyer tracks purchase in My Purchases (Active → Expired)
        ↓
Admin monitors everything from the Admin Dashboard
```

- The marketplace is **public**; purchasing requires a **buyer** account.
- Roles are enforced server-side via `require_role()` in `includes/auth.php`.
- A seller cannot purchase slots; only buyers can.

---

## Database

Three tables in the `subshare` database:

| Table           | Purpose                                                     |
| --------------- | ----------------------------------------------------------- |
| `users`         | Accounts with `buyer`, `seller`, or `admin` roles           |
| `subscriptions` | Seller listings (service, plan, price, slots, duration)     |
| `purchases`     | Buyer purchases with purchase date, expiry date, and status |

Relationships: one seller → many subscriptions, one buyer → many purchases, one subscription → many purchases. Full schema is in `docs/DOCUMENTATION.md`.

---

## Security

- Passwords hashed with `password_hash()` / verified with `password_verify()`
- Prepared statements on all queries using user input
- `session_regenerate_id(true)` after login
- Server-side role-based access control
- Output escaped with `htmlspecialchars()`
- Purchase flow wrapped in a transaction with row-level locking

---

## Project Status

**Core version: complete.** Authentication, buyer/seller/admin workflows, listings, slot purchasing, expiry, and access control are all implemented.

Next phase:

```
Functional Testing → Edge Case Testing → Security Review → UI Refinement → Final Submission
```

See the full testing roadmap and scope limitations in `docs/DOCUMENTATION.md`.

---

## Academic Project

| Field           | Details              |
| --------------- | -------------------- |
| **Project**     | SubShare             |
| **Type**        | BCA Academic Project |
| **Platform**    | Web Application      |
| **Environment** | XAMPP (localhost)    |
| **Database**    | MySQL                |
