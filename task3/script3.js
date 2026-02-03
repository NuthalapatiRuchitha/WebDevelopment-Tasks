 var board = ['', '', '', '', '', '', '', '', ''];
        var currentPlayer = 'X';
        var gameActive = true;
        var player1 = 'Player 1';
        var player2 = 'Player 2';
        var player1Wins = 0;
        var player2Wins = 0;
        var draws = 0;
        var gameMode = 'pvp';
        var difficulty = 'hard'; // Default set to hard
        var isAIThinking = false;

        function selectMode(mode) {
            gameMode = mode;
            document.getElementById('modeScreen').classList.add('hidden');
            
            if (mode == 'pvp') {
                document.getElementById('nameScreen').classList.remove('hidden');
            } else {
                document.getElementById('aiNameScreen').classList.remove('hidden');
            }
        }

        function backToMode() {
            document.getElementById('nameScreen').classList.add('hidden');
            document.getElementById('aiNameScreen').classList.add('hidden');
            document.getElementById('modeScreen').classList.remove('hidden');
        }

        function startGame() {
            var name1 = document.getElementById('player1Name').value;
            var name2 = document.getElementById('player2Name').value;
            
            if (name1 != '') {
                player1 = name1;
            }
            if (name2 != '') {
                player2 = name2;
            }
            
            document.getElementById('nameScreen').classList.add('hidden');
            document.getElementById('gameScreen').classList.remove('hidden');
            updateScore();
            updateMessage();
        }

        function startAIGame() {
            var name = document.getElementById('playerName').value;
            
            if (name != '') {
                player1 = name;
            } else {
                player1 = 'You';
            }
            player2 = 'AI';
            
            document.getElementById('aiNameScreen').classList.add('hidden');
            document.getElementById('gameScreen').classList.remove('hidden');
            updateScore();
            updateMessage();
        }

        function backToNames() {
            document.getElementById('gameScreen').classList.add('hidden');
            
            if (gameMode == 'pvp') {
                document.getElementById('nameScreen').classList.remove('hidden');
                document.getElementById('player1Name').value = '';
                document.getElementById('player2Name').value = '';
            } else {
                document.getElementById('aiNameScreen').classList.remove('hidden');
                document.getElementById('playerName').value = '';
            }
            
            player1Wins = 0;
            player2Wins = 0;
            draws = 0;
            resetGame();
        }

        function updateScore() {
            document.getElementById('player1Score').innerHTML = player1 + ': ' + player1Wins;
            document.getElementById('player2Score').innerHTML = player2 + ': ' + player2Wins;
            document.getElementById('drawScore').innerHTML = 'Draw: ' + draws;
        }

        function updateMessage() {
            var playerName = currentPlayer == 'X' ? player1 : player2;
            if (gameMode == 'ai' && currentPlayer == 'O') {
                document.getElementById('message').innerHTML = "AI is thinking...";
            } else {
                document.getElementById('message').innerHTML = playerName + "'s turn";
            }
        }

        function makeMove(index) {
            // In AI mode, only allow player to click (X), not AI (O)
            if (gameMode == 'ai' && currentPlayer == 'O') {
                return;
            }
            
            if (board[index] == '' && gameActive && !isAIThinking) {
                board[index] = currentPlayer;
                var cells = document.getElementsByClassName('cell');
                cells[index].innerHTML = currentPlayer;
                
                if (checkWinner()) {
                    var winner = currentPlayer == 'X' ? player1 : player2;
                    document.getElementById('message').innerHTML = winner + ' wins!';
                    gameActive = false;
                    
                    if (currentPlayer == 'X') {
                        player1Wins++;
                    } else {
                        player2Wins++;
                    }
                    updateScore();
                    return;
                }
                
                if (checkDraw()) {
                    document.getElementById('message').innerHTML = "It's a draw!";
                    gameActive = false;
                    draws++;
                    updateScore();
                    return;
                }
                
                if (currentPlayer == 'X') {
                    currentPlayer = 'O';
                } else {
                    currentPlayer = 'X';
                }
                
                updateMessage();
                
                // If AI mode and now it's AI's turn, make AI move
                if (gameMode == 'ai' && currentPlayer == 'O' && gameActive) {
                    isAIThinking = true;
                    setTimeout(makeAIMove, 500);
                }
            }
        }

        function makeAIMove() {
            var bestMove = getBestMove();
            
            if (bestMove != -1) {
                board[bestMove] = 'O';
                var cells = document.getElementsByClassName('cell');
                cells[bestMove].innerHTML = 'O';
                
                if (checkWinner()) {
                    document.getElementById('message').innerHTML = player2 + ' wins!';
                    gameActive = false;
                    player2Wins++;
                    updateScore();
                    isAIThinking = false;
                    return;
                }
                
                if (checkDraw()) {
                    document.getElementById('message').innerHTML = "It's a draw!";
                    gameActive = false;
                    draws++;
                    updateScore();
                    isAIThinking = false;
                    return;
                }
                
                currentPlayer = 'X';
                updateMessage();
            }
            
            isAIThinking = false;
        }

        function getBestMove() {
            if (difficulty == 'easy') {
                return getRandomMove();
            } else if (difficulty == 'medium') {
                if (Math.random() < 0.5) {
                    return getRandomMove();
                } else {
                    return getMinimaxMove();
                }
            } else {
                return getMinimaxMove();
            }
        }

        function getRandomMove() {
            var availableMoves = [];
            for (var i = 0; i < board.length; i++) {
                if (board[i] == '') {
                    availableMoves.push(i);
                }
            }
            
            if (availableMoves.length > 0) {
                var randomIndex = Math.floor(Math.random() * availableMoves.length);
                return availableMoves[randomIndex];
            }
            
            return -1;
        }

        function getMinimaxMove() {
            var bestScore = -Infinity;
            var bestMove = -1;
            
            for (var i = 0; i < board.length; i++) {
                if (board[i] == '') {
                    board[i] = 'O';
                    var score = minimax(board, 0, false);
                    board[i] = '';
                    
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = i;
                    }
                }
            }
            
            return bestMove;
        }

        function minimax(boardState, depth, isMaximizing) {
            var result = checkGameState();
            
            if (result != null) {
                if (result == 'O') return 10 - depth;
                if (result == 'X') return depth - 10;
                if (result == 'draw') return 0;
            }
            
            if (isMaximizing) {
                var bestScore = -Infinity;
                for (var i = 0; i < boardState.length; i++) {
                    if (boardState[i] == '') {
                        boardState[i] = 'O';
                        var score = minimax(boardState, depth + 1, false);
                        boardState[i] = '';
                        bestScore = Math.max(score, bestScore);
                    }
                }
                return bestScore;
            } else {
                var bestScore = Infinity;
                for (var i = 0; i < boardState.length; i++) {
                    if (boardState[i] == '') {
                        boardState[i] = 'X';
                        var score = minimax(boardState, depth + 1, true);
                        boardState[i] = '';
                        bestScore = Math.min(score, bestScore);
                    }
                }
                return bestScore;
            }
        }

        function checkGameState() {
            var winPatterns = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6]
            ];
            
            for (var i = 0; i < winPatterns.length; i++) {
                var pattern = winPatterns[i];
                var a = pattern[0];
                var b = pattern[1];
                var c = pattern[2];
                
                if (board[a] != '' && board[a] == board[b] && board[a] == board[c]) {
                    return board[a];
                }
            }
            
            var isDraw = true;
            for (var i = 0; i < board.length; i++) {
                if (board[i] == '') {
                    isDraw = false;
                    break;
                }
            }
            
            if (isDraw) {
                return 'draw';
            }
            
            return null;
        }

        function checkWinner() {
            var winPatterns = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6]
            ];
            
            for (var i = 0; i < winPatterns.length; i++) {
                var pattern = winPatterns[i];
                var a = pattern[0];
                var b = pattern[1];
                var c = pattern[2];
                
                if (board[a] != '' && board[a] == board[b] && board[a] == board[c]) {
                    return true;
                }
            }
            
            return false;
        }

        function checkDraw() {
            for (var i = 0; i < board.length; i++) {
                if (board[i] == '') {
                    return false;
                }
            }
            return true;
        }

        function resetGame() {
            board = ['', '', '', '', '', '', '', '', ''];
            currentPlayer = 'X';
            gameActive = true;
            isAIThinking = false;
            
            var cells = document.getElementsByClassName('cell');
            for (var i = 0; i < cells.length; i++) {
                cells[i].innerHTML = '';
            }
            
            updateMessage();
        }
