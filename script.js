// script.js

const cells = document.querySelectorAll('[data-cell]');
const gameStatus = document.getElementById('game-status');
const restartButton = document.getElementById('restartButton');
const twoPlayerButton = document.getElementById('twoPlayerButton');
const aiButton = document.getElementById('aiButton');
let currentPlayer = 'Player 1';
let gameState = ['', '', '', '', '', '', '', '', ''];
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let gameMode = '';

twoPlayerButton.addEventListener('click', () => selectGameMode('2-player'));
aiButton.addEventListener('click', () => selectGameMode('ai'));
restartButton.addEventListener('click', restartGame);

function selectGameMode(mode) {
    gameMode = mode;
    updateButtonStates();
    restartGame();
}

function updateButtonStates() {
    if (gameMode === '2-player') {
        twoPlayerButton.disabled = true;
        aiButton.disabled = false;
    } else if (gameMode === 'ai') {
        aiButton.disabled = true;
        twoPlayerButton.disabled = false;
    } else {
        twoPlayerButton.disabled = false;
        aiButton.disabled = false;
    }
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick, { once: true });
});

function handleCellClick(e) {
    const cell = e.target;
    const cellIndex = Array.from(cells).indexOf(cell);
    
    if (gameState[cellIndex] !== '' || checkWin()) return;
    
    placeMark(cell, cellIndex, currentPlayer === 'Player 1' ? 'X' : 'O');
    
    if (checkWin()) {
        if (gameMode === 'ai') {
            showPopup(currentPlayer === 'Player 1' ? 'You Win!' : 'Computer Wins!');
        } else {
            showPopup(`${currentPlayer} Wins!`);
        }
        return;
    } else if (isDraw()) {
        showPopup(`It's a Draw!`);
        return;
    }
    
    if (gameMode === 'ai') {
        currentPlayer = currentPlayer === 'Player 1' ? 'Computer' : 'Player 1';
        gameStatus.textContent = currentPlayer === 'Player 1' ? 'Your turn' : 'Computer turn';
        if (currentPlayer === 'Computer') {
            setTimeout(aiMove, 500);  // Delay AI move for better UX
        }
    } else {
        currentPlayer = currentPlayer === 'Player 1' ? 'Player 2' : 'Player 1';
        gameStatus.textContent = `${currentPlayer}'s turn`;
    }
}

function placeMark(cell, index, player) {
    gameState[index] = player;
    cell.textContent = player;
}

function aiMove() {
    const emptyCells = gameState.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    
    const aiCell = cells[randomIndex];
    placeMark(aiCell, randomIndex, 'O');
    
    if (checkWin()) {
        showPopup('Computer Wins!');
        return;
    } else if (isDraw()) {
        showPopup(`It's a Draw!`);
        return;
    }

    currentPlayer = 'Player 1';
    gameStatus.textContent = 'Your turn';
}

function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return gameState[index] === (currentPlayer === 'Player 1' ? 'X' : 'O');
        });
    });
}

function isDraw() {
    return gameState.every(cell => cell !== '');
}

function restartGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'Player 1';
    gameStatus.textContent = gameMode === 'ai' ? 'Your turn' : `${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.addEventListener('click', handleCellClick, { once: true });
    });
    updateButtonStates();  // Ensure button states are updated on restart
    closePopup();
}

function showPopup(message) {
    const popup = document.createElement('div');
    popup.id = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
            <p>${message}</p>
            <button id="newGameButton">New Game</button>
        </div>
    `;
    document.body.appendChild(popup);
    document.getElementById('newGameButton').addEventListener('click', restartGame);
}

function closePopup() {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.remove();
    }
}
