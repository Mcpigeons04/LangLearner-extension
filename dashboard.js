document.addEventListener("DOMContentLoaded", () => {
  // Attach tab switch event listeners
  const historyBtn = document.getElementById("historyBtn");
  const quizBtn = document.getElementById("quizBtn");
  const settingsBtn = document.getElementById("settingsBtn");

  if (historyBtn) historyBtn.addEventListener("click", () => showTab("history"));
  if (quizBtn) quizBtn.addEventListener("click", () => showTab("quiz"));
  if (settingsBtn) settingsBtn.addEventListener("click", () => showTab("settings"));

  loadWordHistory();
});

function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
  });
  document.getElementById(tabId).classList.add("active");

  document.querySelectorAll(".tab-buttons button").forEach(btn => {
    btn.classList.remove("active");
  });
  document.getElementById(tabId + "Btn").classList.add("active");
}


function loadWordHistory() {
  const historyDiv = document.getElementById("historyContent");
  if (!historyDiv) return;

  historyDiv.innerHTML = "Loading...";

  chrome.storage.local.get(null, (items) => {
    historyDiv.innerHTML = ""; // clear loading

    const entries = Object.entries(items)
      .filter(([key]) => /^\d{4}-\d{2}-\d{2}_.+$/.test(key)) // e.g. 2025-07-15_french
      .sort((a, b) => b[0].localeCompare(a[0])); // reverse date sort

    if (entries.length === 0) {
      historyDiv.textContent = "No words saved yet.";
      return;
    }

    for (const [key, word] of entries) {
      const [date, lang] = key.split("_");

      if (!word || !word.word) continue;

      const wordCard = document.createElement("div");
      wordCard.className = "word-card";
      wordCard.innerHTML = `
        <div><strong>${date}</strong> - <em>${lang}</em>: <b>${word.word}</b> ${word.pronunciation ? `(${word.pronunciation})` : ""}</div>
        <div><i>Meaning:</i> ${word.meaning}</div>
        <div><i>Usage:</i> ${word.example}</div>
        <div><i>Translation:</i> ${word.example_translation}</div>
        <hr>
      `;
      historyDiv.appendChild(wordCard);
    }
  });
}

function loadDailyMotivation() {
  fetch("data/motivation.json")
    .then(response => response.json())
    .then(quotes => {
      const day = new Date().getDate();
      const quote = quotes[day % quotes.length];
      const quoteEl = document.getElementById("dailyQuote");
      if (quoteEl) quoteEl.textContent = quote;
    })
    .catch(err => {
      console.error("Failed to load motivation:", err);
      const quoteEl = document.getElementById("dailyQuote");
      if (quoteEl) quoteEl.textContent = "Stay positive. Keep learning!";
    });
}

document.addEventListener("DOMContentLoaded", () => {
  // Existing handlers
  const historyBtn = document.getElementById("historyBtn");
  const quizBtn = document.getElementById("quizBtn");
  const settingsBtn = document.getElementById("settingsBtn");

  if (historyBtn) historyBtn.addEventListener("click", () => showTab("history"));
  if (quizBtn) quizBtn.addEventListener("click", () => showTab("quiz"));
  if (settingsBtn) settingsBtn.addEventListener("click", () => showTab("settings"));

  loadWordHistory();
  loadDailyMotivation(); // 🆕 call motivation loader
});



