<?php

require_once "../includes/auth.php";
require_once "../includes/db.php";

require_role("admin");

$page_title = "Manage Subscriptions";

require_once "../includes/header.php";

/*
|--------------------------------------------------------------------------
| Fetch all subscriptions
|--------------------------------------------------------------------------
*/

$sql = "SELECT
            s.subscription_id,
            s.service_name,
            s.plan_name,
            s.price,
            s.total_slots,
            s.available_slots,
            s.duration_days,
            s.created_at,
            u.name AS seller_name,
            u.email AS seller_email
        FROM subscriptions s
        INNER JOIN users u
            ON s.seller_id = u.user_id
        ORDER BY s.created_at DESC";

$result = $conn->query($sql);
?>

<div class="max-w-6xl mx-auto px-6 py-10">

    <!-- Page Heading -->

    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>

            <h1 class="text-3xl font-bold text-gray-900">
                Manage Subscriptions
            </h1>

            <p class="text-gray-600 mt-2">
                View subscription listings created by sellers.
            </p>

        </div>

        <a
            href="dashboard.php"
            class="inline-block bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg hover:bg-gray-300"
        >
            Back to Dashboard
        </a>

    </div>


    <!-- Subscription Table -->

    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">

        <?php if ($result->num_rows === 0): ?>

            <div class="p-8 text-center">

                <p class="text-gray-600">
                    No subscription listings have been created yet.
                </p>

            </div>

        <?php else: ?>

            <div class="overflow-x-auto">

                <table class="w-full text-left">

                    <thead class="bg-gray-50 border-b border-gray-200">

                        <tr>

                            <th class="px-6 py-4 text-sm font-semibold text-gray-700">
                                ID
                            </th>

                            <th class="px-6 py-4 text-sm font-semibold text-gray-700">
                                Service
                            </th>

                            <th class="px-6 py-4 text-sm font-semibold text-gray-700">
                                Plan
                            </th>

                            <th class="px-6 py-4 text-sm font-semibold text-gray-700">
                                Seller
                            </th>

                            <th class="px-6 py-4 text-sm font-semibold text-gray-700">
                                Price / Slot
                            </th>

                            <th class="px-6 py-4 text-sm font-semibold text-gray-700">
                                Slots
                            </th>

                            <th class="px-6 py-4 text-sm font-semibold text-gray-700">
                                Duration
                            </th>

                            <th class="px-6 py-4 text-sm font-semibold text-gray-700">
                                Created
                            </th>

                        </tr>

                    </thead>

                    <tbody class="divide-y divide-gray-100">

                        <?php while ($subscription = $result->fetch_assoc()): ?>

                            <tr class="hover:bg-gray-50">

                                <td class="px-6 py-4 text-sm text-gray-700">
                                    <?= (int) $subscription[
                                        "subscription_id"
                                    ] ?>
                                </td>

                                <td class="px-6 py-4 text-sm font-medium text-gray-900">
                                    <?= htmlspecialchars(
                                        $subscription["service_name"],
                                    ) ?>
                                </td>

                                <td class="px-6 py-4 text-sm text-gray-600">
                                    <?= htmlspecialchars(
                                        $subscription["plan_name"],
                                    ) ?>
                                </td>

                                <td class="px-6 py-4">

                                    <p class="text-sm font-medium text-gray-800">
                                        <?= htmlspecialchars(
                                            $subscription["seller_name"],
                                        ) ?>
                                    </p>

                                    <p class="text-xs text-gray-500">
                                        <?= htmlspecialchars(
                                            $subscription["seller_email"],
                                        ) ?>
                                    </p>

                                </td>

                                <td class="px-6 py-4 text-sm font-medium text-gray-800">
                                    Rs. <?= number_format(
                                        $subscription["price"],
                                        2,
                                    ) ?>
                                </td>

                                <td class="px-6 py-4">

                                    <?php if (
                                        (int) $subscription["available_slots"] >
                                        0
                                    ): ?>

                                        <span class="text-sm text-green-700 font-medium">
                                            <?= (int) $subscription[
                                                "available_slots"
                                            ] ?>
                                            /
                                            <?= (int) $subscription[
                                                "total_slots"
                                            ] ?>
                                        </span>

                                    <?php else: ?>

                                        <span class="text-sm text-gray-500 font-medium">
                                            0
                                            /
                                            <?= (int) $subscription[
                                                "total_slots"
                                            ] ?>
                                        </span>

                                    <?php endif; ?>

                                </td>

                                <td class="px-6 py-4 text-sm text-gray-600">
                                    <?= (int) $subscription[
                                        "duration_days"
                                    ] ?> days
                                </td>

                                <td class="px-6 py-4 text-sm text-gray-600">
                                    <?= date(
                                        "M d, Y",
                                        strtotime($subscription["created_at"]),
                                    ) ?>
                                </td>

                            </tr>

                        <?php endwhile; ?>

                    </tbody>

                </table>

            </div>

        <?php endif; ?>

    </div>

</div>

<?php require_once "../includes/footer.php";

?>
