
const contentDiv = document.getElementById("content");
const langInput = document.getElementById("languageInput");
const langDropdown = document.getElementById("languageDropdown");

// List of supported languages (key: lowercase name, value: file name)
const languages = {
  spanish: "spanish",
  french: "french",
  hindi: "hindi",
  german: "german",
  japanese: "japanese",
  korean: "korean",
  kannada: "kannada",
  tamil:"tamil",
  mandarin:"mandarin",
  arabic:"arabic",
  russian:"russian",
  bengali:"bengali",
  portuguese:"portuguese"
};

// Load the current word based on selected or stored language
function loadWord() {
  chrome.storage.local.get(["lang"], async (data) => {
    const lang = data.lang || "spanish";
    langInput.value = capitalize(lang);

try {
    const res = await fetch(`data/${lang}.json`);
    const words = await res.json();

    // Ensure there are words to display
    if (words.length === 0) {
        contentDiv.innerHTML = `<p>No vocabulary words found for this language.</p>`;
        return; // Exit if no words
    }

    const today = new Date(); // Get the current date object

    // Calculate the day of the year (1-indexed)
    const startOfYear = new Date(today.getFullYear(), 0, 1); // January 1st of the current year
    const diffTime = today.getTime() - startOfYear.getTime(); // Difference in milliseconds
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Difference in days

    // The index should be 0-based for array access.
    // If dayOfYear is 1 (Jan 1st), we want index 0. So, (dayOfYear - 1).
    // Then, apply modulo to loop through the words array.
    const wordIndex = (diffDays % words.length);

    // Create a unique key for storage, using the full date
    const storageKey = `${today.toISOString().split("T")[0]}_${lang}`;

    const wordobj = words[wordIndex];

    contentDiv.innerHTML = `
        <h3 class="text-2xl font-bold text-gray-800 mb-2">${wordobj.word} <span class="text-gray-600 text-lg">(${wordobj.pronunciation})</span></h3>
        <p class="text-lg text-gray-700 mb-1"><b>Meaning:</b> ${wordobj.meaning}</p>
        <p class="italic text-gray-600 mb-1"><i>Usage:</i> ${wordobj.example}</p>
        <p class="italic text-gray-600"><i>Translation:</i> ${wordobj.example_translation}</p>
    `;

    // Store the word for today in local storage
    chrome.storage.local.set({ [storageKey]: wordobj });

} catch (error) {
    console.error("Error loading or displaying word:", error);
    contentDiv.innerHTML = `<p class="text-red-600">Error loading vocabulary. Please try again later.</p>`;
}
  });
}

// Capitalize helper
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Filter and display matching languages on input
langInput.addEventListener("input", () => {
  const input = langInput.value.toLowerCase().trim();
  langDropdown.innerHTML = '';

  if (input === '') return;

  Object.keys(languages).forEach((langKey) => {
    if (langKey.includes(input)) {
      const li = document.createElement("li");
      li.textContent = capitalize(langKey);
      li.addEventListener("click", () => {
        langInput.value = capitalize(langKey);
        langDropdown.innerHTML = '';
        chrome.storage.local.set({ lang: languages[langKey] }, () => {
          loadWord();
        });
      });
      langDropdown.appendChild(li);
    }
  });
});

// Dismiss dropdown if clicked outside
document.addEventListener("click", (e) => {
  if (!langInput.contains(e.target) && !langDropdown.contains(e.target)) {
    langDropdown.innerHTML = '';
  }
});

// Initial load
loadWord();



