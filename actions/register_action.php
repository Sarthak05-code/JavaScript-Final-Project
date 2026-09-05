<?php

require_once "../includes/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: ../register.php");
    exit();
}

$name = trim($_POST["name"] ?? "");
$email = trim($_POST["email"] ?? "");
$password = $_POST["password"] ?? "";
$role = $_POST["role"] ?? "";

if ($name === "" || $email === "" || $password === "") {
    die("Please fill in all fields.");
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die("Invalid email address.");
}

if (strlen($password) < 6) {
    die("Password must be at least 6 characters.");
}

if (!in_array($role, ["buyer", "seller"])) {
    die("Invalid account type.");
}

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$sql = "INSERT INTO users (name, email, password, role)
        VALUES (?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

$stmt->bind_param("ssss", $name, $email, $hashed_password, $role);

if ($stmt->execute()) {
    header("Location: ../login.php?registered=1");
    exit();
} else {
    if ($stmt->errno === 1062) {
        die("An account with this email already exists.");
    }

    die("Registration failed.");
}

?>
