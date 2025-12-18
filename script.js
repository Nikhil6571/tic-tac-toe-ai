// STEP 2: Basic game logic (clicks & turns)

// Select all cells
const cells = document.querySelectorAll(".cell");

// X will start first
let currentPlayer = "X";

// Add click event to each cell
cells.forEach(cell => {
    cell.addEventListener("click", () => {

        // Prevent overwriting a cell
        if (cell.textContent !== "") {
            return;
        }

        // Place X or O
        cell.textContent = currentPlayer;

        // Add class for styling
        if (currentPlayer === "X") {
            cell.classList.add("x");
            currentPlayer = "O";
        } else {
            cell.classList.add("o");
            currentPlayer = "X";
        }
    });
});
