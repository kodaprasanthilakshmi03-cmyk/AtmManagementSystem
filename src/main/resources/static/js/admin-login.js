// Theme
const body = document.getElementById("body");

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

// Show Password
document.getElementById("togglePassword")
    .addEventListener("click", () => {

        const password =
            document.getElementById("password");

        if (password.type === "password") {

            password.type = "text";

        } else {

            password.type = "password";
        }
    });

// Login Form
document.getElementById("adminLoginForm")
    .addEventListener("submit", async (e) => {

        e.preventDefault();

        const username =
            document.getElementById("username").value;

        const password =
            document.getElementById("password").value;

        const errorMsg =
            document.getElementById("errorMsg");

        const spinner =
            document.getElementById("spinner");

        const loginText =
            document.getElementById("loginText");

        // Validation
        if (username === "" || password === "") {

            errorMsg.classList.remove("d-none");

            errorMsg.innerText =
                "Please fill all fields.";

            return;
        }

        // Loading
        spinner.classList.remove("d-none");

        loginText.innerText =
            "Authenticating...";

        try {

            const response = await fetch(
                "http://localhost:8080/api/admin/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        username,
                        password
                    })
                }
            );

            const data =
                await response.json();

            spinner.classList.add("d-none");

            loginText.innerText =
                "Login";

            if (response.ok) {

                localStorage.setItem(
                    "admin",
                    JSON.stringify(data)
                );

                window.location.href =
                    "admin-dashboard.html";

            } else {

                errorMsg.classList.remove("d-none");

                errorMsg.innerText =
                    "Invalid Admin Credentials";
            }

        } catch (error) {

            spinner.classList.add("d-none");

            loginText.innerText =
                "Login";

            errorMsg.classList.remove("d-none");

            errorMsg.innerText =
                "Server Error";
        }
    });