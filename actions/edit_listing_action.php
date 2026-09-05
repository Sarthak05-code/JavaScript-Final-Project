<?php

require_once "../includes/auth.php";
require_once "../includes/db.php";

require_role("seller");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: ../seller/my_listings.php");
    exit();
}

$subscription_id = (int) ($_POST["subscription_id"] ?? 0);

$service_name = trim($_POST["service_name"] ?? "");
$plan_name = trim($_POST["plan_name"] ?? "");
$price = trim($_POST["price"] ?? "");
$duration_days = trim($_POST["duration_days"] ?? "");

if ($subscription_id <= 0) {
    header("Location: ../seller/my_listings.php");
    exit();
}

/*
|--------------------------------------------------------------------------
| Required Fields
|--------------------------------------------------------------------------
*/

if (
    $service_name === "" ||
    $plan_name === "" ||
    $price === "" ||
    $duration_days === ""
) {
    header(
        "Location: ../seller/edit_listing.php?id=" .
            $subscription_id .
            "&error=fields",
    );

    exit();
}

/*
|--------------------------------------------------------------------------
| Validate Price
|--------------------------------------------------------------------------
*/

if (!is_numeric($price) || $price <= 0) {
    header(
        "Location: ../seller/edit_listing.php?id=" .
            $subscription_id .
            "&error=price",
    );

    exit();
}

/*
|--------------------------------------------------------------------------
| Validate Duration
|--------------------------------------------------------------------------
*/

if (!in_array((int) $duration_days, [7, 30, 90], true)) {
    header(
        "Location: ../seller/edit_listing.php?id=" .
            $subscription_id .
            "&error=duration",
    );

    exit();
}

/*
|--------------------------------------------------------------------------
| Update Listing
|--------------------------------------------------------------------------
*/

$seller_id = $_SESSION["user_id"];

$sql = "UPDATE subscriptions
        SET
            service_name = ?,
            plan_name = ?,
            price = ?,
            duration_days = ?
        WHERE subscription_id = ?
        AND seller_id = ?";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "ssdiii",
    $service_name,
    $plan_name,
    $price,
    $duration_days,
    $subscription_id,
    $seller_id,
);

if ($stmt->execute()) {
    header("Location: ../seller/my_listings.php?updated=1");
    exit();
}

header(
    "Location: ../seller/edit_listing.php?id=" .
        $subscription_id .
        "&error=database",
);

exit();

?>
