var numSelected = null;
var tileSelected = null;
var errors = 0;
var hintLimit = 10;  // Set the limit for hints to 10
var hintsUsed = 0;  // Track how many hints have been used

var board = [
    "--74916-5",
    "2---6-3-9",
    "-----7-1-",
    "-586----4",
    "--3----9-",
    "--62--187",
    "9-4-7---2",
    "67-83----",
    "81--45---"
];

var solution = [
    "387491625",
    "241568379",
    "569327418",
    "758619234",
    "123784596",
    "496253187",
    "934176852",
    "675832941",
    "812945763"
];

window.onload = function() {
    setGame();
    document.getElementById("hint-btn").disabled = false;  // Ensure hint button is enabled
}

function setGame() {
    // Digits 1-9
    for (let i = 1; i <= 9; i++) {
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }

    // Board 9x9
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            if (board[r][c] != "-") {
                tile.innerText = board[r][c];
                tile.classList.add("tile-start");
            }
            if (r == 2 || r == 5) {
                tile.classList.add("horizontal-line");
            }
            if (c == 2 || c == 5) {
                tile.classList.add("vertical-line");
            }
            tile.addEventListener("click", function() {
                selectTile.call(this);
                saveGameState(); // Save state after each tile click
            });
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }

    // Load saved state if available
    loadGameState();
}

function selectNumber() {
    if (numSelected != null) {
        numSelected.classList.remove("number-selected");
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
}

function selectTile() {
    if (numSelected) {
        if (this.innerText != "") {
            return;
        }

        // "0-0" "0-1" .. "3-1"
        let coords = this.id.split("-"); //["0", "0"]
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        if (solution[r][c] == numSelected.id) {
            this.innerText = numSelected.id;
            this.classList.remove("invalid-flash"); // Remove flash animation if correct
        } else {
            errors += 1;
            document.getElementById("errors").innerText = errors;
            this.innerText = numSelected.id;
            this.classList.add("invalid-flash"); // Apply flashing red effect if incorrect

            // After 0.5s (duration of the flash), remove the invalid flash class and clear the input
            setTimeout(() => {
                this.classList.remove("invalid-flash"); // Remove flash effect
                this.innerText = ""; // Clear the invalid number
            }, 500);
        }
    }
}

function saveGameState() {
    let boardState = [];
    let tiles = document.querySelectorAll(".tile");

    for (let i = 0; i < tiles.length; i++) {
        boardState.push(tiles[i].innerText || "-");
    }

    localStorage.setItem("sudokuState", JSON.stringify(boardState));
    localStorage.setItem("errors", errors); // Save errors too
}

function loadGameState() {
    let savedState = localStorage.getItem("sudokuState");
    let savedErrors = localStorage.getItem("errors");

    if (savedState) {
        let boardState = JSON.parse(savedState);
        let tiles = document.querySelectorAll(".tile");

        for (let i = 0; i < tiles.length; i++) {
            tiles[i].innerText = boardState[i] !== "-" ? boardState[i] : "";
        }

        if (savedErrors) {
            errors = parseInt(savedErrors);
            document.getElementById("errors").innerText = errors;
        }
    }
}

// Limit hint usage
document.getElementById("hint-btn").addEventListener("click", function () {
    if (hintsUsed >= hintLimit) {
        alert("You have reached the maximum number of hints!");
        this.disabled = true;  // Disable the hint button after limit is reached
        return;
    }

    let emptyTiles = [];
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.getElementById(`${r}-${c}`);
            if (tile.innerText === "") {
                emptyTiles.push(tile);
            }
        }
    }

    if (emptyTiles.length > 0) {
        let randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        let coords = randomTile.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);
        randomTile.innerText = solution[r][c];
        randomTile.classList.add("tile-start");
        saveGameState(); // Save state after hint
        hintsUsed++;  // Increment hint usage
    }
});

// Restart game and reset everything including hints usage
$("#restart-btn").click(function () {
    localStorage.removeItem("sudokuState");
    localStorage.removeItem("errors");

    document.getElementById("board").innerHTML = "";
    errors = 0;
    hintsUsed = 0;  // Reset hint usage
    document.getElementById("errors").innerText = errors;

    window.location.reload(); // Restart the game
});
