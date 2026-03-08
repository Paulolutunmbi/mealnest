const API_URL = "https://mongotest2026.vercel.app/api/foods";

const grid = document.getElementById("foodsGrid");
const loader = document.getElementById("loader");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const regionFilter = document.getElementById("regionFilter");
const vegFilter = document.getElementById("vegFilter");
const spicyFilter = document.getElementById("spicyFilter");
const clearFilters = document.getElementById("clearFilters");

let allFoods = []; // store all foods globally

// Fetch foods from API
async function fetchFoods() {
  try {
    loader.classList.remove("hidden");
    grid.innerHTML = "";

    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const result = await response.json();
    allFoods = result.data;

    populateFilters();
    renderFoods(allFoods);
  } catch (error) {
    console.error(error);
    grid.innerHTML = `
      <div class="text-center">
        <p class="text-red-500 mb-4">Failed to load foods.</p>
        <button onclick="fetchFoods()" class="bg-orange-600 text-white px-4 py-2 rounded">
          Retry
        </button>
      </div>
    `;
  } finally {
    loader.classList.add("hidden");
  }
}

// Render food cards
function renderFoods(foods) {
  grid.innerHTML = "";

  if (foods.length === 0) {
    grid.innerHTML = "<p class='text-center col-span-3'>No foods found.</p>";
    return;
  }

foods.forEach(food => {
  const vegIcon = food.isVegetarian ? "🌱 Vegetarian" : "";
  const spicyIcon = food.isSpicy ? "🌶 Spicy" : "";

  const card = document.createElement("div");
  card.className = "bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition cursor-pointer";

  card.innerHTML = `
    <div class="bg-gray-200 h-40 flex items-center justify-center text-gray-500">Food Image</div>
    <div class="p-4">
      <h2 class="text-xl font-bold mb-2">${food.name}</h2>
      <p class="text-gray-600 text-sm mb-3">${food.description}</p>
      <div class="flex gap-3 text-sm mb-3">${vegIcon} ${spicyIcon}</div>
      <p class="text-sm">Calories: ${food.calories}</p>
      <p class="text-sm">Prep Time: ${food.preparationTime} mins</p>
      <p class="text-sm font-semibold mt-2">Price: ₦${food.price}</p>
    </div>
  `;

  card.addEventListener("click", () => openModal(food));

  grid.appendChild(card);
});
}
// Populate category & region filters dynamically
function populateFilters() {
  const categories = [...new Set(allFoods.map(f => f.category))];
  const regions = [...new Set(allFoods.map(f => f.region))];

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  regions.forEach(reg => {
    const option = document.createElement("option");
    option.value = reg;
    option.textContent = reg;
    regionFilter.appendChild(option);
  });
}

// Apply filters
function applyFilters() {
  let filtered = [...allFoods];

  if (categoryFilter.value) filtered = filtered.filter(f => f.category === categoryFilter.value);
  if (regionFilter.value) filtered = filtered.filter(f => f.region === regionFilter.value);
  if (vegFilter.checked) filtered = filtered.filter(f => f.isVegetarian);
  if (spicyFilter.checked) filtered = filtered.filter(f => f.isSpicy);
  
  const searchValue = searchInput.value.toLowerCase();
  if (searchValue) {
    filtered = filtered.filter(f =>
      f.name.toLowerCase().includes(searchValue) ||
      f.description.toLowerCase().includes(searchValue)
    );
  }

  renderFoods(filtered);
}

// Event listeners
categoryFilter.addEventListener("change", applyFilters);
regionFilter.addEventListener("change", applyFilters);
vegFilter.addEventListener("change", applyFilters);
spicyFilter.addEventListener("change", applyFilters);
searchInput.addEventListener("input", applyFilters);
clearFilters.addEventListener("click", () => {
  categoryFilter.value = "";
  regionFilter.value = "";
  vegFilter.checked = false;
  spicyFilter.checked = false;
  searchInput.value = "";
  renderFoods(allFoods);
});

// Initial load
fetchFoods();
const foodModal = document.getElementById("foodModal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");

// Function to open modal with food details
function openModal(food) {
  modalContent.innerHTML = `
    <h2 class="text-2xl font-bold">${food.name}</h2>
    <p class="text-gray-600 mb-2">${food.description}</p>
    <div class="flex gap-3 mb-2">
      ${food.isVegetarian ? "🌱 Vegetarian" : ""}
      ${food.isSpicy ? "🌶 Spicy" : ""}
    </div>
    <p class="text-sm">Calories: ${food.calories}</p>
    <p class="text-sm">Prep Time: ${food.preparationTime} mins</p>
    <p class="text-sm">Difficulty: ${food.difficulty || "N/A"}</p>
    <p class="text-sm mb-3">Serving Size: ${food.servingSize || "N/A"}</p>
    <button id="addFavorite" class="bg-orange-600 text-white px-4 py-2 rounded">Add to Favorites</button>
  `;
  foodModal.classList.remove("hidden");

  // Favorite button logic
  const addFavorite = document.getElementById("addFavorite");
  addFavorite.onclick = () => addToFavorites(food);
}

// Close modal
closeModal.addEventListener("click", () => foodModal.classList.add("hidden"));
window.addEventListener("keydown", e => {
  if (e.key === "Escape") foodModal.classList.add("hidden");
});