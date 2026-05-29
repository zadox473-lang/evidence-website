import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const middlemenGrid = document.getElementById("middlemenGrid");

async function loadMiddlemen(){
    try{
        const snap = await getDocs(collection(db, "middlemen"));

        middlemenGrid.innerHTML = "";

        if(snap.empty){
            middlemenGrid.innerHTML = `
                <div class="report-card">
                    <h3>No Trusted Middlemen</h3>
                    <p class="report-desc">No middlemen added yet.</p>
                </div>
            `;
            return;
        }

        snap.forEach(item => {
            const data = item.data();

            middlemenGrid.innerHTML += `
                <div class="report-card">
                    <div class="report-top">
                        <div>
                            <h3>${data.username || "@unknown"}</h3>
                            <span>ID: ${data.user_id || "N/A"}</span>
                        </div>
                    </div>

                    <p class="report-desc">
                        ${data.description || "Verified middleman."}
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
                </div>
            `;
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
