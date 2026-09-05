# SubShare

## Digital Subscription Sharing Platform

SubShare is a simple web-based **Digital Subscription Sharing Platform** developed as a BCA academic project.

The platform allows users to participate as buyers or sellers. Sellers can create subscription slot listings, while buyers can browse available listings and purchase available slots. An administrator can monitor users, subscriptions, and purchases.

The project is designed as a lightweight local web application using PHP, MySQL, HTML, Tailwind CSS, and Vanilla JavaScript.

---

# 1. Project Overview

SubShare provides a simple marketplace where sellers can list available subscription slots and buyers can purchase those slots.

The main purpose of the system is to provide a structured platform for managing:

- User registration and authentication
- Buyer and seller roles
- Subscription listings
- Available subscription slots
- Subscription purchases
- Purchase expiry
- Administrative monitoring

The application is designed for academic demonstration and local deployment using XAMPP.

> **Important:** SubShare models generic subscription slots for academic purposes. It does not store, distribute, or manage real third-party service passwords or credentials.

Example services used during testing can include:

- StreamFlix
- MusicBox
- MovieHub

These names are only examples for the academic application.

---

# Quick Start

## 1. Start XAMPP

Open XAMPP Control Panel and start:

- Apache
- MySQL

## 2. Set Up the Database

Open phpMyAdmin:

```text
http://localhost/phpmyadmin/
```

Create a database named:

```text
subshare
```

Import:

```text
database/subshare.sql
```

## 3. Place the Project

Copy the project folder into:

```text
C:\xampp\htdocs\subshare
```

## 4. Check Database Connection

Open:

```text
includes/db.php
```

The default XAMPP configuration should be:

```text
Host: localhost
Username: root
Password:
Database: subshare
```

## 5. Open SubShare

Visit:

```text
http://localhost/subshare/
```

## 6. Create Test Accounts

Use the **Register** page to create:

- A Buyer account
- A Seller account

The initial Admin account is created separately and is not available through public registration.

## 7. Test the Main Workflow

```text
Seller
  ↓
Create Subscription Listing
  ↓
Buyer
  ↓
Browse Marketplace
  ↓
View Subscription
  ↓
Purchase Slot
  ↓
My Purchases
```

Then log in as Admin to review:

```text
Admin Dashboard
  ├── Users
  ├── Subscriptions
  └── Purchases
```

## Quick URLs

```text
Home:
http://localhost/subshare/

Login:
http://localhost/subshare/login.php

Register:
http://localhost/subshare/register.php

Buyer Dashboard:
http://localhost/subshare/buyer/dashboard.php

Seller Dashboard:
http://localhost/subshare/seller/dashboard.php

Admin Dashboard:
http://localhost/subshare/admin/dashboard.php
```

# 2. Project Objectives

The main objectives of SubShare are:

1. To provide a simple platform for listing and purchasing subscription slots.
2. To provide separate functionality for buyers, sellers, and administrators.
3. To manage subscription availability using a database.
4. To automatically reduce available slots after a successful purchase.
5. To track purchase dates, expiry dates, and purchase status.
6. To provide administrators with an overview of users, subscriptions, and purchases.
7. To demonstrate practical use of PHP, MySQL, HTML, Tailwind CSS, and JavaScript.

---

# 3. Technology Stack

| Technology         | Purpose                       |
| ------------------ | ----------------------------- |
| PHP                | Server-side application logic |
| MySQL              | Database                      |
| phpMyAdmin         | Database management           |
| HTML               | Page structure                |
| Tailwind CSS       | UI styling                    |
| Vanilla JavaScript | Client-side interaction       |
| AJAX / Fetch API   | Purchase request              |
| Apache             | Local web server              |
| XAMPP              | Local development environment |

No PHP framework is currently used.

No Composer or npm dependency is required.

Tailwind CSS is currently used through its CDN version.

---

# 4. User Roles

SubShare has three roles.

## 4.1 Buyer

A buyer can:

- Register an account
- Log in
- Browse subscription listings
- View subscription details
- Purchase available subscription slots
- View their purchases
- View purchase expiry dates
- See whether a purchase is active or expired

A buyer cannot access seller or admin management pages.

---

## 4.2 Seller

A seller can:

- Register an account
- Log in
- View seller dashboard
- Create subscription listings
- View their own listings
- Edit their listings
- Delete their listings

A seller cannot purchase subscription slots.

A seller can browse the public marketplace.

---

## 4.3 Admin

The administrator can:

