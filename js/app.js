console.log("Evidence.gg Loaded");

/* CATEGORY BUTTONS */

const navButtons = document.querySelectorAll(".nav-btn");

navButtons.forEach(button => {

    button.addEventListener("click", () => {

        navButtons.forEach(btn => {
            btn.classList.remove("active-nav");
        });

        button.classList.add("active-nav");

    });

});

/* SIDEBAR BUTTONS */

const sidebarButtons = document.querySelectorAll(".sidebar-btn");

sidebarButtons.forEach(button => {

    button.addEventListener("click", () => {

        sidebarButtons.forEach(btn => {
            btn.classList.remove("active-btn");
        });

        button.classList.add("active-btn");

    });

});

/* ADMIN BUTTON */

const adminBtn = document.querySelector(".admin-btn");

adminBtn.addEventListener("click", () => {

    window.location.href = "pages/login.html";

});
