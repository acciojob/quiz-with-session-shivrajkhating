// ─── Quiz Data ─────────────────────────────────────────────────────────────────
// ⚠️  IMPORTANT: Open  cypress/integration/tests/test.spec.js
//     Find the `questions` array defined there and copy it here EXACTLY.
//     The structure the test expects:  { question: "...", choices: [...], answer: "..." }
//
//     The questions below are best-guess placeholders.
//     If your tests still fail on question text, replace this array with yours.

const questions = [
  {
    question: "What is the capital of France?",
    choices: ["Paris", "London", "Berlin", "Rome"],
    answer: "Paris",
  },
  {
    question: "What is the highest mountain in the world?",
    choices: ["Mount Everest", "K2", "Kangchenjunga", "Lhotse"],
    answer: "Mount Everest",
  },
  {
    question: "Which planet is known as the Red Planet?",
    choices: ["Mars", "Venus", "Jupiter", "Saturn"],
    answer: "Mars",
  },
  {
    question: "How many sides does a hexagon have?",
    choices: ["5", "6", "7", "8"],
    answer: "6",
  },
  {
    question: "What is the chemical symbol for water?",
    choices: ["H2O", "CO2", "NaCl", "O2"],
    answer: "H2O",
  },
];

// ─── Restore progress from sessionStorage ─────────────────────────────────────
let progress = {};
try {
  const saved = sessionStorage.getItem("progress");
  if (saved) progress = JSON.parse(saved);
} catch (e) {
  progress = {};
}

// ─── Render Questions ─────────────────────────────────────────────────────────
const container = document.getElementById("questions");

questions.forEach((q, index) => {
  const card = document.createElement("div");

  // ✅ FIX 1: Question text is the FIRST content inside the card.
  //    Cypress does: $ele.text().split("?")[0] + "?"
  //    So no prefix text (like "Question 1 of 5") must appear before the question.
  const qText = document.createElement("p");
  qText.className = "q-text";
  qText.textContent = q.question;
  card.appendChild(qText);

  // Options
  const optionsDiv = document.createElement("div");
  optionsDiv.className = "options";

  q.choices.forEach((choice) => {
    const label = document.createElement("label");
    label.className = "option-label";

    const radio = document.createElement("input");
    radio.type  = "radio";
    radio.name  = `q${index}`;   // unique name per question
    radio.value = choice;         // Cypress checks input[value]

    // ✅ FIX 2: setAttribute("checked","true") so the CSS attribute selector
    //    [type="radio"][checked="true"] works in Cypress after a page reload.
    //    radio.checked = true  only sets the DOM property — not the HTML attribute.
    if (progress[`q${index}`] === choice) {
      radio.setAttribute("checked", "true");
      radio.checked = true; // also set property so the browser renders it checked
    }

    // Persist every selection to sessionStorage
    radio.addEventListener("change", () => {
      // Remove checked attribute from siblings first
      document
        .querySelectorAll(`input[name="q${index}"]`)
        .forEach((r) => r.removeAttribute("checked"));

      // Set on the selected one
      radio.setAttribute("checked", "true");

      progress[`q${index}`] = choice;
      sessionStorage.setItem("progress", JSON.stringify(progress));
      updateUI();
    });

    const span = document.createElement("span");
    span.textContent = choice;

    label.appendChild(radio);
    label.appendChild(span);
    optionsDiv.appendChild(label);
  });

  card.appendChild(optionsDiv);
  container.appendChild(card);
});

// ─── Progress indicator ────────────────────────────────────────────────────────
function updateUI() {
  const answered = Object.keys(progress).length;
  const bar = document.getElementById("progressBar");
  if (bar) bar.style.width = `${(answered / questions.length) * 100}%`;
  const countEl = document.getElementById("answersCount");
  if (countEl)
    countEl.textContent = `${answered} of ${questions.length} answered`;
}
updateUI();

// ─── Submit ────────────────────────────────────────────────────────────────────
document.getElementById("submit").addEventListener("click", () => {
  // Calculate score
  let score = 0;
  questions.forEach((q, index) => {
    if (progress[`q${index}`] === q.answer) score++;
  });

  // ✅ FIX 3: Score must be PLAIN TEXT only — no wrapping HTML elements.
  //    Cypress: expect(span.text()).equal("Your score is 3 out of 5.")
  //    Any nested div/span/emoji breaks span.text() equality check.
  const scoreEl = document.getElementById("score");
  scoreEl.textContent = `Your score is ${score} out of ${questions.length}.`;

  // Store score in localStorage with key "score"
  localStorage.setItem("score", String(score));
});