let canvas, ctx
let planets = []
let isPlaying = true
let speed = 1
let time = 0
let supabase // Declare supabase variable

// Initialize simulation
async function initSimulation() {
  canvas = document.getElementById("simulationCanvas")
  ctx = canvas.getContext("2d")

  // Set canvas size
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight

  // Load planets
  await loadPlanets()

  // Start animation
  animate()
}

// Load planets from database
async function loadPlanets() {
  try {
    const { data, error } = await supabase
      .from("celestial_objects")
      .select("*")
      .eq("type", "planet")
      .order("distance_from_sun")

    if (error) throw error

    planets = data.map((planet, index) => ({
      name: planet.name,
      distance: 50 + index * 40, // Scaled distance for visualization
      speed: 0.5 / (index + 1), // Slower for outer planets
      angle: Math.random() * Math.PI * 2,
      color: getColorForPlanet(planet.name),
      radius: Math.max(3, 15 - index * 1.5), // Scaled size
    }))

    renderLegend()
  } catch (error) {
    console.error("Error loading planets:", error)
  }
}

// Render legend
function renderLegend() {
  const legendContainer = document.getElementById("planetLegend")

  legendContainer.innerHTML = planets
    .map(
      (planet) => `
    <div class="legend-item">
      <div class="legend-color" style="background: ${planet.color};"></div>
      <span>${planet.name}</span>
    </div>
  `,
    )
    .join("")
}

// Animation loop
function animate() {
  if (isPlaying) {
    time += 0.01 * speed

    // Clear canvas
    ctx.fillStyle = "#0f172a"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Draw Sun
    ctx.fillStyle = "#f59e0b"
    ctx.beginPath()
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2)
    ctx.fill()

    // Draw orbits and planets
    planets.forEach((planet) => {
      // Draw orbit
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(centerX, centerY, planet.distance, 0, Math.PI * 2)
      ctx.stroke()

      // Calculate planet position
      planet.angle += planet.speed * speed * 0.01
      const x = centerX + Math.cos(planet.angle) * planet.distance
      const y = centerY + Math.sin(planet.angle) * planet.distance

      // Draw planet
      ctx.fillStyle = planet.color
      ctx.beginPath()
      ctx.arc(x, y, planet.radius, 0, Math.PI * 2)
      ctx.fill()

      // Draw planet name
      ctx.fillStyle = "#e2e8f0"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(planet.name, x, y - planet.radius - 5)
    })
  }

  requestAnimationFrame(animate)
}

// Toggle play/pause
function togglePlayPause() {
  isPlaying = !isPlaying
  const btn = document.getElementById("playPauseBtn")
  btn.textContent = isPlaying ? "⏸ Pause" : "▶ Play"
}

// Update speed
function updateSpeed(value) {
  speed = Number.parseFloat(value)
  document.getElementById("speedValue").textContent = `${speed}x`
}

// Reset simulation
function resetSimulation() {
  time = 0
  planets.forEach((planet) => {
    planet.angle = Math.random() * Math.PI * 2
  })
}

// Get color for planet
function getColorForPlanet(name) {
  const colors = {
    Mercury: "#8c7853",
    Venus: "#ffc649",
    Earth: "#4a90e2",
    Mars: "#e27b58",
    Jupiter: "#c88b3a",
    Saturn: "#fad5a5",
    Uranus: "#4fd0e7",
    Neptune: "#4166f5",
  }
  return colors[name] || "#6366f1"
}

// Handle window resize
window.addEventListener("resize", () => {
  if (canvas) {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
  }
})

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Initialize supabase here
  supabase = initializeSupabase() // Placeholder for actual initialization
  initSimulation()
})

// Placeholder function for initializing supabase
function initializeSupabase() {
  // Replace with actual supabase initialization code
  return {
    from: (table) => ({
      select: (columns) => ({
        eq: (column, value) => ({
          order: (column) => ({
            then: (callback) => {
              callback({ data: [], error: null })
            },
          }),
        }),
      }),
    }),
  }
}
