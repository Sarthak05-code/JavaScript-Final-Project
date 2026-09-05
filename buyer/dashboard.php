<?php

require_once "../includes/auth.php";

require_role("buyer");

$page_title = "Buyer Dashboard";

require_once "../includes/header.php";
?>

<section class="max-w-6xl mx-auto px-6 py-12">

    <h1 class="text-3xl font-bold">
        Welcome, <?= htmlspecialchars($_SESSION["name"]) ?>
    </h1>

    <p class="text-gray-500 mt-2">
        This is your buyer dashboard.
    </p>

    <a
        href="../logout.php"
        class="inline-block mt-6 bg-gray-900 text-white px-5 py-2.5 rounded-lg"
    >
        Logout
    </a>

</section>

<?php require_once "../includes/footer.php";

?>
