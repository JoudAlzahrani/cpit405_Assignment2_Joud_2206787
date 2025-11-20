// CPIT405 - Assignment 2
// Fetch & Display Data from a Public API using fetch()
// Public API used: REST Countries API (https://restcountries.com)

/*
  App idea:
  - The user types a country name in the input box.
  - When the user clicks the "Search" button (or presses Enter),
    we call fetch() to get country information from the API.
  - We then display flag, capital, region, population, and languages.
*/

// Select DOM elements
const countryInput = document.getElementById("countryInput");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");
const resultCard = document.getElementById("result");

// When user clicks the button
searchBtn.addEventListener("click", fetchCountryData);

// Also allow pressing Enter inside the input
countryInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    fetchCountryData();
  }
});

function fetchCountryData() {
  const countryName = countryInput.value.trim();

  // Simple validation: input should not be empty
  if (!countryName) {
    showMessage("Please type a country name first.", "error");
    resultCard.classList.add("hidden");
    return;
  }

  // Show loading message
  showMessage("Loading country data...", "info");
  resultCard.classList.add("hidden");

  // Build the API URL
  const url =
    "https://restcountries.com/v3.1/name/" +
    encodeURIComponent(countryName) +
    "?fullText=false";

  // Use fetch() to get data from the public API
  fetch(url)
    .then(function (response) {
      if (!response.ok) {
        // If response is not ok (e.g., 404), throw an error
        throw new Error("Country not found");
      }
      return response.json();
    })
    .then(function (data) {
      // The API returns an array of countries; we take the first one
      const country = data[0];
      displayCountry(country);
      showMessage(""); // clear message
    })
    .catch(function (error) {
      // If there is any error (network or country not found)
      console.error(error);
      showMessage(
        "Could not find this country. Please try another name.",
        "error"
      );
      resultCard.classList.add("hidden");
    });
}

// Helper function: display data inside the card
function displayCountry(country) {
  // Safely access properties
  const flag =
    (country.flags && (country.flags.png || country.flags.svg)) || "";
  const name = (country.name && country.name.common) || "Unknown";
  const capital = country.capital ? country.capital[0] : "N/A";
  const region = country.region || "N/A";
  const population = country.population
    ? country.population.toLocaleString()
    : "N/A";
  const languages = country.languages
    ? Object.values(country.languages).join(", ")
    : "N/A";

  // Fill the result card with HTML
  resultCard.innerHTML = `
    <img src="${flag}" alt="Flag of ${name}">
    <h2>${name}</h2>
    <p><span class="label">Capital:</span> ${capital}</p>
    <p><span class="label">Region:</span> ${region}</p>
    <p><span class="label">Population:</span> ${population}</p>
    <p><span class="label">Languages:</span> ${languages}</p>
  `;

  // Show the card
  resultCard.classList.remove("hidden");
}

// Helper function: show status / error messages
function showMessage(text, type) {
  message.textContent = text;
  message.className = "message"; // reset classes

  if (type === "error") {
    message.classList.add("error");
  } else if (type === "info") {
    message.classList.add("info");
  }
}
