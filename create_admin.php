<?php

require_once "includes/db.php";

$name = "SubShare Admin";
$email = "admin@subshare.com";
$password = "admin123";
$role = "admin";

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$sql = "INSERT INTO users
        (name, email, password, role)
        VALUES (?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

$stmt->bind_param("ssss", $name, $email, $hashed_password, $role);

if ($stmt->execute()) {
    echo "Admin account created successfully.";
} else {
    echo "Error creating admin account: " . $stmt->error;
}

?>
