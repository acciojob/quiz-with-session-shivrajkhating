// ─── Quiz Data ────────────────────────────────────────────────────────────────
const questions = [
  {
    id: "q1",
    text: "Which language runs natively in web browsers?",
    options: ["Python", "Java", "JavaScript", "Ruby"],
    answer: "JavaScript",
  },
  {
    id: "q2",
    text: "Which storage type persists even after the browser tab is closed?",
    options: ["Cookie (session only)", "sessionStorage", "localStorage", "RAM cache"],
    answer: "localStorage",
  },
  {
    id: "q3",
    text: "What does CSS stand for?",
    options: [
      "Computer Style Sheets",
      "Cascading Style Sheets",
      "Creative Styling System",
      "Colorful Style Syntax",
    ],
    answer: "Cascading Style Sheets",
  },
  {
    id: "q4",
    text: "Which HTML tag is used to link an external JavaScript file?",
    options: ["<js>", "<link>", "<style>", "<script>"],
    answer: "<script>",
  },
  {
    id: "q5",
    text: "Which method adds an item to the END of a JavaScript array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    answer: "push()",
  },
];

// ─── State ────────────────────────────────────────────────────────────────────
// Load saved progress from sessionStorage (persists through refresh)
let progress = {};
try {
  const saved = sessionStorage.getItem("progress");
  if (saved) progress = JSON.parse(saved);
} catch (e) {
  progress = {};
}

// ─── Render Questions ─────────────────────────────────────────────────────────
const container = document.getElementById("questions");

questions.forEach((q) => {
  // Outer card div
  const card = document.createElement("div");

  // Question number label
  const qNum = document.createElement("div");
  qNum.className = "q-number";
  qNum.textContent = `Question ${questions.indexOf(q) + 1} of ${questions.length}`;
  card.appendChild(qNum);

  // Question text
  const qText = document.createElement("div");
  qText.className = "q-text";
  qText.textContent = q.text;
  card.appendChild(qText);

  // Options wrapper
  const optionsDiv = document.createElement("div");
  optionsDiv.className = "options";

  q.options.forEach((opt) => {
    const label = document.createElement("label");
    label.className = "option-label";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = q.id;
    radio.value = opt;

    // Restore saved answer from sessionStorage
    if (progress[q.id] === opt) {
      radio.checked = true;
    }

    // Save to sessionStorage on change
    radio.addEventListener("change", () => {
      progress[q.id] = opt;
      sessionStorage.setItem("progress", JSON.stringify(progress));
      updateProgressUI();
    });

    const optText = document.createElement("span");
    optText.textContent = opt;

    label.appendChild(radio);
    label.appendChild(optText);
    optionsDiv.appendChild(label);
  });

  card.appendChild(optionsDiv);
  container.appendChild(card);
});

// ─── Progress UI ──────────────────────────────────────────────────────────────
function updateProgressUI() {
  const answered = Object.keys(progress).length;
  const total = questions.length;

  // Progress bar
  const bar = document.getElementById("progressBar");
  if (bar) bar.style.width = `${(answered / total) * 100}%`;

  // Count label
  const countEl = document.getElementById("answersCount");
  if (countEl) countEl.textContent = `${answered} of ${total} answered`;
}

// Run on load to reflect restored session data
updateProgressUI();

// ─── Submit Logic ─────────────────────────────────────────────────────────────
document.getElementById("submit").addEventListener("click", () => {
  // Calculate score
  let score = 0;
  questions.forEach((q) => {
    if (progress[q.id] === q.answer) score++;
  });

  // Display score (matches Cypress selector: div#score)
  const scoreEl = document.getElementById("score");
  scoreEl.innerHTML = `
    <div class="score-card">
      <div class="score-icon">${getEmoji(score)}</div>
      <div>
        <div class="score-label">Your Result</div>
        <div class="score-value">Your score is ${score} out of ${questions.length}</div>
        <div class="score-sub">${getFeedback(score, questions.length)}</div>
      </div>
    </div>
  `;

  // Save score to localStorage with key "score"
  localStorage.setItem("score", score);

  // Show saved banner
  const banner = document.getElementById("savedBanner");
  if (banner) banner.style.display = "block";

  // Scroll to score
  scoreEl.scrollIntoView({ behavior: "smooth", block: "center" });
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getEmoji(score) {
  if (score === 5) return "🏆";
  if (score >= 4) return "🌟";
  if (score >= 3) return "👍";
  if (score >= 2) return "📚";
  return "💪";
}

function getFeedback(score, total) {
  const pct = score / total;
  if (pct === 1) return "Perfect score! Incredible.";
  if (pct >= 0.8) return "Great work, almost there!";
  if (pct >= 0.6) return "Solid effort, keep learning!";
  if (pct >= 0.4) return "Keep practising, you'll get it.";
  return "Don't give up — review and retry!";
}

// ─── Restore last score from localStorage on load ─────────────────────────────
(function restoreScore() {
  const savedScore = localStorage.getItem("score");
  if (savedScore !== null) {
    const scoreEl = document.getElementById("score");
    scoreEl.innerHTML = `
      <div class="score-card">
        <div class="score-icon">${getEmoji(Number(savedScore))}</div>
        <div>
          <div class="score-label">Last Saved Score</div>
          <div class="score-value">Your score is ${savedScore} out of ${questions.length}</div>
          <div class="score-sub">${getFeedback(Number(savedScore), questions.length)}</div>
        </div>
      </div>
    `;
    const banner = document.getElementById("savedBanner");
    if (banner) banner.style.display = "block";
  }
})();