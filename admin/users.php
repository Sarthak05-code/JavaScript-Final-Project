<?php

require_once "../includes/auth.php";
require_once "../includes/db.php";

require_role("admin");

$page_title = "Manage Users";

require_once "../includes/header.php";

/*
|--------------------------------------------------------------------------
| Fetch all users
|--------------------------------------------------------------------------
*/

$sql = "SELECT
            user_id,
            name,
            email,
            role,
            created_at
        FROM users
        ORDER BY created_at DESC";

$result = $conn->query($sql);
?>

<div class="max-w-6xl mx-auto px-6 py-10">

    <!-- Page Heading -->

    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>

            <h1 class="text-3xl font-bold text-gray-900">
                Manage Users
            </h1>

            <p class="text-gray-600 mt-2">
                View all registered users on the SubShare platform.
            </p>

        </div>

        <a
            href="dashboard.php"
            class="inline-block bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg hover:bg-gray-300"
        >
            Back to Dashboard
        </a>

    </div>


    <!-- Users Table -->

    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">

        <?php if ($result->num_rows === 0): ?>

            <div class="p-8 text-center">

                <p class="text-gray-600">
                    No users have been registered yet.
                </p>

            </div>

        <?php else: ?>

            <div class="overflow-x-auto">

                <table class="w-full text-left">

                    <thead class="bg-gray-50 border-b border-gray-200">

                        <tr>

                            <th class="px-6 py-4 text-sm font-semibold text-gray-700">
                                ID
                            </th>

                            <th class="px-6 py-4 text-sm font-semibold text-gray-700">
                                Name
                            </th>

                            <th class="px-6 py-4 text-sm font-semibold text-gray-700">
                                Email
                            </th>

                            <th class="px-6 py-4 text-sm font-semibold text-gray-700">
                                Role
                            </th>

                            <th class="px-6 py-4 text-sm font-semibold text-gray-700">
                                Registered
                            </th>

                        </tr>

                    </thead>

                    <tbody class="divide-y divide-gray-100">

                        <?php while ($user = $result->fetch_assoc()): ?>

                            <tr class="hover:bg-gray-50">

                                <td class="px-6 py-4 text-sm text-gray-700">
                                    <?= (int) $user["user_id"] ?>
                                </td>

                                <td class="px-6 py-4 text-sm font-medium text-gray-900">
                                    <?= htmlspecialchars($user["name"]) ?>
                                </td>

                                <td class="px-6 py-4 text-sm text-gray-600">
                                    <?= htmlspecialchars($user["email"]) ?>
                                </td>

                                <td class="px-6 py-4">

                                    <?php if ($user["role"] === "admin"): ?>

                                        <span class="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                                            Admin
                                        </span>

                                    <?php elseif (
                                        $user["role"] === "seller"
                                    ): ?>

                                        <span class="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                                            Seller
                                        </span>

                                    <?php else: ?>

                                        <span class="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                                            Buyer
                                        </span>

                                    <?php endif; ?>

                                </td>

                                <td class="px-6 py-4 text-sm text-gray-600">
                                    <?= date(
                                        "M d, Y",
                                        strtotime($user["created_at"]),
                                    ) ?>
                                </td>

                            </tr>

                        <?php endwhile; ?>

                    </tbody>

                </table>

            </div>

        <?php endif; ?>

    </div>

</div>

<?php require_once "../includes/footer.php";

?>
