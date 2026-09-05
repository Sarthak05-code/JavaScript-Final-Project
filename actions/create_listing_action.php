<?php

require_once "../includes/auth.php";
require_once "../includes/db.php";

require_role("seller");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: ../seller/create_listing.php");
    exit();
}

$service_name = trim($_POST["service_name"] ?? "");
$plan_name = trim($_POST["plan_name"] ?? "");
$price = trim($_POST["price"] ?? "");
$total_slots = trim($_POST["total_slots"] ?? "");
$duration_days = trim($_POST["duration_days"] ?? "");

/*
|--------------------------------------------------------------------------
| Required Fields
|--------------------------------------------------------------------------
*/

if (
    $service_name === "" ||
    $plan_name === "" ||
    $price === "" ||
    $total_slots === "" ||
    $duration_days === ""
) {
    header("Location: ../seller/create_listing.php?error=fields");
    exit();
}

/*
|--------------------------------------------------------------------------
| Validate Price
|--------------------------------------------------------------------------
*/

if (!is_numeric($price) || $price <= 0) {
    header("Location: ../seller/create_listing.php?error=price");
    exit();
}

/*
|--------------------------------------------------------------------------
| Validate Total Slots
|--------------------------------------------------------------------------
*/

if (!filter_var($total_slots, FILTER_VALIDATE_INT) || $total_slots < 1) {
    header("Location: ../seller/create_listing.php?error=slots");
    exit();
}

/*
|--------------------------------------------------------------------------
| Validate Duration
|--------------------------------------------------------------------------
*/

if (!in_array((int) $duration_days, [7, 30, 90], true)) {
    header("Location: ../seller/create_listing.php?error=duration");
    exit();
}

/*
|--------------------------------------------------------------------------
| Insert Listing
|--------------------------------------------------------------------------
*/

$seller_id = $_SESSION["user_id"];

$available_slots = (int) $total_slots;

$sql = "INSERT INTO subscriptions
        (
            seller_id,
            service_name,
            plan_name,
            price,
            total_slots,
            available_slots,
            duration_days
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "issdiii",
    $seller_id,
    $service_name,
    $plan_name,
    $price,
    $total_slots,
    $available_slots,
    $duration_days,
);

if ($stmt->execute()) {
    header("Location: ../seller/my_listings.php?created=1");
    exit();
}

/*
|--------------------------------------------------------------------------
| Database Error
|--------------------------------------------------------------------------
*/

header("Location: ../seller/create_listing.php?error=database");
exit();

?>
