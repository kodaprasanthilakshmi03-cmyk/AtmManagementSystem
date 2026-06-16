// =========================
// CHECK ADMIN LOGIN
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

// Load Theme
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
// LOAD CARDS
// =========================

async function loadCards() {

    try {

        const response =
            await fetch(
                "http://localhost:8080/api/admin/cards"
            );

        const cards =
            await response.json();

        const table =
            document.getElementById(
                "cardTableBody"
            );

        table.innerHTML = "";

        let active = 0;
        let blocked = 0;
        let frozen = 0;

        cards.forEach((card) => {

            // Count
            if (
                card.cardStatus ===
                "ACTIVE"
            ) active++;

            if (
                card.cardStatus ===
                "BLOCKED"
            ) blocked++;

            if (
                card.cardStatus ===
                "FROZEN"
            ) frozen++;

            // Badge
            let badge =
                "bg-success";

            if (
                card.cardStatus ===
                "BLOCKED"
            ) {

                badge =
                    "bg-danger";
            }

            if (
                card.cardStatus ===
                "FROZEN"
            ) {

                badge =
                    "bg-warning text-dark";
            }

            if (
                card.cardStatus ===
                "EXPIRED"
            ) {

                badge =
                    "bg-dark";
            }

            table.innerHTML += `

                <tr>

                    <td>
                        ${card.cardNumber}
                    </td>

                    <td>
                        ${card.accountNumber}
                    </td>

                    <td>
                        ${card.cardType}
                    </td>

                    <td>
                        ${card.expiryDate}
                    </td>

                    <td>

                        <span class="badge ${badge}">

                            ${card.cardStatus}

                        </span>

                    </td>

                    <td>
                        ${card.issueDate}
                    </td>

                    <td>

                        <div class="d-flex gap-2">

                            <button class="btn btn-sm btn-primary"
                                onclick='viewCard(${JSON.stringify(card)})'>

                                <i class="bi bi-eye-fill"></i>

                            </button>

                            <button class="btn btn-sm btn-success"
                                onclick='activateCard("${card.accountNumber}")'>

                                <i class="bi bi-check-circle-fill"></i>

                            </button>

                            <button class="btn btn-sm btn-danger"
                                onclick='blockCard("${card.accountNumber}")'>

                                <i class="bi bi-x-circle-fill"></i>

                            </button>

                            <button class="btn btn-sm btn-warning"
                                onclick='freezeCard("${card.accountNumber}")'>

                                <i class="bi bi-pause-circle-fill"></i>

                            </button>

                        </div>

                    </td>

                </tr>
            `;
        });

        // Statistics
        document.getElementById(
            "totalCards"
        ).innerText =
            cards.length;

        document.getElementById(
            "activeCards"
        ).innerText =
            active;

        document.getElementById(
            "blockedCards"
        ).innerText =
            blocked;

        document.getElementById(
            "frozenCards"
        ).innerText =
            frozen;

    } catch (error) {

        console.log(error);
    }
}

// =========================
// ISSUE CARD
// =========================

document.getElementById(
    "issueCardBtn"
).addEventListener(
    "click",
    async () => {

        const accountNumber =
            document.getElementById(
                "accountNumber"
            ).value;

        const cardType =
            document.getElementById(
                "cardType"
            ).value;

        try {

            const response =
                await fetch(
                    "http://localhost:8080/api/admin/issue-card",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            accountNumber:
                                accountNumber,

                            cardType:
                                cardType
                        })
                    }
                );

            const data =
                await response.json();

            if (response.ok) {

                showIssueAlert(
                    data.message,
                    "success"
                );

                loadCards();

                loadAccountsWithoutCards();

            } else {

                showIssueAlert(
                    data.message,
                    "danger"
                );
            }

        } catch (error) {

            showIssueAlert(
                "Server Error",
                "danger"
            );
        }
    }
);

// =========================
// ISSUE ALERT
// =========================

function showIssueAlert(
    message,
    type
) {

    const alert =
        document.getElementById(
            "issueAlert"
        );

    alert.className =
        `alert alert-${type}`;

    alert.innerText =
        message;

    alert.classList.remove(
        "d-none"
    );
}

// =========================
// BLOCK CARD
// =========================

async function blockCard(
    accountNumber
) {

    await fetch(
        `http://localhost:8080/api/admin/block-card/${accountNumber}`,
        {
            method: "PUT"
        }
    );

    loadCards();
}

// =========================
// ACTIVATE CARD
// =========================

async function activateCard(
    accountNumber
) {

    await fetch(
        `http://localhost:8080/api/admin/activate-card/${accountNumber}`,
        {
            method: "PUT"
        }
    );

    loadCards();
}

// =========================
// FREEZE CARD
// =========================

async function freezeCard(
    accountNumber
) {

    await fetch(
        `http://localhost:8080/api/admin/freeze-card/${accountNumber}`,
        {
            method: "PUT"
        }
    );

    loadCards();
}

// =========================
// VIEW CARD
// =========================

function viewCard(card) {

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "viewCardModal"
            )
        );

    document.getElementById(
        "viewCardBody"
    ).innerHTML = `

        <p>

            <strong>Card Number:</strong>
            ${card.cardNumber}

        </p>

        <p>

            <strong>Card Type:</strong>
            ${card.cardType}

        </p>

        <p>

            <strong>Expiry Date:</strong>
            ${card.expiryDate}

        </p>

        <p>

            <strong>Status:</strong>
            ${card.cardStatus}

        </p>

        <p>

            <strong>Issue Date:</strong>
            ${card.issueDate}

        </p>

        <p>

            <strong>Last Used Date:</strong>
            ${card.lastUsedDate}

        </p>
    `;

    modal.show();
}

// =========================
// ACCOUNTS WITHOUT CARDS
// =========================

async function loadAccountsWithoutCards() {

    try {

        const response =
            await fetch(
                "http://localhost:8080/api/admin/accounts-without-cards"
            );

        const users =
            await response.json();

        const container =
            document.getElementById(
                "accountsWithoutCards"
            );

        container.innerHTML = "";

        users.forEach((user) => {

            container.innerHTML += `

                <div class="d-flex justify-content-between align-items-center border rounded p-3 mb-3">

                    <div>

                        <h6 class="mb-1">

                            ${user.name}

                        </h6>

                        <small>

                            ${user.accountNumber}

                        </small>

                    </div>

                    <button class="btn btn-primary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#issueCardModal">

                        Issue Card

                    </button>

                </div>
            `;
        });

    } catch (error) {

        console.log(error);
    }
}

// =========================
// SEARCH
// =========================

document.getElementById(
    "searchInput"
).addEventListener(
    "keyup",
    () => {

        const value =
            document.getElementById(
                "searchInput"
            ).value.toLowerCase();

        const rows =
            document.querySelectorAll(
                "#cardTableBody tr"
            );

        rows.forEach((row) => {

            row.style.display =
                row.innerText
                    .toLowerCase()
                    .includes(value)
                    ? ""
                    : "none";
        });
    }
);

// Load Data
loadCards();

loadAccountsWithoutCards();