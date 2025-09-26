const hamburger = document.querySelector('.hamburger');
const navLink = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLink.classList.toggle('active');
    hamburger.classList.toggle('active');
});

function goToLoginPage(view) {
    window.location.href = `login.html?view=${view}`;
}

// === LOGIN FORM HANDLER ===
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
        const res = await fetch("https://new-eaor.onrender.com/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Login successful!");
            localStorage.setItem("token", data.token);
            handleLoginSuccess(data);
        } else {
            alert(data.message || "Login failed!");
        }
    } catch (err) {
        console.error(err);
        alert("Something went wrong!");
    }
});

// === SIGNUP FORM HANDLER ===
document.getElementById("signup-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const phone = document.getElementById("signup-phone").value;
    const role = document.getElementById("signup-role").value;
    const company = document.getElementById("signup-company")?.value || null;

    try {
        const res = await fetch("https://new-eaor.onrender.com/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, phone, role, company })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Signup successful! Please log in.");
            window.location.href = "login.html?view=login";
        } else {
            alert(data.message || "Signup failed!");
        }
    } catch (err) {
        console.error(err);
        alert("Something went wrong!");
    }
});

// === Update UI after login ===
function updateUserMenu(user) {
    document.querySelector(".auth-btn")?.style?.setProperty("display", "none");

    const userMenu = document.querySelector(".user-menu");
    if (userMenu) userMenu.style.display = "block";

    document.getElementById("username").textContent = user.name;

    const adminLink = document.getElementById("admin-link");
    if (adminLink) {
        if (user.type === "admin") {
            adminLink.style.display = "block";
        } else {
            adminLink.style.display = "none";
        }
    }

    const notificationsLink = document.getElementById("notifications-link");
    if (notificationsLink) {
        if (user.role === "owner" || user.role === "tenant") {
            notificationsLink.style.display = "block";
        } else {
            notificationsLink.style.display = "none";
        }
    }
}

// === Logout ===
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    document.querySelector(".user-menu")?.style?.setProperty("display", "none");
    document.querySelector(".auth-btn")?.style?.setProperty("display", "block");

    alert("You have logged out.");
    window.location.href = "index.html";
}

// === After login success ===
async function handleLoginSuccess(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    updateUserMenu(data.user);

    // Redirect user
    if (data.user.email === "admin@quickrent.com" || data.user.isAdmin) {
        window.location.href = "admin.html"; 
    } else {
        window.location.href = "profile.html"; 
    }
}

// === Auto-load user menu if logged in ===
window.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user) {
        updateUserMenu(user);
    }
});

window.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const res = await fetch("https://new-eaor.onrender.com/api/auth/me", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (!data.user) return;

        const user = data.user;
        document.getElementById("username").textContent = user.name;

        if (user.email === "admin@quickrent.com" || user.isAdmin) {
            document.getElementById("profile-link").style.display = "none";
            document.getElementById("admin-link").style.display = "block";
        } else {
            document.getElementById("profile-link").style.display = "block";
            document.getElementById("admin-link").style.display = "none";
        }

    } catch (err) {
        console.error(err);
    }
});
