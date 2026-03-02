const API_URL = "https://mongotest2026.vercel.app/api/foods";

const grid = document.getElementById("foodsGrid");
const loader = document.getElementById("loader");
const searchInput = document.getElementById("searchInput");

let allFoods = []; // stores all foods globally

async function fetchFoods() {
  try {
    loader.classList.remove("hidden");
    grid.innerHTML = "";

    const response = await fetch(API_URL);

    // Handle HTTP errors (404, 500, etc.)
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const result = await response.json();

    allFoods = result.data; // store globally
    renderFoods(allFoods);

  } catch (error) {
    console.error(error);
    grid.innerHTML = `
      <div class="text-center">
        <p class="text-red-500 mb-4">Failed to load foods.</p>
        <button onclick="fetchFoods()" 
          class="bg-orange-600 text-white px-4 py-2 rounded">
          Retry
        </button>
      </div>
    `;
  } finally {
    loader.classList.add("hidden");
  }
}

function renderFoods(foods) {
  grid.innerHTML = "";

  if (foods.length === 0) {
    grid.innerHTML = "<p class='text-center col-span-3'>No foods found.</p>";
    return;
  }

  foods.forEach(food => {
    const card = `
      <div class="bg-white shadow-md rounded-xl p-4 hover:shadow-xl transition">
        <h2 class="text-xl font-bold mb-2">${food.name}</h2>
        <p class="text-gray-600 text-sm mb-2">${food.description}</p>
        <p class="text-sm">Calories: ${food.calories}</p>
        <p class="text-sm">Prep Time: ${food.preparationTime} mins</p>
        <p class="text-sm font-semibold">Price: ₦${food.price}</p>
      </div>
    `;

    grid.innerHTML += card;
  });
}

// Real-time search
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  const filtered = allFoods.filter(food =>
    food.name.toLowerCase().includes(value) ||
    food.description.toLowerCase().includes(value)
  );

  renderFoods(filtered);
});

fetchFoods();