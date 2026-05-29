import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ADMIN TABS */

const adminTabs = document.querySelectorAll(".admin-tab, .admin-top-btn[data-admin-tab]");
const adminSections = document.querySelectorAll(".admin-section");

adminTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const target = tab.dataset.adminTab;
        if(!target) return;

        document.querySelectorAll(".admin-tab").forEach(btn => {
            btn.classList.remove("active-admin-tab");
        });

        const sidebarTab = document.querySelector(`.admin-tab[data-admin-tab="${target}"]`);

        if(sidebarTab){
            sidebarTab.classList.add("active-admin-tab");
        }

        adminSections.forEach(section => {
            section.classList.remove("active-admin-section");
        });

        const activeSection = document.getElementById(target);

        if(activeSection){
            activeSection.classList.add("active-admin-section");
        }
    });
});

/* SAVE REPORT */

async function saveReport(type, data){
    const docRef = await addDoc(collection(db, "reports"), {
        type: type,
        status: "approved",
        timestamp: serverTimestamp(),
        ...data
    });

    return docRef.id;
}

/* SCAMMER FORM */

const scammerBtn = document.querySelector("#scammer .admin-submit");

if(scammerBtn){
    scammerBtn.addEventListener("click", async () => {
        const inputs = document.querySelectorAll("#scammer .admin-input");
        const desc = document.querySelector("#scammer .admin-textarea");

        await saveReport("scammer", {
            username: inputs[0].value,
            user_id: inputs[1].value,
            amount: inputs[2].value,
            description: desc.value,
            proof_channel: inputs[3].value
        });

        alert("Scammer report posted");
        location.reload();
    });
}

/* FAKE MM FORM */

const fakeMmBtn = document.querySelector("#fake-mm .admin-submit");

if(fakeMmBtn){
    fakeMmBtn.addEventListener("click", async () => {
        const inputs = document.querySelectorAll("#fake-mm .admin-input");
        const desc = document.querySelector("#fake-mm .admin-textarea");

        await saveReport("fakemm", {
            fake_mm: inputs[0].value,
            user_id: inputs[1].value,
            real_mm: inputs[2].value,
            amount: inputs[3].value,
            description: desc.value,
            proof_channel: inputs[4].value
        });

        alert("Fake MM report posted");
        location.reload();
    });
}

/* IMPERSONATION FORM */

const impersonationBtn = document.querySelector("#impersonation .admin-submit");

if(impersonationBtn){
    impersonationBtn.addEventListener("click", async () => {
        const inputs = document.querySelectorAll("#impersonation .admin-input");
        const desc = document.querySelector("#impersonation .admin-textarea");

        await saveReport("impersonation", {
            fake_username: inputs[0].value,
            real_username: inputs[1].value,
            user_id: inputs[2].value,
            amount: inputs[3].value,
            description: desc.value,
            proof_channel: inputs[4].value
        });

        alert("Impersonation report posted");
        location.reload();
    });
}

/* MIDDLEMAN FORM */

const middlemanBtn = document.querySelector("#middleman .admin-submit");

if(middlemanBtn){
    middlemanBtn.addEventListener("click", async () => {
        const inputs = document.querySelectorAll("#middleman .admin-input");
        const desc = document.querySelector("#middleman .admin-textarea");

        await addDoc(collection(db, "middlemen"), {
            username: inputs[0].value,
            user_id: inputs[1].value,
            telegram_link: inputs[2].value,
            description: desc.value,
            timestamp: serverTimestamp()
        });

        alert("Middleman added");
        location.reload();
    });
          }
