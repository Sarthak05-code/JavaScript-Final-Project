<?php

require_once "../includes/auth.php";

require_role("seller");

require_once "../includes/db.php";

$page_title = "Seller Dashboard";

require_once "../includes/header.php";
?>

<section class="max-w-6xl mx-auto px-6 py-10">


<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

    <div>
        <h1 class="text-3xl font-bold">
            Seller Dashboard
        </h1>

        <p class="text-gray-500 mt-1">
            Welcome, <?= htmlspecialchars($_SESSION["name"]) ?>
        </p>
    </div>

    <a
        href="create_listing.php"
        class="bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 text-center"
    >
        + Create Listing
    </a>

</div>


<!-- Dashboard Statistics -->

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mt-10">

    <?php
    $seller_id = $_SESSION["user_id"];

    /*
    |--------------------------------------------------------------------------
    | Total Listings
    |--------------------------------------------------------------------------
    */

    $sql = "SELECT COUNT(*) AS total
            FROM subscriptions
            WHERE seller_id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $seller_id);
    $stmt->execute();

    $result = $stmt->get_result();
    $total_listings = $result->fetch_assoc()["total"];
    ?>


    <!-- Total Listings -->

    <div class="bg-white border rounded-xl p-6">

        <p class="text-sm text-gray-500">
            Total Listings
        </p>

        <p class="text-3xl font-bold mt-2">
            <?= $total_listings ?>
        </p>

    </div>


    <!-- Available Slots -->

    <div class="bg-white border rounded-xl p-6">

        <p class="text-sm text-gray-500">
            Available Slots
        </p>

        <p class="text-3xl font-bold mt-2">

            <?php
            $sql = "SELECT COALESCE(SUM(available_slots), 0) AS total
                    FROM subscriptions
                    WHERE seller_id = ?";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $seller_id);
            $stmt->execute();

            $result = $stmt->get_result();

            echo $result->fetch_assoc()["total"];
            ?>

        </p>

    </div>


    <!-- Active Purchases -->

    <div class="bg-white border rounded-xl p-6">

        <p class="text-sm text-gray-500">
            Active Purchases
        </p>

        <p class="text-3xl font-bold mt-2">

            <?php
            $sql = "SELECT COUNT(*) AS total
                    FROM purchases p
                    INNER JOIN subscriptions s
                        ON p.subscription_id = s.subscription_id
                    WHERE s.seller_id = ?
                    AND p.status = 'active'";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $seller_id);
            $stmt->execute();

            $result = $stmt->get_result();

            echo $result->fetch_assoc()["total"];
            ?>

        </p>

    </div>


    <!-- Sold Out Listings -->

    <div class="bg-white border rounded-xl p-6">

        <p class="text-sm text-gray-500">
            Sold Out Listings
        </p>

        <p class="text-3xl font-bold mt-2">

            <?php
            $sql = "SELECT COUNT(*) AS total
                    FROM subscriptions
                    WHERE seller_id = ?
                    AND available_slots = 0";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $seller_id);
            $stmt->execute();

            $result = $stmt->get_result();

            echo $result->fetch_assoc()["total"];
            ?>

        </p>

    </div>


    <!-- Quick Action -->

    <div class="bg-white border rounded-xl p-6">

        <p class="text-sm text-gray-500">
            Quick Action
        </p>

        <a
            href="my_listings.php"
            class="inline-block mt-3 text-sm font-medium hover:underline"
        >
            Manage Listings →
        </a>

    </div>

</div>


<!-- Recent Listings -->

<div class="bg-white border rounded-xl p-6 mt-8">

    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        <div>
            <h2 class="text-xl font-semibold">
                My Recent Listings
            </h2>

            <p class="text-sm text-gray-500 mt-1">
                Your three most recently created subscription listings.
            </p>
        </div>

        <a
            href="my_listings.php"
            class="text-sm font-medium hover:underline"
        >
            View All →
        </a>

    </div>


    <?php
    /*
    |--------------------------------------------------------------------------
    | Fetch Recent Listings
    |--------------------------------------------------------------------------
    */

    $sql = "SELECT
                subscription_id,
                service_name,
                plan_name,
                price,
                total_slots,
                available_slots,
                duration_days
            FROM subscriptions
            WHERE seller_id = ?
            ORDER BY created_at DESC
            LIMIT 3";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $seller_id);
    $stmt->execute();

    $recent_listings = $stmt->get_result();
    ?>


    <?php if ($recent_listings->num_rows > 0): ?>

        <div class="overflow-x-auto mt-6">

            <table class="w-full text-sm">

                <thead>

                    <tr class="border-b text-left">

                        <th class="py-3 pr-4">
                            Service
                        </th>

                        <th class="py-3 pr-4">
                            Plan
                        </th>

                        <th class="py-3 pr-4">
                            Price
                        </th>

                        <th class="py-3 pr-4">
                            Slots
                        </th>

                        <th class="py-3 pr-4">
                            Status
                        </th>

                        <th class="py-3 pr-4">
                            Duration
                        </th>

                        <th class="py-3">
                            Action
                        </th>

                    </tr>

                </thead>


                <tbody>

                    <?php while ($listing = $recent_listings->fetch_assoc()): ?>

                        <tr class="border-b last:border-b-0">

                            <!-- Service -->

                            <td class="py-4 pr-4 font-medium">
                                <?= htmlspecialchars(
                                    $listing["service_name"],
                                ) ?>
                            </td>


                            <!-- Plan -->

                            <td class="py-4 pr-4">
                                <?= htmlspecialchars($listing["plan_name"]) ?>
                            </td>


                            <!-- Price -->

                            <td class="py-4 pr-4">
                                Rs. <?= number_format(
                                    (float) $listing["price"],
                                    2,
                                ) ?>
                            </td>


                            <!-- Slots -->

                            <td class="py-4 pr-4">
                                <?= (int) $listing["available_slots"] ?>
                                /
                                <?= (int) $listing["total_slots"] ?>
                            </td>


                            <!-- Status -->

                            <td class="py-4 pr-4">

                                <?php if (
                                    (int) $listing["available_slots"] > 0
                                ): ?>

                                    <span class="text-sm font-medium text-green-600">
                                        Available
                                    </span>

                                <?php else: ?>

                                    <span class="text-sm font-medium text-red-600">
                                        Sold Out
                                    </span>

                                <?php endif; ?>

                            </td>


                            <!-- Duration -->

                            <td class="py-4 pr-4">
                                <?= (int) $listing["duration_days"] ?>
                                days
                            </td>


                            <!-- Action -->

                            <td class="py-4">

                                <a
                                    href="edit_listing.php?id=<?= (int) $listing[
                                        "subscription_id"
                                    ] ?>"
                                    class="text-sm font-medium hover:underline"
                                >
                                    Edit
                                </a>

                            </td>

                        </tr>

                    <?php endwhile; ?>

                </tbody>

            </table>

        </div>

    <?php else: ?>

        <!-- Empty State -->

        <div class="text-center py-10">

            <p class="text-gray-500">
                You have not created any listings yet.
            </p>

            <a
                href="create_listing.php"
                class="inline-block mt-4 bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800"
            >
                Create Your First Listing
            </a>

        </div>

    <?php endif; ?>

</div>


</section>

<?php require_once "../includes/footer.php"; ?>
