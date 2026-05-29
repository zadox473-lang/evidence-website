import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const middlemenGrid = document.getElementById("middlemenGrid");

async function loadMiddlemen(){
    try{
        const snapshot = await getDocs(collection(db, "middlemen"));

        middlemenGrid.innerHTML = "";

        if(snapshot.empty){
            middlemenGrid.innerHTML = `
                <div class="report-card">
                    <h3>No middlemen found</h3>
                    <p class="report-desc">No trusted middlemen are available right now.</p>
                </div>
            `;
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();

            const card = document.createElement("div");
            card.className = "report-card";

            card.innerHTML = `
                <div class="report-top">
                    <div>
                        <h3>${data.username || "@unknown"}</h3>
                        <span>ID: ${data.user_id || "N/A"}</span>
                    </div>
                </div>

                <p class="report-desc">
                    ${data.description || "Verified trusted middleman."}
                </p>

                <div class="report-tags">
                    <span>Trusted MM</span>
                    <span>Verified</span>
                </div>

                <div class="report-buttons">
                    <button onclick="window.open('${data.telegram_link || "https://t.me/DwcProtect"}')">
                        Open Telegram
                    </button>
                </div>
            `;

            middlemenGrid.appendChild(card);
        });

    }catch(error){
        middlemenGrid.innerHTML = `
            <div class="report-card">
                <h3>Database Error</h3>
                <p class="report-desc">${error.message}</p>
            </div>
        `;
    }
}

loadMiddlemen();
