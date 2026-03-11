const apiUrl = "https://dummyjson.com/recipes"; 

let allFoods = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const foodGrid = document.getElementById("foodGrid");

const categoryFilter = document.getElementById("categoryFilter");
const regionFilter = document.getElementById("regionFilter");
const vegFilter = document.getElementById("vegFilter");
const spicyFilter = document.getElementById("spicyFilter");
const searchInput = document.getElementById("searchInput");
const clearFilters = document.getElementById("clearFilters");

const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");

const toast = document.getElementById("toast");

const imageMap = {
"Jollof Rice":"https://upload.wikimedia.org/wikipedia/commons/4/4b/Jollof_Rice.jpg",
"Egusi Soup":"https://upload.wikimedia.org/wikipedia/commons/6/6e/Egusi_soup.jpg",
"Pounded Yam":"https://upload.wikimedia.org/wikipedia/commons/e/e3/Pounded_yam.jpg",
"Suya":"https://upload.wikimedia.org/wikipedia/commons/5/5b/Suya.jpg",
"Akara":"https://upload.wikimedia.org/wikipedia/commons/f/f3/Akara.jpg",
"Moi Moi":"https://upload.wikimedia.org/wikipedia/commons/a/a8/Moi_moi.jpg",
"Efo Riro":"https://upload.wikimedia.org/wikipedia/commons/3/35/Efo_riro.jpg",
"Fried Rice":"https://upload.wikimedia.org/wikipedia/commons/8/8f/Fried_rice.jpg",
"Pepper Soup":"https://upload.wikimedia.org/wikipedia/commons/4/48/Pepper_soup.jpg",
"Amala":"https://upload.wikimedia.org/wikipedia/commons/b/bd/Amala_food.jpg",
"Puff Puff":"https://upload.wikimedia.org/wikipedia/commons/8/82/Puff_puff.jpg",
"Chin Chin":"https://upload.wikimedia.org/wikipedia/commons/f/f5/Chin_chin_snack.jpg"
};

function showToast(message){
toast.textContent = message;
toast.classList.remove("hidden");

setTimeout(()=>{
toast.classList.add("hidden");
},2000);
}

function renderFoods(list){

foodGrid.innerHTML="";

list.forEach(food=>{

const isFavorite = favorites.includes(food.id);

const card = document.createElement("div");

card.className="bg-white shadow rounded-lg p-4 cursor-pointer";

card.innerHTML=`

<img src="${imageMap[food.name] || 'https://via.placeholder.com/400'}"
class="w-full h-40 object-cover rounded mb-3">

<h2 class="text-lg font-bold flex justify-between items-center">

${food.name}

<svg 
data-id="${food.id}"
class="favorite-btn w-6 h-6"
viewBox="0 0 24 24"
fill="${isFavorite ? 'orange' : 'white'}"
stroke="orange"
stroke-width="1.5"
stroke-linecap="round"
stroke-linejoin="round">

<path d="M7.75 3.5C5.127 3.5 3 5.76 3 8.547C3 14.125 12 20.5 12 20.5s9-6.375 9-11.953C21 5.094 18.873 3.5 16.25 3.5c-1.86 0-3.47 1.136-4.25 2.79c-.78-1.654-2.39-2.79-4.25-2.79"/>

</svg>

</h2>

<p class="text-gray-600">${food.description}</p>

`;

foodGrid.appendChild(card);

card.addEventListener("click",(e)=>{

if(e.target.classList.contains("favorite-btn")) return;

openModal(food);

});

});

document.querySelectorAll(".favorite-btn").forEach(btn=>{

btn.addEventListener("click",(e)=>{

e.stopPropagation();

const id = Number(btn.dataset.id);

toggleFavorite(id);

});

});

}

function toggleFavorite(id){

if(favorites.includes(id)){

favorites = favorites.filter(f=>f!==id);

showToast("Removed from favorites");

}else{

favorites.push(id);

showToast("Added to favorites");

}

localStorage.setItem("favorites",JSON.stringify(favorites));

renderFoods(allFoods);

}

function openModal(food){

const isFavorite = favorites.includes(food.id);

modalContent.innerHTML=`

<img src="${imageMap[food.name] || 'https://via.placeholder.com/400'}"
class="w-full h-52 object-cover rounded mb-4">

<h2 class="text-xl font-bold flex justify-between">

${food.name}

<svg
onclick="toggleFavorite(${food.id})"
class="w-7 h-7 cursor-pointer"
viewBox="0 0 24 24"
fill="${isFavorite ? 'orange' : 'white'}"
stroke="orange"
stroke-width="1.5">

<path d="M7.75 3.5C5.127 3.5 3 5.76 3 8.547C3 14.125 12 20.5 12 20.5s9-6.375 9-11.953C21 5.094 18.873 3.5 16.25 3.5c-1.86 0-3.47 1.136-4.25 2.79c-.78-1.654-2.39-2.79-4.25-2.79"/>

</svg>

</h2>

<p class="mt-2">${food.description}</p>

<h3 class="font-bold mt-4">Ingredients</h3>

<ul class="list-disc ml-5">
${food.ingredients.map(i=>`<li>${i}</li>`).join("")}
</ul>

<p class="mt-3"><b>Region:</b> ${food.region}</p>
<p><b>Category:</b> ${food.category}</p>
<p><b>Calories:</b> ${food.calories}</p>

`;

modal.classList.remove("hidden");

}

closeModal.addEventListener("click",()=>{

modal.classList.add("hidden");

});

document.addEventListener("keydown",(e)=>{

if(e.key==="Escape"){

modal.classList.add("hidden");

}

});

function applyFilters(){

let filtered=[...allFoods];

if(categoryFilter.value)
filtered=filtered.filter(f=>f.category===categoryFilter.value);

if(regionFilter.value)
filtered=filtered.filter(f=>f.region===regionFilter.value);

if(vegFilter.checked)
filtered=filtered.filter(f=>f.isVegetarian);

if(spicyFilter.checked)
filtered=filtered.filter(f=>f.isSpicy);

const searchValue=searchInput.value.toLowerCase();

if(searchValue){

filtered=filtered.filter(f=>
f.name.toLowerCase().includes(searchValue) ||
f.description.toLowerCase().includes(searchValue)
);

}

renderFoods(filtered);

}

categoryFilter.addEventListener("change",applyFilters);
regionFilter.addEventListener("change",applyFilters);
vegFilter.addEventListener("change",applyFilters);
spicyFilter.addEventListener("change",applyFilters);
searchInput.addEventListener("input",applyFilters);

clearFilters.addEventListener("click",()=>{

categoryFilter.value="";
regionFilter.value="";
vegFilter.checked=false;
spicyFilter.checked=false;
searchInput.value="";

renderFoods(allFoods);

});

async function loadFoods(){

const res = await fetch("foods.json");
const data = await res.json();

allFoods = data.data;

populateFilters();

renderFoods(allFoods);

}

function populateFilters(){

const categories=[...new Set(allFoods.map(f=>f.category))];

categories.forEach(c=>{

const option=document.createElement("option");

option.value=c;
option.textContent=c;

categoryFilter.appendChild(option);

});

const regions=[...new Set(allFoods.map(f=>f.region))];

regions.forEach(r=>{

const option=document.createElement("option");

option.value=r;
option.textContent=r;

regionFilter.appendChild(option);

});

}

loadFoods();