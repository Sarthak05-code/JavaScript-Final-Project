<?php

$page_title = "Login";

require_once "includes/header.php";
?>

<section class="max-w-md mx-auto px-6 py-12">

    <div class="bg-white border rounded-xl shadow-sm p-8">

        <h1 class="text-2xl font-bold text-center">
            Login
        </h1>

        <p class="text-gray-500 text-center mt-2">
            Login to your SubShare account.
        </p>


        <?php if (isset($_GET["registered"])): ?>

            <div class="mt-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                Account created successfully. You can now login.
            </div>

        <?php endif; ?>


        <?php if (isset($_GET["error"])): ?>

            <div class="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                Invalid email or password.
            </div>

        <?php endif; ?>


        <form action="actions/login_action.php" method="POST" class="mt-8">

            <div class="mb-5">

                <label class="block text-sm font-medium mb-2">
                    Email
                </label>

                <input
                    type="email"
                    name="email"
                    required
                    class="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Enter your email"
                >

            </div>


            <div class="mb-6">

                <label class="block text-sm font-medium mb-2">
                    Password
                </label>

                <input
                    type="password"
                    name="password"
                    required
                    class="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Enter your password"
                >

            </div>


            <button
                type="submit"
                class="w-full bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800"
            >
                Login
            </button>

        </form>


        <p class="text-sm text-center text-gray-500 mt-6">

            Don't have an account?

            <a
                href="register.php"
                class="text-gray-900 font-medium hover:underline"
            >
                Register
            </a>

        </p>

    </div>

</section>

<?php require_once "includes/footer.php";

?>
