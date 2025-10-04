let userProfile = null
let favorites = []
let quizHistory = []
const currentUser = null // Declare currentUser
const supabase = null // Declare supabase
const formatDate = null // Declare formatDate
const checkAuthState = null // Declare checkAuthState

// Load profile
async function loadProfile() {
  if (!currentUser) {
    window.location.href = "login.html"
    return
  }

  const loadingSpinner = document.getElementById("loadingSpinner")
  const profileContent = document.getElementById("profileContent")

  try {
    // Load user profile
    const { data: profileData, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", currentUser.id)
      .single()

    if (profileError) throw profileError

    userProfile = profileData

    // Update profile header
    document.getElementById("profileUsername").textContent = userProfile.username || "User"
    document.getElementById("profileEmail").textContent = currentUser.email

    // Load favorites
    await loadFavorites()

    // Load quiz history
    await loadQuizHistory()

    // Calculate stats
    calculateStats()

    loadingSpinner.style.display = "none"
    profileContent.style.display = "block"
  } catch (error) {
    console.error("Error loading profile:", error)
    loadingSpinner.innerHTML = "<p>Error loading profile. Please try again.</p>"
  }
}

// Load favorites
async function loadFavorites() {
  const { data, error } = await supabase
    .from("user_favorites")
    .select(`
      *,
      celestial_objects (*)
    `)
    .eq("user_id", currentUser.id)

  if (error) {
    console.error("Error loading favorites:", error)
    return
  }

  favorites = data
  renderFavorites()
}

// Render favorites
function renderFavorites() {
  const favoritesList = document.getElementById("favoritesList")
  const noFavorites = document.getElementById("noFavorites")

  if (favorites.length === 0) {
    favoritesList.innerHTML = ""
    noFavorites.style.display = "block"
    return
  }

  noFavorites.style.display = "none"

  favoritesList.innerHTML = favorites
    .map(
      (fav) => `
    <a href="object-detail.html?id=${fav.celestial_objects.id}" class="object-card">
      <div class="object-card-image" style="background: linear-gradient(135deg, ${getColorForType(fav.celestial_objects.type)} 0%, ${getSecondaryColor(fav.celestial_objects.type)} 100%);"></div>
      <div class="object-card-content">
        <h3 class="object-card-title">${fav.celestial_objects.name}</h3>
        <span class="object-type-badge">${fav.celestial_objects.type}</span>
      </div>
    </a>
  `,
    )
    .join("")
}

// Load quiz history
async function loadQuizHistory() {
  const { data, error } = await supabase
    .from("quiz_attempts")
    .select(`
      *,
      quizzes (*)
    `)
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error loading quiz history:", error)
    return
  }

  quizHistory = data
  renderQuizHistory()
}

// Render quiz history
function renderQuizHistory() {
  const quizHistoryContainer = document.getElementById("quizHistory")
  const noQuizzes = document.getElementById("noQuizzes")

  if (quizHistory.length === 0) {
    quizHistoryContainer.innerHTML = ""
    noQuizzes.style.display = "block"
    return
  }

  noQuizzes.style.display = "none"

  quizHistoryContainer.innerHTML = quizHistory
    .map(
      (attempt) => `
    <div class="quiz-history-item">
      <div class="quiz-history-info">
        <h3>${attempt.quizzes.title}</h3>
        <p>${formatDate(attempt.created_at)}</p>
      </div>
      <div class="quiz-score">${attempt.percentage}%</div>
    </div>
  `,
    )
    .join("")
}

// Calculate stats
function calculateStats() {
  document.getElementById("totalFavorites").textContent = favorites.length
  document.getElementById("totalQuizzes").textContent = quizHistory.length

  if (quizHistory.length > 0) {
    const avgScore = quizHistory.reduce((sum, attempt) => sum + attempt.percentage, 0) / quizHistory.length
    const bestScore = Math.max(...quizHistory.map((attempt) => attempt.percentage))

    document.getElementById("avgScore").textContent = `${Math.round(avgScore)}%`
    document.getElementById("bestScore").textContent = `${bestScore}%`
  }
}

// Show tab
function showTab(tabName) {
  // Hide all tabs
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.style.display = "none"
  })

  // Remove active class from all buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active")
  })

  // Show selected tab
  document.getElementById(`${tabName}Tab`).style.display = "block"
  event.target.classList.add("active")
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
  checkAuthState().then(() => {
    loadProfile()
  })
})
