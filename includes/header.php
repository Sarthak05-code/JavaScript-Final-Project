<?php

$page_title = $page_title ?? "Subshare"; ?>



<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title><?= htmlspecialchars($page_title) ?> | Subshare</title>
	<script src = "https://cdn.tailwindcss.com"></script>

	<link rel="stylesheet" href="/subshare/css/style.css">
</head>
<body class="min-h-screen bg-gray-100 text-gray-900">
<nav class="bg-gray-900 text-white shadow">

    <div class="max-w-6xl mx-auto px-6 py-4">

        <div class="flex items-center justify-between">

            <!-- Logo -->

            <a
                href="/subshare/"
                class="text-xl font-bold"
            >
                SubShare
            </a>


            <!-- Navigation -->

            <div class="flex items-center gap-6 text-sm">

                <a
                    href="/subshare/"
                    class="hover:text-gray-300"
                >
                    Home
                </a>


                <?php if (!isset($_SESSION["user_id"])): ?>

                    <!-- Guest Navigation -->

                    <a
                        href="/subshare/login.php"
                        class="hover:text-gray-300"
                    >
                        Login
                    </a>

                    <a
                        href="/subshare/register.php"
                        class="bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-200"
                    >
                        Register
                    </a>


                <?php elseif ($_SESSION["role"] === "buyer"): ?>

                    <!-- Buyer Navigation -->

                    <a
                        href="/subshare/buyer/dashboard.php"
                        class="hover:text-gray-300"
                    >
                        Dashboard
                    </a>

                    <a
                        href="/subshare/buyer/purchases.php"
                        class="hover:text-gray-300"
                    >
                        Purchases
                    </a>

                    <a
                        href="/subshare/logout.php"
                        class="hover:text-gray-300"
                    >
                        Logout
                    </a>


                <?php elseif ($_SESSION["role"] === "seller"): ?>

                    <!-- Seller Navigation -->

                    <a
                        href="/subshare/seller/dashboard.php"
                        class="hover:text-gray-300"
                    >
                        Dashboard
                    </a>

                    <a
                        href="/subshare/seller/my_listings.php"
                        class="hover:text-gray-300"
                    >
                        My Listings
                    </a>

                    <a
                        href="/subshare/logout.php"
                        class="hover:text-gray-300"
                    >
                        Logout
                    </a>


                <?php elseif ($_SESSION["role"] === "admin"): ?>

                    <!-- Admin Navigation -->

                    <a
                        href="/subshare/admin/dashboard.php"
                        class="hover:text-gray-300"
                    >
                        Dashboard
                    </a>

                    <a
                        href="/subshare/logout.php"
                        class="hover:text-gray-300"
                    >
                        Logout
                    </a>

                <?php endif; ?>

            </div>

        </div>

    </div>

</nav>
    <main class="min-h-[calc(100vh-136px)]">
