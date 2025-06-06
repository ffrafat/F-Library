const SHEET_URL = "https://opensheet.elk.sh/1iRmGrxhck68waJpNKLAicm0X96mZg-2mAf5xwtZuD98/1";
const container = document.getElementById("bookCards");
const search = document.getElementById("search");
const categoryFilter = document.getElementById("categoryFilter");
const languageFilter = document.getElementById("languageFilter");

async function fetchBooks() {
  const res = await fetch(SHEET_URL);
  const data = await res.json();
  populateFilters(data);
  displayBooks(data);

  search.addEventListener("input", () => filterBooks(data));
  categoryFilter.addEventListener("change", () => filterBooks(data));
  languageFilter.addEventListener("change", () => filterBooks(data));
}

function populateFilters(data) {
  const categories = [...new Set(data.map(book => book["Category"]).filter(Boolean))];
  const languages = [...new Set(data.map(book => book["Language"]).filter(Boolean))];

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  languages.forEach(lang => {
    const option = document.createElement("option");
    option.value = lang;
    option.textContent = lang;
    languageFilter.appendChild(option);
  });
}

function displayBooks(data) {
  container.innerHTML = "";

  data.forEach(book => {
    const id = book["ID"] || "";
    const title = book["Title"] || "";
    const author = book["Author"] || "";
    const category = book["Category"] || "";
    const language = book["Language"] || "";

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      ${id ? `<div class="card-id">আইডি: ${id}</div>` : ""}
      ${title ? `<div class="card-title">${title}</div>` : ""}
      ${author ? `<div class="card-author">✍️ ${author}</div>` : ""}
      <div class="tags">
        ${category ? `<span class="tag">${category}</span>` : ""}
        ${language ? `<span class="tag">${language}</span>` : ""}
      </div>
    `;

    container.appendChild(card);
  });
}

function filterBooks(data) {
  const term = search.value.toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedLanguage = languageFilter.value;

  const filtered = data.filter(book =>
    (book["Title"]?.toLowerCase().includes(term) || book["Author"]?.toLowerCase().includes(term)) &&
    (selectedCategory === "" || book["Category"] === selectedCategory) &&
    (selectedLanguage === "" || book["Language"] === selectedLanguage)
  );

  displayBooks(filtered);
}

function toggleMenu() {
  document.getElementById('mainMenu').classList.toggle('show');
}

fetchBooks();
