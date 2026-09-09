<?php

require_once "includes/auth.php";

$page_title = "Register";

require_once "includes/header.php";
?>

<section class="max-w-md mx-auto px-6 py-12">

    <div class="bg-white border rounded-xl shadow-sm p-8">

        <h1 class="text-2xl font-bold text-center">
            Create an Account
        </h1>

        <p class="text-gray-500 text-center mt-2">
            Join SubShare as a buyer or seller.
        </p>

        <form action="actions/register_action.php" method="POST" class="mt-8">

            <?= csrf_field() ?>

            <div class="mb-5">

                <label class="block text-sm font-medium mb-2">
                    Name
                </label>

                <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    maxlength="100"
                    class="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Enter your name"
                >

            </div>


            <div class="mb-5">

                <label class="block text-sm font-medium mb-2">
                    Email
                </label>

                <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    maxlength="100"
                    class="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Enter your email"
                >

            </div>


            <div class="mb-5">

                <label class="block text-sm font-medium mb-2">
                    Password
                </label>

                <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    minlength="6"
                    maxlength="255"
                    class="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Enter your password"
                >

            </div>


            <div class="mb-6">

                <label class="block text-sm font-medium mb-2">
                    Account Type
                </label>

                <select
                    name="role"
                    required
                    class="w-full border rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                >

                    <option value="buyer">
                        Buyer
                    </option>

                    <option value="seller">
                        Seller
                    </option>

                </select>

            </div>


            <button
                type="submit"
                class="w-full bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800"
            >
                Create Account
            </button>

        </form>


        <p class="text-sm text-center text-gray-500 mt-6">

            Already have an account?

            <a
                href="login.php"
                class="text-gray-900 font-medium hover:underline"
            >
                Login
            </a>

        </p>

    </div>

</section>
<script>
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

nameInput.addEventListener("input", function () {
    if (this.value.trim() === "") {
        this.setCustomValidity("Name can't be empty");
    } else {
        this.setCustomValidity("");
    }
});

emailInput.addEventListener("input", function () {
    const email = this.value.trim();

    if (email === "") {
        this.setCustomValidity("Email cannot be empty");
    } else if (!this.validity.valid) {
        this.setCustomValidity("Please enter a valid email address");
    } else {
        this.setCustomValidity("");
    }
});

passwordInput.addEventListener("input", function () {
    const password = this.value;

    if (password.trim() === "") {
        this.setCustomValidity("Password cannot be empty");
    } else if (password.length < 6) {
        this.setCustomValidity("Password cannot be below six characters");
    } else {
        this.setCustomValidity("");
    }
});
</script>

<?php require_once "includes/footer.php";

?>
