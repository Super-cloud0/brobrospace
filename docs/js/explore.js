import { supabase } from "./path-to-supabase" // Import supabase or declare it before using

let allObjects = []
let filteredObjects = []
let currentFilter = "all"

// Load objects from database
async function loadObjects() {
  const loadingSpinner = document.getElementById("loadingSpinner")
  const objectsGrid = document.getElementById("objectsGrid")
  const noResults = document.getElementById("noResults")

  try {
    const { data, error } = await supabase.from("celestial_objects").select("*").order("name")

    if (error) throw error

    allObjects = data
    filteredObjects = data

    loadingSpinner.style.display = "none"
    renderObjects()
  } catch (error) {
    console.error("Error loading objects:", error)
    loadingSpinner.innerHTML = "<p>Error loading objects. Please try again.</p>"
  }
}

// Render objects grid
function renderObjects() {
  const objectsGrid = document.getElementById("objectsGrid")
  const noResults = document.getElementById("noResults")

  if (filteredObjects.length === 0) {
    objectsGrid.innerHTML = ""
    noResults.style.display = "block"
    return
  }

  noResults.style.display = "none"

  objectsGrid.innerHTML = filteredObjects
    .map(
      (obj) => `
    <a href="object-detail.html?id=${obj.id}" class="object-card">
      <div class="object-card-image" style="background: linear-gradient(135deg, ${getColorForType(obj.type)} 0%, ${getSecondaryColor(obj.type)} 100%);"></div>
      <div class="object-card-content">
        <h3 class="object-card-title">${obj.name}</h3>
        <span class="object-type-badge">${obj.type}</span>
        <p class="object-card-description">${obj.description || "No description available"}</p>
      </div>
    </a>
  `,
    )
    .join("")
}

// Filter by type
function filterByType(type) {
  currentFilter = type

  // Update active button
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active")
  })
  event.target.classList.add("active")

  // Filter objects
  if (type === "all") {
    filteredObjects = allObjects
  } else {
    filteredObjects = allObjects.filter((obj) => obj.type === type)
  }

  renderObjects()
}

// Search objects
function searchObjects() {
  const searchInput = document.getElementById("searchInput")
  const query = searchInput.value.toLowerCase()

  if (!query) {
    filteredObjects = currentFilter === "all" ? allObjects : allObjects.filter((obj) => obj.type === currentFilter)
  } else {
    const baseFilter = currentFilter === "all" ? allObjects : allObjects.filter((obj) => obj.type === currentFilter)

    filteredObjects = baseFilter.filter(
      (obj) =>
        obj.name.toLowerCase().includes(query) || (obj.description && obj.description.toLowerCase().includes(query)),
    )
  }

  renderObjects()
}

// Get color for object type
function getColorForType(type) {
  const colors = {
    planet: "#6366f1",
    moon: "#8b5cf6",
    star: "#f59e0b",
    galaxy: "#06b6d4",
  }
  return colors[type] || "#6366f1"
}

function getSecondaryColor(type) {
  const colors = {
    planet: "#4f46e5",
    moon: "#7c3aed",
    star: "#d97706",
    galaxy: "#0891b2",
  }
  return colors[type] || "#4f46e5"
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadObjects()

  // Add enter key support for search
  const searchInput = document.getElementById("searchInput")
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchObjects()
    }
  })
})
