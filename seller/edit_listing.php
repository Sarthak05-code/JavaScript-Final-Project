<?php

require_once "../includes/auth.php";

require_role("seller");

require_once "../includes/db.php";

$subscription_id = $_GET["id"] ?? 0;

if (!filter_var($subscription_id, FILTER_VALIDATE_INT)) {
    die("Invalid listing.");
}

$seller_id = $_SESSION["user_id"];

$sql = "SELECT *
        FROM subscriptions
        WHERE subscription_id = ?
        AND seller_id = ?";

$stmt = $conn->prepare($sql);

$stmt->bind_param("ii", $subscription_id, $seller_id);

$stmt->execute();

$result = $stmt->get_result();

$listing = $result->fetch_assoc();

if (!$listing) {
    die("Listing not found.");
}

$page_title = "Edit Listing";

require_once "../includes/header.php";
?>

<section class="max-w-2xl mx-auto px-6 py-10">

    <div class="bg-white border rounded-xl shadow-sm p-8">

        <h1 class="text-2xl font-bold">
            Edit Listing
        </h1>


        <form
            action="../actions/edit_listing_action.php"
            method="POST"
            class="mt-8"
        >

            <input
                type="hidden"
                name="subscription_id"
                value="<?= $listing["subscription_id"] ?>"
            >


            <div class="mb-5">

                <label class="block text-sm font-medium mb-2">
                    Service Name
                </label>

                <input
                    type="text"
                    name="service_name"
                    value="<?= htmlspecialchars($listing["service_name"]) ?>"
                    required
                    class="w-full border rounded-lg px-4 py-2.5"
                >

            </div>


            <div class="mb-5">

                <label class="block text-sm font-medium mb-2">
                    Plan Name
                </label>

                <input
                    type="text"
                    name="plan_name"
                    value="<?= htmlspecialchars($listing["plan_name"]) ?>"
                    required
                    class="w-full border rounded-lg px-4 py-2.5"
                >

            </div>


            <div class="mb-5">

                <label class="block text-sm font-medium mb-2">
                    Price
                </label>

                <input
                    type="number"
                    name="price"
                    value="<?= $listing["price"] ?>"
                    min="1"
                    step="0.01"
                    required
                    class="w-full border rounded-lg px-4 py-2.5"
                >

            </div>


            <div class="mb-6">

                <label class="block text-sm font-medium mb-2">
                    Duration
                </label>

                <label
                    for="duration_days"
                    class="block text-sm font-medium text-gray-700 mb-2"
                >
                    Duration
                </label>

                <select
                    id="duration_days"
                    name="duration_days"
                    required
                    class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
                >

                    <option value="7"
                        <?= $listing["duration_days"] == 7 ? "selected" : "" ?>>
                        7 Days
                    </option>

                    <option value="30"
                        <?= $listing["duration_days"] == 30
                            ? "selected"
                            : "" ?>>
                        30 Days
                    </option>

                    <option value="90"
                        <?= $listing["duration_days"] == 90
                            ? "selected"
                            : "" ?>>
                        90 Days
                    </option>

                </select>

            </div>


            <div class="flex gap-3">

                <a
                    href="my_listings.php"
                    class="flex-1 text-center border py-2.5 rounded-lg"
                >
                    Cancel
                </a>

                <button
                    type="submit"
                    class="flex-1 bg-gray-900 text-white py-2.5 rounded-lg"
                >
                    Save Changes
                </button>

            </div>

        </form>

    </div>

</section>

<?php require_once "../includes/footer.php";

?>
