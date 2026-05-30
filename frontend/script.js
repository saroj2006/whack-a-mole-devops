let score = 0;
let time = 30;
let currentMole = -1;
let timer;
let moleTimer;

const grid = document.getElementById("grid");

for (let i = 0; i < 9; i++) {
  const div = document.createElement("div");
  div.classList.add("hole");
  div.setAttribute("data-id", i);
  div.addEventListener("click", hitMole);
  grid.appendChild(div);
}

function startGame() {
  score = 0;
  time = 30;
  document.getElementById("score").innerText = score;
  document.getElementById("time").innerText = time;

  timer = setInterval(countdown, 1000);
  moleTimer = setInterval(showMole, 800);
}

function countdown() {
  time--;
  document.getElementById("time").innerText = time;

  if (time <= 0) {
    clearInterval(timer);
    clearInterval(moleTimer);
    alert("Game Over! Score: " + score);
  }
}

function showMole() {
  document.querySelectorAll(".hole").forEach(h => {
    h.innerHTML = "";
  });

  currentMole = Math.floor(Math.random() * 9);
  const mole = document.querySelector(`[data-id="${currentMole}"]`);
  mole.innerHTML = "🐹";
}

function hitMole(e) {
  const id = e.target.getAttribute("data-id");

  if (parseInt(id) === currentMole) {
    score++;
    document.getElementById("score").innerText = score;
  }
}

/* backend unchanged */
function submitScore() {
  const name = document.getElementById("playerName").value;

  if (!name) {
    alert("Enter name first!");
    return;
  }

  fetch("/api/score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, score })
  }).then(() => {
    loadLeaderboard();
  });
}

function loadLeaderboard() {
  fetch("/api/leaderboard")
    .then(res => res.json())
    .then(data => {
      const lb = document.getElementById("leaderboard");
      lb.innerHTML = "";

      data.forEach((item, i) => {
        lb.innerHTML += `<div>${i + 1}. ${item.name} - ${item.score}</div>`;
      });
    });
}

loadLeaderboard();