- Log in using an administrator account
- View the admin dashboard
- View registered users
- View subscription listings
- View purchases
- Monitor platform statistics

Admin registration is not available through the public registration form.

The initial administrator account is created manually.

---

# 5. Access Control

The application uses role-based access control.

| Page / Action        | Guest | Buyer | Seller | Admin |
| -------------------- | ----: | ----: | -----: | ----: |
| Home / Marketplace   |   Yes |   Yes |    Yes |   Yes |
| View Subscription    |   Yes |   Yes |    Yes |   Yes |
| Purchase Slot        |    No |   Yes |     No |    No |
| Buyer Dashboard      |    No |   Yes |     No |    No |
| My Purchases         |    No |   Yes |     No |    No |
| Seller Dashboard     |    No |    No |    Yes |    No |
| Create Listing       |    No |    No |    Yes |    No |
| My Listings          |    No |    No |    Yes |    No |
| Edit Listing         |    No |    No |    Yes |    No |
| Admin Dashboard      |    No |    No |     No |   Yes |
| Manage Users         |    No |    No |     No |   Yes |
| Manage Subscriptions |    No |    No |     No |   Yes |
| View Purchases       |    No |    No |     No |   Yes |

Access control is enforced on the server side using the authentication functions in:

```text
includes/auth.php
```

---

# 6. Main Application Workflow

## 6.1 Registration

A user selects either:

- Buyer
- Seller

The registration process:

1. Receives user information.
2. Validates required fields.
3. Validates email format.
4. Validates minimum password length.
5. Checks whether the email already exists.
6. Hashes the password using PHP's password hashing function.
7. Stores the account in the database.

Admin accounts cannot be created through public registration.

---

## 6.2 Login

The login process:

1. Receives email and password.
2. Searches for the user by email.
3. Verifies the password using `password_verify()`.
4. Regenerates the session ID.
5. Stores user information in the session.
6. Redirects the user according to their role.

Redirect destinations:

```text
Buyer  → /subshare/buyer/dashboard.php
Seller → /subshare/seller/dashboard.php
Admin  → /subshare/admin/dashboard.php
```

---

# 7. Seller Workflow

The seller workflow is:

```text
Seller Registration
        ↓
Seller Login
        ↓
Seller Dashboard
        ↓
Create Subscription Listing
        ↓
Listing Appears on Marketplace
        ↓
Buyer Purchases Slot
        ↓
Available Slot Count Decreases
```

A seller can edit:

- Service name
- Plan name
- Price
- Duration

The total number of slots is intentionally not editable through the current edit form because slot availability is affected by purchases.

---

# 8. Buyer Workflow

The buyer workflow is:

```text
Buyer Registration
        ↓
Buyer Login
        ↓
Public Marketplace
        ↓
View Subscription
        ↓
Purchase Slot
        ↓
Purchase Saved
        ↓
Available Slots Decrease
        ↓
My Purchases
        ↓
Active / Expired
```

The marketplace itself is public.

However, the purchase operation is restricted to authenticated buyers.

Guests see:

```text
Login to Purchase
```

Sellers and administrators see:

```text
Only buyer accounts can purchase subscription slots.
```

---

# 9. Purchase System

Purchases are processed through:

```text
ajax/purchase.php
```

The purchase process uses a database transaction.

The system:

1. Checks that the request is a POST request.
2. Checks that the user is logged in.
3. Checks that the user has the buyer role.
4. Validates the subscription ID.
5. Locks the subscription row using `FOR UPDATE`.
6. Checks whether the subscription exists.
7. Checks whether a slot is available.
8. Calculates the expiry date.
9. Creates the purchase record.
10. Decreases the available slot count.
11. Commits the transaction.
12. Returns a JSON success response.

If an error occurs, the transaction is rolled back.

---

# 10. Purchase Expiry

Each purchase contains an expiry date.

The expiry date is calculated from:

```text
Purchase Date + Subscription Duration
```

Example:

```text
Duration: 30 days

Purchase Date: September 5, 2026
Expiry Date:   October 5, 2026
```

The buyer's purchase page checks for expired purchases and updates their status from:

```text
active
```

to:

```text
expired
```

when the expiry date has passed.

The admin purchase page also performs this expiry status update.

---

# 11. Database

The database name is:

```text
subshare
```

The project currently uses three tables:

```text
users
subscriptions
purchases
```

---

# 12. Users Table

Table:

```text
users
```

Fields:

