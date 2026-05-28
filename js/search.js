const searchInput = document.querySelector(".search-section input");

searchInput.addEventListener("keyup", () => {

    const value = searchInput.value.toLowerCase();

    const cards = document.querySelectorAll(".report-card");

    cards.forEach(card => {

        const text = card.innerText.toLowerCase();

        if(text.includes(value)){
            card.style.display = "block";
        }else{
            card.style.display = "none";
        }

    });

});
