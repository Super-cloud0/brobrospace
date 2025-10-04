// Import Supabase client
const { createClient } = require("@supabase/supabase-js")
const supabaseUrl = "https://your-supabase-url.supabase.co"
const supabaseKey = "your-supabase-key"
const supabase = createClient(supabaseUrl, supabaseKey)

// Declare currentUser and checkAuthState
let currentUser = null

async function checkAuthState() {
  const { user } = await supabase.auth.getUser()
  currentUser = user
}

// Handle login
async function handleLogin(event) {
  event.preventDefault()

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  const errorMessage = document.getElementById("errorMessage")

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    window.location.href = "profile.html"
  } catch (error) {
    console.error("Login error:", error)
    errorMessage.textContent = error.message
    errorMessage.style.display = "block"
  }
}

// Show sign up modal
function showSignUp() {
  document.getElementById("signUpModal").style.display = "flex"
}

// Close sign up modal
function closeSignUp() {
  document.getElementById("signUpModal").style.display = "none"
}

// Handle sign up
async function handleSignUp(event) {
  event.preventDefault()

  const email = document.getElementById("signUpEmail").value
  const password = document.getElementById("signUpPassword").value
  const username = document.getElementById("signUpUsername").value
  const errorMessage = document.getElementById("signUpError")

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    })

    if (error) throw error

    // Create user profile
    await supabase.from("user_profiles").insert({
      user_id: data.user.id,
      username: username,
      email: email,
    })

    alert("Account created successfully! Please check your email to verify your account.")
    closeSignUp()
  } catch (error) {
    console.error("Sign up error:", error)
    errorMessage.textContent = error.message
    errorMessage.style.display = "block"
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Check if already logged in
  checkAuthState().then(() => {
    if (currentUser) {
      window.location.href = "profile.html"
    }
  })
})
