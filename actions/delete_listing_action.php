<?php

require_once "../includes/auth.php";

require_role("seller");

require_once "../includes/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: ../seller/my_listings.php");
    exit();
}

$seller_id = $_SESSION["user_id"];

$subscription_id = $_POST["subscription_id"] ?? 0;

if (!filter_var($subscription_id, FILTER_VALIDATE_INT)) {
    die("Invalid listing.");
}

$sql = "DELETE FROM subscriptions
        WHERE subscription_id = ?
        AND seller_id = ?";

$stmt = $conn->prepare($sql);

$stmt->bind_param("ii", $subscription_id, $seller_id);

if ($stmt->execute()) {
    header("Location: ../seller/my_listings.php");
    exit();
}

die("Failed to delete listing.");

?>
