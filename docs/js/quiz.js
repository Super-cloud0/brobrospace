let currentQuiz = null
let questions = []
let currentQuestionIndex = 0
let score = 0
let answers = []
let currentUser = null // Declare currentUser variable
const supabase = null // Declare supabase variable

// Function to get URL parameter
function getUrlParameter(name) {
  name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]")
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)")
  var results = regex.exec(location.search)
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "))
}

// Function to check authentication state
async function checkAuthState() {
  // Placeholder for authentication state check
  // This should be replaced with actual authentication logic
  currentUser = { id: "123" } // Example user
}

// Load quiz
async function loadQuiz() {
  const quizId = getUrlParameter("id")
  if (!quizId) {
    window.location.href = "learn.html"
    return
  }

  const loadingSpinner = document.getElementById("loadingSpinner")
  const quizContent = document.getElementById("quizContent")

  try {
    // Load quiz details
    const { data: quizData, error: quizError } = await supabase.from("quizzes").select("*").eq("id", quizId).single()

    if (quizError) throw quizError

    currentQuiz = quizData

    // Load questions
    const { data: questionsData, error: questionsError } = await supabase
      .from("quiz_questions")
      .select("*")
      .eq("quiz_id", quizId)
      .order("id")

    if (questionsError) throw questionsError

    questions = questionsData

    document.getElementById("quizTitle").textContent = currentQuiz.title

    loadingSpinner.style.display = "none"
    quizContent.style.display = "block"

    showQuestion()
  } catch (error) {
    console.error("Error loading quiz:", error)
    loadingSpinner.innerHTML = "<p>Error loading quiz. Please try again.</p>"
  }
}

// Show current question
function showQuestion() {
  const question = questions[currentQuestionIndex]

  document.getElementById("questionText").textContent = question.question
  document.getElementById("progressText").textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`
  document.getElementById("progressFill").style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`

  const answersContainer = document.getElementById("answersContainer")
  answersContainer.innerHTML = question.options
    .map(
      (option, index) => `
    <button class="answer-btn" onclick="selectAnswer(${index})">${option}</button>
  `,
    )
    .join("")

  document.getElementById("feedback").style.display = "none"
  document.getElementById("nextBtn").style.display = "none"
}

// Select answer
function selectAnswer(index) {
  const question = questions[currentQuestionIndex]
  const answerBtns = document.querySelectorAll(".answer-btn")
  const feedback = document.getElementById("feedback")
  const nextBtn = document.getElementById("nextBtn")

  // Disable all buttons
  answerBtns.forEach((btn) => (btn.disabled = true))

  // Check if correct
  const isCorrect = index === question.correct_answer

  if (isCorrect) {
    score++
    answerBtns[index].classList.add("correct")
    feedback.className = "feedback correct"
    feedback.textContent = "✓ Correct! " + (question.explanation || "")
  } else {
    answerBtns[index].classList.add("incorrect")
    answerBtns[question.correct_answer].classList.add("correct")
    feedback.className = "feedback incorrect"
    feedback.textContent = "✗ Incorrect. " + (question.explanation || "")
  }

  feedback.style.display = "block"
  nextBtn.style.display = "block"

  answers.push({
    question_id: question.id,
    selected_answer: index,
    is_correct: isCorrect,
  })
}

// Next question
function nextQuestion() {
  currentQuestionIndex++

  if (currentQuestionIndex < questions.length) {
    showQuestion()
  } else {
    showResults()
  }
}

// Show results
async function showResults() {
  const questionContainer = document.getElementById("questionContainer")
  const resultsContainer = document.getElementById("resultsContainer")

  questionContainer.style.display = "none"
  resultsContainer.style.display = "block"

  const percentage = Math.round((score / questions.length) * 100)

  document.getElementById("scorePercentage").textContent = `${percentage}%`
  document.getElementById("scoreText").textContent =
    `You scored ${score} out of ${questions.length} questions correctly!`

  // Save score if logged in
  if (currentUser) {
    try {
      await supabase.from("quiz_attempts").insert({
        user_id: currentUser.id,
        quiz_id: currentQuiz.id,
        score: score,
        total_questions: questions.length,
        percentage: percentage,
      })
    } catch (error) {
      console.error("Error saving quiz score:", error)
    }
  }
}

// Retake quiz
function retakeQuiz() {
  currentQuestionIndex = 0
  score = 0
  answers = []

  document.getElementById("questionContainer").style.display = "block"
  document.getElementById("resultsContainer").style.display = "none"

  showQuestion()
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  checkAuthState().then(() => {
    loadQuiz()
  })
})