| Field      | Type         | Description             |
| ---------- | ------------ | ----------------------- |
| user_id    | INT          | Primary key             |
| name       | VARCHAR(100) | User name               |
| email      | VARCHAR(100) | Unique email            |
| password   | VARCHAR(255) | Hashed password         |
| role       | ENUM         | buyer, seller, or admin |
| created_at | TIMESTAMP    | Account creation date   |

The email field is unique.

Passwords are never stored as plain text.

---

# 13. Subscriptions Table

Table:

```text
subscriptions
```

Fields:

| Field           | Type         | Description                |
| --------------- | ------------ | -------------------------- |
| subscription_id | INT          | Primary key                |
| seller_id       | INT          | Seller who created listing |
| service_name    | VARCHAR(100) | Subscription service       |
| plan_name       | VARCHAR(100) | Subscription plan          |
| price           | DECIMAL(8,2) | Price per slot             |
| total_slots     | INT          | Total available slots      |
| available_slots | INT          | Currently available slots  |
| duration_days   | INT          | Subscription duration      |
| created_at      | TIMESTAMP    | Listing creation date      |

The `seller_id` references:

```text
users.user_id
```

---

# 14. Purchases Table

Table:

```text
purchases
```

Fields:

| Field           | Type      | Description              |
| --------------- | --------- | ------------------------ |
| purchase_id     | INT       | Primary key              |
| buyer_id        | INT       | Buyer who made purchase  |
| subscription_id | INT       | Purchased subscription   |
| purchase_date   | TIMESTAMP | Purchase date            |
| expiry_date     | DATE      | Subscription expiry date |
| status          | ENUM      | active or expired        |

Relationships:

```text
users → purchases
subscriptions → purchases
```

---

# 15. Database Relationships

The main relationships are:

```text
users
  │
  ├───────────────┐
  │               │
  │ seller_id     │ buyer_id
  ↓               ↓
subscriptions   purchases
       │
       │ subscription_id
       └──────────────→ purchases
```

More specifically:

```text
One Seller
    ↓
Many Subscriptions

One Buyer
    ↓
Many Purchases

One Subscription
    ↓
Many Purchases
```

---

# 16. Project Structure

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

# 17. File Responsibilities

## Root Files

### `index.php`

Public marketplace.

Displays available subscription listings and allows users to view listing details.

---

### `login.php`

Displays the login form.

---

### `register.php`

Displays the registration form.

Users can register as:

```text
buyer
seller
```

---

### `logout.php`

Destroys the current session and redirects the user to the home page.

---

# 18. Includes

## `includes/db.php`

Creates the MySQL database connection.

Current configuration is designed for XAMPP:

```text
Host: localhost
Username: root
Password: empty
Database: subshare
```

---

## `includes/auth.php`

Contains authentication and authorization functions.

Main functions:

```php
require_login()
```

and:

```php
require_role($role)
```

Examples:

```php
require_role("buyer");
```

```php
require_role("seller");
```

```php
require_role("admin");
```

---

## `includes/header.php`

Shared header and navigation.

Navigation changes according to the current user's role.

---

## `includes/footer.php`

Shared footer used across application pages.

---

# 19. Actions

The `actions` folder contains server-side form processing files.

## `register_action.php`

Processes user registration.

---

## `login_action.php`

Processes user authentication.

---

## `create_listing_action.php`

Creates a new subscription listing for a seller.

---

## `edit_listing_action.php`

Updates a seller's subscription listing.

---

## `delete_listing_action.php`

Deletes a seller-owned subscription listing.

---

# 20. Buyer Files

## `buyer/dashboard.php`

Displays:

- Welcome message
- Active purchase count
- Available subscription count
- Marketplace link
- My Purchases link

---

## `buyer/view_listing.php`

Public subscription details page.

Users can view:

- Service
- Plan
- Price
- Duration
- Available slots
- Total slots

Only buyers can purchase.

---

## `buyer/purchases.php`

Displays the logged-in buyer's purchase history.

Shows:

- Service
- Plan
- Price
- Purchase date
- Expiry date
- Status

Possible statuses:

```text
Active
Expired
```

---

# 21. Seller Files

## `seller/dashboard.php`

Displays seller statistics and seller management links.

---

## `seller/create_listing.php`

Allows sellers to create subscription listings.

Current fields:

- Service name
- Plan name
- Price per slot
- Total slots
- Duration

Supported durations:

```text
7 days
30 days
90 days
```

---

## `seller/my_listings.php`

Displays listings belonging to the logged-in seller.

