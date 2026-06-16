// Admin Session
const admin =
    JSON.parse(localStorage.getItem("admin"));

if (!admin) {

    window.location.href =
        "admin-login.html";
}

// Theme
const body =
    document.getElementById("body");

const themeToggle =
    document.getElementById("themeToggle");

const themeIcon =
    document.getElementById("themeIcon");

// Load Theme
const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "light") {

    body.classList.add("light-theme");

    themeIcon.classList.remove("bi-moon-fill");

    themeIcon.classList.add("bi-sun-fill");
}

// Toggle Theme
themeToggle.addEventListener("click", () => {

    body.classList.toggle("light-theme");

    if (body.classList.contains("light-theme")) {

        localStorage.setItem("theme", "light");

        themeIcon.classList.remove("bi-moon-fill");

        themeIcon.classList.add("bi-sun-fill");

    } else {

        localStorage.setItem("theme", "dark");

        themeIcon.classList.remove("bi-sun-fill");

        themeIcon.classList.add("bi-moon-fill");
    }
});

// Logout
document.getElementById("logoutBtn")
    .addEventListener("click", () => {

        localStorage.removeItem("admin");

        window.location.href =
            "admin-login.html";
    });

// Fetch Users
async function loadUsers() {

    try {

        const response =
            await fetch(
                "http://localhost:8080/api/admin/users"
            );

        const users =
            await response.json();

        renderUsers(users);

    } catch (error) {

        console.log(error);
    }
}

// Render Users
function renderUsers(users) {

    const table =
        document.getElementById("userTable");

    table.innerHTML = "";

    users.forEach((user) => {

        const badge =
            user.status === "ACTIVE"
                ? "success"
                : "danger";

        table.innerHTML += `

            <tr>

                <td>
                    ${user.accountNumber}
                </td>

                <td>
                    ${user.name}
                </td>

                <td>
                    ₹ ${user.balance}
                </td>

                <td>

                    <span class="badge bg-${badge}">
                        ${user.status}
                    </span>

                </td>
                <td class="d-flex gap-2">
                 <!-- VIEW BUTTON -->

    <button
        class="btn btn-info btn-sm me-1"
        onclick='viewUser(${JSON.stringify(user)})'>

        <i class="bi bi-eye-fill"></i>

    </button>

    <!-- Edit -->
    <button class="btn btn-warning btn-sm"
        onclick='openEditModal(${JSON.stringify(user)})'>

        <i class="bi bi-pencil-fill"></i>

    </button>

    <!-- Block -->
    <button class="btn btn-secondary btn-sm"
        onclick="toggleStatus(
            ${user.id},
            '${user.status}'
        )">

        <i class="bi bi-lock-fill"></i>

    </button>

    <!-- Delete -->
    <button class="btn btn-danger btn-sm"
        onclick="deleteUser(${user.id})">

        <i class="bi bi-trash-fill"></i>

    </button>

</td>                         
            </tr>
        `;
    });
}

// Toggle Status
async function toggleStatus(id, status) {

    const action =
        status === "ACTIVE"
            ? "BLOCK"
            : "UNBLOCK";

    if (!confirm(
        `Are you sure to ${action} this account?`
    )) return;

    try {

        const response =
            await fetch(
                `http://localhost:8080/api/admin/users/block/${id}`,
                {
                    method: "PUT"
                }
            );

        if (response.ok) {

            loadUsers();
        }

    } catch (error) {

        console.log(error);
    }
}

// ========================================
// VIEW USER DETAILS
// ========================================

function viewUser(user) {

    // Profile Image

    document.getElementById(
        "viewProfileImage"
    ).src = user.profilePhoto
        ? "http://localhost:8080/" + user.profilePhoto
        : "images/default-user.png";

    // User Name

    document.getElementById(
        "viewUserName"
    ).innerText =
        user.name || "N/A";

    // Account Number

    document.getElementById(
        "viewAccount"
    ).innerText =
        user.accountNumber || "N/A";

    // Email

    document.getElementById(
        "viewEmail"
    ).innerText =
        user.email || "N/A";

    // Mobile Number

    document.getElementById(
        "viewMobile"
    ).innerText =
        user.mobileNumber || "N/A";

    // Balance

    document.getElementById(
        "viewBalance"
    ).innerText =
        "₹ " + (user.balance || 0);

    // Status Badge

    const statusBadge =
        document.getElementById(
            "viewStatus"
        );

    statusBadge.innerText =
        user.status || "ACTIVE";

    // Badge Color

    statusBadge.className =
        "badge";

    if (user.status === "BLOCKED") {

        statusBadge.classList.add(
            "bg-danger"
        );

    } else {

        statusBadge.classList.add(
            "bg-success"
        );
    }

    // Open Modal

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "viewUserModal"
            )
        );

    modal.show();
}

// Open Edit Modal
function openEditModal(user) {

    document.getElementById("editUserId")
        .value = user.id;

    document.getElementById("editName")
        .value = user.name;

    document.getElementById("editAccount")
        .value = user.accountNumber;

    document.getElementById("editBalance")
        .value = user.balance;

    document.getElementById("editStatus")
        .value = user.status;

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "editUserModal"
            )
        );

    modal.show();
}

// Save Changes
async function saveUserChanges() {

    const id =
        document.getElementById("editUserId")
            .value;

    const updatedUser = {

        name:
            document.getElementById("editName")
                .value,

        accountNumber:
            document.getElementById("editAccount")
                .value,

        balance:
            document.getElementById("editBalance")
                .value,

        status:
            document.getElementById("editStatus")
                .value
    };

    try {

        const response =
            await fetch(
                `http://localhost:8080/api/admin/users/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(updatedUser)
                }
            );

        if (response.ok) {

            alert(
                "User Updated Successfully"
            );

            location.reload();
        }

    } catch (error) {

        console.log(error);
    }
}
// Delete User
async function deleteUser(id) {

    if (!confirm(
        "Are you sure to delete this account?"
    )) return;

    try {

        const response =
            await fetch(
                `http://localhost:8080/api/admin/users/delete/${id}`,
                {
                    method: "DELETE"
                }
            );

        if (response.ok) {

            loadUsers();
        }

    } catch (error) {

        console.log(error);
    }
}

// Search Filters
document.getElementById("searchAccount")
    .addEventListener("input", filterUsers);

document.getElementById("searchName")
    .addEventListener("input", filterUsers);

document.getElementById("statusFilter")
    .addEventListener("change", filterUsers);
// Filter Users
async function filterUsers() {

    const account =
        document.getElementById("searchAccount")
            .value.toLowerCase();

    const name =
        document.getElementById("searchName")
            .value.toLowerCase();

    const status =
        document.getElementById("statusFilter")
            .value;

    const response =
        await fetch(
            "http://localhost:8080/api/admin/users"
        );

    const users =
        await response.json();

    const filtered =
        users.filter((user) => {

            return (

                user.accountNumber
                    .toLowerCase()
                    .includes(account)

                &&

                user.name
                    .toLowerCase()
                    .includes(name)

                &&

                (
                    status === "" ||
                    user.status === status
                )
            );
        });

    renderUsers(filtered);
}

// Load Users
loadUsers();