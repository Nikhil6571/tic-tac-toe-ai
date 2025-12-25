document.addEventListener("DOMContentLoaded", () => {

const cells = document.querySelectorAll(".cell");
const restartBtn = document.getElementById("restart");
const pvpBtn = document.getElementById("pvp");
const aiBtn = document.getElementById("ai");
const modeText = document.querySelector(".mode-text");
const levelSelect = document.getElementById("level");
const difficultyBox = document.getElementById("difficultyBox");
const winSound = document.getElementById("winSound");

let currentPlayer = "X";
let gameActive = true;
let moveCount = 0;
let gameMode = "PVP";
let difficulty = "beginner";

const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

/* ================= MODE SWITCH ================= */
pvpBtn.addEventListener("click", () => setMode("PVP"));
aiBtn.addEventListener("click", () => setMode("AI"));

levelSelect.addEventListener("change", () => {
    difficulty = levelSelect.value;
});

function setMode(mode) {
    gameMode = mode;

    pvpBtn.classList.toggle("active", mode === "PVP");
    aiBtn.classList.toggle("active", mode === "AI");

    difficultyBox.classList.toggle("hidden", mode !== "AI");

    modeText.textContent =
        mode === "PVP" ? "Mode: Player vs Player" : "Mode: Player vs AI";

    resetGame();
}

/* ================= CELL CLICK ================= */
cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
        if (!gameActive || cell.textContent !== "") return;
        if (gameMode === "AI" && currentPlayer === "O") return;

        makeMove(index, currentPlayer);

        if (gameMode === "AI" && gameActive && currentPlayer === "O") {
            setTimeout(aiMove, 400);
        }
    });
});

/* ================= MOVE ================= */
function makeMove(index, player) {
    cells[index].textContent = player;
    cells[index].classList.add(player === "X" ? "x" : "o");
    moveCount++;

    if (checkWinner(player)) {
        playWinSound();
        setTimeout(() => alert(`${player} Wins 🎉`), 100);
        gameActive = false;
        return;
    }

    if (moveCount === 9) {
        setTimeout(() => alert("Draw 😐"), 100);
        gameActive = false;
        return;
    }

    currentPlayer = player === "X" ? "O" : "X";
}

/* ================= AI MOVE ================= */
function aiMove() {
    if (!gameActive) return;

    let move = null;

    if (difficulty === "beginner") {
        move = randomMove();
    } else if (difficulty === "intermediate") {
        move = findBestMove("O") ?? findBestMove("X") ?? randomMove();
    } else {
        move = minimaxMove();
    }

    if (move !== null && move !== undefined) {
        makeMove(move, "O");
    }
}

/* ================= HELPERS ================= */
function randomMove() {
    const empty = [...cells]
        .map((c, i) => c.textContent === "" ? i : null)
        .filter(i => i !== null);

    return empty.length ? empty[Math.floor(Math.random() * empty.length)] : null;
}

function findBestMove(player) {
    for (let pattern of winPatterns) {
        const values = pattern.map(i => cells[i].textContent);
        if (values.filter(v => v === player).length === 2 && values.includes("")) {
            return pattern[values.indexOf("")];
        }
    }
    return null;
}

/* ================= MINIMAX ================= */
function minimaxMove() {
    let bestScore = -Infinity;
    let move = null;

    cells.forEach((cell, i) => {
        if (cell.textContent === "") {
            cell.textContent = "O";
            let score = minimax(false);
            cell.textContent = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    });
    return move;
}

function minimax(isMax) {
    if (checkState("O")) return 1;
    if (checkState("X")) return -1;
    if ([...cells].every(c => c.textContent !== "")) return 0;

    let best = isMax ? -Infinity : Infinity;

    cells.forEach(cell => {
        if (cell.textContent === "") {
            cell.textContent = isMax ? "O" : "X";
            let score = minimax(!isMax);
            cell.textContent = "";
            best = isMax ? Math.max(best, score) : Math.min(best, score);
        }
    });
    return best;
}

function checkState(player) {
    return winPatterns.some(p =>
        p.every(i => cells[i].textContent === player)
    );
}

function checkWinner(player) {
    return winPatterns.some(pattern => {
        if (pattern.every(i => cells[i].textContent === player)) {
            pattern.forEach(i => cells[i].classList.add("win"));
            return true;
        }
        return false;
    });
}

/* ================= SOUND (SAFE) ================= */
function playWinSound() {
    if (!winSound) return;
    winSound.currentTime = 0;
    winSound.play().catch(() => {}); // GitHub Pages safe
}

/* ================= RESET ================= */
restartBtn.addEventListener("click", resetGame);

function resetGame() {
    cells.forEach(c => {
        c.textContent = "";
        c.classList.remove("x", "o", "win");
    });
    currentPlayer = "X";
    gameActive = true;
    moveCount = 0;
}

});




