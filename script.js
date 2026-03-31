const quizData = [
  {
    question: "1. Which keyword is used to declare a variable in JavaScript?",
    options: ["var", "int", "string", "define"],
    answer: "var",
  },
  {
    question: "2. What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyper Transfer Markup Language",
      "Home Tool Markup Language",
    ],
    answer: "Hyper Text Markup Language",
  },
  {
    question: "3. Which method is used to add an element at the end of an array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    answer: "push()",
  },
  {
    question: "4. What does CSS stand for?",
    options: [
      "Cascading Style Sheets",
      "Creative Style System",
      "Computer Style Sheets",
      "Colorful Style Sheets",
    ],
    answer: "Cascading Style Sheets",
  },
  {
    question: "5. Which symbol is used for single-line comments in JavaScript?",
    options: ["//", "/* */", "#", "--"],
    answer: "//",
  },
];

// ==================== Render Questions ====================

const questionsContainer = document.getElementById("questions");
const submitBtn = document.getElementById("submit");
const scoreDisplay = document.getElementById("score");

function renderQuiz() {
  questionsContainer.innerHTML = "";

  quizData.forEach((q, index) => {
    const questionDiv = document.createElement("div");

    const questionText = document.createElement("p");
    questionText.textContent = q.question;
    questionDiv.appendChild(questionText);

    q.options.forEach((option) => {
      const label = document.createElement("label");

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = `question${index}`;
      radio.value = option;

      radio.addEventListener("change", () => saveProgress());

      label.appendChild(radio);
      label.appendChild(document.createTextNode(option));
      questionDiv.appendChild(label);
    });

    questionsContainer.appendChild(questionDiv);
  });
}

// ==================== Session Storage (Progress) ====================

function saveProgress() {
  const progress = {};

  quizData.forEach((_, index) => {
    const selected = document.querySelector(
      `input[name="question${index}"]:checked`
    );
    if (selected) {
      progress[`question${index}`] = selected.value;
    }
  });

  sessionStorage.setItem("progress", JSON.stringify(progress));
}

function loadProgress() {
  const saved = sessionStorage.getItem("progress");
  if (!saved) return;

  const progress = JSON.parse(saved);

  Object.keys(progress).forEach((key) => {
    const radios = document.querySelectorAll(`input[name="${key}"]`);
    radios.forEach((radio) => {
      if (radio.value === progress[key]) {
        radio.checked = true;
      }
    });
  });
}

// ==================== Score Calculation & Local Storage ====================

function calculateScore() {
  let score = 0;

  quizData.forEach((q, index) => {
    const selected = document.querySelector(
      `input[name="question${index}"]:checked`
    );
    if (selected && selected.value === q.answer) {
      score++;
    }
  });

  return score;
}

submitBtn.addEventListener("click", () => {
  const score = calculateScore();

  scoreDisplay.textContent = `Your score is ${score} out of 5.`;

  localStorage.setItem("score", JSON.stringify(score));
});

// ==================== Load Saved Score ====================

function loadScore() {
  const savedScore = localStorage.getItem("score");
  if (savedScore !== null) {
    scoreDisplay.textContent = `Your score is ${JSON.parse(savedScore)} out of 5.`;
  }
}

// ==================== Initialize ====================

renderQuiz();
loadProgress();
loadScore();
