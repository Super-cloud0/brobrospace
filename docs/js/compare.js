import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://your-supabase-url.supabase.co"
const supabaseKey = "your-supabase-key"
const supabase = createClient(supabaseUrl, supabaseKey)

function formatNumber(num) {
  return num.toLocaleString("en-US")
}

let allObjects = []
let selectedObjects = []

// Load objects for comparison
async function loadObjectsForComparison() {
  try {
    const { data, error } = await supabase.from("celestial_objects").select("*").order("name")

    if (error) throw error

    allObjects = data
    populateSelectors()
  } catch (error) {
    console.error("Error loading objects:", error)
  }
}

// Populate select dropdowns
function populateSelectors() {
  const selectors = ["object1", "object2", "object3"]

  selectors.forEach((selectorId) => {
    const select = document.getElementById(selectorId)
    select.innerHTML =
      '<option value="">Select an object...</option>' +
      allObjects.map((obj) => `<option value="${obj.id}">${obj.name}</option>`).join("")
  })
}

// Load comparison
async function loadComparison() {
  const object1Id = document.getElementById("object1").value
  const object2Id = document.getElementById("object2").value
  const object3Id = document.getElementById("object3").value

  selectedObjects = []

  if (object1Id) {
    const obj = allObjects.find((o) => o.id === object1Id)
    if (obj) selectedObjects.push(obj)
  }

  if (object2Id) {
    const obj = allObjects.find((o) => o.id === object2Id)
    if (obj) selectedObjects.push(obj)
  }

  if (object3Id) {
    const obj = allObjects.find((o) => o.id === object3Id)
    if (obj) selectedObjects.push(obj)
  }

  if (selectedObjects.length >= 2) {
    renderComparison()
  } else {
    document.getElementById("comparisonResults").style.display = "none"
    document.getElementById("emptyState").style.display = "block"
  }
}

// Render comparison
function renderComparison() {
  const comparisonGrid = document.getElementById("comparisonGrid")
  const comparisonResults = document.getElementById("comparisonResults")
  const emptyState = document.getElementById("emptyState")

  comparisonGrid.innerHTML = selectedObjects
    .map(
      (obj) => `
    <div class="comparison-card">
      <h3>${obj.name}</h3>
      <span class="object-type-badge">${obj.type}</span>
      <div class="comparison-stats">
        <div class="stat-row">
          <span>Mass</span>
          <strong>${obj.mass ? formatNumber(obj.mass) + " kg" : "N/A"}</strong>
        </div>
        <div class="stat-row">
          <span>Radius</span>
          <strong>${obj.radius ? formatNumber(obj.radius) + " km" : "N/A"}</strong>
        </div>
        <div class="stat-row">
          <span>Distance from Sun</span>
          <strong>${obj.distance_from_sun ? formatNumber(obj.distance_from_sun) + " km" : "N/A"}</strong>
        </div>
        <div class="stat-row">
          <span>Orbital Period</span>
          <strong>${obj.orbital_period ? formatNumber(obj.orbital_period) + " days" : "N/A"}</strong>
        </div>
        <div class="stat-row">
          <span>Temperature</span>
          <strong>${obj.surface_temperature ? obj.surface_temperature + "°C" : "N/A"}</strong>
        </div>
        <div class="stat-row">
          <span>Gravity</span>
          <strong>${obj.gravity ? obj.gravity + " m/s²" : "N/A"}</strong>
        </div>
      </div>
    </div>
  `,
    )
    .join("")

  comparisonResults.style.display = "block"
  emptyState.style.display = "none"
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadObjectsForComparison()
})
