// DOM Elements
const startScreen = document.getElementById("start-screen")
const quizScreen = document.getElementById("quiz-screen")
const resultScreen = document.getElementById("result-screen")
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");


// Quiz Questions
const quizQuestions = [
  {
    question: "What is the phenomenon where light bends as it passes from one medium to another?",
    answers: [
      { text: "Reflection", correct: false },
      { text: "Diffraction", correct: false },
      { text: "Refraction", correct: true },
      { text: "Absorption", correct: false },
    ],
  },
  {
    question: "Who wrote the play 'Romeo and Juliet'?",
    answers: [
      { text: "Charles Dickens", correct: false },
      { text: "William Shakespeare", correct: true },
      { text: "Jane Austen", correct: false },
      { text: "Leo Tolstoy", correct: false },
    ],
  },
  {
    question: "Which of the following is an example of a deciduous tree?",
    answers: [
      { text: "Pine", correct: false },
      { text: "Spruce", correct: false },
      { text: "Oak", correct: true },
      { text: "Fir", correct: false },
    ],
  },
  {
    question: "In computing, what does 'CPU' stand for?",
    answers: [
      { text: "Central Processing Unit", correct: true },
      { text: "Central Power Unit", correct: false },
      { text: "Computer Personal Utility", correct: false },
      { text: "Core Processing Utility", correct: false },
    ],
  },
  {
    question: "Which famous artist is known for cutting off part of his own ear?",
    answers: [
      { text: "Claude Monet", correct: false },
      { text: "Pablo Picasso", correct: false },
      { text: "Vincent van Gogh", correct: true },
      { text: "Leonardo da Vinci", correct: false },
    ],
  },
];

// Quiz State Vars
let currentQuestionIndex = 0
let score = 0
let answerDisabled = false

totalQuestionsSpan.textContent = quizQuestions.length
maxScoreSpan.textContent = quizQuestions.length

// Event Listeners

startButton.addEventListener("click", startQuiz)
restartButton.addEventListener("click", restartQuiz)

function startQuiz() {

    shuffleArray(quizQuestions);
    
    // Reset Variables
    currentQuestionIndex = 0
    score = 0
    scoreSpan.textContent = 0

    
    startScreen.classList.remove("active")
    quizScreen.classList.add("active")

    showQuestion()
}

function shuffleArray(array) {

  for(let i=array.length-1; i>0; i--) {

    const j = Math.floor(Math.random() * (i+1));

    [array[i], array[j]] = [array[j], array[i]]
  }
}

function showQuestion() {

    //Reset state
    answerDisabled = false;

    const currentQuestion = quizQuestions[currentQuestionIndex];

    //  Shuffing Answers
    shuffleArray(currentQuestion.answers)

    currentQuestionSpan.textContent = currentQuestionIndex + 1;

    const progressPrecent = (currentQuestionIndex / quizQuestions.length) * 100;
    progressBar.style.width = progressPrecent + "%";

    questionText.textContent = currentQuestion.question;

    //  This line will clear the previous questions answer container
    answersContainer.innerHTML = "";

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer.text
        button.classList.add("answer-btn")

        // Custom dataset for correct and incorrect values
        button.dataset.correct = answer.correct
        button.addEventListener("click", selectAnswer)

        answersContainer.appendChild(button)
    });
}

function selectAnswer(event) {
    if(answerDisabled) return

    answerDisabled = true

    const selectedButton = event.target;
    const isCorrect = selectedButton.dataset.correct === "true"

    // Here Array.from() function will convert every nodeList returned by the answersContainer.children into an array, this is because the NodeList is not an array and we need to use the forEach method
    Array.from(answersContainer.children).forEach((button) => {
        if(button.dataset.correct === "true") {
            button.classList.add("correct")
        } else if(button === selectedButton) {
            button.classList.add("incorrect")
        }
    });

    if(isCorrect) {
        score++
        scoreSpan.textContent = score
    }

    setTimeout(() => {
        currentQuestionIndex++

        // Check if there are anymore questions
        if(currentQuestionIndex < quizQuestions.length) {
            showQuestion()
        } else {
            showResults()
        }
    }, 1000)
}

function showResults() {
    quizScreen.classList.remove("active")
    resultScreen.classList.add("active")

    finalScoreSpan.textContent = score

    const percentage = (score / quizQuestions.length) * 100

    if(percentage == 100) {
        resultMessage.textContent = "Perfect! You're a Genius!"
    } else if(percentage >= 80) {
        resultMessage.textContent = "Great job! You know your stuff!"
    } else if(percentage >= 60) {
        resultMessage.textContent = "Good effort! Keep learning!"
    } else if(percentage >= 40) {
        resultMessage.textContent = "Not bad! Try again to improve!"
    } else {
        resultMessage.textContent = "Keep Studying! You'll get better!"
    }
}

function restartQuiz() {
    resultScreen.classList.remove("active")
    startScreen.classList.add("active")
    
}