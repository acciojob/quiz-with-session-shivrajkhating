const quizData = [
  {
    question: "What is the capital of France?",
    choices: ["Paris", "London", "Berlin", "Madrid"],
    answer: "Paris",
  },
  {
    question: "Which planet is known as the Red Planet?",
    choices: ["Mars", "Venus", "Jupiter", "Saturn"],
    answer: "Mars",
  },
  {
    question: "What is the largest ocean on Earth?",
    choices: ["Atlantic", "Indian", "Arctic", "Pacific"],
    answer: "Pacific",
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    choices: [
      "Charles Dickens",
      "William Shakespeare",
      "Mark Twain",
      "Jane Austen",
    ],
    answer: "William Shakespeare",
  },
  {
    question: "What is the chemical symbol for water?",
    choices: ["H2O", "CO2", "O2", "NaCl"],
    answer: "H2O",
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

    q.choices.forEach((choice) => {
      const label = document.createElement("label");

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = `question${index}`;
      radio.value = choice;

      radio.addEventListener("change", () => saveProgress());

      label.appendChild(radio);
      label.appendChild(document.createTextNode(choice));
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
        radio.setAttribute("checked", "true");
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

// ==================== Initialize ====================

renderQuiz();
loadProgress();
