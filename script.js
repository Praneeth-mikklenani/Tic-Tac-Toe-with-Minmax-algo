// ========================================
// TIC-TAC-TOE WITH MINIMAX AI
// ========================================

// Get HTML elements
const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.status');
const resetBtn = document.querySelector('.reset-btn');
const modeBtns = document.querySelectorAll('.mode-btn');

// Game variables
let currentPlayer = 'X';
let gameActive = true;

let gameState = ['', '', '', '', '', '', '', '', ''];

let gameMode = 'two-player';

// All possible winning combinations
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];


// ========================================
// HANDLE PLAYER MOVES
// ========================================

function handleCellClick(event) {

    const clickedCell = event.target;

    const clickedCellIndex = Number(
        clickedCell.getAttribute('data-index')
    );

    // Ignore occupied cells and moves after game ends
    if (!gameActive || gameState[clickedCellIndex] !== '') {
        return;
    }

    // Prevent the player from moving during the computer's turn
    if (gameMode === 'single-player' && currentPlayer !== 'X') {
        return;
    }

    // Place the player's mark
    gameState[clickedCellIndex] = currentPlayer;

    clickedCell.textContent = currentPlayer;

    clickedCell.classList.add(currentPlayer.toLowerCase());

    // Check whether the game has ended
    checkResult();
}


// ========================================
// CHECK WIN OR DRAW
// ========================================

function checkResult() {

    let winningCombination = null;

    // Check every winning combination
    for (const condition of winningConditions) {

        const [a, b, c] = condition;

        if (
            gameState[a] !== '' &&
            gameState[a] === gameState[b] &&
            gameState[b] === gameState[c]
        ) {
            winningCombination = condition;
            break;
        }
    }

    // Someone has won
    if (winningCombination !== null) {

        winningCombination.forEach(index => {
            cells[index].classList.add('winner');
        });

        if (gameMode === 'single-player') {

            statusText.textContent =
                currentPlayer === 'X'
                    ? 'You win!'
                    : 'Computer wins!';

        } else {

            statusText.textContent =
                `Player ${currentPlayer} wins!`;
        }

        gameActive = false;
        return true;
    }

    // Check for a draw
    if (!gameState.includes('')) {

        statusText.textContent = 'Draw!';

        gameActive = false;
        return true;
    }

    // Switch players
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    // Display whose turn it is
    if (gameMode === 'single-player') {

        statusText.textContent =
            currentPlayer === 'X'
                ? 'Your turn'
                : 'Computer is thinking...';

    } else {

        statusText.textContent =
            `Player ${currentPlayer}'s turn`;
    }

    // Let the computer make its move
    if (
        gameMode === 'single-player' &&
        currentPlayer === 'O' &&
        gameActive
    ) {
        setTimeout(computerMove, 300);
    }

    return false;
}


// ========================================
// MINIMAX AI ALGORITHM
// ========================================

function minimax(board, depth, isMaximizing) {

    const result = evaluateBoard(board);

    // Stop searching if the game has ended
    if (result !== null) {
        return result;
    }

    // Computer O tries to maximize its score
    if (isMaximizing) {

        let bestScore = -Infinity;

        for (let i = 0; i < 9; i++) {

            if (board[i] === '') {

                // Try placing O
                board[i] = 'O';

                const score = minimax(
                    board,
                    depth + 1,
                    false
                );

                // Undo the simulated move
                board[i] = '';

                bestScore = Math.max(bestScore, score);
            }
        }

        return bestScore;

    } else {

        // Player X tries to minimize the computer's score
        let bestScore = Infinity;

        for (let i = 0; i < 9; i++) {

            if (board[i] === '') {

                // Try placing X
                board[i] = 'X';

                const score = minimax(
                    board,
                    depth + 1,
                    true
                );

                // Undo the simulated move
                board[i] = '';

                bestScore = Math.min(bestScore, score);
            }
        }

        return bestScore;
    }
}


// ========================================
// EVALUATE THE BOARD
// ========================================

function evaluateBoard(board) {

    for (const condition of winningConditions) {

        const [a, b, c] = condition;

        if (
            board[a] !== '' &&
            board[a] === board[b] &&
            board[b] === board[c]
        ) {

            // Computer wins
            if (board[a] === 'O') {
                return 10;
            }

            // Human player wins
            if (board[a] === 'X') {
                return -10;
            }
        }
    }

    // No winner and no empty cells means a draw
    if (!board.includes('')) {
        return 0;
    }

    // Game is still in progress
    return null;
}


// ========================================
// FIND THE BEST MOVE
// ========================================

function findBestMove() {

    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {

        if (gameState[i] === '') {

            // Simulate the computer's move
            gameState[i] = 'O';

            const score = minimax(
                gameState,
                0,
                false
            );

            // Undo the simulated move
            gameState[i] = '';

            // Keep the best-scoring move
            if (score > bestScore) {

                bestScore = score;
                bestMove = i;
            }
        }
    }

    return bestMove;
}


// ========================================
// COMPUTER MOVE
// ========================================

function computerMove() {

    // Ignore outdated callbacks after a reset or mode change
    if (
        !gameActive ||
        gameMode !== 'single-player' ||
        currentPlayer !== 'O'
    ) {
        return;
    }

    // Ask Minimax to choose the best move
    const move = findBestMove();

    if (move === -1) {
        return;
    }

    // Place O on the selected square
    gameState[move] = 'O';

    cells[move].textContent = 'O';

    cells[move].classList.add('o');

    // Check the result after the computer moves
    checkResult();
}


// ========================================
// RESET THE GAME
// ========================================

function resetGame() {

    currentPlayer = 'X';

    gameActive = true;

    gameState = ['', '', '', '', '', '', '', '', ''];

    statusText.textContent =
        gameMode === 'single-player'
            ? 'Your turn'
            : "Player X's turn";

    // Clear every cell and its styling
    cells.forEach(cell => {

        cell.textContent = '';

        cell.classList.remove(
            'x',
            'o',
            'winner'
        );
    });
}


// ========================================
// CHANGE GAME MODE
// ========================================

function handleModeChange(event) {

    const selectedMode = event.target.getAttribute('data-mode');

    gameMode = selectedMode;

    // Update the active button
    modeBtns.forEach(button => {
        button.classList.remove('active');
    });

    event.target.classList.add('active');

    // Start a new game in the selected mode
    resetGame();
}


// ========================================
// EVENT LISTENERS
// ========================================

cells.forEach(cell => {

    cell.addEventListener(
        'click',
        handleCellClick
    );
});

resetBtn.addEventListener(
    'click',
    resetGame
);

modeBtns.forEach(button => {

    button.addEventListener(
        'click',
        handleModeChange
    );
});
