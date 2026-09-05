<?php

require_once "../includes/auth.php";
require_once "../includes/db.php";

/*
|--------------------------------------------------------------------------
| JSON Response
|--------------------------------------------------------------------------
*/

header("Content-Type: application/json");

/*
|--------------------------------------------------------------------------
| Check Request Method
|--------------------------------------------------------------------------
*/

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request.",
    ]);

    exit();
}

/*
|--------------------------------------------------------------------------
| Check Buyer Login
|--------------------------------------------------------------------------
*/

if (!isset($_SESSION["user_id"]) || $_SESSION["role"] !== "buyer") {
    echo json_encode([
        "success" => false,
        "message" => "You must be logged in as a buyer.",
    ]);

    exit();
}

$buyer_id = (int) $_SESSION["user_id"];

/*
|--------------------------------------------------------------------------
| Get Subscription ID
|--------------------------------------------------------------------------
*/

$subscription_id = (int) ($_POST["subscription_id"] ?? 0);

if ($subscription_id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid subscription.",
    ]);

    exit();
}

/*
|--------------------------------------------------------------------------
| Start Database Transaction
|--------------------------------------------------------------------------
*/

$conn->begin_transaction();

try {
    /*
    |--------------------------------------------------------------------------
    | Fetch Subscription
    |--------------------------------------------------------------------------
    */

    $sql = "SELECT
                subscription_id,
                price,
                available_slots,
                duration_days
            FROM subscriptions
            WHERE subscription_id = ?
            FOR UPDATE";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param("i", $subscription_id);

    $stmt->execute();

    $result = $stmt->get_result();

    $subscription = $result->fetch_assoc();

    /*
    |--------------------------------------------------------------------------
    | Check Subscription
    |--------------------------------------------------------------------------
    */

    if (!$subscription) {
        throw new Exception("Subscription not found.");
    }

    /*
    |--------------------------------------------------------------------------
    | Check Available Slots
    |--------------------------------------------------------------------------
    */

    if ((int) $subscription["available_slots"] <= 0) {
        throw new Exception("No slots are currently available.");
    }

    /*
    |--------------------------------------------------------------------------
    | Calculate Expiry Date
    |--------------------------------------------------------------------------
    */

    $duration_days = (int) $subscription["duration_days"];

    $purchase_date = new DateTime();

    $expiry_date = clone $purchase_date;

    $expiry_date->modify("+" . $duration_days . " days");

    $expiry_date_value = $expiry_date->format("Y-m-d");

    /*
    |--------------------------------------------------------------------------
    | Create Purchase
    |--------------------------------------------------------------------------
    */

    $sql = "INSERT INTO purchases
            (
                buyer_id,
                subscription_id,
                expiry_date,
                status
            )
            VALUES (?, ?, ?, 'active')";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param("iis", $buyer_id, $subscription_id, $expiry_date_value);

    $stmt->execute();

    /*
    |--------------------------------------------------------------------------
    | Decrease Available Slots
    |--------------------------------------------------------------------------
    */

    $sql = "UPDATE subscriptions
            SET available_slots = available_slots - 1
            WHERE subscription_id = ?
            AND available_slots > 0";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param("i", $subscription_id);

    $stmt->execute();

    /*
    |--------------------------------------------------------------------------
    | Confirm Slot Update
    |--------------------------------------------------------------------------
    */

    if ($stmt->affected_rows !== 1) {
        throw new Exception("The subscription slot is no longer available.");
    }

    /*
    |--------------------------------------------------------------------------
    | Commit Transaction
    |--------------------------------------------------------------------------
    */

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Subscription slot purchased successfully.",
    ]);

    exit();
} catch (Exception $e) {
    /*
    |--------------------------------------------------------------------------
    | Rollback
    |--------------------------------------------------------------------------
    */

    $conn->rollback();

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage(),
    ]);

    exit();
}

?>