---

## `seller/edit_listing.php`

Allows a seller to edit their own listing.

Current editable fields:

- Service name
- Plan name
- Price
- Duration

---

# 22. Admin Files

## `admin/dashboard.php`

Displays platform statistics:

- Total users
- Total buyers
- Total sellers
- Total subscriptions
- Total purchases
- Active purchases

---

## `admin/users.php`

Displays registered users.

Shows:

- User ID
- Name
- Email
- Role
- Registration date

---

## `admin/subscriptions.php`

Displays subscription listings.

Shows:

- Subscription ID
- Service
- Plan
- Seller
- Price
- Available slots
- Total slots
- Duration
- Creation date

---

## `admin/purchases.php`

Displays all purchases.

Shows:

- Purchase ID
- Buyer
- Buyer email
- Subscription
- Seller
- Price
- Purchase date
- Expiry date
- Status

---

# 23. AJAX

## `ajax/purchase.php`

Handles subscription slot purchases.

It returns JSON responses such as:

```json
{
  "success": true,
  "message": "Subscription slot purchased successfully."
}
```

or:

```json
{
  "success": false,
  "message": "No slots are currently available."
}
```

The purchase page uses JavaScript `fetch()` to communicate with this endpoint.

---

# 24. Security Measures

The current implementation includes several basic security measures.

## Password Hashing

Passwords are stored using:

```php
password_hash()
```

Login verification uses:

```php
password_verify()
```

---

## Prepared Statements

Database queries involving user input use prepared statements.

This reduces the risk of SQL injection.

---

## Session Regeneration

After successful login:

```php
session_regenerate_id(true);
```

is used to reduce session fixation risk.

---

## Role-Based Access Control

Protected pages use:

```php
require_role()
```

This prevents users from accessing pages belonging to another role.

---

## Output Escaping

User-controlled values displayed in HTML are escaped using:

```php
htmlspecialchars()
```

---

## Database Transactions

The purchase process uses a database transaction to keep the purchase insertion and slot reduction consistent.

The subscription row is locked during the transaction using:

```sql
FOR UPDATE
```

---

# 25. UI and Design

The project uses Tailwind CSS for the interface.

The design focuses on:

- Simple layout
- Clear navigation
- Responsive pages
- Cards for marketplace listings
- Tables for administrative information
- Role-specific navigation
- Clear status labels

Custom CSS is located at:

```text
css/style.css
```

Custom JavaScript is located at:

```text
js/script.js
```

---

# 26. Local Installation

## Requirements

Install:

- XAMPP
- Apache
- MySQL
- Web browser

PHP and MySQL are provided by XAMPP.

---

## Step 1: Copy Project

Place the project inside the XAMPP web root:

```text
C:\xampp\htdocs\subshare
```

---

## Step 2: Start XAMPP

Start:

```text
Apache
MySQL
```

from the XAMPP Control Panel.

---

## Step 3: Create Database

Open phpMyAdmin:

```text
http://localhost/phpmyadmin/
```

Create a database named:

```text
subshare
```

---

## Step 4: Import SQL

Import:

```text
database/subshare.sql
```

into the `subshare` database.

---

## Step 5: Check Database Connection

The current database connection is configured in:

```text
includes/db.php
```

Default XAMPP configuration:

```text
Host: localhost
Username: root
Password:
Database: subshare
```

---

## Step 6: Open Application

Open:

```text
http://localhost/subshare/
```

---

# 27. Creating the Initial Admin

Admin registration is intentionally disabled from the public registration form.

The initial admin account is created manually.

For the current development setup, the administrator account used for testing is:

```text
Email: admin@subshare.com
Password: admin123
Role: admin
```

The password should be changed to a stronger password if the application is deployed beyond the local development environment.

The temporary admin creation script should not remain in the project after the administrator account has been created.

---

# 28. Current Development Status

## Completed

### Authentication

- [x] Buyer registration
- [x] Seller registration
- [x] Login
- [x] Logout
- [x] Password hashing
- [x] Role-based redirects
- [x] Role-based page protection

### Buyer

- [x] Buyer dashboard
- [x] Public marketplace
- [x] Subscription details
- [x] Purchase slot
- [x] Slot availability reduction
- [x] Purchase history
- [x] Expiry status

### Seller

- [x] Seller dashboard
- [x] Create listing
- [x] View own listings
- [x] Edit listing
- [x] Delete listing

### Admin

- [x] Admin account
- [x] Admin login
- [x] Admin dashboard
- [x] User overview
- [x] Subscription overview
- [x] Purchase overview

