// Function to fetch crypto names from the API
async function fetchCryptoNames() {
    try {
        const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=40&page=1&sparkline=false");
        if (!response.ok) {
            throw new Error("Failed to fetch crypto names");
        }
        const data = await response.json();
        return data.map(coin => coin.name);
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Function to add crypto options to the dropdown
async function addCryptoOptions() {
    const cryptoNames = await fetchCryptoNames();
    const optionsList = document.querySelector(".options1");
    optionsList.innerHTML = "";
    cryptoNames.forEach(crypto => {
        let option = document.createElement("li");
        option.textContent = crypto;
        option.addEventListener("click", function() {
            updateCryptoName(this.textContent);
        });
        optionsList.appendChild(option);
    });
}

// Function to update the selected crypto
function updateCryptoName(selectedCrypto) {
    const inputField = document.querySelector(".input1");
    inputField.value = "";
    const selectButton = document.querySelector(".select-btn1 span");
    selectButton.textContent = selectedCrypto;
    const wrapper = document.querySelector(".wrapper1");
    wrapper.classList.remove("active");
}

// Function to fetch fiat names from the API
async function fetchFiatNames() {
    try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        if (!response.ok) {
            throw new Error("Failed to fetch fiat names");
        }
        const data = await response.json();
        return Object.keys(data.rates);
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Function to add fiat options to the dropdown
async function addFiatOptions() {
    const fiatNames = await fetchFiatNames();
    const optionsList = document.querySelector(".options2");
    optionsList.innerHTML = "";
    fiatNames.forEach(fiat => {
        let option = document.createElement("li");
        option.textContent = fiat;
        option.addEventListener("click", function() {
            updateFiatName(this.textContent);
        });
        optionsList.appendChild(option);
    });
}

// Function to update the selected fiat
function updateFiatName(selectedFiat) {
    const inputField = document.querySelector(".input2");
    inputField.value = "";
    const selectButton = document.querySelector(".select-btn2 span");
    selectButton.textContent = selectedFiat;
    const wrapper = document.querySelector(".wrapper2");
    wrapper.classList.remove("active");
}

// Function to initialize dropdowns
async function initializeDropdowns() {
    await addCryptoOptions();
    await addFiatOptions();

    // After both dropdowns are populated, initialize them
    document.querySelector(".select-btn1").addEventListener("click", function() {
        const wrapper = document.querySelector(".wrapper1");
        wrapper.classList.toggle("active");
    });
    document.querySelector(".select-btn2").addEventListener("click", function() {
        const wrapper = document.querySelector(".wrapper2");
        wrapper.classList.toggle("active");
    });
}

// Event listener for the convert button
document.getElementById("convertBtn").addEventListener("click", convertCryptoToFiat);

// Event listeners for opening/closing dropdowns
document.addEventListener("DOMContentLoaded", initializeDropdowns);

// Function to handle conversion and display result
async function convertCryptoToFiat() {
    const selectedCrypto = document.querySelector(".select-btn1 span").innerText.toLowerCase();
    const selectedFiat = document.querySelector(".select-btn2 span").innerText.toLowerCase();

    const amount = parseFloat(document.getElementById("amount").value);
    if (isNaN(amount) || amount <= 0) {
        document.getElementById("result").textContent = "Please enter a valid amount.";
        document.getElementById("result").style.display = "block"; // Show result div
        return;
    }

    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${selectedCrypto}&vs_currencies=${selectedFiat}`);
        if (!response.ok) {
            throw new Error("Failed to fetch conversion rate.");
        }
        const data = await response.json();
        
        // Check if the conversion rate exists
        if (!data[selectedCrypto] || !data[selectedCrypto][selectedFiat]) {
            throw new Error("Conversion rate not available.");
        }

        const rate = data[selectedCrypto][selectedFiat];
        const convertedAmount = amount * rate;
        document.getElementById("result").textContent = `${amount} ${selectedCrypto.toUpperCase()} = ${convertedAmount.toFixed(2)} ${selectedFiat.toUpperCase()}`;
        document.getElementById("result").style.display = "block"; // Show result div
    } catch (error) {
        console.error(error);
        document.getElementById("result").textContent = "Failed to perform conversion. Please try again later.";
        document.getElementById("result").style.display = "block"; // Show result div
    }
}


// Function to handle search for crypto options
document.querySelector(".input1").addEventListener("input", function() {
    const searchTerm = this.value.toLowerCase();
    const optionsList = document.querySelector(".options1");
    const options = optionsList.querySelectorAll("li");
    let matchFound = false;
    options.forEach(option => {
        const text = option.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            option.style.display = "block";
            matchFound = true;
        } else {
            option.style.display = "none";
        }
    });
    if (!matchFound) {
        optionsList.innerHTML = `<li>Oops!!!, ${searchTerm} is not available.</li>`;
    }
});

// Function to handle search for fiat options
document.querySelector(".input2").addEventListener("input", function() {
    const searchTerm = this.value.toLowerCase();
    const optionsList = document.querySelector(".options2");
    const options = optionsList.querySelectorAll("li");
    let matchFound = false;
    options.forEach(option => {
        const text = option.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            option.style.display = "block";
            matchFound = true;
        } else {
            option.style.display = "none";
        }
    });
    if (!matchFound) {
        optionsList.innerHTML = `<li>Oops!!!, ${searchTerm} is not available.</li>`;
    }
});

// Function to handle backspace key press
document.querySelector(".input1").addEventListener("keydown", function(event) {
    if (event.keyCode === 8) { // Backspace key code
        const optionsList = document.querySelector(".options1");
        optionsList.innerHTML = ""; // Remove the "Oops" message
        addCryptoOptions(); // Restore original options
    }
});

document.querySelector(".input2").addEventListener("keydown", function(event) {
    if (event.keyCode === 8) { // Backspace key code
        const optionsList = document.querySelector(".options2");
        optionsList.innerHTML = ""; // Remove the "Oops" message
        addFiatOptions(); // Restore original options
    }
});