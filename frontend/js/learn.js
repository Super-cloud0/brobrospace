let quizzes = []
let supabase // Declare the supabase variable

// Load quizzes
async function loadQuizzes() {
  const loadingSpinner = document.getElementById("loadingSpinner")
  const quizzesGrid = document.getElementById("quizzesGrid")

  try {
    const { data, error } = await supabase.from("quizzes").select("*").order("title")

    if (error) throw error

    quizzes = data

    loadingSpinner.style.display = "none"
    renderQuizzes()
  } catch (error) {
    console.error("Error loading quizzes:", error)
    loadingSpinner.innerHTML = "<p>Error loading quizzes. Please try again.</p>"
  }
}

// Render quizzes
function renderQuizzes() {
  const quizzesGrid = document.getElementById("quizzesGrid")

  quizzesGrid.innerHTML = quizzes
    .map(
      (quiz) => `
    <a href="quiz.html?id=${quiz.id}" class="quiz-card">
      <span class="quiz-difficulty ${quiz.difficulty}">${quiz.difficulty}</span>
      <h3>${quiz.title}</h3>
      <p>${quiz.description}</p>
      <div class="quiz-meta">
        <span>📝 ${quiz.question_count || 10} questions</span>
      </div>
    </a>
  `,
    )
    .join("")
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  supabase = loadQuizzes() // Initialize supabase here, e.g., createClient('your-supabase-url', 'your-supabase-key');
})
