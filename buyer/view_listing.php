<?php

require_once "../includes/auth.php";
require_once "../includes/db.php";

$page_title = "Subscription Details";

require_once "../includes/header.php";

/*
|--------------------------------------------------------------------------
| Get Subscription ID
|--------------------------------------------------------------------------
*/

$subscription_id = (int) ($_GET["id"] ?? 0);

if ($subscription_id <= 0) {
    header("Location: ../index.php");
    exit();
}

/*
|--------------------------------------------------------------------------
| Fetch Subscription
|--------------------------------------------------------------------------
*/

$sql = "SELECT
            subscription_id,
            service_name,
            plan_name,
            price,
            total_slots,
            available_slots,
            duration_days,
            created_at
        FROM subscriptions
        WHERE subscription_id = ?";

$stmt = $conn->prepare($sql);

$stmt->bind_param("i", $subscription_id);

$stmt->execute();

$result = $stmt->get_result();

$listing = $result->fetch_assoc();

/*
|--------------------------------------------------------------------------
| Listing Not Found
|--------------------------------------------------------------------------
*/

if (!$listing) {
    header("Location: ../index.php");
    exit();
}
?>

<section class="max-w-4xl mx-auto px-6 py-12">

    <!-- Back -->

    <a
        href="../index.php"
        class="inline-block text-sm text-gray-500 hover:text-gray-900 mb-8"
    >
        &larr; Back to Subscriptions
    </a>


    <!-- Listing Card -->

    <div
        class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
    >

        <div class="p-8">

            <!-- Service -->

            <div>

                <p class="text-sm text-gray-500">
                    Subscription Service
                </p>

                <h1 class="text-3xl font-bold text-gray-900 mt-1">
                    <?= htmlspecialchars($listing["service_name"]) ?>
                </h1>

                <p class="text-lg text-gray-500 mt-2">
                    <?= htmlspecialchars($listing["plan_name"]) ?>
                </p>

            </div>


            <!-- Price -->

            <div class="mt-8">

                <p class="text-sm text-gray-500">
                    Price per Slot
                </p>

                <p class="text-3xl font-bold text-gray-900 mt-1">
                    Rs. <?= number_format($listing["price"], 2) ?>
                </p>

                <p class="text-sm text-gray-500 mt-1">
                    for <?= $listing["duration_days"] ?> days
                </p>

            </div>


            <!-- Details -->

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">

                <!-- Duration -->

                <div
                    class="bg-gray-50 border border-gray-200 rounded-lg p-4"
                >

                    <p class="text-sm text-gray-500">
                        Duration
                    </p>

                    <p class="font-semibold text-gray-900 mt-1">
                        <?= $listing["duration_days"] ?> Days
                    </p>

                </div>


                <!-- Available Slots -->

                <div
                    class="bg-gray-50 border border-gray-200 rounded-lg p-4"
                >

                    <p class="text-sm text-gray-500">
                        Available Slots
                    </p>

                    <p class="font-semibold text-gray-900 mt-1">
                        <?= $listing["available_slots"] ?>
                    </p>

                </div>


                <!-- Total Slots -->

                <div
                    class="bg-gray-50 border border-gray-200 rounded-lg p-4"
                >

                    <p class="text-sm text-gray-500">
                        Total Slots
                    </p>

                    <p class="font-semibold text-gray-900 mt-1">
                        <?= $listing["total_slots"] ?>
                    </p>

                </div>

            </div>


            <!-- Purchase Area -->

            <div class="border-t border-gray-200 mt-8 pt-8">

                <?php if ($listing["available_slots"] > 0): ?>


                    <!-- Logged-in Buyer -->

                    <?php if (
                        isset($_SESSION["user_id"]) &&
                        $_SESSION["role"] === "buyer"
                    ): ?>

                        <button
                            type="button"
                            id="purchaseButton"
                            data-subscription-id="<?= $listing[
                                "subscription_id"
                            ] ?>"
                            class="w-full bg-gray-900 text-white px-5 py-3 rounded-lg hover:bg-gray-800"
                        >
                            Purchase Slot
                        </button>

                        <p
                            id="purchaseMessage"
                            class="text-sm text-center mt-3 hidden"
                        ></p>


                    <!-- Guest -->

                    <?php elseif (!isset($_SESSION["user_id"])): ?>

                        <a
                            href="../login.php"
                            class="block text-center bg-gray-900 text-white px-5 py-3 rounded-lg hover:bg-gray-800"
                        >
                            Login to Purchase
                        </a>

                        <p class="text-sm text-gray-500 text-center mt-3">
                            You need a buyer account to purchase a slot.
                        </p>


                    <!-- Seller / Admin -->

                    <?php else: ?>

                        <div
                            class="bg-gray-100 text-gray-600 text-center px-5 py-3 rounded-lg"
                        >
                            Only buyer accounts can purchase subscription slots.
                        </div>

                    <?php endif; ?>


                <?php else: ?>

                    <!-- No Slots -->

                    <div
                        class="bg-gray-100 text-gray-600 text-center px-5 py-3 rounded-lg"
                    >
                        No slots are currently available.
                    </div>

                <?php endif; ?>

            </div>

        </div>

    </div>

</section>


<!-- Purchase AJAX -->

<?php if (
    isset($_SESSION["user_id"]) &&
    $_SESSION["role"] === "buyer" &&
    $listing["available_slots"] > 0
): ?>

<script>

const purchaseButton = document.getElementById("purchaseButton");
const purchaseMessage = document.getElementById("purchaseMessage");


if (purchaseButton) {

    purchaseButton.addEventListener("click", function () {

        const subscriptionId =
            this.dataset.subscriptionId;


        const confirmed = confirm(
            "Are you sure you want to purchase this subscription slot?"
        );


        if (!confirmed) {
            return;
        }


        purchaseButton.disabled = true;

        purchaseButton.textContent = "Processing...";


        fetch("../ajax/purchase.php", {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded"
            },

            body:
                "subscription_id=" +
                encodeURIComponent(subscriptionId)

        })


        .then(response => response.json())


        .then(data => {

            if (data.success) {

                purchaseMessage.textContent =
                    data.message;

                purchaseMessage.className =
                    "text-sm text-center mt-3 text-green-600";

                purchaseMessage.classList.remove("hidden");

                purchaseButton.textContent =
                    "Purchase Successful";


            } else {

                purchaseMessage.textContent =
                    data.message;

                purchaseMessage.className =
                    "text-sm text-center mt-3 text-red-600";

                purchaseMessage.classList.remove("hidden");

                purchaseButton.disabled = false;

                purchaseButton.textContent =
                    "Purchase Slot";

            }

        })


        .catch(() => {

            purchaseMessage.textContent =
                "Something went wrong. Please try again.";

            purchaseMessage.className =
                "text-sm text-center mt-3 text-red-600";

            purchaseMessage.classList.remove("hidden");

            purchaseButton.disabled = false;

            purchaseButton.textContent =
                "Purchase Slot";

        });

    });

}

</script>

<?php endif; ?>


<?php require_once "../includes/footer.php";

?>
