import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const submitBtn = document.getElementById("submitAppealBtn");

submitBtn?.addEventListener("click", async () => {
    const username = document.getElementById("appealUsername").value.trim();
    const userId = document.getElementById("appealUserId").value.trim();
    const telegram = document.getElementById("appealTelegram").value.trim();
    const proof = document.getElementById("appealProof").value.trim();
    const reason = document.getElementById("appealReason").value.trim();

    if(!username || !userId || !reason){
        alert("Please fill username, user ID and reason.");
        return;
    }

    try{
        await addDoc(collection(db, "appeals"), {
            username,
            user_id: userId,
            telegram,
            proof_link: proof,
            reason,
            status: "pending",
            timestamp: serverTimestamp()
        });

        alert("Appeal submitted successfully.");
        window.location.href = "../index.html";

    }catch(error){
        alert("Appeal Error: " + error.message);
    }
});
