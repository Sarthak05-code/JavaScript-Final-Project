<?php

require_once "includes/db.php";

$page_title = "Home";

require_once "includes/header.php";
?>

<section class="max-w-6xl mx-auto px-6 py-16">

    <div class="text-center">

        <h1 class="text-4xl font-bold mb-4">
            Welcome to SubShare
        </h1>

        <p class="text-gray-600 max-w-2xl mx-auto mb-8">
            A simple platform for sharing available subscription slots
            between users.
        </p>

        <div class="flex justify-center gap-4">

            <a
                href="register.php"
                class="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800"
            >
                Get Started
            </a>

            <a
                href="#subscriptions"
                class="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50"
            >
                Browse Subscriptions
            </a>

        </div>

    </div>

</section>


<section id="subscriptions" class="max-w-6xl mx-auto px-6 pb-16">

    <h2 class="text-2xl font-bold mb-6">
        Available Subscriptions
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

        <!-- Temporary card -->

        <div class="bg-white rounded-xl shadow-sm border p-6">

            <h3 class="text-xl font-semibold">
                StreamFlix
            </h3>

            <p class="text-gray-500 mt-1">
                Premium Plan
            </p>

            <div class="mt-6">

                <span class="text-2xl font-bold">
                    Rs. 300
                </span>

                <span class="text-gray-500">
                    / 30 days
                </span>

            </div>

            <p class="text-sm text-gray-500 mt-3">
                2 slots available
            </p>

            <button
                class="w-full mt-6 bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800"
            >
                View Details
            </button>

        </div>


        <div class="bg-white rounded-xl shadow-sm border p-6">

            <h3 class="text-xl font-semibold">
                MusicBox
            </h3>

            <p class="text-gray-500 mt-1">
                Family Plan
            </p>

            <div class="mt-6">

                <span class="text-2xl font-bold">
                    Rs. 150
                </span>

                <span class="text-gray-500">
                    / 30 days
                </span>

            </div>

            <p class="text-sm text-gray-500 mt-3">
                3 slots available
            </p>

            <button
                class="w-full mt-6 bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800"
            >
                View Details
            </button>

        </div>


        <div class="bg-white rounded-xl shadow-sm border p-6">

            <h3 class="text-xl font-semibold">
                MovieHub
            </h3>

            <p class="text-gray-500 mt-1">
                Standard Plan
            </p>

            <div class="mt-6">

                <span class="text-2xl font-bold">
                    Rs. 200
                </span>

                <span class="text-gray-500">
                    / 30 days
                </span>

            </div>

            <p class="text-sm text-gray-500 mt-3">
                1 slot available
            </p>

            <button
                class="w-full mt-6 bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800"
            >
                View Details
            </button>

        </div>

    </div>

</section>

<?php require_once "includes/footer.php";

?>
