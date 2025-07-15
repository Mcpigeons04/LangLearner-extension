// const contentDiv=document.getElementById("content");
// const langSelector=document.getElementById("languageSelector");

// langSelector.addEventListener("change", () => {
//   const selectedLang = langSelector.value;
//   chrome.storage.local.set({ lang: selectedLang }, () => {
//     loadWord(); // 🔁 Immediately reload word with new language
//   });
// });

// function loadWord(){
//     chrome.storage.local.get(["lang"],async(data)=>{
//         const lang=data.lang || "spanish";
//         langSelector.value=lang; //Assigns language chosen by user to lang.
//         const res=await fetch(`data/${lang}.json`); //fetches the words from the json language chosen.
//         const words=await res.json(); //gets json data into array like format.

//         const today= new Date().toISOString().split("T")[0]; //get only the date part
//         let index= new Date(today).getDate()%words.length; //if words less thatn 31...gets repeated again as days progress
//         let wordobj= words[index];
        
//         contentDiv.innerHTML=`
//         <h3>${wordobj.word} (${wordobj.pronunciation})</h3>
//         <br>
//         <p><b>Meaning: </b>${wordobj.meaning}</p>
//         <p><i>Usage:</i> ${wordobj.example}</p>
//         <p><i>Translation:</i> ${wordobj.example_translation}</p>
//         `;
//         chrome.storage.local.set({[today]:wordobj });
//     });
// }

// loadWord();




// const contentDiv = document.getElementById("content");
// const langSelector = document.getElementById("languageSelector");

// // Save selected language and reload word
// langSelector.addEventListener("change", () => {
//   const selectedLang = langSelector.value;
//   chrome.storage.local.set({ lang: selectedLang }, () => {
//     loadWord(); // Reload word after language change
//   });
// });

// function loadWord() {
//   chrome.storage.local.get(["lang"], async (data) => {
//     const lang = data.lang || "spanish";
//     langSelector.value = lang;

//     const res = await fetch(`data/${lang}.json`);
//     const words = await res.json();

//     const today = new Date().toISOString().split("T")[0];
//     const key = `${today}_${lang}`; // Use composite key

//     let index = new Date(today).getDate() % words.length;
//     const wordobj = words[index];

//     // Render on screen
//     contentDiv.innerHTML = `
//       <h3>${wordobj.word} (${wordobj.pronunciation})</h3>
//       <br>
//       <p><b>Meaning:</b> ${wordobj.meaning}</p>
//       <p><i>Usage:</i> ${wordobj.example}</p>
//       <p><i>Translation:</i> ${wordobj.example_translation}</p>
//     `;

//     // Store with unique key per language and date
//     chrome.storage.local.set({ [key]: wordobj });
//   });
// }

// loadWord(); // code without the typing feature for dropdown.


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
  tamil:"tamil"
};

// Load the current word based on selected or stored language
function loadWord() {
  chrome.storage.local.get(["lang"], async (data) => {
    const lang = data.lang || "spanish";
    langInput.value = capitalize(lang);

    try {
      const res = await fetch(`data/${lang}.json`);
      const words = await res.json();

      const today = new Date().toISOString().split("T")[0];
      const key = `${today}_${lang}`;
      const index = new Date(today).getDate() % words.length;
      const wordobj = words[index];

      contentDiv.innerHTML = `
        <h3>${wordobj.word} (${wordobj.pronunciation})</h3>
        <br>
        <p><b>Meaning:</b> ${wordobj.meaning}</p>
        <p><i>Usage:</i> ${wordobj.example}</p>
        <p><i>Translation:</i> ${wordobj.example_translation}</p>
      `;

      chrome.storage.local.set({ [key]: wordobj });
    } catch (err) {
      contentDiv.innerHTML = `<p style="color:red;"><b>Error loading data for "${lang}".</b> Please try another language.</p>`;
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
