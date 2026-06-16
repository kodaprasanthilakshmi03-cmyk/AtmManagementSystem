// User
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

// Balance
let currentBalance =
    user.balance;

document.getElementById("balanceAmount")
    .innerText =
    `₹ ${currentBalance}`;

// Balance Toggle
let visible = true;

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

// Quick Amount
document.querySelectorAll(".quickAmount")
    .forEach((btn) => {

        btn.addEventListener("click", () => {

            document.getElementById("amount")
                .value =
                btn.innerText.replace("₹", "");
        });
    });

// Validate Receiver
document.getElementById("receiverAccount")
    .addEventListener("blur", async () => {

        const receiverAccount =
            document.getElementById(
                "receiverAccount"
            ).value;

        // Self Transfer
        if (receiverAccount ===
            user.accountNumber) {

            showAlert(
                "Cannot Transfer To Same Account",
                "danger"
            );

            return;
        }

        try {

            const response =
                await fetch(
                    `http://localhost:8080/api/users/validate-receiver/${receiverAccount}`
                );

            const data =
                await response.json();

            if (response.ok) {

                document.getElementById(
                    "receiverName"
                ).value =
                    data.name;

            } else {

                showAlert(
                    "Receiver Account Not Found",
                    "danger"
                );

                document.getElementById(
                    "receiverName"
                ).value = "";
            }

        } catch (error) {

            console.log(error);
        }
    });

// Transfer
document.getElementById("transferForm")
    .addEventListener("submit", async (e) => {

        e.preventDefault();

        const receiverAccount =
            document.getElementById(
                "receiverAccount"
            ).value;

        const amount =
            parseFloat(
                document.getElementById(
                    "amount"
                ).value
            );

        // Validation
        if (!receiverAccount || !amount) {

            showAlert(
                "Please Fill All Fields",
                "danger"
            );

            return;
        }

        if (amount <= 0) {

            showAlert(
                "Enter Valid Amount",
                "danger"
            );

            return;
        }

        if (amount > currentBalance) {

            showAlert(
                "Insufficient Balance",
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
                    "http://localhost:8080/api/users/transfer",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            senderAccount:
                                user.accountNumber,

                            receiverAccount:
                                receiverAccount,

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
                "Transfer";

            if (response.ok) {

                showAlert(
                    "Transfer Successful",
                    "success"
                );

                currentBalance =
                    data.remainingBalance;

                user.balance =
                    currentBalance;

                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );

                document.getElementById(
                    "balanceAmount"
                ).innerText =
                    `₹ ${currentBalance}`;

                // Summary
                document.getElementById(
                    "summaryCard"
                ).classList.remove("d-none");
                document.getElementById("summaryTransactionId")
                .innerText = data.transactionId;

                document.getElementById(
                    "summaryReceiver"
                ).innerText =
                    data.receiverName;

                document.getElementById(
                    "summaryAccount"
                ).innerText =
                    receiverAccount;

                document.getElementById(
                    "summaryAmount"
                ).innerText =
                    `₹ ${amount}`;

                document.getElementById(
                    "summaryBalance"
                ).innerText =
                    `₹ ${currentBalance}`;

                document.getElementById(
                    "summaryDate"
                ).innerText =
                    new Date()
                        .toLocaleString();

                document.getElementById(
                    "transferForm"
                ).reset();

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