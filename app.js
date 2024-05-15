const guessDisplay = document.getElementById("guess-display");
const chosenCategory = document.getElementById("chosen-category");
const categorySelect = document.querySelector("dialog");
const healthBar = document.querySelector("progress");
const categoryButtons = document.querySelectorAll(".categoryBtn");
const replayBtn = document.getElementById("replay");
const letterAlreadyGuessed = document.getElementById("error-display");
const playAgain = document.getElementById("play-again-button");
const endGameDialog = document.getElementById("end-game-dialog");
const endGameResult = document.getElementById("end-game-result");
const endGameWord = document.getElementById("end-game-word");
const keyboardButtons = document.querySelectorAll(".keyboard button");

let targetWord = ""; // The word to be guessed
let modifiedTargetWord = ""; // Target word is modified for to have no spaces as the option to guess spaces does not exist
let guessedLetters = []; // Array to store guessed letters
let attemptsLeft = 8; // Number of attempts allowed
let gameWon = false;

// Logic to select a word from the data.json file based on the category chosen by the player
function selectWord(category) {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      selectRandomItem(data.categories[category]);
      displayWord();
    });
}

//Starts the health bar at the intial 100% upon load
updateHealthBar();

//Selects an item at random from the JSON category chosen by the player
function selectRandomItem(category) {
  const categoryIndex = Math.floor(Math.random() * category.length);
  const randomName = category[categoryIndex].name;
  targetWord = randomName.toUpperCase().split(" ");
  modifiedTargetWord = randomName.toUpperCase().split(" ").join("");
}

//Create the HTML elements that will display each letter when correctly guessed
function displayWord() {
  for (let i = 0; i < targetWord.length; i++) {
    const wordWrapper = document.createElement("div");

    const currentString = targetWord[i];

    for (let j = 0; j < currentString.length; j++) {
      const tile = document.createElement("div");
      tile.setAttribute("value", currentString[j]);
      tile.classList.add("div-guess-tile");
      wordWrapper.classList.add("word-wrapper");
      wordWrapper.appendChild(tile);
    }
    guessDisplay.appendChild(wordWrapper);
  }
}

function handleGuess(letter) {
  // Add letter to guessed letters
  guessedLetters.push(letter);
  // Check if letter is in the word
  if (modifiedTargetWord.includes(letter)) {
    updateDisplay(letter);
    if (isWordGuessed()) {
      gameWon = true;
      endGame();
    }
  } else {
    attemptsLeft--;
    updateHealthBar();

    if (attemptsLeft === 0) {
      endGame();
    }
  }
}

//Updates the healthbar everytime a wrong answer is chosen
function updateHealthBar() {
  healthBar.setAttribute("value", attemptsLeft);
}

//Updates the letter tiles to display the correctly guessed letter
function updateDisplay(letter) {
  const divs = document.querySelectorAll(".div-guess-tile");
  divs.forEach((div) => {
    if (div.getAttribute("value") === letter) {
      div.textContent = letter;
      div.style.opacity = "100%";
    }
  });
}

// Function to check if all letters have been guessed
function isWordGuessed() {
  for (let i = 0; i < modifiedTargetWord.length; i++) {
    if (!guessedLetters.includes(modifiedTargetWord[i])) {
      return false;
    }
  }
  return true;
}

// Function to handle end of game
function endGame() {
  if (gameWon) {
    endGameResult.textContent = "You Win";
    endGameDialog.showModal();
  } else {
    endGameResult.textContent = "You Lose";
    endGameDialog.showModal();
  }
}

//Resets all relevant elements once the player selects to play again
function resetGame() {
  guessedLetters = [];
  targetWord = "";
  modifiedTargetWord = "";
  attemptsLeft = 8;
  guessDisplay.innerHTML = "";
  categorySelect.showModal();
  gameWon = false;
  updateHealthBar();

  //Reset all the keyboard buttons
  keyboardButtons.forEach((button) => {
    button.disabled = false;
  });
}

//Event listener to disable a letter once it has already been guessed
keyboardButtons.forEach((button) => {
  button.addEventListener("click", () => {
    handleGuess(button.textContent);
    button.disabled = true;
  });
});

//Calls the selectWord function and passes in the category displayed in the button
categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectWord(button.textContent);
    chosenCategory.textContent = button.textContent;
    categorySelect.close();
  });
});

playAgain.addEventListener("click", () => {
  endGameDialog.close();
  resetGame();
});

//Adds the ability play with keyboard inputs
document.addEventListener("keydown", (e) => {
  handleGuess(e.key.toUpperCase());
  keyboardButtons.forEach((button) => {
    if (button.textContent === e.key.toUpperCase()) {
      button.disabled = true;
    }
  });
});
