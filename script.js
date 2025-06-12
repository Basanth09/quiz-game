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
let fetchedQuestions = []

// Quiz State Vars
let currentQuestionIndex = 0
let score = 0
let answerDisabled = false

// This is our new function to fetch quiz question from Open Trivia Database API
async function fetchAndStartQuiz() {
  try {

    // Fetching data from API
    const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple')

    // Checking if the response was successful
    if(!response.ok) {
      throw new Error(`Something went wrong with the network! Status: ${response.status}`);
    }

    const data = await response.json();

    // Converting the API data into the format our app needs (the .map() transformation)
    const formattedQuestions = data.results.map(apiQuestion => {
      const incorrectAnswers = apiQuestion.incorrect_answers;
      const correctAnswer = apiQuestion.correct_answer;

      // Combine all answers into a single array
      const allAnswers = [...incorrectAnswers, correctAnswer];

      // We need to shuffle the answers so the correct one isn't always last
      // This uses shuffle Array function
      shuffleArray(allAnswers);

      return {
        question: decodeHTML(apiQuestion.question),
        //We now map over the shuffled answers to create the final object structure
        answers: allAnswers.map(answer => {
          return {
            text: decodeHTML(answer),
            correct: answer === correctAnswer
          };
        })
      };
    });

    // call a new function to actually start the with the formatted questions
    startQuizWithData(formattedQuestions);

  } catch (error) {
    console.error("Failed to fetch quiz questions:", error);
    alert("Could not load new questions. Please check your internet connection and try again.")
  }
}

function startQuizWithData(questions) {

  // This is our global variable where we store the fethched questions array
  fetchedQuestions = questions;

  totalQuestionsSpan.textContent = fetchedQuestions.length;
  maxScoreSpan.textContent = fetchedQuestions.length;

  startScreen.classList.remove("active");
  quizScreen.classList.add("active");

  showQuestion();
}

// Event Listeners

startButton.addEventListener("click", fetchAndStartQuiz)
restartButton.addEventListener("click", restartQuiz)

function shuffleArray(array) {

  for(let i=array.length-1; i>0; i--) {

    const j = Math.floor(Math.random() * (i+1));

    [array[i], array[j]] = [array[j], array[i]]
  }
}

function showQuestion() {

    //Reset state
    answerDisabled = false;

    const currentQuestion = fetchedQuestions[currentQuestionIndex];

    //  Shuffing Answers
    shuffleArray(currentQuestion.answers)

    currentQuestionSpan.textContent = currentQuestionIndex + 1;

    const progressPrecent = (currentQuestionIndex / fetchedQuestions.length) * 100;
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
        if(currentQuestionIndex < fetchedQuestions.length) {
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

    const percentage = (score / fetchedQuestions.length) * 100

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

    currentQuestionIndex = 0;
    score = 0;
    fetchedQuestions = [];

    scoreSpan.textContent = 0;
    progressBar.style.width = "0%";
    
    resultScreen.classList.remove("active")
    startScreen.classList.add("active")
    
}

// Helper function for decoding quotation marks
function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}