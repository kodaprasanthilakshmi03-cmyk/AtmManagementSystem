// =========================
// ADMIN CHECK
// =========================

const admin =
    JSON.parse(
        localStorage.getItem("admin")
    );

if (!admin) {

    window.location.href =
        "admin-login.html";
}

// =========================
// THEME
// =========================

const body =
    document.getElementById("body");

const themeToggle =
    document.getElementById("themeToggle");

const themeIcon =
    document.getElementById("themeIcon");

const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "light") {

    body.classList.add(
        "light-theme"
    );

    themeIcon.classList.replace(
        "bi-moon-fill",
        "bi-sun-fill"
    );
}

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

            themeIcon.classList.replace(
                "bi-moon-fill",
                "bi-sun-fill"
            );

        } else {

            localStorage.setItem(
                "theme",
                "dark"
            );

            themeIcon.classList.replace(
                "bi-sun-fill",
                "bi-moon-fill"
            );
        }
    }
);

// =========================
// LOGOUT
// =========================

document.getElementById("logoutBtn")
    .addEventListener(
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
// LOAD TRANSACTIONS
// =========================

async function loadTransactions() {

    try {

        const response =
            await fetch(
                "http://localhost:8080/api/admin/transactions"
            );

        const data =
            await response.json();

        renderTransactions(data);

        loadStatistics(data);

        loadRecentActivities(data);

    } catch (error) {

        console.log(error);
    }
}

// =========================
// RENDER TABLE
// =========================

function renderTransactions(data) {

    const table =
        document.getElementById(
            "transactionsTable"
        );

    table.innerHTML = "";

    data.forEach(txn => {

        let typeBadge = "";
        let statusBadge = "";
        let suspicious = "";

        // Type Badge
        if (
            txn.transactionType ===
            "WITHDRAW"
        ) {

            typeBadge =
                "bg-danger";

        } else if (
            txn.transactionType ===
            "DEPOSIT"
        ) {

            typeBadge =
                "bg-success";

        } else {

            typeBadge =
                "bg-primary";
        }

        // Status Badge
        if (
            txn.status ===
            "SUCCESS"
        ) {

            statusBadge =
                "bg-success";

        } else if (
            txn.status ===
            "FAILED"
        ) {

            statusBadge =
                "bg-danger";

        } else {

            statusBadge =
                "bg-warning text-dark";
        }

        // Suspicious
        if (
            txn.amount > 50000
        ) {

            suspicious =
                `<span class="badge bg-danger ms-2">
                    Suspicious
                </span>`;
        }

        table.innerHTML += `

<tr>

    <td>

        <span class="badge bg-dark">

            ${txn.transactionId}

        </span>

    </td>

    <td>

        ${txn.accountNumber}

    </td>

    <td>

        ${txn.receiverAccount || "-"}

    </td>

    <td>

        <span class="badge ${typeBadge}">

            ${txn.transactionType}

        </span>

    </td>

    <td>

        ₹${txn.amount}

        ${suspicious}

    </td>

    <td>

        <span class="badge ${statusBadge}">

            ${txn.status}

        </span>

    </td>

    <td>

        ${txn.transactionDate}

    </td>

    <td>

        <button class="btn btn-sm btn-outline-info"
            onclick="viewTransaction(${txn.id})">

            <i class="bi bi-eye-fill"></i>

        </button>

    </td>

</tr>
`;
    });
}

// =========================
// STATISTICS
// =========================

function loadStatistics(data) {

    document.getElementById(
        "totalTransactions"
    ).innerText =
        data.length;

    document.getElementById(
        "successTransactions"
    ).innerText =
        data.filter(
            t => t.status === "SUCCESS"
        ).length;

    document.getElementById(
        "failedTransactions"
    ).innerText =
        data.filter(
            t => t.status === "FAILED"
        ).length;

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    document.getElementById(
        "todayTransactions"
    ).innerText =
        data.filter(
            t => t.transactionDate.includes(today)
        ).length;
}

// =========================
// RECENT ACTIVITIES
// =========================

function loadRecentActivities(data) {

    const recent =
        document.getElementById(
            "recentActivities"
        );

    recent.innerHTML = "";

    data.slice(0, 5)
        .forEach(txn => {

            recent.innerHTML += `

<div class="glass-box p-3 mb-3">

    <div class="d-flex justify-content-between">

        <div>

            <strong>

                ${txn.transactionType}

            </strong>

            <br>

            ${txn.accountNumber}

        </div>

        <div>

            ₹${txn.amount}

        </div>

    </div>

</div>
`;
        });
}

// =========================
// VIEW TRANSACTION
// =========================

async function viewTransaction(id) {

    try {

        const response =
            await fetch(
                `http://localhost:8080/api/admin/transaction/${id}`
            );

        const txn =
            await response.json();

        document.getElementById(
            "transactionDetails"
        ).innerHTML = `

<p>
<b>Transaction ID:</b>
${txn.transactionId}
</p>

<p>
<b>Account Number:</b>
${txn.accountNumber}
</p>

<p>
<b>Receiver Account:</b>
${txn.receiverAccount || "-"}
</p>

<p>
<b>Type:</b>
${txn.transactionType}
</p>

<p>
<b>Amount:</b>
₹${txn.amount}
</p>

<p>
<b>Status:</b>
${txn.status}
</p>

<p>
<b>Date:</b>
${txn.transactionDate}
</p>

<p>
<b>Remarks:</b>
${txn.remarks || "N/A"}
</p>
`;

        new bootstrap.Modal(
            document.getElementById(
                "transactionModal"
            )
        ).show();

    } catch (error) {

        console.log(error);
    }
}

// =========================
// FILTERS
// =========================

document.getElementById(
    "searchInput"
).addEventListener(
    "keyup",
    applyFilters
);

document.getElementById(
    "typeFilter"
).addEventListener(
    "change",
    applyFilters
);

document.getElementById(
    "statusFilter"
).addEventListener(
    "change",
    applyFilters
);

async function applyFilters() {

    const search =
        document.getElementById(
            "searchInput"
        ).value;

    const type =
        document.getElementById(
            "typeFilter"
        ).value;

    const status =
        document.getElementById(
            "statusFilter"
        ).value;

    try {

        const response =
            await fetch(
                `http://localhost:8080/api/admin/transactions/filter?search=${search}&type=${type}&status=${status}`
            );

        const data =
            await response.json();

        renderTransactions(data);

    } catch (error) {

        console.log(error);
    }
}

// =========================
// REFRESH
// =========================

document.getElementById(
    "refreshBtn"
).addEventListener(
    "click",
    loadTransactions
);

// Load
loadTransactions();