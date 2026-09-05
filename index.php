<?php

require_once "includes/db.php";

$page_title = "Home";

require_once "includes/header.php";

/*
|--------------------------------------------------------------------------
| Fetch Available Subscriptions
|--------------------------------------------------------------------------
*/

$sql = "SELECT
            subscription_id,
            service_name,
            plan_name,
            price,
            available_slots,
            total_slots,
            duration_days
        FROM subscriptions
        WHERE available_slots > 0
        ORDER BY created_at DESC";

$result = $conn->query($sql);
?>

<!-- Hero Section -->

<section class="max-w-6xl mx-auto px-6 py-16">

    <div class="max-w-2xl">

        <h1 class="text-4xl md:text-5xl font-bold text-gray-900">
            Share Subscriptions,
            <span class="text-gray-600">
                Save Money
            </span>
        </h1>

        <p class="text-gray-500 mt-5 text-lg">
            Find available subscription slots and join plans
            at an affordable price.
        </p>

        <div class="mt-7 flex gap-3">

            <?php if (!isset($_SESSION["user_id"])): ?>

                <a
                    href="register.php"
                    class="bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800"
                >
                    Get Started
                </a>

                <a
                    href="#subscriptions"
                    class="border border-gray-300 px-5 py-2.5 rounded-lg hover:bg-gray-100"
                >
                    Browse Subscriptions
                </a>

            <?php elseif ($_SESSION["role"] === "buyer"): ?>

                <a
                    href="buyer/dashboard.php"
                    class="bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800"
                >
                    Go to Dashboard
                </a>

                <a
                    href="#subscriptions"
                    class="border border-gray-300 px-5 py-2.5 rounded-lg hover:bg-gray-100"
                >
                    Browse Subscriptions
                </a>

            <?php elseif ($_SESSION["role"] === "seller"): ?>

                <a
                    href="seller/dashboard.php"
                    class="bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800"
                >
                    Seller Dashboard
                </a>

                <a
                    href="#subscriptions"
                    class="border border-gray-300 px-5 py-2.5 rounded-lg hover:bg-gray-100"
                >
                    Browse Subscriptions
                </a>

            <?php elseif ($_SESSION["role"] === "admin"): ?>

                <a
                    href="admin/dashboard.php"
                    class="bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800"
                >
                    Admin Dashboard
                </a>

                <a
                    href="#subscriptions"
                    class="border border-gray-300 px-5 py-2.5 rounded-lg hover:bg-gray-100"
                >
                    Browse Subscriptions
                </a>

            <?php endif; ?>

        </div>

    </div>

</section>


<!-- Subscription Listings -->

<section
    id="subscriptions"
    class="bg-gray-50 border-t border-gray-200"
>

    <div class="max-w-6xl mx-auto px-6 py-14">

        <div class="mb-8">

            <h2 class="text-2xl font-bold text-gray-900">
                Available Subscriptions
            </h2>

            <p class="text-gray-500 mt-2">
                Browse subscription plans with available slots.
            </p>

        </div>


        <?php if ($result && $result->num_rows > 0): ?>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <?php while ($listing = $result->fetch_assoc()): ?>

                    <div
                        class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                    >

                        <!-- Service -->

                        <div>

                            <h3 class="text-xl font-semibold text-gray-900">
                                <?= htmlspecialchars(
                                    $listing["service_name"],
                                ) ?>
                            </h3>

                            <p class="text-gray-500 mt-1">
                                <?= htmlspecialchars($listing["plan_name"]) ?>
                            </p>

                        </div>


                        <!-- Price -->

                        <div class="mt-6">

                            <p class="text-2xl font-bold text-gray-900">
                                Rs. <?= number_format($listing["price"], 2) ?>
                            </p>

                            <p class="text-sm text-gray-500">
                                per slot / <?= $listing["duration_days"] ?> days
                            </p>

                        </div>


                        <!-- Slots -->

                        <div class="mt-5 text-sm text-gray-600">

                            <p>
                                Available Slots:

                                <span class="font-medium text-gray-900">
                                    <?= $listing["available_slots"] ?>
                                </span>

                            </p>

                            <p class="mt-1">

                                Total Slots:

                                <span class="font-medium text-gray-900">
                                    <?= $listing["total_slots"] ?>
                                </span>

                            </p>

                        </div>


                        <!-- Details -->

                        <a
                            href="buyer/view_listing.php?id=<?= $listing[
                                "subscription_id"
                            ] ?>"
                            class="block text-center mt-6 bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800"
                        >
                            View Details
                        </a>

                    </div>

                <?php endwhile; ?>

            </div>

        <?php else: ?>

            <div
                class="bg-white border border-gray-200 rounded-xl p-8 text-center"
            >

                <h3 class="text-lg font-semibold text-gray-900">
                    No subscriptions available
                </h3>

                <p class="text-gray-500 mt-2">
                    There are currently no subscription slots available.
                </p>

            </div>

        <?php endif; ?>

    </div>

</section>


<?php require_once "includes/footer.php";

?>
