// Import supabase client
import { supabase } from "./supabaseClient.js"

// Authentication state management
let currentUser = null

// Check authentication state
async function checkAuthState() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  currentUser = user
  updateNavigation()
}

// Update navigation based on auth state
function updateNavigation() {
  const loginLink = document.getElementById("loginLink")
  const profileLink = document.getElementById("profileLink")
  const logoutBtn = document.getElementById("logoutBtn")

  if (currentUser) {
    if (loginLink) loginLink.style.display = "none"
    if (profileLink) profileLink.style.display = "block"
    if (logoutBtn) logoutBtn.style.display = "block"
  } else {
    if (loginLink) loginLink.style.display = "block"
    if (profileLink) profileLink.style.display = "none"
    if (logoutBtn) logoutBtn.style.display = "none"
  }
}

// Handle logout
async function handleLogout() {
  await supabase.auth.signOut()
  currentUser = null
  window.location.href = "index.html"
}

// Initialize auth on page load
document.addEventListener("DOMContentLoaded", () => {
  checkAuthState()
})
