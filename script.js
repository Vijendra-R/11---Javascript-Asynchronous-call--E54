// Target HTML Elements
const countryInput = document.getElementById("countryInput");
const searchBtn = document.getElementById("searchBtn");
const resultContainer = document.getElementById("result");
const messageContainer = document.getElementById("message");

// Event Listeners
searchBtn.addEventListener("click", fetchCountryData);
countryInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") fetchCountryData();
});

// Async Function to fetch data
async function fetchCountryData() {
    const countryName = countryInput.value.trim();

    // Reset previous views
    resultContainer.classList.add("hidden");
    messageContainer.innerHTML = "";
    messageContainer.className = "message";

    if (!countryName) {
        showMessage("Please enter a country name.", "error");
        return;
    }

    showMessage("Searching country details...", "loading");

    // We pass the exact assignment API URL through a CORS proxy to bypass server blocks
    const targetUrl = `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURI(targetUrl)}`;

    try {
        const response = await fetch(proxyUrl);

        if (!response.ok) {
            throw new Error("Country not found. Please check spelling.");
        }

        const data = await response.json();
        
        // Handle array response from REST Countries
        const country = Array.isArray(data) ? data[0] : data;

        // Extract requested data
        const name = country.name?.common || "N/A";
        const capital = country.capital ? country.capital[0] : "N/A";
        const population = country.population ? country.population.toLocaleString() : "N/A";
        const region = country.region || "N/A";
        const flagUrl = country.flags?.png || "";

        // Render HTML
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
        showMessage(error.message || "Failed to fetch country details.", "error");
    }
}

function showMessage(msg, type) {
    messageContainer.innerHTML = msg;
    messageContainer.className = `message ${type}`;
}