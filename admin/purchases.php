<?php

require_once "../includes/auth.php";
require_once "../includes/db.php";

require_role("admin");

$page_title = "View Purchases";

require_once "../includes/header.php";

/*
|--------------------------------------------------------------------------
| Update expired purchases
|--------------------------------------------------------------------------
*/

$sql = "UPDATE purchases
        SET status = 'expired'
        WHERE expiry_date < CURDATE()
        AND status = 'active'";

$conn->query($sql);

/*
|--------------------------------------------------------------------------
| Fetch all purchases
|--------------------------------------------------------------------------
*/

$sql = "SELECT
            p.purchase_id,
            p.purchase_date,
            p.expiry_date,
            p.status,

            b.name AS buyer_name,
            b.email AS buyer_email,

            s.service_name,
            s.plan_name,
            s.price,

            seller.name AS seller_name

        FROM purchases p

        INNER JOIN users b
            ON p.buyer_id = b.user_id

        INNER JOIN subscriptions s
            ON p.subscription_id = s.subscription_id

        INNER JOIN users seller
            ON s.seller_id = seller.user_id

        ORDER BY p.purchase_date DESC";

$result = $conn->query($sql);
?>

<div class="max-w-6xl mx-auto px-6 py-10">

    <!-- Page Heading -->

    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>

            <h1 class="text-3xl font-bold text-gray-900">
                View Purchases
            </h1>

            <p class="text-gray-600 mt-2">
                Monitor subscription purchases and their expiry status.
            </p>

        </div>

        <a
            href="dashboard.php"
            class="inline-block bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg hover:bg-gray-300"
        >
            Back to Dashboard
        </a>

    </div>


    <!-- Purchases Table -->

    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">

        <?php if ($result->num_rows === 0): ?>

            <div class="p-8 text-center">

                <p class="text-gray-600">
                    No purchases have been made yet.
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
                                Buyer
                            </th>

                            <th class="px-6 py-4 text-sm font-semibold text-gray-700">
                                Subscription
                            </th>

                            <th class="px-6 py-4 text-sm font-semibold text-gray-700">
                                Seller
                            </th>

                            <th class="px-6 py-4 text-sm font-semibold text-gray-700">
                                Price
                            </th>

                            <th class="px-6 py-4 text-sm font-semibold text-gray-700">
                                Purchase Date
                            </th>

                            <th class="px-6 py-4 text-sm font-semibold text-gray-700">
                                Expiry Date
                            </th>

                            <th class="px-6 py-4 text-sm font-semibold text-gray-700">
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody class="divide-y divide-gray-100">

                        <?php while ($purchase = $result->fetch_assoc()): ?>

                            <tr class="hover:bg-gray-50">

                                <!-- Purchase ID -->

                                <td class="px-6 py-4 text-sm text-gray-700">
                                    <?= (int) $purchase["purchase_id"] ?>
                                </td>


                                <!-- Buyer -->

                                <td class="px-6 py-4">

                                    <p class="text-sm font-medium text-gray-900">
                                        <?= htmlspecialchars(
                                            $purchase["buyer_name"],
                                        ) ?>
                                    </p>

                                    <p class="text-xs text-gray-500">
                                        <?= htmlspecialchars(
                                            $purchase["buyer_email"],
                                        ) ?>
                                    </p>

                                </td>


                                <!-- Subscription -->

                                <td class="px-6 py-4">

                                    <p class="text-sm font-medium text-gray-900">
                                        <?= htmlspecialchars(
                                            $purchase["service_name"],
                                        ) ?>
                                    </p>

                                    <p class="text-xs text-gray-500">
                                        <?= htmlspecialchars(
                                            $purchase["plan_name"],
                                        ) ?>
                                    </p>

                                </td>


                                <!-- Seller -->

                                <td class="px-6 py-4 text-sm text-gray-700">
                                    <?= htmlspecialchars(
                                        $purchase["seller_name"],
                                    ) ?>
                                </td>


                                <!-- Price -->

                                <td class="px-6 py-4 text-sm font-medium text-gray-800">
                                    Rs. <?= number_format(
                                        $purchase["price"],
                                        2,
                                    ) ?>
                                </td>


                                <!-- Purchase Date -->

                                <td class="px-6 py-4 text-sm text-gray-600">
                                    <?= date(
                                        "M d, Y",
                                        strtotime($purchase["purchase_date"]),
                                    ) ?>
                                </td>


                                <!-- Expiry Date -->

                                <td class="px-6 py-4 text-sm text-gray-600">
                                    <?= date(
                                        "M d, Y",
                                        strtotime($purchase["expiry_date"]),
                                    ) ?>
                                </td>


                                <!-- Status -->

                                <td class="px-6 py-4">

                                    <?php if (
                                        $purchase["status"] === "active"
                                    ): ?>

                                        <span class="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                                            Active
                                        </span>

                                    <?php else: ?>

                                        <span class="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                                            Expired
                                        </span>

                                    <?php endif; ?>

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
