let questions = [];
let resultsPerPage = 10;

async function loadQuestions() {
    const res = await fetch("pages/questions.json");
    questions = await res.json();
    populateFilters();
    renderQuestions();
}

function populateFilters() {
    const yearSet = new Set();
    const topicSet = new Set();

    questions.forEach(q => {
        yearSet.add(q.year);
        topicSet.add(q.topic);
    });

    const yearFilter = document.getElementById("yearFilter");
    const topicFilter = document.getElementById("topicFilter");

    [...yearSet].sort().forEach(year => {
        yearFilter.innerHTML += `<option value="${year}">${year}</option>`;
    });

    [...topicSet].sort().forEach(topic => {
        topicFilter.innerHTML += `<option value="${topic}">${topic}</option>`;
    });
}

function renderQuestions() {
    const difficulty = document.getElementById("difficultyFilter").value;
    const year = document.getElementById("yearFilter").value;
    const topic = document.getElementById("topicFilter").value;

    const filtered = questions.filter(q => {
        return (!difficulty || q.difficulty === difficulty) &&
        (!year || q.year.toString() === year) &&
        (!topic || q.topic === topic);
    });

    const container = document.getElementById("questionList");
    container.innerHTML = "";

    document.getElementById("resultsCount").textContent =
`Showing ${Math.min(resultsPerPage, filtered.length)} of ${filtered.length} results`;

filtered.slice(0, resultsPerPage).forEach((q, index) => {
    const div = document.createElement("div");
    div.className = "question-card";
    div.innerHTML = `
            <div class="question-text">${q.question}</div>
            <button class="expand-btn" data-index="${index}">+</button>
    `;
    container.appendChild(div);
});

document.querySelectorAll(".expand-btn").forEach(btn => {
    btn.addEventListener("click", () => openModal(filtered[btn.dataset.index]));
});
}

function openModal(q) {
  document.getElementById("modalQuestion").textContent = q.question;
  document.getElementById("modalDifficulty").textContent = q.difficulty;
  document.getElementById("modalTopic").textContent = q.topic;
  document.getElementById("modalYear").textContent = q.year;

  const revealBtn = document.getElementById("revealAnswerBtn");
  const answerContainer = document.getElementById("modalAnswerContainer");

// Reset state
  answerContainer.classList.add("hidden");
  revealBtn.classList.remove("hidden");

// Attach listener fresh each time
  revealBtn.onclick = () => {
    answerContainer.classList.remove("hidden");
    revealBtn.classList.add("hidden");
};


  // Diagram
const diagramContainer = document.getElementById("modalDiagramContainer");
const diagramImg = document.getElementById("modalDiagram");

if (q.diagram && q.diagram.trim() !== "") {
    diagramImg.src = q.diagram;
    diagramContainer.classList.remove("hidden");
} else {
    diagramImg.src = "";
    diagramContainer.classList.add("hidden");
}


  // Hide answer initially
document.getElementById("modalAnswerContainer").classList.add("hidden");
document.getElementById("revealAnswerBtn").classList.remove("hidden");

  // Set answer/explanation
document.getElementById("modalAnswer").textContent = q.answer || "No answer provided";
document.getElementById("modalExplanation").textContent = q.explanation || "No explanation provided";

document.getElementById("questionModal").classList.remove("hidden");
document.getElementById("modalOverlay").classList.remove("hidden");
document.body.classList.add("dimmed");

}


function closeModal() {
    document.getElementById("modalOverlay").classList.add("hidden");

    document.getElementById("questionModal").classList.add("hidden");
    document.body.classList.remove("dimmed");
}

function initQuestionBank() {
    loadQuestions();

    document.getElementById("difficultyFilter").addEventListener("change", renderQuestions);
    document.getElementById("yearFilter").addEventListener("change", renderQuestions);
    document.getElementById("topicFilter").addEventListener("change", renderQuestions);


    document.getElementById("resultsPerPage").addEventListener("change", e => {
        resultsPerPage = parseInt(e.target.value);
        renderQuestions();
    });

    document.querySelector(".modal-close").addEventListener("click", closeModal);
    document.getElementById("questionModal").addEventListener("click", e => {
        if (e.target.classList.contains("modal")) closeModal();
    });
}
