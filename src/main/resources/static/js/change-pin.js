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
});

// Logout
document.getElementById("logoutBtn")
    .addEventListener("click", () => {

        localStorage.removeItem("user");

        window.location.href =
            "login.html";
    });

// =========================
// SHOW/HIDE PASSWORD
// =========================

document.querySelectorAll(".togglePassword")
    .forEach((button) => {

        button.addEventListener("click", () => {

            const input =
                button.parentElement.querySelector("input");

            const icon =
                button.querySelector("i");

            if (input.type === "password") {

                input.type = "text";

                icon.classList.remove(
                    "bi-eye-fill"
                );

                icon.classList.add(
                    "bi-eye-slash-fill"
                );

            } else {

                input.type = "password";

                icon.classList.remove(
                    "bi-eye-slash-fill"
                );

                icon.classList.add(
                    "bi-eye-fill"
                );
            }
        });
    });

// =========================
// CHANGE PIN FORM
// =========================

document.getElementById("changePinForm")
    .addEventListener("submit", async (e) => {

        e.preventDefault();

        const currentPin =
            document.getElementById("currentPin")
                .value.trim();

        const newPin =
            document.getElementById("newPin")
                .value.trim();

        const confirmPin =
            document.getElementById("confirmPin")
                .value.trim();

        // Validation
        if (!/^\d+$/.test(newPin)) {

            showAlert(
                "Only Numeric Digits Allowed",
                "danger"
            );

            return;
        }

        if (
            !(
                newPin.length === 4 ||
                newPin.length === 6
            )
        ) {

            showAlert(
                "PIN Must Be 4 or 6 Digits",
                "danger"
            );

            return;
        }

        if (newPin !== confirmPin) {

            showAlert(
                "PINs Do Not Match",
                "danger"
            );

            return;
        }

        if (currentPin === newPin) {

            showAlert(
                "New PIN Cannot Be Same As Current PIN",
                "danger"
            );

            return;
        }

        // Loading
        document.getElementById("spinner")
            .classList.remove("d-none");

        document.getElementById("btnText")
            .innerText =
            "Updating...";

        try {

            const response =
                await fetch(
                    "http://localhost:8080/api/users/change-pin",
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            accountNumber:
                                user.accountNumber,

                            currentPin:
                                currentPin,

                            newPin:
                                newPin
                        })
                    }
                );

            const data =
                await response.json();

            document.getElementById("spinner")
                .classList.add("d-none");

            document.getElementById("btnText")
                .innerText =
                "Update PIN";

            if (response.ok) {

                showAlert(
                    "PIN Updated Successfully",
                    "success"
                );

                document.getElementById(
                    "changePinForm"
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

// =========================
// ALERT
// =========================

function showAlert(message, type) {

    const alertBox =
        document.getElementById("alertBox");

    alertBox.className =
        `alert alert-${type}`;

    alertBox.innerText =
        message;

    alertBox.classList.remove("d-none");
}