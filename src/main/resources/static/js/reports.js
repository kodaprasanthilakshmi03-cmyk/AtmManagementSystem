const API_BASE =
    "http://localhost:8080/api/admin";

// =========================
// THEME
// =========================

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

// =========================
// LOGOUT
// =========================

document.getElementById(
    "logoutBtn"
).addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "admin"
        );

        window.location.href =
            "admin-login.html";
    }
);

// =========================
// CHARTS
// =========================

let pieChart;
let barChart;
let lineChart;

// =========================
// LOAD ANALYTICS
// =========================

async function loadAnalytics() {

    try {

        const filter =
            document.getElementById(
                "filterType"
            ).value;

        // Summary

        const response =
            await fetch(
                `${API_BASE}/analytics-summary?filter=${filter}`
            );

        const data =
            await response.json();

        document.getElementById(
            "totalUsers"
        ).innerText =
            data.totalUsers;

        document.getElementById(
            "totalTransactions"
        ).innerText =
            data.totalTransactions;

        document.getElementById(
            "totalDeposits"
        ).innerText =
            "₹ " + data.totalDeposits;

        document.getElementById(
            "totalWithdrawals"
        ).innerText =
            "₹ " + data.totalWithdrawals;

        document.getElementById(
            "bankBalance"
        ).innerText =
            "₹ " + data.totalBankBalance;

        document.getElementById(
            "activeAccounts"
        ).innerText =
            data.activeAccounts;

        document.getElementById(
            "blockedAccounts"
        ).innerText =
            data.blockedAccounts;

        document.getElementById(
            "todayDeposits"
        ).innerText =
            "₹ " + data.todayDeposits;

        document.getElementById(
            "todayWithdrawals"
        ).innerText =
            "₹ " + data.todayWithdrawals;

        document.getElementById(
            "todayTransfers"
        ).innerText =
            "₹ " + data.todayTransfers;

        // Chart Data

        const statsResponse =
            await fetch(
                `${API_BASE}/transaction-stats`
            );

        const stats =
            await statsResponse.json();

        loadPieChart(stats);

        loadBarChart(stats);

        loadLineChart(stats);

        // Top Users

        loadTopUsers();

    } catch (error) {

        console.log(error);
    }
}

// =========================
// LOAD TOP USERS
// =========================

async function loadTopUsers() {

    try {

        const response =
            await fetch(
                `${API_BASE}/top-users`
            );

        const users =
            await response.json();

        const table =
            document.getElementById(
                "topUsersTable"
            );

        table.innerHTML = "";

        users.forEach(user => {

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

                </tr>
            `;
        });

    } catch (error) {

        console.log(error);
    }
}

// =========================
// PIE CHART
// =========================

function loadPieChart(stats) {

    if (pieChart) {

        pieChart.destroy();
    }

    pieChart =
        new Chart(
            document.getElementById(
                "pieChart"
            ),
            {

                type: "pie",

                data: {

                    labels: [
                        "Withdraw",
                        "Deposit",
                        "Transfer"
                    ],

                    datasets: [{

                        data: [
                            stats.withdrawCount,
                            stats.depositCount,
                            stats.transferCount
                        ]
                    }]
                }
            }
        );
}

// =========================
// BAR CHART
// =========================

function loadBarChart(stats) {

    if (barChart) {

        barChart.destroy();
    }

    barChart =
        new Chart(
            document.getElementById(
                "barChart"
            ),
            {

                type: "bar",

                data: {

                    labels: [
                        "Withdraw",
                        "Deposit",
                        "Transfer"
                    ],

                    datasets: [{

                        label:
                            "Transactions",

                        data: [
                            stats.withdrawCount,
                            stats.depositCount,
                            stats.transferCount
                        ]
                    }]
                }
            }
        );
}

// =========================
// LINE CHART
// =========================

function loadLineChart(stats) {

    if (lineChart) {

        lineChart.destroy();
    }

    lineChart =
        new Chart(
            document.getElementById(
                "lineChart"
            ),
            {

                type: "line",

                data: {

                    labels: [
                        "Withdraw",
                        "Deposit",
                        "Transfer"
                    ],

                    datasets: [{

                        label:
                            "Growth",

                        data: [
                            stats.withdrawCount,
                            stats.depositCount,
                            stats.transferCount
                        ]
                    }]
                }
            }
        );
}

// =========================
// DOWNLOAD PDF
// =========================

function downloadReport() {

    window.open(
        `${API_BASE}/download-report`,
        "_blank"
    );
}

// =========================
// INITIAL LOAD
// =========================

loadAnalytics();