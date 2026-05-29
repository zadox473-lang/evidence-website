import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
        if(sidebarTab) sidebarTab.classList.add("active-admin-tab");

        adminSections.forEach(section => {
            section.classList.remove("active-admin-section");
        });

        const activeSection = document.getElementById(target);
        if(activeSection) activeSection.classList.add("active-admin-section");
    });
});

async function saveReport(type, data){
    const docRef = await addDoc(collection(db, "reports"), {
        type,
        status: "approved",
        timestamp: serverTimestamp(),
        ...data
    });

    return docRef.id;
}

function showLink(id){
    const link = `${window.location.origin}/pages/report.html?id=${id}`;
    prompt("Generated Report Link:", link);
}

function getInputs(sectionId){
    const section = document.querySelector(sectionId);
    return {
        inputs: section.querySelectorAll(".admin-input"),
        textarea: section.querySelector(".admin-textarea")
    };
}

/* SCAMMER */

const scammerBtns = document.querySelectorAll("#scammer .admin-submit");

scammerBtns[0]?.addEventListener("click", async () => {
    const { inputs, textarea } = getInputs("#scammer");

    await saveReport("scammer", {
        username: inputs[0].value,
        user_id: inputs[1].value,
        amount: inputs[2].value,
        description: textarea.value,
        proof_channel: inputs[3].value
    });

    alert("Scammer report posted");
});

scammerBtns[1]?.addEventListener("click", async () => {
    const { inputs, textarea } = getInputs("#scammer");

    const id = await saveReport("scammer", {
        username: inputs[0].value,
        user_id: inputs[1].value,
        amount: inputs[2].value,
        description: textarea.value,
        proof_channel: inputs[3].value
    });

    showLink(id);
});

/* FAKE MM */

const fakeMmBtns = document.querySelectorAll("#fake-mm .admin-submit");

fakeMmBtns[0]?.addEventListener("click", async () => {
    const { inputs, textarea } = getInputs("#fake-mm");

    await saveReport("fakemm", {
        fake_mm: inputs[0].value,
        user_id: inputs[1].value,
        real_mm: inputs[2].value,
        amount: inputs[3].value,
        description: textarea.value,
        proof_channel: inputs[4].value
    });

    alert("Fake MM report posted");
});

fakeMmBtns[1]?.addEventListener("click", async () => {
    const { inputs, textarea } = getInputs("#fake-mm");

    const id = await saveReport("fakemm", {
        fake_mm: inputs[0].value,
        user_id: inputs[1].value,
        real_mm: inputs[2].value,
        amount: inputs[3].value,
        description: textarea.value,
        proof_channel: inputs[4].value
    });

    showLink(id);
});

/* IMPERSONATION */

const impBtns = document.querySelectorAll("#impersonation .admin-submit");

impBtns[0]?.addEventListener("click", async () => {
    const { inputs, textarea } = getInputs("#impersonation");

    await saveReport("impersonation", {
        fake_username: inputs[0].value,
        real_username: inputs[1].value,
        user_id: inputs[2].value,
        amount: inputs[3].value,
        description: textarea.value,
        proof_channel: inputs[4].value
    });

    alert("Impersonation report posted");
});

impBtns[1]?.addEventListener("click", async () => {
    const { inputs, textarea } = getInputs("#impersonation");

    const id = await saveReport("impersonation", {
        fake_username: inputs[0].value,
        real_username: inputs[1].value,
        user_id: inputs[2].value,
        amount: inputs[3].value,
        description: textarea.value,
        proof_channel: inputs[4].value
    });

    showLink(id);
});

/* MIDDLEMAN */

const mmBtn = document.querySelector("#middleman .admin-submit");

mmBtn?.addEventListener("click", async () => {
    const { inputs, textarea } = getInputs("#middleman");

    await addDoc(collection(db, "middlemen"), {
        username: inputs[0].value,
        user_id: inputs[1].value,
        telegram_link: inputs[2].value,
        description: textarea.value,
        timestamp: serverTimestamp()
    });

    alert("Middleman added");
});
