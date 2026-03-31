// 🔹 Questions (with correct answers)
const questionsData = [
  { q: "Q1", options: ["A", "B", "C", "D"], answer: "A" },
  { q: "Q2", options: ["A", "B", "C", "D"], answer: "B" },
  { q: "Q3", options: ["A", "B", "C", "D"], answer: "C" },
  { q: "Q4", options: ["A", "B", "C", "D"], answer: "D" },
  { q: "Q5", options: ["A", "B", "C", "D"], answer: "A" },
];

const questionsDiv = document.getElementById("questions");
const submitBtn = document.getElementById("submit");
const scoreDiv = document.getElementById("score");

// 🔹 Load progress
let progress = JSON.parse(sessionStorage.getItem("progress")) || {};

// 🔹 Render questions
function renderQuestions() {
  questionsDiv.innerHTML = "";

  questionsData.forEach((item, index) => {
    const qDiv = document.createElement("div");

    const title = document.createElement("p");
    title.textContent = item.q;
    qDiv.appendChild(title);

    item.options.forEach((opt) => {
      const label = document.createElement("label");

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "q" + index;
      input.value = opt;

      // restore checked
      if (progress[index] === opt) {
        input.checked = true;
      }

      // save on change
      input.addEventListener("change", () => {
        progress[index] = opt;
        sessionStorage.setItem("progress", JSON.stringify(progress));
      });

      label.appendChild(input);
      label.append(opt);

      qDiv.appendChild(label);
      qDiv.appendChild(document.createElement("br"));
    });

    questionsDiv.appendChild(qDiv);
  });
}

// 🔹 Submit logic
submitBtn.addEventListener("click", () => {
  let score = 0;

  questionsData.forEach((item, index) => {
    if (progress[index] === item.answer) {
      score++;
    }
  });

  scoreDiv.textContent = `Your score is ${score} out of 5.`;

  localStorage.setItem("score", score);
});

// 🔹 Load saved score (persist after refresh)
const savedScore = localStorage.getItem("score");
if (savedScore !== null) {
  scoreDiv.textContent = `Your score is ${savedScore} out of 5.`;
}

// 🔹 Initial render
renderQuestions();