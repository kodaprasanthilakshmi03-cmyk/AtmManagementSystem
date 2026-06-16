// ========================================
// BASE URL
// ========================================

const BASE_URL =
    "http://localhost:8080/api/users";

// ========================================
// ACCOUNT NUMBER
// ========================================

const accountNumber =
    localStorage.getItem(
        "accountNumber"
    );

// ========================================
// THEME SYSTEM
// ========================================

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

    body.classList.add(
        "light-theme"
    );

    themeIcon.classList.remove(
        "bi-moon-fill"
    );

    themeIcon.classList.add(
        "bi-sun-fill"
    );
}

// Toggle Theme

themeToggle.addEventListener(
    "click",
    () => {

        body.classList.toggle(
            "light-theme"
        );

        if (
            body.classList.contains(
                "light-theme"
            )
        ) {

            localStorage.setItem(
                "theme",
                "light"
            );

            themeIcon.classList.remove(
                "bi-moon-fill"
            );

            themeIcon.classList.add(
                "bi-sun-fill"
            );

        } else {

            localStorage.setItem(
                "theme",
                "dark"
            );

            themeIcon.classList.remove(
                "bi-sun-fill"
            );

            themeIcon.classList.add(
                "bi-moon-fill"
            );
        }
    }
);

// ========================================
// LOAD PROFILE
// ========================================

async function loadProfile() {

    try {

        const response =
            await fetch(
                `${BASE_URL}/profile/${accountNumber}`
            );

        const user =
            await response.json();

        // Profile Header

        document.getElementById(
            "profileUserName"
        ).innerText =
            user.name || "N/A";

        // Status

        document.getElementById(
            "statusBadge"
        ).innerText =
            user.status || "ACTIVE";

        // Form Fields

        document.getElementById(
            "name"
        ).value =
            user.name || "";

        document.getElementById(
            "accountNumberField"
        ).value =
            user.accountNumber || "";

        document.getElementById(
            "email"
        ).value =
            user.email || "";

        document.getElementById(
            "mobileNumber"
        ).value =
            user.mobileNumber || "";

        // Banking Info

        document.getElementById(
            "balance"
        ).innerText =
            "₹ " + user.balance;

        document.getElementById(
            "createdDate"
        ).innerText =
            user.createdDate || "N/A";

        // Profile Image

        if (user.profilePhoto) {

            document.getElementById(
                "profileImage"
            ).src =
                "http://localhost:8080/"
                + user.profilePhoto;
        }

        // Load Activities

        loadRecentActivities();

    } catch(error) {

        console.log(error);
    }
}

// ========================================
// RECENT ACTIVITIES
// ========================================

async function loadRecentActivities() {

    try {

        const response =
            await fetch(
                `${BASE_URL}/recent-activities/${accountNumber}`
            );

        const activities =
            await response.json();

        const table =
            document.getElementById(
                "activityTable"
            );

        table.innerHTML = "";

        // Last Transaction

        if (activities.length > 0) {

            document.getElementById(
                "lastTransaction"
            ).innerText =

                activities[0].transactionType
                + " - ₹"
                + activities[0].amount;

        } else {

            document.getElementById(
                "lastTransaction"
            ).innerText =
                "No Transactions";
        }

        // Table

        activities.forEach(activity => {

            table.innerHTML += `

                <tr>

                    <td>
                        ${activity.transactionId || "N/A"}
                    </td>

                    <td>
                        ${activity.transactionType}
                    </td>

                    <td>
                        ₹${activity.amount}
                    </td>

                    <td>
                        ${activity.transactionDate}
                    </td>

                </tr>
            `;
        });

    } catch(error) {

        console.log(error);
    }
}

// ========================================
// LOGOUT
// ========================================

document.getElementById(
    "logoutBtn"
).addEventListener(
    "click",
    () => {

        localStorage.clear();

        window.location.href =
            "login.html";
    }
);

// ========================================
// INITIAL LOAD
// ========================================

loadProfile();