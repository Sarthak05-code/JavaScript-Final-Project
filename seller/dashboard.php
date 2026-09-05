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


    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">

        <?php
        $seller_id = $_SESSION["user_id"];

        $sql = "SELECT COUNT(*) AS total
                FROM subscriptions
                WHERE seller_id = ?";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $seller_id);
        $stmt->execute();

        $result = $stmt->get_result();
        $total_listings = $result->fetch_assoc()["total"];
        ?>


        <div class="bg-white border rounded-xl p-6">

            <p class="text-sm text-gray-500">
                Total Listings
            </p>

            <p class="text-3xl font-bold mt-2">
                <?= $total_listings ?>
            </p>

        </div>


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


    <div class="mt-10">

        <a
            href="../logout.php"
            class="text-sm text-red-600 hover:underline"
        >
            Logout
        </a>

    </div>

</section>

<?php require_once "../includes/footer.php";

?>
