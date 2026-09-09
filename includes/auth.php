<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function require_login()
{
    if (!isset($_SESSION["user_id"])) {
        header("Location: /subshare/login.php");
        exit();
    }
}

function require_role($role)
{
    require_login();
    if ($_SESSION["role"] !== $role) {
        header("Location: /subshare/");
        exit();
    }
}

function csrf_token()
{
    if (!isset($_SESSION["csrf_token"])) {
        $_SESSION["csrf_token"] = bin2hex(random_bytes(32));
    }

    return $_SESSION["csrf_token"];
}

function csrf_field()
{
    return '<input type="hidden" name="csrf_token" value="' .
        htmlspecialchars(csrf_token(), ENT_QUOTES, "UTF-8") .
        '">';
}

function csrf_is_valid($token)
{
    return is_string($token) &&
        isset($_SESSION["csrf_token"]) &&
        hash_equals($_SESSION["csrf_token"], $token);
}

?>
