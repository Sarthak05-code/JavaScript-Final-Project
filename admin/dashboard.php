<?php

require_once "../includes/auth.php";
require_once "../includes/db.php";

require_role("admin");

$page_title = "Admin Dashboard";

require_once "../includes/header.php";

/*
|--------------------------------------------------------------------------
| Dashboard Statistics
|--------------------------------------------------------------------------
*/

// Total users
$sql = "SELECT COUNT(*) AS total FROM users";

$result = $conn->query($sql);
$total_users = $result->fetch_assoc()["total"];

// Total buyers
$sql = "SELECT COUNT(*) AS total
        FROM users
        WHERE role = 'buyer'";

$result = $conn->query($sql);
$total_buyers = $result->fetch_assoc()["total"];

// Total sellers
$sql = "SELECT COUNT(*) AS total
        FROM users
        WHERE role = 'seller'";

$result = $conn->query($sql);
$total_sellers = $result->fetch_assoc()["total"];

// Total subscriptions
$sql = "SELECT COUNT(*) AS total
        FROM subscriptions";

$result = $conn->query($sql);
$total_subscriptions = $result->fetch_assoc()["total"];

// Total purchases
$sql = "SELECT COUNT(*) AS total
        FROM purchases";

$result = $conn->query($sql);
$total_purchases = $result->fetch_assoc()["total"];

// Active purchases
$sql = "SELECT COUNT(*) AS total
        FROM purchases
        WHERE status = 'active'";

$result = $conn->query($sql);
$active_purchases = $result->fetch_assoc()["total"];
?>

<div class="max-w-6xl mx-auto px-6 py-10">

    <!-- Page Heading -->

    <div class="mb-8">

        <h1 class="text-3xl font-bold text-gray-900">
            Admin Dashboard
        </h1>

        <p class="text-gray-600 mt-2">
            Manage and monitor the SubShare platform.
        </p>

    </div>


    <!-- Welcome -->

    <div class="bg-white border border-gray-200 rounded-xl p-6 mb-8">

        <h2 class="text-xl font-semibold text-gray-900 mb-2">
            Welcome, <?= htmlspecialchars($_SESSION["name"]) ?>
        </h2>

        <p class="text-gray-600">
            Use the admin panel to monitor users, subscriptions, and purchases.
        </p>

    </div>


    <!-- Statistics -->

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">


        <!-- Total Users -->

        <div class="bg-white border border-gray-200 rounded-xl p-6">

            <p class="text-sm text-gray-500">
                Total Users
            </p>

            <p class="text-3xl font-bold text-gray-900 mt-2">
                <?= (int) $total_users ?>
            </p>

        </div>


        <!-- Buyers -->

        <div class="bg-white border border-gray-200 rounded-xl p-6">

            <p class="text-sm text-gray-500">
                Buyers
            </p>

            <p class="text-3xl font-bold text-gray-900 mt-2">
                <?= (int) $total_buyers ?>
            </p>

        </div>


        <!-- Sellers -->

        <div class="bg-white border border-gray-200 rounded-xl p-6">

            <p class="text-sm text-gray-500">
                Sellers
            </p>

            <p class="text-3xl font-bold text-gray-900 mt-2">
                <?= (int) $total_sellers ?>
            </p>

        </div>


        <!-- Subscriptions -->

        <div class="bg-white border border-gray-200 rounded-xl p-6">

            <p class="text-sm text-gray-500">
                Total Subscriptions
            </p>

            <p class="text-3xl font-bold text-gray-900 mt-2">
                <?= (int) $total_subscriptions ?>
            </p>

        </div>


        <!-- Purchases -->

        <div class="bg-white border border-gray-200 rounded-xl p-6">

            <p class="text-sm text-gray-500">
                Total Purchases
            </p>

            <p class="text-3xl font-bold text-gray-900 mt-2">
                <?= (int) $total_purchases ?>
            </p>

        </div>


        <!-- Active Purchases -->

        <div class="bg-white border border-gray-200 rounded-xl p-6">

            <p class="text-sm text-gray-500">
                Active Purchases
            </p>

            <p class="text-3xl font-bold text-gray-900 mt-2">
                <?= (int) $active_purchases ?>
            </p>

        </div>

    </div>


    <!-- Management Links -->

    <div>

        <h2 class="text-2xl font-bold text-gray-900 mb-5">
            Management
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">


            <!-- Users -->

            <a
                href="users.php"
                class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition"
            >

                <h3 class="text-xl font-semibold text-gray-900 mb-2">
                    Manage Users
                </h3>

                <p class="text-gray-600 text-sm">
                    View registered buyers and sellers.
                </p>

            </a>


            <!-- Subscriptions -->

            <a
                href="subscriptions.php"
                class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition"
            >

                <h3 class="text-xl font-semibold text-gray-900 mb-2">
                    Manage Subscriptions
                </h3>

                <p class="text-gray-600 text-sm">
                    View and manage subscription listings.
                </p>

            </a>


            <!-- Purchases -->

            <a
                href="purchases.php"
                class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition"
            >

                <h3 class="text-xl font-semibold text-gray-900 mb-2">
                    View Purchases
                </h3>

                <p class="text-gray-600 text-sm">
                    Monitor subscription purchases and expiry status.
                </p>

            </a>

        </div>

    </div>

</div>

<?php require_once "../includes/footer.php";

?>
