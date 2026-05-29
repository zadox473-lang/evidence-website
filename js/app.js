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
/* 3D SHIELD */

const shieldPanel = document.getElementById("shieldPanel");
const shield3d = document.getElementById("shield3d");

let autoRotate = true;
let angleY = 0;
let angleX = 0;

let startX = 0;
let startY = 0;

let baseY = 0;
let baseX = 0;

let dragging = false;

function clamp(value,min,max){
    return Math.max(min,Math.min(max,value));
}

function updateShield(){
    shield3d.style.transform =
    `rotateX(${angleX}deg) rotateY(${angleY}deg)`;
}

function animateShield(){

    if(autoRotate){

        angleY += 0.6;

        angleX *= 0.96;

        updateShield();

    }

    requestAnimationFrame(animateShield);
}

function startDrag(e){

    dragging = true;
    autoRotate = false;

    const point =
    e.touches ? e.touches[0] : e;

    startX = point.clientX;
    startY = point.clientY;

    baseY = angleY;
    baseX = angleX;
}

function moveDrag(e){

    if(!dragging) return;

    e.preventDefault();

    const point =
    e.touches ? e.touches[0] : e;

    const dx = point.clientX - startX;
    const dy = point.clientY - startY;

    angleY = baseY + dx * 0.8;

    angleX =
    clamp(baseX - dy * 0.25,-25,25);

    updateShield();
}

function stopDrag(){

    dragging = false;
    autoRotate = true;

}

if(shieldPanel && shield3d){

    shieldPanel.addEventListener(
        "mousedown",
        startDrag
    );

    window.addEventListener(
        "mousemove",
        moveDrag
    );

    window.addEventListener(
        "mouseup",
        stopDrag
    );

    shieldPanel.addEventListener(
        "touchstart",
        startDrag,
        {passive:false}
    );

    window.addEventListener(
        "touchmove",
        moveDrag,
        {passive:false}
    );

    window.addEventListener(
        "touchend",
        stopDrag
    );

    animateShield();
        }
