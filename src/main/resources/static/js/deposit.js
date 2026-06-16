// Check Login
const user =
    JSON.parse(localStorage.getItem("user"));

if (!user) {

    window.location.href =
        "login.html";
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

        localStorage.removeItem("user");

        window.location.href =
            "login.html";
    });

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

        if (visible) {

            document.getElementById("balanceAmount")
                .innerText =
                `₹ ${currentBalance}`;

        } else {

            document.getElementById("balanceAmount")
                .innerText =
                "₹ ******";
        }
    });

// Quick Amount
document.querySelectorAll(".quickAmount")
    .forEach((btn) => {

        btn.addEventListener("click", () => {

            const amount =
                btn.innerText.replace("₹", "");

            document.getElementById("amount")
                .value = amount;
        });
    });

// Deposit Form
document.getElementById("depositForm")
    .addEventListener("submit", async (e) => {

        e.preventDefault();

        const amount =
            parseFloat(
                document.getElementById("amount")
                    .value
            );

        // Validation
        if (!amount || amount <= 0) {

            showAlert(
                "Enter Valid Amount",
                "danger"
            );

            return;
        }

        // Loading
        document.getElementById("spinner")
            .classList.remove("d-none");

        document.getElementById("btnText")
            .innerText =
            "Processing...";

        try {

            const response =
                await fetch(
                    "http://localhost:8080/api/users/deposit",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            accountNumber:
                                user.accountNumber,

                            amount:
                                amount
                        })
                    }
                );

            const data =
                await response.json();

            document.getElementById("spinner")
                .classList.add("d-none");

            document.getElementById("btnText")
                .innerText =
                "Deposit";

            if (response.ok) {

                showAlert(
                    "Deposit Successful",
                    "success"
                );

                // Update Balance
                currentBalance =
                    data.updatedBalance;

                user.balance =
                    currentBalance;

                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );

                document.getElementById("balanceAmount")
                    .innerText =
                    `₹ ${currentBalance}`;

                // Summary
                document.getElementById("summaryCard")
                    .classList.remove("d-none");
                document.getElementById("summaryTransactionId")
                .innerText = data.transactionId;

                document.getElementById("summaryAmount")
                    .innerText =
                    `₹ ${amount}`;

                document.getElementById("summaryBalance")
                    .innerText =
                    `₹ ${currentBalance}`;

                document.getElementById("summaryDate")
                    .innerText =
                    new Date()
                        .toLocaleString();

                // Reset Form
                document.getElementById("depositForm")
                    .reset();

            } else {

                showAlert(
                    data.message,
                    "danger"
                );
            }

        } catch (error) {

            showAlert(
                "Server Error",
                "danger"
            );
        }
    });

// Alert
function showAlert(message, type) {

    const alertBox =
        document.getElementById("alertBox");

    alertBox.className =
        `alert alert-${type}`;

    alertBox.innerText =
        message;

    alertBox.classList.remove("d-none");
}