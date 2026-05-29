import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ELEMENTS */

const reportsGrid = document.querySelector(".reports-grid");
const navButtons = document.querySelectorAll(".nav-btn");
const searchInput = document.querySelector(".search-section input");
const categorySelect = document.querySelector(".search-section select");
const adminBtn = document.querySelector(".admin-btn");

let allReports = [];
let currentFilter = "all";

/* HELPERS */

function cleanAmount(amount){
    if(!amount) return 0;
    return Number(String(amount).replace(/[^0-9.]/g, "")) || 0;
}

function getReportName(report){
    if(report.type === "fakemm"){
        return report.fake_mm || "@unknown";
    }

    if(report.type === "impersonation"){
        return report.fake_username || "@unknown";
    }

    return report.username || "@unknown";
}

function getReportTags(report){
    if(report.type === "fakemm"){
        return ["Fake MM", "Middleman Scam"];
    }

    if(report.type === "impersonation"){
        return ["Impersonation", "Fake Identity"];
    }

    return ["Market Scam", "Buyer Scam"];
}

function renderReports(reports){
    reportsGrid.innerHTML = "";

    if(reports.length === 0){
        reportsGrid.innerHTML = `
            <div class="report-card">
                <h3>No reports found</h3>
                <p class="report-desc">No approved reports are available right now.</p>
            </div>
        `;
        return;
    }

    reports.forEach(report => {
        const name = getReportName(report);
        const tags = getReportTags(report);

        const card = document.createElement("div");
        card.className = "report-card";
        card.dataset.category = report.type;

        card.innerHTML = `
            <div class="report-top">
                <div>
                    <h3>${name}</h3>
                    <span>ID: ${report.user_id || "N/A"}</span>
                </div>

                <h4>${report.amount || "$0"}</h4>
            </div>

            <p class="report-desc">
                ${report.description || "No description available."}
            </p>

            <div class="report-tags">
                <span>${tags[0]}</span>
                <span>${tags[1]}</span>
            </div>

            <div class="report-buttons">
                <button onclick="window.location.href='pages/report.html?id=${report.id}'">
                    View Evidence
                </button>

                <button onclick="window.open('${report.proof_channel || "https://t.me/DwcProtect"}')">
                    Proof Channel
                </button>
            </div>
        `;

        reportsGrid.appendChild(card);
    });
}

function applyFilters(){
    let filtered = [...allReports];

    if(currentFilter !== "all" && currentFilter !== "top"){
        filtered = filtered.filter(report => report.type === currentFilter);
    }

    if(currentFilter === "top"){
        filtered = filtered.sort((a,b) => cleanAmount(b.amount) - cleanAmount(a.amount));
    }

    const searchValue = searchInput.value.toLowerCase().trim();

    if(searchValue){
        filtered = filtered.filter(report => {
            const text = `
                ${getReportName(report)}
                ${report.user_id || ""}
                ${report.description || ""}
            `.toLowerCase();

            return text.includes(searchValue);
        });
    }

    renderReports(filtered);
}

/* LOAD REPORTS */

async function loadReports(){
    const q = query(
        collection(db, "reports"),
        where("status", "==", "approved"),
        orderBy("timestamp", "desc")
    );

    const snapshot = await getDocs(q);

    allReports = [];

    snapshot.forEach(doc => {
        allReports.push({
            id: doc.id,
            ...doc.data()
        });
    });

    renderReports(allReports);
}

loadReports();

/* NAVIGATION */

navButtons.forEach(button => {
    button.addEventListener("click", () => {
        if(button.classList.contains("trusted-btn")){
            window.location.href = "pages/trustedmm.html";
            return;
        }

        if(button.classList.contains("appeal-btn")){
            window.location.href = "pages/appeal.html";
            return;
        }

        navButtons.forEach(btn => btn.classList.remove("active-nav"));
        button.classList.add("active-nav");

        currentFilter = button.dataset.filter || "all";

        applyFilters();
    });
});

if(adminBtn){
    adminBtn.addEventListener("click", () => {
        window.location.href = "pages/login.html";
    });
}

if(searchInput){
    searchInput.addEventListener("input", applyFilters);
}

if(categorySelect){
    categorySelect.addEventListener("change", () => {
        const value = categorySelect.value.toLowerCase();

        if(value.includes("scammer")){
            currentFilter = "scammer";
        }else if(value.includes("fake")){
            currentFilter = "fakemm";
        }else if(value.includes("impersonation")){
            currentFilter = "impersonation";
        }else{
            currentFilter = "all";
        }

        applyFilters();
    });
}

/* 3D SHIELD ROTATION */

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

function clamp(value, min, max){
    return Math.max(min, Math.min(max, value));
}

function updateShield(){
    if(!shield3d) return;
    shield3d.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;
}

function animateShield(){
    if(autoRotate){
        angleY += 0.7;
        angleX *= 0.96;
        updateShield();
    }

    requestAnimationFrame(animateShield);
}

function startDrag(e){
    dragging = true;
    autoRotate = false;

    const point = e.touches ? e.touches[0] : e;

    startX = point.clientX;
    startY = point.clientY;

    baseY = angleY;
    baseX = angleX;
}

function moveDrag(e){
    if(!dragging) return;

    e.preventDefault();

    const point = e.touches ? e.touches[0] : e;

    const dx = point.clientX - startX;
    const dy = point.clientY - startY;

    angleY = baseY + dx * 0.85;
    angleX = clamp(baseX - dy * 0.28, -25, 25);

    updateShield();
}

function stopDrag(){
    if(!dragging) return;

    dragging = false;
    autoRotate = true;
}

if(shieldPanel && shield3d){
    shieldPanel.addEventListener("mousedown", startDrag);
    window.addEventListener("mousemove", moveDrag);
    window.addEventListener("mouseup", stopDrag);

    shieldPanel.addEventListener("touchstart", startDrag, { passive:false });
    window.addEventListener("touchmove", moveDrag, { passive:false });
    window.addEventListener("touchend", stopDrag);

    animateShield();
        }
/* SHIELD FIX */

const fixShield = document.getElementById("shield3d");

let fixAngle = 0;

function rotateShieldFix(){
    if(fixShield){
        fixAngle += 0.7;
        fixShield.style.transform = `rotateY(${fixAngle}deg)`;
    }

    requestAnimationFrame(rotateShieldFix);
}

rotateShieldFix();
