// ========================================
// BODY
// ========================================

const body =
    document.getElementById("body");

// ========================================
// THEME ELEMENTS
// ========================================

const themeToggle =
    document.getElementById("themeToggle");

const themeIcon =
    document.getElementById("themeIcon");

// ========================================
// LOAD SAVED THEME
// ========================================

const savedTheme =
    localStorage.getItem("theme");

// ========================================
// APPLY SAVED THEME
// ========================================

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

} else {

    body.classList.remove(
        "light-theme"
    );

    themeIcon.classList.remove(
        "bi-sun-fill"
    );

    themeIcon.classList.add(
        "bi-moon-fill"
    );
}

// ========================================
// THEME TOGGLE
// ========================================

themeToggle.addEventListener(
    "click",
    () => {

        body.classList.toggle(
            "light-theme"
        );

        // LIGHT THEME

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

        }

        // DARK THEME

        else {

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
// TOGGLE PIN VISIBILITY
// ========================================

document.getElementById(
    "togglePin"
).addEventListener(
    "click",
    () => {

        const pinInput =
            document.getElementById(
                "pin"
            );

        const eyeIcon =
            document.getElementById(
                "eyeIcon"
            );

        // SHOW PASSWORD

        if (
            pinInput.type ===
            "password"
        ) {

            pinInput.type =
                "text";

            eyeIcon.classList.remove(
                "bi-eye-fill"
            );

            eyeIcon.classList.add(
                "bi-eye-slash-fill"
            );
        }

        // HIDE PASSWORD

        else {

            pinInput.type =
                "password";

            eyeIcon.classList.remove(
                "bi-eye-slash-fill"
            );

            eyeIcon.classList.add(
                "bi-eye-fill"
            );
        }
    }
);

// ========================================
// LOGIN FORM SUBMIT
// ========================================

document.getElementById(
    "loginForm"
).addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        // ========================================
        // GET INPUT VALUES
        // ========================================

        const accountNumber =
            document.getElementById(
                "accountNumber"
            ).value;

        const pin =
            document.getElementById(
                "pin"
            ).value;

        const errorMsg =
            document.getElementById(
                "errorMsg"
            );

        // ========================================
        // VALIDATION
        // ========================================

        if (
            accountNumber === ""
            ||
            pin === ""
        ) {

            errorMsg.classList.remove(
                "d-none"
            );

            errorMsg.innerText =
                "Please fill all fields.";

            return;
        }

        try {

            // ========================================
            // API CALL
            // ========================================

            const response =
                await fetch(
                    "http://localhost:8080/api/users/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            accountNumber:
                                accountNumber,

                            pin:
                                pin
                        })
                    }
                );

            const data =
                await response.json();

            console.log(data);

            // ========================================
            // LOGIN SUCCESS
            // ========================================

            if (response.ok) {

                // Store Full User

                localStorage.setItem(
                    "user",
                    JSON.stringify(data)
                );

                // Store Account Number

                localStorage.setItem(
                    "accountNumber",
                    data.accountNumber
                );

                // Store User Name

                localStorage.setItem(
                    "userName",
                    data.name
                );

                // Store Balance

                localStorage.setItem(
                    "balance",
                    data.balance
                );

                // Hide Error

                errorMsg.classList.add(
                    "d-none"
                );

                // Redirect

                window.location.href =
                    "dashboard.html";
            }

            // ========================================
            // LOGIN FAILED
            // ========================================

            else {

                errorMsg.classList.remove(
                    "d-none"
                );

                errorMsg.innerText =
                    data.message;
            }

        }

        // ========================================
        // SERVER ERROR
        // ========================================

        catch (error) {

            console.log(error);

            errorMsg.classList.remove(
                "d-none"
            );

            errorMsg.innerText =
                "Server error. Please try again.";
        }
    }
);