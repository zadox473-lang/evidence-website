import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ELEMENTS */

const reportsGrid = document.querySelector(".reports-grid");
const navButtons = document.querySelectorAll(".nav-btn");
const searchInput = document.querySelector(".search-section input");
const categorySelect = document.querySelector(".search-section select");
const adminBtn = document.querySelector(".admin-btn");
const heroSection = document.querySelector(".hero-section");
const statsSection = document.querySelector(".stats-grid");

let allReports = [];
let currentFilter = "all";

/* HELPERS */

function cleanAmount(amount){
    if(!amount) return 0;
    return Number(String(amount).replace(/[^0-9.]/g, "")) || 0;
}

function getReportName(report){
    if(report.type === "fakemm") return report.fake_mm || "@unknown";
    if(report.type === "impersonation") return report.fake_username || "@unknown";
    return report.username || "@unknown";
}

function getReportTags(report){
    if(report.type === "fakemm") return ["Fake MM", "Middleman Scam"];
    if(report.type === "impersonation") return ["Impersonation", "Fake Identity"];
    return ["Market Scam", "Buyer Scam"];
}

function setHeroVisibility(){
    if(
        currentFilter === "scammer" ||
        currentFilter === "fakemm" ||
        currentFilter === "impersonation" ||
        currentFilter === "top"
    ){
        if(heroSection) heroSection.style.display = "none";
        if(statsSection) statsSection.style.display = "none";
    }else{
        if(heroSection) heroSection.style.display = "";
        if(statsSection) statsSection.style.display = "";
    }
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

                <button class="proof-btn" onclick="window.open('${report.proof_channel || "https://t.me/DwcProtect"}', '_blank')">
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

    const searchValue = searchInput?.value.toLowerCase().trim();

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

    setHeroVisibility();
    renderReports(filtered);
}

function updateStats(){
    const statNumbers = document.querySelectorAll(".stat-card h2");

    const totalReports = allReports.length;
    const totalScammers = allReports.filter(r => r.type === "scammer").length;
    const totalAmount = allReports.reduce((sum,r) => sum + cleanAmount(r.amount), 0);

    if(statNumbers[0]) statNumbers[0].textContent = totalReports;
    if(statNumbers[1]) statNumbers[1].textContent = totalScammers;
    if(statNumbers[2]) statNumbers[2].textContent = "$" + totalAmount;
}

async function updateTrustedCount(){
    try{
        const mmSnap = await getDocs(collection(db, "middlemen"));
        const statNumbers = document.querySelectorAll(".stat-card h2");

        if(statNumbers[3]) statNumbers[3].textContent = mmSnap.size;
    }catch(error){
        console.log("Trusted MM count error:", error);
    }
}

/* LOAD REPORTS */

async function loadReports(){
    try{
        const q = query(
            collection(db, "reports"),
            where("status", "==", "approved")
        );

        const snapshot = await getDocs(q);

        allReports = [];

        snapshot.forEach(doc => {
            allReports.push({
                id: doc.id,
                ...doc.data()
            });
        });

        updateStats();
        updateTrustedCount();
        applyFilters();

    }catch(error){
        console.log("Report load error:", error);

        if(reportsGrid){
            reportsGrid.innerHTML = `
                <div class="report-card">
                    <h3>Database Error</h3>
                    <p class="report-desc">${error.message}</p>
                </div>
            `;
        }
    }
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

        const reportsSection = document.querySelector(".reports-section");
        if(reportsSection && currentFilter !== "all"){
            reportsSection.scrollIntoView({ behavior: "smooth" });
        }
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

/* SHIELD ROTATION */

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
