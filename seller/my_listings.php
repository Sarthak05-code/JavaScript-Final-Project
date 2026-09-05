<?php

require_once "../includes/auth.php";

require_role("seller");

require_once "../includes/db.php";

$page_title = "My Listings";

require_once "../includes/header.php";

$seller_id = $_SESSION["user_id"];

$sql = "SELECT *
        FROM subscriptions
        WHERE seller_id = ?
        ORDER BY created_at DESC";

$stmt = $conn->prepare($sql);

$stmt->bind_param("i", $seller_id);

$stmt->execute();

$result = $stmt->get_result();
?>

<section class="max-w-6xl mx-auto px-6 py-10">

    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

            <h1 class="text-3xl font-bold">
                My Listings
            </h1>

            <p class="text-gray-500 mt-1">
                Manage your subscription listings.
            </p>

        </div>

        <a
            href="create_listing.php"
            class="bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 text-center"
        >
            + Create Listing
        </a>

    </div>


    <?php if (isset($_GET["created"])): ?>

        <div class="mb-6 bg-green-100 text-green-700 px-4 py-3 rounded-lg">
            Listing created successfully.
        </div>

    <?php endif; ?>


    <?php if (isset($_GET["updated"])): ?>

        <div class="mb-6 bg-green-100 text-green-700 px-4 py-3 rounded-lg">
            Listing updated successfully.
        </div>

    <?php endif; ?>


    <?php if ($result->num_rows === 0): ?>

        <div class="mt-10 bg-white border rounded-xl p-10 text-center">

            <h2 class="text-xl font-semibold">
                No listings yet
            </h2>

            <p class="text-gray-500 mt-2">
                Create your first subscription listing.
            </p>

        </div>

    <?php else: ?>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">

            <?php while ($listing = $result->fetch_assoc()): ?>

                <div class="bg-white border rounded-xl shadow-sm p-6">

                    <div class="flex items-start justify-between gap-3">

                        <div>

                            <h2 class="text-xl font-semibold">
                                <?= htmlspecialchars(
                                    $listing["service_name"],
                                ) ?>
                            </h2>

                            <p class="text-gray-500 text-sm mt-1">
                                <?= htmlspecialchars($listing["plan_name"]) ?>
                            </p>

                        </div>

                        <span class="text-xs bg-gray-100 px-2.5 py-1 rounded-full">
                            <?= $listing["duration_days"] ?> days
                        </span>

                    </div>


                    <div class="mt-6">

                        <span class="text-2xl font-bold">
                            Rs. <?= number_format($listing["price"], 2) ?>
                        </span>

                        <span class="text-gray-500 text-sm">
                            / slot
                        </span>

                    </div>


                    <div class="mt-4 text-sm">

                        <p class="text-gray-600">
                            Available:
                            <strong>
                                <?= $listing["available_slots"] ?>
                            </strong>
                        </p>

                        <p class="text-gray-600 mt-1">
                            Total:
                            <strong>
                                <?= $listing["total_slots"] ?>
                            </strong>
                        </p>

                    </div>


                    <div class="flex gap-3 mt-6">

                        <a
                            href="edit_listing.php?id=<?= $listing[
                                "subscription_id"
                            ] ?>"
                            class="flex-1 text-center border border-gray-300 py-2 rounded-lg hover:bg-gray-50 text-sm"
                        >
                            Edit
                        </a>

                        <form
                            action="../actions/delete_listing_action.php"
                            method="POST"
                            class="flex-1"
                            onsubmit="return confirm('Are you sure you want to delete this listing?');"
                        >

                            <input
                                type="hidden"
                                name="subscription_id"
                                value="<?= $listing["subscription_id"] ?>"
                            >

                            <button
                                type="submit"
                                class="w-full border border-red-200 text-red-600 py-2 rounded-lg hover:bg-red-50 text-sm"
                            >
                                Delete
                            </button>

                        </form>

                    </div>

                </div>

            <?php endwhile; ?>

        </div>

    <?php endif; ?>

</section>

<?php require_once "../includes/footer.php";

?>
