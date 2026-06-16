// Check Admin Session
const admin =
    JSON.parse(localStorage.getItem("admin"));

if (!admin) {

    window.location.href =
        "admin-login.html";
}

// Theme Elements
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

        localStorage.removeItem("admin");

        window.location.href =
            "admin-login.html";
    });

// Generate Account Number
function generateAccountNumber() {

    return "AC" +
        Math.floor(
            100000000 +
            Math.random() * 900000000
        );
}

document.getElementById("accountNumber")
    .value = generateAccountNumber();

// Toggle PIN Visibility
document.querySelectorAll(".togglePin")
    .forEach((btn) => {

        btn.addEventListener("click", () => {

            const input =
                btn.parentElement.querySelector("input");

            if (input.type === "password") {

                input.type = "text";

            } else {

                input.type = "password";
            }
        });
    });

// Form Submit
// ========================================
// CREATE ACCOUNT
// ========================================

document.getElementById("addUserForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (!otpVerified) {

        showAlert(
            "Verify OTP First",
            "danger"
        );

        return;
    }

    const name =
        document.getElementById("name").value;

    const accountNumber =
        document.getElementById("accountNumber").value;

    const pin =
        document.getElementById("pin").value;

    const confirmPin =
        document.getElementById("confirmPin").value;

    const balance =
        document.getElementById("balance").value;

    const status =
        document.getElementById("status").value;

    const email =
        document.getElementById("email").value;

    const mobileNumber =
        document.getElementById("mobileNumber").value;

    const profilePhoto =
        document.getElementById("profilePhoto").files[0];

    const spinner =
        document.getElementById("spinner");

    const btnText =
        document.getElementById("btnText");

    // VALIDATION

    if (
        !name ||
        !pin ||
        !confirmPin ||
        !balance ||
        !email ||
        !mobileNumber
    ) {

        showAlert(
            "Please fill all fields",
            "danger"
        );

        return;
    }

    if (pin !== confirmPin) {

        showAlert(
            "PIN does not match",
            "danger"
        );

        return;
    }

    // FORM DATA

    const formData =
        new FormData();

    formData.append(
        "name",
        name
    );

    formData.append(
        "accountNumber",
        accountNumber
    );

    formData.append(
        "pin",
        pin
    );

    formData.append(
        "balance",
        balance
    );

    formData.append(
        "status",
        status
    );

    formData.append(
        "email",
        email
    );

    formData.append(
        "mobileNumber",
        mobileNumber
    );

    if (profilePhoto) {

        formData.append(
            "profilePhoto",
            profilePhoto
        );
    }

    spinner.classList.remove("d-none");

    btnText.innerText =
        "Creating...";

    try {

        const response =
            await fetch(
                "http://localhost:8080/api/admin/create-user",
                {
                    method: "POST",
                    body: formData
                }
            );

        const data =
            await response.json();

        spinner.classList.add("d-none");

        btnText.innerText =
            "Create Account";

        if (response.ok) {

            showAlert(
                "ATM Account Created Successfully",
                "success"
            );

            document.getElementById(
                "addUserForm"
            ).reset();

            document.getElementById(
                "accountNumber"
            ).value =
                generateAccountNumber();

            document.getElementById(
                "photoPreview"
            ).src =
            "https://cdn-icons-png.flaticon.com/512/149/149071.png";

            otpVerified = false;

            document.getElementById(
                "createBtn"
            ).disabled = true;

        } else {

            showAlert(
                data.message,
                "danger"
            );
        }

    } catch (error) {

        spinner.classList.add("d-none");

        btnText.innerText =
            "Create Account";

        showAlert(
            "Server Error",
            "danger"
        );

        console.log(error);
    }

});
    // =========================
// IMAGE PREVIEW
// =========================

const profilePhoto =
    document.getElementById(
        "profilePhoto"
    );

const photoPreview =
    document.getElementById(
        "photoPreview"
    );

profilePhoto.addEventListener(
    "change",
    function () {

        const file =
            this.files[0];

        if (!file) return;

        // File Type Validation
        const allowed =
            [
                "image/jpeg",
                "image/jpg",
                "image/png"
            ];

        if (
            !allowed.includes(
                file.type
            )
        ) {

            alert(
                "Only JPG, JPEG, PNG allowed"
            );

            this.value = "";

            return;
        }

        // Size Validation
        if (
            file.size >
            2 * 1024 * 1024
        ) {

            alert(
                "Maximum file size is 2MB"
            );

            this.value = "";

            return;
        }

        // Preview
        const reader =
            new FileReader();

        reader.onload =
            function (e) {

                photoPreview.src =
                    e.target.result;
            };

        reader.readAsDataURL(file);
    }
);

// ========================================
// OTP
// ========================================

let otpVerified = false;

// SEND OTP

document.getElementById("sendOtpBtn")
    .addEventListener("click", sendOtp);

async function sendOtp() {

    const email =
        document.getElementById("email").value;

    if (!email) {

        showAlert(
            "Enter Email Address",
            "danger"
        );

        return;
    }

    try {

        const response =
            await fetch(
                "http://localhost:8080/api/admin/send-otp",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email
                    })
                }
            );

        const data =
            await response.json();

        showAlert(
            data.message,
            "success"
        );

        if (data.success) {

            document.getElementById("otpSection")
                .classList.remove("d-none");

            startTimer();
        }

    } catch (error) {

        showAlert(
            "Failed To Send OTP",
            "danger"
        );
    }
}

// VERIFY OTP

document.getElementById("verifyOtpBtn")
    .addEventListener("click", verifyOtp);

async function verifyOtp() {

    const email =
        document.getElementById("email").value;

    const otp =
        document.getElementById("otp").value;

    try {

        const response =
            await fetch(
                "http://localhost:8080/api/admin/verify-otp",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        otp
                    })
                }
            );

        const data =
            await response.json();

        if (data.verified) {

            otpVerified = true;

            document.getElementById("createBtn")
                .disabled = false;

            showAlert(
                "OTP Verified Successfully",
                "success"
            );

        } else {

            showAlert(
                data.message,
                "danger"
            );
        }

    } catch (error) {

        showAlert(
            "OTP Verification Failed",
            "danger"
        );
    }
}

// TIMER

function startTimer() {

    let time = 30;

    const timer =
        document.getElementById("timer");

    const resendBtn =
        document.getElementById("resendOtpBtn");

    resendBtn.disabled = true;

    const interval =
        setInterval(() => {

            time--;

            timer.innerText = time;

            if (time <= 0) {

                clearInterval(interval);

                resendBtn.disabled = false;
            }

        }, 1000);
}

// RESEND OTP

document.getElementById("resendOtpBtn")
    .addEventListener("click", sendOtp);


// Alert Function
function showAlert(message, type) {

    const alertBox =
        document.getElementById("alertBox");

    alertBox.className =
        `alert alert-${type}`;

    alertBox.innerText =
        message;

    alertBox.classList.remove("d-none");
}