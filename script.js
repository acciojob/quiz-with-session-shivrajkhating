// 🔹 EXACT questions (match Cypress)
const questionsData = [
  {
    question: "What is the capital of France?",
    choices: ["Paris", "London", "Berlin", "Madrid"],
    answer: "Paris",
  },
  {
    question: "What is 2 + 2?",
    choices: ["3", "4", "5", "6"],
    answer: "4",
  },
  {
    question: "What color is the sky?",
    choices: ["Blue", "Green", "Red", "Yellow"],
    answer: "Blue",
  },
  {
    question: "Which is a fruit?",
    choices: ["Carrot", "Potato", "Apple", "Onion"],
    answer: "Apple",
  },
  {
    question: "Which is a programming language?",
    choices: ["HTML", "CSS", "JavaScript", "Photoshop"],
    answer: "JavaScript",
  },
];

const questionsDiv = document.getElementById("questions");
const submitBtn = document.getElementById("submit");
const scoreDiv = document.getElementById("score");

// 🔹 Load progress
let progress = JSON.parse(sessionStorage.getItem("progress")) || {};

// 🔹 Render
function renderQuestions() {
  questionsDiv.innerHTML = "";

  questionsData.forEach((q, index) => {
    const div = document.createElement("div");

    const title = document.createElement("p");
    title.textContent = q.question;
    div.appendChild(title);

    q.choices.forEach((choice) => {
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "q" + index;
      input.value = choice;

      // restore checked
      if (progress[index] === choice) {
        input.setAttribute("checked", "true");
      }

      // save on change
      input.addEventListener("change", () => {
        progress[index] = choice;
        sessionStorage.setItem("progress", JSON.stringify(progress));

        // remove checked from others
        document
          .querySelectorAll(`input[name="q${index}"]`)
          .forEach((el) => el.removeAttribute("checked"));

        input.setAttribute("checked", "true");
      });

      div.appendChild(input);
      div.appendChild(document.createTextNode(choice));
      div.appendChild(document.createElement("br"));
    });

    questionsDiv.appendChild(div);
  });
}

// 🔹 Submit
submitBtn.addEventListener("click", () => {
  let score = 0;

  questionsData.forEach((q, index) => {
    if (progress[index] === q.answer) {
      score++;
    }
  });

  scoreDiv.textContent = `Your score is ${score} out of 5.`;
  localStorage.setItem("score", score);
});

// 🔹 Load saved score
const savedScore = localStorage.getItem("score");
if (savedScore !== null) {
  scoreDiv.textContent = `Your score is ${savedScore} out of 5.`;
}

// 🔹 Init
renderQuestions();