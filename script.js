const countryInput = document.getElementById("countryInput");
const searchBtn = document.getElementById("searchBtn");
const resultContainer = document.getElementById("result");
const messageContainer = document.getElementById("message");

searchBtn.addEventListener("click", fetchCountryData);
countryInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") fetchCountryData();
});

async function fetchCountryData() {
    const countryName = countryInput.value.trim();

    resultContainer.classList.add("hidden");
    messageContainer.innerHTML = "";
    messageContainer.className = "message";

    if (!countryName) {
        showMessage("Please enter a country name.", "error");
        return;
    }

    showMessage("Searching country details...", "loading");

    // Primary endpoint required by assignment prompt
    const primaryUrl = `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`;
    
    // Fallback mirror endpoint if main API is blocked by ISP/DNS
    const fallbackUrl = `https://countryinfoapi.com/api/countries/name/${encodeURIComponent(countryName)}`;

    try {
        let response;
        try {
            // Try primary Rest Countries API
            response = await fetch(primaryUrl);
        } catch (netErr) {
            // If primary fails completely at network layer (ISP/DNS block), try fallback
            console.warn("Primary API failed/blocked. Trying fallback endpoint...");
            response = await fetch(fallbackUrl);
        }

        if (!response.ok) {
            throw new Error("Country not found. Please check spelling.");
        }

        const data = await response.json();
        
        // Handle array responses from both APIs
        const country = Array.isArray(data) ? data[0] : data;

        const name = country.name?.common || country.name || "N/A";
        const capital = country.capital ? (Array.isArray(country.capital) ? country.capital[0] : country.capital) : "N/A";
        const population = country.population ? country.population.toLocaleString() : "N/A";
        const region = country.region || "N/A";
        const flagUrl = country.flags?.png || country.flag || "";

        resultContainer.innerHTML = `
            <img class="flag-img" src="${flagUrl}" alt="Flag of ${name}">
            <h2 class="country-title">${name}</h2>
            <div class="detail-item"><span>Capital:</span> ${capital}</div>
            <div class="detail-item"><span>Population:</span> ${population}</div>
            <div class="detail-item"><span>Region:</span> ${region}</div>
        `;

        messageContainer.innerHTML = "";
        resultContainer.classList.remove("hidden");

    } catch (error) {
        showMessage(error.message || "Failed to fetch data.", "error");
    }
}

function showMessage(msg, type) {
    messageContainer.innerHTML = msg;
    messageContainer.className = `message ${type}`;
}