### Database

- [x] Users table
- [x] Subscriptions table
- [x] Purchases table
- [x] Foreign keys
- [x] Purchase transaction
- [x] Slot management

---

# 29. Development Roadmap

The core application is currently complete.

The next development phase should focus on testing and refinement rather than immediately adding new features.

## Phase 1: Functional Testing

Test:

- Registration
- Login
- Logout
- Buyer workflow
- Seller workflow
- Admin workflow
- Purchase workflow
- Slot reduction
- Purchase expiry
- Role restrictions

---

## Phase 2: Edge Case Testing

Examples:

- Invalid login
- Duplicate email
- Invalid subscription ID
- Buying when no slots remain
- Invalid price
- Invalid number of slots
- Invalid duration
- Accessing another seller's listing
- Accessing another buyer's purchases
- Invalid or missing URL parameters
- Expired purchases
- Deleted subscriptions
- Multiple purchases
- Refreshing after purchase

---

## Phase 3: Security Review

Review:

- SQL injection protection
- XSS protection
- Session handling
- Authorization checks
- Input validation
- CSRF protection
- Direct URL access
- Error handling
- Password security

---

## Phase 4: UI Review

Review:

- Responsive design
- Mobile layout
- Button consistency
- Navigation consistency
- Table responsiveness
- Form validation
- Empty states
- Success/error messages
- Spacing and typography

---

## Phase 5: Final Cleanup

Before final submission:

- Remove temporary development files
- Remove unnecessary code
- Remove unused variables
- Remove debug output
- Check all links
- Check all redirects
- Check database constraints
- Check folder structure
- Verify SQL export
- Test from a clean database

---

# 30. Current Known Scope Limitations

The current version intentionally keeps the project simple.

It does not include:

- Payment gateway
- Real subscription credential management
- OTP verification
- Email notifications
- Chat system
- Image uploads
- Reviews and ratings
- Complex subscription verification
- Automated external subscription API integration

These features are outside the current core project scope.

---

# 31. Important Development Rule

The project should remain simple and understandable for a BCA academic project.

Before adding a new feature, consider:

1. Does the feature support the main purpose of SubShare?
2. Does it require unnecessary database complexity?
3. Can it be implemented clearly using the current PHP/MySQL architecture?
4. Does it introduce unnecessary dependencies?
5. Can the feature be properly tested and explained during project presentation?

The preferred approach is:

```text
Build
  ↓
Test
  ↓
Fix
  ↓
Move to next feature
  ↓
Complete core system
  ↓
Edge cases
  ↓
Security review
  ↓
UI cleanup
  ↓
Final testing
```

---

# 32. Development Environment

The project is currently intended for:

```text
Operating Environment: Localhost
Web Server: Apache
Database Server: MySQL
Environment: XAMPP
PHP: XAMPP-supported PHP version
Database Management: phpMyAdmin
```

---

# 33. Project Philosophy

SubShare is intentionally designed as a lightweight application.

The project prioritizes:

- Simplicity
- Clear role separation
- Basic security
- Database consistency
- Understandable PHP code
- Practical functionality
- Easy local deployment
- Academic demonstration

The application avoids unnecessary frameworks and external services so that the complete workflow can be understood and demonstrated clearly.

---

# 34. Final Application Workflow

The complete system can be represented as:

```text
                         SUBSHARE
                            │
             ┌──────────────┼──────────────┐
             │              │              │
           BUYER          SELLER          ADMIN
             │              │              │
             ↓              ↓              ↓
         Dashboard      Dashboard       Dashboard
             │              │              │
             ↓              ↓              ├── Users
       Marketplace      Create Listing   ├── Subscriptions
             │              │              └── Purchases
             ↓              ↓
       View Listing     My Listings
             │              │
             ↓              ↓
       Purchase Slot     Edit/Delete
             │
             ↓
       My Purchases
             │
             ↓
       Active / Expired
```

---

# 35. Project Status

**SubShare Core Version: Complete**

The main buyer, seller, and administrator workflows have been implemented.

The project should now move into:

```text
Functional Testing
        ↓
Edge Case Testing
        ↓
Security Review
        ↓
UI Refinement
        ↓
Final Testing
        ↓
Documentation
        ↓
Final Submission
```

---

# 36. Author

**Project:** SubShare
**Type:** BCA Academic Project
**Platform:** Web Application
**Development Environment:** XAMPP
**Database:** MySQL
