<?php

require_once "../includes/auth.php";
require_once "../includes/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: ../login.php");
    exit();
}

if (!csrf_is_valid($_POST["csrf_token"] ?? null)) {
    header("Location: ../login.php?error=1");
    exit();
}

$email = trim($_POST["email"] ?? "");
$password = $_POST["password"] ?? "";

if ($email === "" || $password === "") {
    header("Location: ../login.php?error=1");
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header("Location: ../login.php?error=1");
    exit();
}

$sql = "SELECT user_id, name, email, password, role
        FROM users
        WHERE email = ?";

$stmt = $conn->prepare($sql);

$stmt->bind_param("s", $email);

$stmt->execute();

$result = $stmt->get_result();

$user = $result->fetch_assoc();

if (!$user || !password_verify($password, $user["password"])) {
    header("Location: ../login.php?error=1");
    exit();
}

session_regenerate_id(true);

$_SESSION["user_id"] = $user["user_id"];
$_SESSION["name"] = $user["name"];
$_SESSION["email"] = $user["email"];
$_SESSION["role"] = $user["role"];

if ($user["role"] === "buyer") {
    header("Location: ../buyer/dashboard.php");
} elseif ($user["role"] === "seller") {
    header("Location: ../seller/dashboard.php");
} elseif ($user["role"] === "admin") {
    header("Location: ../admin/dashboard.php");
}

exit();

?>
