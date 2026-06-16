// User
const user =
    JSON.parse(localStorage.getItem("user"));

if (!user) {

    window.location.href =
        "login.html";
}

// Load User Info
document.getElementById("userName")
    .innerText =
    user.name;

document.getElementById("accountNumber")
    .innerText =
    user.accountNumber;

// Balance
let currentBalance =
    user.balance;

let visible = true;

document.getElementById("balanceAmount")
    .innerText =
    `₹ ${currentBalance}`;

// Toggle Balance
document.getElementById("toggleBalance")
    .addEventListener("click", () => {

        visible = !visible;

        document.getElementById(
            "balanceAmount"
        ).innerText =
            visible
                ? `₹ ${currentBalance}`
                : "₹ ******";
    });

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

    themeIcon.classList.replace(
        "bi-moon-fill",
        "bi-sun-fill"
    );
}

// Toggle Theme
themeToggle.addEventListener("click", () => {

    body.classList.toggle("light-theme");

    if (body.classList.contains("light-theme")) {

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
});

// Logout
document.getElementById("logoutBtn")
    .addEventListener("click", () => {

        localStorage.removeItem("user");

        window.location.href =
            "login.html";
    });

// Load Statement
async function loadStatement() {

    try {

        const response =
            await fetch(
                `http://localhost:8080/api/users/mini-statement/${user.accountNumber}`
            );

        const transactions =
            await response.json();

        const table =
            document.getElementById(
                "statementTable"
            );

        // No Data
        if (transactions.length === 0) {

            document.getElementById(
                "noData"
            ).classList.remove("d-none");

            return;
        }

        table.innerHTML = "";

        transactions.forEach((transaction) => {

            let badge = "";

            if (
                transaction.transactionType ===
                "WITHDRAW"
            ) {

                badge =
                    "bg-danger";

            } else if (
                transaction.transactionType ===
                "DEPOSIT"
            ) {

                badge =
                    "bg-success";

            } else {

                badge =
                    "bg-primary";
            }

            table.innerHTML += `

                <tr>
                <td>

            ${transaction.transactionId}

        </td>

                    <td>

                        <span class="badge ${badge}">

                            ${transaction.transactionType}

                        </span>

                    </td>

                    <td>

                        ₹ ${transaction.amount}

                    </td>

                    <td>

                        <span class="badge bg-success">

                            SUCCESS

                        </span>

                    </td>

                    <td>

                        ${transaction.transactionDate}

                    </td>

                </tr>
            `;
        });

    } catch (error) {

        console.log(error);
    }
}

// Download Statement
document.getElementById("downloadBtn")
    .addEventListener("click", () => {

        window.print();
    });

// Load Data
loadStatement();    