// =========================
// CHECK LOGIN
// =========================

const user =
    JSON.parse(localStorage.getItem("user"));

if (!user) {

    window.location.href =
        "login.html";
}

// =========================
// ELEMENTS
// =========================

const body =
    document.getElementById("body");

const themeToggle =
    document.getElementById("themeToggle");

const themeIcon =
    document.getElementById("themeIcon");

const bankLogo =
    document.getElementById("bankLogo");

const darkHeroImage =
    document.getElementById("darkHeroImage");

const lightHeroImage =
    document.getElementById("lightHeroImage");

// =========================
// WELCOME USER
// =========================

document.getElementById("welcomeUser")
    .innerText =
    `Welcome Back, ${user.name}`;

// =========================
// BALANCE
// =========================

let balanceVisible = true;

document.getElementById("balanceAmount")
    .innerText =
    `₹ ${user.balance}`;

// =========================
// LOAD SAVED THEME
// =========================

const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "light") {

    body.classList.add("light-theme");

    themeIcon.classList.remove(
        "bi-moon-fill"
    );

    themeIcon.classList.add(
        "bi-sun-fill"
    );
}

// =========================
// UPDATE THEME ASSETS
// =========================

function updateThemeAssets() {

    const isLight =
        body.classList.contains(
            "light-theme"
        );

    // =====================
    // LOGO SWITCH
    // =====================

    if (bankLogo) {

        bankLogo.src = isLight
            ? "images/nexora-light.png"
            : "images/nexora-dark.png";
    }

    // =====================
    // HERO IMAGE SWITCH
    // =====================

    if (darkHeroImage && lightHeroImage) {

        if (isLight) {

            darkHeroImage.style.display =
                "none";

            lightHeroImage.style.display =
                "block";

        } else {

            darkHeroImage.style.display =
                "block";

            lightHeroImage.style.display =
                "none";
        }
    }
}

// Initial Theme Assets
updateThemeAssets();

// =========================
// TOGGLE THEME
// =========================

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

        // Update Images & Logo
        updateThemeAssets();
    }
);

// =========================
// HIDE / SHOW BALANCE
// =========================

document.getElementById("toggleBalance")
    .addEventListener("click", () => {

        balanceVisible =
            !balanceVisible;

        if (balanceVisible) {

            document.getElementById(
                "balanceAmount"
            ).innerText =
                `₹ ${user.balance}`;

        } else {

            document.getElementById(
                "balanceAmount"
            ).innerText =
                "₹ ******";
        }
    });

// =========================
// LOGOUT
// =========================

document.getElementById("logoutBtn")
    .addEventListener("click", () => {

        localStorage.removeItem(
            "user"
        );

        window.location.href =
            "login.html";
    });

// =========================
// LOAD TRANSACTIONS
// =========================

async function loadTransactions() {

    try {

        const response =
            await fetch(
                `http://localhost:8080/api/user/recent-transactions/${user.accountNumber}`
            );

        const transactions =
            await response.json();

        const table =
            document.getElementById(
                "transactionTable"
            );

        table.innerHTML = "";

        transactions.forEach(
            (transaction) => {

                table.innerHTML += `

                <tr>
                <td>
                        ${transaction.transactionId}
                    </td>

                    <td>
                        ${transaction.transactionType}
                    </td>

                    <td>
                        ₹ ${transaction.amount}
                    </td>

                    <td>
                        ${transaction.transactionDate}
                    </td>

                </tr>
                `;
            }
        );

    } catch (error) {

        console.log(error);
    }
}

// =========================
// INITIAL LOAD
// =========================

loadTransactions();