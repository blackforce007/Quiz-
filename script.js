let questions = [];
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 30;
let streak = 0;

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const quizBox = document.getElementById("quizBox");
const resultBox = document.getElementById("resultBox");
const questionText = document.getElementById("questionText");
const optionsList = document.getElementById("optionsList");
const timerDisplay = document.getElementById("timer");
const feedback = document.getElementById("feedback");
const scoreText = document.getElementById("scoreText");
const questionCounter = document.getElementById("questionCounter");

const correctSound = new Audio("assets/correct.mp3");
const wrongSound = new Audio("assets/wrong.mp3");

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);

function startGame() {
  startBtn.classList.add("hidden");
  resultBox.classList.add("hidden");
  quizBox.classList.remove("hidden");
  currentQuestion = 0;
  score = 0;
  streak = 0;
  loadQuestions();
}

function loadQuestions() {
  fetch("questions.json")
    .then((res) => res.json())
    .then((data) => {
      questions = shuffleArray(data);
      showQuestion();
    });
}

function showQuestion() {
  clearInterval(timer);
  timeLeft = 30;
  timerDisplay.textContent = `⏱️ ${timeLeft}`;
  timer = setInterval(updateTimer, 1000);

  const q = questions[currentQuestion];
  questionText.textContent = q.question;
  questionCounter.textContent = `প্রশ্ন ${currentQuestion + 1} / ${questions.length}`;
  optionsList.innerHTML = "";

  q.options.forEach((opt, index) => {
    const li = document.createElement("li");
    li.textContent = opt;
    li.addEventListener("click", () => checkAnswer(index));
    optionsList.appendChild(li);
  });

  feedback.textContent = "";
}

function updateTimer() {
  timeLeft--;
  timerDisplay.textContent = `⏱️ ${timeLeft}`;
  if (timeLeft <= 0) {
    clearInterval(timer);
    checkAnswer(-1); // No answer
  }
}

function checkAnswer(selected) {
  clearInterval(timer);
  const correct = questions[currentQuestion].answer;
  const options = optionsList.querySelectorAll("li");

  options.forEach((opt, i) => {
    opt.classList.add(i === correct ? "correct" : i === selected ? "wrong" : "");
    opt.style.pointerEvents = "none";
  });

  if (selected === correct) {
    correctSound.play();
    streak++;
    score += 10 + timeLeft + streak * 2;
    feedback.textContent = "✅ সঠিক!";
  } else {
    wrongSound.play();
    streak = 0;
    feedback.textContent = "❌ ভুল!";
  }

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      showQuestion();
    } else {
      endGame();
    }
  }, 1500);
}

function endGame() {
  quizBox.classList.add("hidden");
  resultBox.classList.remove("hidden");
  scoreText.textContent = `আপনার মোট স্কোর: ${score}`;

  saveScore(score);
}

function saveScore(score) {
  let scores = JSON.parse(localStorage.getItem("bf007_scores")) || [];
  scores.push({ score, date: new Date().toLocaleString() });
  localStorage.setItem("bf007_scores", JSON.stringify(scores));
}

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
