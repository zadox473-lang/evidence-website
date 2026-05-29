import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const reportId = params.get("id");

const reportName = document.getElementById("reportName");
const reportUserId = document.getElementById("reportId");
const reportAmount = document.getElementById("reportAmount");
const reportDescription = document.getElementById("reportDescription");
const tagOne = document.getElementById("tagOne");
const tagTwo = document.getElementById("tagTwo");
const evidenceBtn = document.getElementById("evidenceBtn");

function getName(data){
    if(data.type === "fakemm") return data.fake_mm || "@unknown";
    if(data.type === "impersonation") return data.fake_username || "@unknown";
    return data.username || "@unknown";
}

function setTags(type){
    if(type === "fakemm"){
        tagOne.textContent = "Fake MM";
        tagTwo.textContent = "Middleman Scam";
        return;
    }

    if(type === "impersonation"){
        tagOne.textContent = "Impersonation";
        tagTwo.textContent = "Fake Identity";
        return;
    }

    tagOne.textContent = "Market Scam";
    tagTwo.textContent = "Buyer Scam";
}

async function loadReport(){
    if(!reportId){
        reportName.textContent = "Invalid Report";
        reportDescription.textContent = "No report ID found.";
        return;
    }

    try{
        const ref = doc(db, "reports", reportId);
        const snap = await getDoc(ref);

        if(!snap.exists()){
            reportName.textContent = "Report Not Found";
            reportDescription.textContent = "This report does not exist.";
            return;
        }

        const data = snap.data();

        reportName.textContent = getName(data);
        reportUserId.textContent = "ID: " + (data.user_id || "N/A");
        reportAmount.textContent = data.amount || "$0";
        reportDescription.textContent = data.description || "No description available.";

        setTags(data.type);

        evidenceBtn.onclick = () => {
            window.open(data.proof_channel || "https://t.me/DwcProtect", "_blank");
        };

    }catch(error){
        reportName.textContent = "Database Error";
        reportDescription.textContent = error.message;
    }
}

loadReport();
