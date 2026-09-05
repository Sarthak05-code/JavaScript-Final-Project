<?php

require_once "../includes/auth.php";
require_once "../includes/db.php";

require_role("buyer");

$page_title = "My Purchases";

require_once "../includes/header.php";

$buyer_id = $_SESSION["user_id"];

/*
|--------------------------------------------------------------------------
| Update expired purchases
|--------------------------------------------------------------------------
| Any active purchase whose expiry date has passed
| will be marked as expired.
*/

$sql = "UPDATE purchases
        SET status = 'expired'
        WHERE buyer_id = ?
        AND expiry_date < CURDATE()
        AND status = 'active'";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $buyer_id);
$stmt->execute();

/*
|--------------------------------------------------------------------------
| Fetch buyer purchases
|--------------------------------------------------------------------------
*/

$sql = "SELECT
            p.purchase_id,
            p.purchase_date,
            p.expiry_date,
            p.status,
            s.service_name,
            s.plan_name,
            s.price,
            s.duration_days
        FROM purchases p
        INNER JOIN subscriptions s
            ON p.subscription_id = s.subscription_id
        WHERE p.buyer_id = ?
        ORDER BY p.purchase_date DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $buyer_id);
$stmt->execute();

$result = $stmt->get_result();
?>

<div class="max-w-6xl mx-auto px-6 py-10">

    <!-- Page Heading -->

    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
            <h1 class="text-3xl font-bold text-gray-900">
                My Purchases
            </h1>

            <p class="text-gray-600 mt-2">
                View your purchased subscription slots and their expiry dates.
            </p>
        </div>

        <a
            href="../index.php"
            class="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700"
        >
            Browse Subscriptions
        </a>

    </div>


    <?php if ($result->num_rows === 0): ?>

        <!-- No Purchases -->

        <div class="bg-white border border-gray-200 rounded-xl p-10 text-center">

            <h2 class="text-xl font-semibold text-gray-800 mb-2">
                No Purchases Yet
            </h2>

            <p class="text-gray-600 mb-6">
                You have not purchased any subscription slots yet.
            </p>

            <a
                href="../index.php"
                class="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700"
            >
                Browse Subscriptions
            </a>

        </div>

    <?php else: ?>

        <!-- Purchases -->

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <?php while ($purchase = $result->fetch_assoc()): ?>

                <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

                    <!-- Service -->

                    <div class="flex items-start justify-between gap-3 mb-4">

                        <div>

                            <h2 class="text-xl font-bold text-gray-900">
                                <?= htmlspecialchars(
                                    $purchase["service_name"],
                                ) ?>
                            </h2>

                            <p class="text-gray-600">
                                <?= htmlspecialchars($purchase["plan_name"]) ?>
                            </p>

                        </div>

                        <?php if ($purchase["status"] === "active"): ?>

                            <span class="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                                Active
                            </span>

                        <?php else: ?>

                            <span class="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                                Expired
                            </span>

                        <?php endif; ?>

                    </div>


                    <!-- Price -->

                    <div class="mb-5">

                        <p class="text-2xl font-bold text-gray-900">
                            Rs. <?= number_format($purchase["price"], 2) ?>
                        </p>

                        <p class="text-sm text-gray-500">
                            Per slot / <?= (int) $purchase[
                                "duration_days"
                            ] ?> days
                        </p>

                    </div>


                    <!-- Purchase Details -->

                    <div class="space-y-3 text-sm">

                        <div class="flex justify-between border-b border-gray-100 pb-2">

                            <span class="text-gray-500">
                                Purchase Date
                            </span>

                            <span class="font-medium text-gray-800">
                                <?= date(
                                    "M d, Y",
                                    strtotime($purchase["purchase_date"]),
                                ) ?>
                            </span>

                        </div>


                        <div class="flex justify-between">

                            <span class="text-gray-500">
                                Expiry Date
                            </span>

                            <span class="font-medium text-gray-800">
                                <?= date(
                                    "M d, Y",
                                    strtotime($purchase["expiry_date"]),
                                ) ?>
                            </span>

                        </div>

                    </div>

                </div>

            <?php endwhile; ?>

        </div>

    <?php endif; ?>

</div>

<?php require_once "../includes/footer.php";

?>
