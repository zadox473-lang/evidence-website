import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* TABS */

const adminTabs = document.querySelectorAll(".admin-tab, .admin-top-btn[data-admin-tab]");
const adminSections = document.querySelectorAll(".admin-section");

adminTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const target = tab.dataset.adminTab;
        if(!target) return;

        document.querySelectorAll(".admin-tab").forEach(btn => btn.classList.remove("active-admin-tab"));

        const sidebarTab = document.querySelector(`.admin-tab[data-admin-tab="${target}"]`);
        if(sidebarTab) sidebarTab.classList.add("active-admin-tab");

        adminSections.forEach(section => section.classList.remove("active-admin-section"));

        const activeSection = document.getElementById(target);
        if(activeSection) activeSection.classList.add("active-admin-section");

        if(target === "manage") loadManageData();
    });
});

function getInputs(sectionId){
    const section = document.querySelector(sectionId);

    return {
        inputs: section.querySelectorAll(".admin-input"),
        textarea: section.querySelector(".admin-textarea")
    };
}

function cleanAmount(amount){
    if(!amount) return 0;
    return Number(String(amount).replace(/[^0-9.]/g, "")) || 0;
}

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
    const basePath = window.location.pathname.replace("/pages/admin.html", "");
const link = `${window.location.origin}${basePath}/pages/report.html?id=${id}`;
    prompt("Generated Report Link:", link);
}

/* SCAMMER */

const scammerBtns = document.querySelectorAll("#scammer .admin-submit");

scammerBtns[0]?.addEventListener("click", async () => {
    try{
        const { inputs, textarea } = getInputs("#scammer");

        await saveReport("scammer", {
            username: inputs[0].value,
            user_id: inputs[1].value,
            amount: inputs[2].value,
            description: textarea.value,
            proof_channel: inputs[3].value
        });

        alert("Scammer report posted");
        loadStats();
    }catch(error){
        alert("Error: " + error.message);
    }
});

scammerBtns[1]?.addEventListener("click", async () => {
    try{
        const { inputs, textarea } = getInputs("#scammer");

        const id = await saveReport("scammer", {
            username: inputs[0].value,
            user_id: inputs[1].value,
            amount: inputs[2].value,
            description: textarea.value,
            proof_channel: inputs[3].value
        });

        showLink(id);
        loadStats();
    }catch(error){
        alert("Error: " + error.message);
    }
});

/* FAKE MM */

const fakeMmBtns = document.querySelectorAll("#fake-mm .admin-submit");

fakeMmBtns[0]?.addEventListener("click", async () => {
    try{
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
        loadStats();
    }catch(error){
        alert("Error: " + error.message);
    }
});

fakeMmBtns[1]?.addEventListener("click", async () => {
    try{
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
        loadStats();
    }catch(error){
        alert("Error: " + error.message);
    }
});

/* IMPERSONATION */

const impBtns = document.querySelectorAll("#impersonation .admin-submit");

impBtns[0]?.addEventListener("click", async () => {
    try{
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
        loadStats();
    }catch(error){
        alert("Error: " + error.message);
    }
});

impBtns[1]?.addEventListener("click", async () => {
    try{
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
        loadStats();
    }catch(error){
        alert("Error: " + error.message);
    }
});

/* SET MIDDLEMAN */

const mmBtns = document.querySelectorAll("#middleman .admin-submit");

const middlemanPostBtn =
document.getElementById("middlemanPostBtn");

middlemanPostBtn?.addEventListener(
    "click",
    async () => {

        try{

            const { inputs, textarea } =
            getInputs("#middleman");

            await addDoc(
                collection(db, "middlemen"),
                {
                    username: inputs[0].value,
                    user_id: inputs[1].value,
                    telegram_link: inputs[2].value,
                    description: textarea.value,
                    timestamp: serverTimestamp()
                }
            );

            alert("Middleman added successfully");

            loadStats();

        }
        catch(error){

            alert(
                "Middleman Error: " +
                error.message
            );

            console.log(error);

        }

    }
);

/* STATS */

