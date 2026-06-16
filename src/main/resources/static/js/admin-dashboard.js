// Check Admin Session
const admin =
    JSON.parse(localStorage.getItem("admin"));

if (!admin) {

    window.location.href =
        "admin-login.html";
}

// Theme Elements
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

// Fetch Dashboard Stats
async function loadDashboardStats() {

    try {

        const response =
            await fetch(
                "http://localhost:8080/api/admin/dashboard-stats"
            );

        const data =
            await response.json();

        document.getElementById("totalUsers")
            .innerText = data.totalUsers;

        document.getElementById("totalTransactions")
            .innerText = data.totalTransactions;

        document.getElementById("totalBalance")
            .innerText =
            `₹ ${data.totalBalance}`;

        document.getElementById("activeAccounts")
            .innerText =
            data.activeAccounts;

    } catch (error) {

        console.log(error);
    }
}

// Fetch Activities
async function loadActivities() {

    try {

        const response =
            await fetch(
                "http://localhost:8080/api/admin/recent-activities"
            );

        const data =
            await response.json();

        const table =
            document.getElementById("activityTable");

        data.forEach((activity) => {

            table.innerHTML += `

                <tr>
                <td>
                        ${activity.transactionId}
                    </td>

                    <td>
                        ${activity.accountNumber}
                    </td>

                    <td>
                        ${activity.transactionType}
                    </td>

                    <td>
                        ₹ ${activity.amount}
                    </td>

                    <td>
                        ${activity.transactionDate}
                    </td>

                </tr>
            `;
        });

    } catch (error) {

        console.log(error);
    }
}

// Load Data
loadDashboardStats();

loadActivities();