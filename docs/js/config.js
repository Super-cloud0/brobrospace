// Supabase Configuration
const SUPABASE_URL = "https://gplyzxozluicasuteeny.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwbHl6eG96bHVpY2FzdXRlZW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1Njc1NTMsImV4cCI6MjA3NTE0MzU1M30.Dk6TTEAuFs-hubpbxT0QQje97l9Te_G0IjFm-4QIhQk"

// NASA API Configuration
const NASA_API_KEY = "DEMO_KEY" // Replace with actual key from environment

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Helper function to format numbers
function formatNumber(num) {
  if (!num) return "N/A"
  return new Intl.NumberFormat("en-US").format(num)
}

// Helper function to format dates
function formatDate(dateString) {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Get URL parameters
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(name)
}
