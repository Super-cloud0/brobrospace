let currentObject = null
let scene, camera, renderer, mesh
let isFavorite = false
const currentUser = null
import { supabase } from "./supabaseClient.js"
import * as THREE from "three"
import { getUrlParameter } from "./utils.js"
import { formatNumber } from "./utils.js"
import { checkAuthState } from "./auth.js"

// Load object details
async function loadObjectDetails() {
  const objectId = getUrlParameter("id")
  if (!objectId) {
    window.location.href = "explore.html"
    return
  }

  const loadingSpinner = document.getElementById("loadingSpinner")
  const objectContent = document.getElementById("objectContent")

  try {
    const { data, error } = await supabase.from("celestial_objects").select("*").eq("id", objectId).single()

    if (error) throw error

    currentObject = data

    // Check if favorited
    if (currentUser) {
      await checkFavoriteStatus()
    }

    // Populate page
    document.getElementById("objectName").textContent = data.name
    document.getElementById("objectType").textContent = data.type
    document.getElementById("objectType").className = "object-type-badge"
    document.getElementById("objectMass").textContent = data.mass ? `${formatNumber(data.mass)} kg` : "N/A"
    document.getElementById("objectRadius").textContent = data.radius ? `${formatNumber(data.radius)} km` : "N/A"
    document.getElementById("objectDistance").textContent = data.distance_from_sun
      ? `${formatNumber(data.distance_from_sun)} km`
      : "N/A"
    document.getElementById("objectOrbitalPeriod").textContent = data.orbital_period
      ? `${formatNumber(data.orbital_period)} days`
      : "N/A"
    document.getElementById("objectTemperature").textContent = data.surface_temperature
      ? `${data.surface_temperature}°C`
      : "N/A"
    document.getElementById("objectGravity").textContent = data.gravity ? `${data.gravity} m/s²` : "N/A"
    document.getElementById("objectDescription").textContent = data.description || "No description available"

    // Populate facts
    const factsList = document.getElementById("objectFacts")
    if (data.interesting_facts && data.interesting_facts.length > 0) {
      factsList.innerHTML = data.interesting_facts.map((fact) => `<li>${fact}</li>`).join("")
    } else {
      factsList.innerHTML = "<li>No interesting facts available</li>"
    }

    loadingSpinner.style.display = "none"
    objectContent.style.display = "block"

    // Initialize 3D viewer
    init3DViewer()
  } catch (error) {
    console.error("Error loading object:", error)
    loadingSpinner.innerHTML = "<p>Error loading object details. Please try again.</p>"
  }
}

// Check if object is favorited
async function checkFavoriteStatus() {
  if (!currentUser || !currentObject) return

  const { data, error } = await supabase
    .from("user_favorites")
    .select("*")
    .eq("user_id", currentUser.id)
    .eq("object_id", currentObject.id)
    .single()

  isFavorite = !!data
  updateFavoriteButton()
}

// Update favorite button
function updateFavoriteButton() {
  const favoriteBtn = document.getElementById("favoriteBtn")
  const favoriteIcon = document.getElementById("favoriteIcon")

  if (isFavorite) {
    favoriteBtn.classList.add("active")
    favoriteIcon.textContent = "★"
  } else {
    favoriteBtn.classList.remove("active")
    favoriteIcon.textContent = "☆"
  }
}

// Toggle favorite
async function toggleFavorite() {
  if (!currentUser) {
    alert("Please log in to save favorites")
    window.location.href = "login.html"
    return
  }

  try {
    if (isFavorite) {
      // Remove favorite
      await supabase.from("user_favorites").delete().eq("user_id", currentUser.id).eq("object_id", currentObject.id)

      isFavorite = false
    } else {
      // Add favorite
      await supabase.from("user_favorites").insert({
        user_id: currentUser.id,
        object_id: currentObject.id,
      })

      isFavorite = true
    }

    updateFavoriteButton()
  } catch (error) {
    console.error("Error toggling favorite:", error)
    alert("Error updating favorite. Please try again.")
  }
}

// Initialize 3D viewer
function init3DViewer() {
  const container = document.getElementById("threeDViewer")

  // Scene
  scene = new THREE.Scene()

  // Camera
  camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)
  camera.position.z = 5

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setClearColor(0x0f172a, 1)
  container.appendChild(renderer.domElement)

  // Create sphere
  const geometry = new THREE.SphereGeometry(2, 32, 32)
  const material = new THREE.MeshPhongMaterial({
    color: getColorForType(currentObject.type),
    shininess: 30,
  })
  mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0xffffff, 1)
  pointLight.position.set(5, 5, 5)
  scene.add(pointLight)

  // Animation
  animate()
}

// Animation loop
function animate() {
  requestAnimationFrame(animate)

  if (mesh) {
    mesh.rotation.y += 0.005
  }

  renderer.render(scene, camera)
}

// Reset camera
function resetCamera() {
  camera.position.set(0, 0, 5)
  camera.lookAt(0, 0, 0)
}

// Get color for object type
function getColorForType(type) {
  const colors = {
    planet: 0x6366f1,
    moon: 0x8b5cf6,
    star: 0xf59e0b,
    galaxy: 0x06b6d4,
  }
  return colors[type] || 0x6366f1
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  checkAuthState().then(() => {
    loadObjectDetails()
  })
})
