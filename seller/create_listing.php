<?php

require_once "../includes/auth.php";

require_role("seller");

$page_title = "Create Listing";

require_once "../includes/header.php";
?>

<section class="max-w-3xl mx-auto px-6 py-12">

    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">
            Create Subscription Listing
        </h1>

        <p class="text-gray-500 mt-2">
            Add a subscription plan and make available slots for buyers.
        </p>
    </div>

    <?php if (isset($_GET["error"])): ?>

        <div class="mb-6 bg-red-100 text-red-700 px-4 py-3 rounded-lg">
            <?php if ($_GET["error"] === "fields") {
                echo "Please fill in all fields.";
            } elseif ($_GET["error"] === "price") {
                echo "Price must be greater than 0.";
            } elseif ($_GET["error"] === "slots") {
                echo "Number of slots must be at least 1.";
            } elseif ($_GET["error"] === "duration") {
                echo "Please select a valid duration.";
            } else {
                echo "Something went wrong. Please try again.";
            } ?>
        </div>

    <?php endif; ?>


    <form
        action="../actions/create_listing_action.php"
        method="POST"
        class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
    >

        <!-- Service Name -->
        <div class="mb-5">

            <label
                for="service_name"
                class="block text-sm font-medium text-gray-700 mb-2"
            >
                Service Name
            </label>

            <input
                type="text"
                id="service_name"
                name="service_name"
                required
                maxlength="100"
                class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="e.g. StreamFlix"
            >

        </div>


        <!-- Plan Name -->
        <div class="mb-5">

            <label
                for="plan_name"
                class="block text-sm font-medium text-gray-700 mb-2"
            >
                Plan Name
            </label>

            <input
                type="text"
                id="plan_name"
                name="plan_name"
                required
                maxlength="100"
                class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="e.g. Premium Plan"
            >

        </div>


        <!-- Price -->
        <div class="mb-5">

            <label
                for="price"
                class="block text-sm font-medium text-gray-700 mb-2"
            >
                Price per Slot (Rs.)
            </label>

            <input
                type="number"
                id="price"
                name="price"
                required
                min="1"
                step="0.01"
                class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="e.g. 300"
            >

        </div>


        <!-- Total Slots -->
        <div class="mb-5">

            <label
                for="total_slots"
                class="block text-sm font-medium text-gray-700 mb-2"
            >
                Total Slots
            </label>

            <input
                type="number"
                id="total_slots"
                name="total_slots"
                required
                min="1"
                step="1"
                class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="e.g. 5"
            >

        </div>


        <!-- Duration -->
        <div class="mb-6">

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

                <option value="">
                    Select duration
                </option>

                <option value="7">
                    7 Days
                </option>

                <option value="30">
                    30 Days
                </option>

                <option value="90">
                    90 Days
                </option>

            </select>

        </div>


        <!-- Buttons -->
        <div class="flex gap-3">

            <a
                href="my_listings.php"
                class="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
                Cancel
            </a>

            <button
                type="submit"
                class="bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800"
            >
                Create Listing
            </button>

        </div>

    </form>

</section>


<?php require_once "../includes/footer.php";

?>
