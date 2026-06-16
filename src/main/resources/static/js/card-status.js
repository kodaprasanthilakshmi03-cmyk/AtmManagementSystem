// =========================
// CHECK LOGIN
// =========================

const user =
    JSON.parse(
        localStorage.getItem("user")
    );

if (!user) {

    window.location.href =
        "login.html";
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

// Load Saved Theme
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

document.getElementById(
    "logoutBtn"
).addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "user"
        );

        window.location.href =
            "login.html";
    }
);

// =========================
// LOAD CARD DETAILS
// =========================

async function loadCardStatus() {

    try {

        const response =
            await fetch(
                `http://localhost:8080/api/users/card-status/${user.accountNumber}`
            );

        const data =
            await response.json();

        // No Card
        if (!data.cardNumber) {

            document.getElementById(
                "noCardContainer"
            ).classList.remove(
                "d-none"
            );

            return;
        }

        // Show Card Section
        document.getElementById(
            "cardContainer"
        ).classList.remove(
            "d-none"
        );

        // Mask Card Number
        const masked =
            "**** **** **** " +
            data.cardNumber.slice(-4);

        document.getElementById(
            "cardNumber"
        ).innerText =
            masked;

        // Other Details
        document.getElementById(
            "cardType"
        ).innerText =
            data.cardType;

        document.getElementById(
            "expiryDate"
        ).innerText =
            data.expiryDate;

        document.getElementById(
            "issueDate"
        ).innerText =
            data.issueDate;

        

        // Badge
        const badge =
            document.getElementById(
                "statusBadge"
            );

        badge.innerText =
            data.cardStatus;

        if (
            data.cardStatus ===
            "ACTIVE"
        ) {

            badge.className =
                "badge bg-success";

        } else if (
            data.cardStatus ===
            "BLOCKED"
        ) {

            badge.className =
                "badge bg-danger";

        } else if (
            data.cardStatus ===
            "FROZEN"
        ) {

            badge.className =
                "badge bg-warning text-dark";

        } else {

            badge.className =
                "badge bg-dark";
        }

    } catch (error) {

        console.log(error);
    }
}

// =========================
// VERIFY MODAL
// =========================

const verifyModal =
    new bootstrap.Modal(
        document.getElementById(
            "verifyModal"
        )
    );

// Open Modal
document.getElementById(
    "viewCardBtn"
).addEventListener(
    "click",
    () => {

        document.getElementById(
            "verifyPin"
        ).value = "";

        document.getElementById(
            "verifyAlert"
        ).classList.add(
            "d-none"
        );

        verifyModal.show();
    }
);

// =========================
// TOGGLE PIN VISIBILITY
// =========================

document.getElementById(
    "toggleVerifyPin"
).addEventListener(
    "click",
    () => {

        const input =
            document.getElementById(
                "verifyPin"
            );

        const icon =
            document.querySelector(
                "#toggleVerifyPin i"
            );

        if (
            input.type ===
            "password"
        ) {

            input.type = "text";

            icon.classList.replace(
                "bi-eye-fill",
                "bi-eye-slash-fill"
            );

        } else {

            input.type = "password";

            icon.classList.replace(
                "bi-eye-slash-fill",
                "bi-eye-fill"
            );
        }
    }
);

// =========================
// VERIFY CARD PIN
// =========================

document.getElementById(
    "verifyBtn"
).addEventListener(
    "click",
    async () => {

        const pin =
            document.getElementById(
                "verifyPin"
            ).value.trim();

        // Validation
        if (!/^\d+$/.test(pin)) {

            showVerifyAlert(
                "Only Numeric Digits Allowed",
                "danger"
            );

            return;
        }

        if (
            !(
                pin.length === 4 ||
                pin.length === 6
            )
        ) {

            showVerifyAlert(
                "PIN Must Be 4 or 6 Digits",
                "danger"
            );

            return;
        }

        try {

            const response =
                await fetch(
                    "http://localhost:8080/api/users/verify-card-pin",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            accountNumber:
                                user.accountNumber,

                            pin:
                                pin
                        })
                    }
                );

            const data =
                await response.json();

            if (
                response.ok &&
                data.success
            ) {

                // Show Full Card Number
                document.getElementById(
                    "cardNumber"
                ).innerText =
                    data.cardNumber.replace(
                        /(.{4})/g,
                        "$1 "
                    );

                // Show CVV
                document.getElementById(
                    "cvvText"
                ).innerText =
                    data.cvv;

                verifyModal.hide();

                // Auto Hide After 15 Seconds
                setTimeout(() => {

                    const masked =
                        "**** **** **** " +
                        data.cardNumber.slice(-4);

                    document.getElementById(
                        "cardNumber"
                    ).innerText =
                        masked;

                    document.getElementById(
                        "cvvText"
                    ).innerText =
                        "***";

                }, 15000);

            } else {

                showVerifyAlert(
                    data.message,
                    "danger"
                );
            }

        } catch (error) {

            showVerifyAlert(
                "Server Error",
                "danger"
            );
        }
    }
);

// =========================
// VERIFY ALERT
// =========================

function showVerifyAlert(
    message,
    type
) {

    const alertBox =
        document.getElementById(
            "verifyAlert"
        );

    alertBox.className =
        `alert alert-${type}`;

    alertBox.innerText =
        message;

    alertBox.classList.remove(
        "d-none"
    );
}

// =========================
// FREEZE CARD
// =========================

document.getElementById(
    "freezeBtn"
).addEventListener(
    "click",
    async () => {

        await fetch(
            `http://localhost:8080/api/users/freeze-card/${user.accountNumber}`,
            {
                method: "PUT"
            }
        );

        location.reload();
    }
);

// =========================
// ACTIVATE CARD
// =========================

document.getElementById(
    "activateBtn"
).addEventListener(
    "click",
    async () => {

        await fetch(
            `http://localhost:8080/api/users/activate-card/${user.accountNumber}`,
            {
                method: "PUT"
            }
        );

        location.reload();
    }
);

// =========================
// INITIAL LOAD
// =========================

loadCardStatus();