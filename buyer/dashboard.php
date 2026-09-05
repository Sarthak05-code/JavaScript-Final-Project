<?php

require_once "../includes/auth.php";
require_once "../includes/db.php";

require_role("buyer");

$page_title = "Buyer Dashboard";

require_once "../includes/header.php";

$buyer_id = $_SESSION["user_id"];

/*
|--------------------------------------------------------------------------
| Count Active Purchases
|--------------------------------------------------------------------------
*/

$sql = "SELECT COUNT(*) AS total
        FROM purchases
        WHERE buyer_id = ?
        AND status = 'active'";

$stmt = $conn->prepare($sql);

$stmt->bind_param("i", $buyer_id);

$stmt->execute();

$result = $stmt->get_result();

$active_purchases = $result->fetch_assoc()["total"];

/*
|--------------------------------------------------------------------------
| Count Available Subscriptions
|--------------------------------------------------------------------------
*/

$sql = "SELECT COUNT(*) AS total
        FROM subscriptions
        WHERE available_slots > 0";

$result = $conn->query($sql);

$available_subscriptions = $result->fetch_assoc()["total"];
?>

<section class="max-w-6xl mx-auto px-6 py-12">

    <!-- Header -->

    <div class="mb-10">

        <h1 class="text-3xl font-bold text-gray-900">
            Welcome, <?= htmlspecialchars($_SESSION["name"]) ?>
        </h1>

        <p class="text-gray-500 mt-2">
            Manage your subscriptions and purchases from here.
        </p>

    </div>


    <!-- Statistics -->

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

        <!-- Active Purchases -->

        <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

            <p class="text-sm text-gray-500">
                Active Purchases
            </p>

            <p class="text-3xl font-bold text-gray-900 mt-2">
                <?= $active_purchases ?>
            </p>

        </div>


        <!-- Available Subscriptions -->

        <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

            <p class="text-sm text-gray-500">
                Available Subscriptions
            </p>

            <p class="text-3xl font-bold text-gray-900 mt-2">
                <?= $available_subscriptions ?>
            </p>

        </div>

    </div>


    <!-- Quick Actions -->

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Browse -->

        <div class="bg-gray-50 border border-gray-200 rounded-xl p-6">

            <h2 class="text-xl font-semibold text-gray-900">
                Browse Subscriptions
            </h2>

            <p class="text-gray-500 mt-2 mb-5">
                Find available subscription plans and purchase a slot.
            </p>

            <a
                href="../index.php"
                class="inline-block bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800"
            >
                Browse Subscriptions
            </a>

        </div>


        <!-- Purchases -->

        <div class="bg-gray-50 border border-gray-200 rounded-xl p-6">

            <h2 class="text-xl font-semibold text-gray-900">
                My Purchases
            </h2>

            <p class="text-gray-500 mt-2 mb-5">
                View your active and previous subscription purchases.
            </p>

            <a
                href="purchases.php"
                class="inline-block bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800"
            >
                View Purchases
            </a>

        </div>

    </div>

</section>


<?php require_once "../includes/footer.php";

?>
