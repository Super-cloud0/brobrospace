let galleryImages = []
const NASA_API_KEY = "your_api_key_here" // Declare NASA_API_KEY

// Load NASA APOD images
async function loadGalleryImages() {
  const loadingSpinner = document.getElementById("loadingSpinner")
  const galleryGrid = document.getElementById("galleryGrid")

  try {
    // Fetch last 12 days of APOD
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 11)

    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&start_date=${formatDateForAPI(startDate)}&end_date=${formatDateForAPI(endDate)}`,
    )

    if (!response.ok) throw new Error("Failed to fetch NASA images")

    const data = await response.json()
    galleryImages = data.reverse() // Most recent first

    loadingSpinner.style.display = "none"
    renderGallery()
  } catch (error) {
    console.error("Error loading gallery:", error)
    loadingSpinner.innerHTML = "<p>Error loading NASA images. Please try again.</p>"
  }
}

// Render gallery
function renderGallery() {
  const galleryGrid = document.getElementById("galleryGrid")

  galleryGrid.innerHTML = galleryImages
    .map(
      (image, index) => `
    <div class="gallery-card" onclick="openModal(${index})">
      <img src="${image.url}" alt="${image.title}" class="gallery-image" onerror="this.src='https://via.placeholder.com/300x250?text=Image+Not+Available'">
      <div class="gallery-content">
        <h3 class="gallery-title">${image.title}</h3>
        <p class="gallery-date">${formatDate(image.date)}</p>
        <p class="gallery-description">${image.explanation.substring(0, 150)}...</p>
      </div>
    </div>
  `,
    )
    .join("")
}

// Open modal
function openModal(index) {
  const image = galleryImages[index]
  const modal = document.getElementById("imageModal")

  document.getElementById("modalImage").src = image.url
  document.getElementById("modalTitle").textContent = image.title
  document.getElementById("modalDate").textContent = formatDate(image.date)
  document.getElementById("modalDescription").textContent = image.explanation
  document.getElementById("modalHdLink").href = image.hdurl || image.url

  modal.classList.add("active")
}

// Close modal
function closeModal() {
  const modal = document.getElementById("imageModal")
  modal.classList.remove("active")
}

// Format date for API
function formatDateForAPI(date) {
  return date.toISOString().split("T")[0]
}

// Format date for display
function formatDate(date) {
  return new Date(date).toLocaleDateString() // Declare formatDate
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadGalleryImages()
})