async function loadStats(){
    try{
        const reportsSnap = await getDocs(collection(db, "reports"));
        const mmSnap = await getDocs(collection(db, "middlemen"));

        let totalAmount = 0;

        reportsSnap.forEach(item => {
            totalAmount += cleanAmount(item.data().amount);
        });

        const cards = document.querySelectorAll(".admin-stat-card h2");

        if(cards[0]) cards[0].textContent = reportsSnap.size;
        if(cards[1]) cards[1].textContent = reportsSnap.size;
        if(cards[2]) cards[2].textContent = "$" + totalAmount;
        if(cards[3]) cards[3].textContent = mmSnap.size;
    }catch(error){
        console.log(error);
    }
}

/* MANAGE DATA */

async function loadManageData(){
    const manageList = document.querySelector("#manage .manage-list");
    if(!manageList) return;

    manageList.innerHTML = "";

    const reportsSnap = await getDocs(collection(db, "reports"));

    reportsSnap.forEach(item => {
        const data = item.data();

        const name =
            data.username ||
            data.fake_mm ||
            data.fake_username ||
            "@unknown";

        manageList.innerHTML += `
            <div class="manage-item">
                <div>
                    <h3>${name}</h3>
                    <p>${data.type || "report"} | ${data.amount || "$0"}</p>
                </div>

                <button class="admin-submit danger-admin-btn" onclick="deleteReport('${item.id}')">
                    DELETE REPORT
                </button>
            </div>
        `;
    });

    const mmSnap = await getDocs(collection(db, "middlemen"));

    mmSnap.forEach(item => {
        const data = item.data();

        manageList.innerHTML += `
            <div class="manage-item">
                <div>
                    <h3>${data.username || "@middleman"}</h3>
                    <p>Trusted Middleman</p>
                </div>

                <button class="admin-submit danger-admin-btn" onclick="deleteMiddleman('${item.id}')">
                    DELETE MM
                </button>
            </div>
        `;
    });
}

window.deleteReport = async function(id){
    if(!confirm("Delete this report?")) return;

    await deleteDoc(doc(db, "reports", id));

    alert("Report deleted");
    loadManageData();
    loadStats();
};

window.deleteMiddleman = async function(id){
    if(!confirm("Delete this middleman?")) return;

    await deleteDoc(doc(db, "middlemen", id));

    alert("Middleman deleted");
    loadManageData();
    loadStats();
};

loadStats();
/* NOTIFICATIONS / APPEALS */

async function loadAppeals(){
    const notificationList = document.querySelector("#notifications .manage-list");

    if(!notificationList) return;

    notificationList.innerHTML = "";

    const appealsSnap = await getDocs(collection(db, "appeals"));

    if(appealsSnap.empty){
        notificationList.innerHTML = `
            <div class="manage-item">
                <div>
                    <h3>No notifications</h3>
                    <p>No appeal requests found.</p>
                </div>
            </div>
        `;
        return;
    }

    appealsSnap.forEach(item => {
        const data = item.data();

        notificationList.innerHTML += `
            <div class="manage-item appeal-item">
                <div>
                    <h3>${data.username || "@unknown"}</h3>
                    <p>ID: ${data.user_id || "N/A"}</p>
                    <p>Telegram: ${data.telegram || "N/A"}</p>
                    <p>Reason: ${data.reason || "No reason provided"}</p>
                    <p>
                        Proof:
                        <a href="${data.proof_link || "#"}" target="_blank" style="color:#ff4d4d;">
                            Open Proof
                        </a>
                    </p>
                </div>

                <div class="admin-actions small-actions">
                    <button class="admin-submit" onclick="approveAppeal('${item.id}')">
                        APPROVE
                    </button>

                    <button class="admin-submit secondary-admin-btn" onclick="rejectAppeal('${item.id}')">
                        REJECT
                    </button>

                    <button class="admin-submit danger-admin-btn" onclick="deleteAppeal('${item.id}')">
                        DELETE
                    </button>
                </div>
            </div>
        `;
    });
}

window.approveAppeal = async function(id){
    alert("Appeal approved");
    await deleteDoc(doc(db, "appeals", id));
    loadAppeals();
};

window.rejectAppeal = async function(id){
    alert("Appeal rejected");
    await deleteDoc(doc(db, "appeals", id));
    loadAppeals();
};

window.deleteAppeal = async function(id){
    if(!confirm("Delete this appeal?")) return;

    await deleteDoc(doc(db, "appeals", id));
    alert("Appeal deleted");
    loadAppeals();
};
