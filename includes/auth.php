<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function require_login()
{
    if (!isset($_SESSION["user_id"])) {
        header("Location : /subshare/login.php");
        exit();
    }
}

function require_role($role)
{
    require_login();
    if ($_SESSION["role"] !== $role) {
        header("Location : /subshare");
        exit();
    }
}

?>
