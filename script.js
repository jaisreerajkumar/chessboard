const PIECES = {
            WHITE_KING: '♔',
            WHITE_QUEEN: '♕',
            WHITE_ROOK: '♖',
            WHITE_BISHOP: '♗',
            WHITE_KNIGHT: '♘',
            WHITE_PAWN: '♙',
            BLACK_KING: '♚',
            BLACK_QUEEN: '♛',
            BLACK_ROOK: '♜',
            BLACK_BISHOP: '♝',
            BLACK_KNIGHT: '♞',
            BLACK_PAWN: '♟'
        };

        const initialBoard = [
            ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
            ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
            ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
        ];

        let board = JSON.parse(JSON.stringify(initialBoard));
        let selectedSquare = null;
        let currentTurn = 'white';
        let validMoves = [];
        let gameOver = false;

        const whitePieces = ['♔', '♕', '♖', '♗', '♘', '♙'];
        const blackPieces = ['♚', '♛', '♜', '♝', '♞', '♟'];

        function getPieceColor(piece) {
            if (!piece) return null;
            return whitePieces.includes(piece) ? 'white' : 'black';
        }

        function isValidPosition(row, col) {
            return row >= 0 && row < 8 && col >= 0 && col < 8;
        }

        function getValidMoves(row, col) {
            const piece = board[row][col];
            if (!piece) return [];
            
            const color = getPieceColor(piece);
            const moves = [];

            // Pawn moves
            if (piece === PIECES.WHITE_PAWN) {
                const direction = -1;
                if (isValidPosition(row + direction, col) && !board[row + direction][col]) {
                    moves.push([row + direction, col]);
                    if (row === 6 && !board[row + 2 * direction][col]) {
                        moves.push([row + 2 * direction, col]);
                    }
                }
                // Pawn captures
                if (isValidPosition(row + direction, col - 1) && board[row + direction][col - 1] && 
                    getPieceColor(board[row + direction][col - 1]) === 'black') {
                    moves.push([row + direction, col - 1]);
                }
                if (isValidPosition(row + direction, col + 1) && board[row + direction][col + 1] && 
                    getPieceColor(board[row + direction][col + 1]) === 'black') {
                    moves.push([row + direction, col + 1]);
                }
            } else if (piece === PIECES.BLACK_PAWN) {
                const direction = 1;
                if (isValidPosition(row + direction, col) && !board[row + direction][col]) {
                    moves.push([row + direction, col]);
                    if (row === 1 && !board[row + 2 * direction][col]) {
                        moves.push([row + 2 * direction, col]);
                    }
                }
                // Pawn captures
                if (isValidPosition(row + direction, col - 1) && board[row + direction][col - 1] && 
                    getPieceColor(board[row + direction][col - 1]) === 'white') {
                    moves.push([row + direction, col - 1]);
                }
                if (isValidPosition(row + direction, col + 1) && board[row + direction][col + 1] && 
                    getPieceColor(board[row + direction][col + 1]) === 'white') {
                    moves.push([row + direction, col + 1]);
                }
            }

            // Knight moves
            if (piece === PIECES.WHITE_KNIGHT || piece === PIECES.BLACK_KNIGHT) {
                const knightMoves = [
                    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
                    [1, -2], [1, 2], [2, -1], [2, 1]
                ];
                knightMoves.forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    if (isValidPosition(newRow, newCol)) {
                        const target = board[newRow][newCol];
                        if (!target || getPieceColor(target) !== color) {
                            moves.push([newRow, newCol]);
                        }
                    }
                });
            }

            // Bishop moves
            if (piece === PIECES.WHITE_BISHOP || piece === PIECES.BLACK_BISHOP ||
                piece === PIECES.WHITE_QUEEN || piece === PIECES.BLACK_QUEEN) {
                const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
                directions.forEach(([dr, dc]) => {
                    let newRow = row + dr;
                    let newCol = col + dc;
                    while (isValidPosition(newRow, newCol)) {
                        const target = board[newRow][newCol];
                        if (!target) {
                            moves.push([newRow, newCol]);
                        } else {
                            if (getPieceColor(target) !== color) {
                                moves.push([newRow, newCol]);
                            }
                            break;
                        }
                        newRow += dr;
                        newCol += dc;
                    }
                });
            }

            // Rook moves
            if (piece === PIECES.WHITE_ROOK || piece === PIECES.BLACK_ROOK ||
                piece === PIECES.WHITE_QUEEN || piece === PIECES.BLACK_QUEEN) {
                const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                directions.forEach(([dr, dc]) => {
                    let newRow = row + dr;
                    let newCol = col + dc;
                    while (isValidPosition(newRow, newCol)) {
                        const target = board[newRow][newCol];
                        if (!target) {
                            moves.push([newRow, newCol]);
                        } else {
                            if (getPieceColor(target) !== color) {
                                moves.push([newRow, newCol]);
                            }
                            break;
                        }
                        newRow += dr;
                        newCol += dc;
                    }
                });
            }

            // King moves
            if (piece === PIECES.WHITE_KING || piece === PIECES.BLACK_KING) {
                const kingMoves = [
                    [-1, -1], [-1, 0], [-1, 1],
                    [0, -1], [0, 1],
                    [1, -1], [1, 0], [1, 1]
                ];
                kingMoves.forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    if (isValidPosition(newRow, newCol)) {
                        const target = board[newRow][newCol];
                        if (!target || getPieceColor(target) !== color) {
                            moves.push([newRow, newCol]);
                        }
                    }
                });
            }

            return moves;
        }

        function findKing(color) {
            const king = color === 'white' ? PIECES.WHITE_KING : PIECES.BLACK_KING;
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (board[row][col] === king) {
                        return [row, col];
                    }
                }
            }
            return null;
        }

        function isKingInCheck(color) {
            const kingPos = findKing(color);
            if (!kingPos) return false;

            const [kingRow, kingCol] = kingPos;
            const opponentColor = color === 'white' ? 'black' : 'white';

            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const piece = board[row][col];
                    if (piece && getPieceColor(piece) === opponentColor) {
                        const moves = getValidMoves(row, col);
                        if (moves.some(([r, c]) => r === kingRow && c === kingCol)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        function isValidMove(fromRow, fromCol, toRow, toCol) {
            const piece = board[fromRow][fromCol];
            const tempPiece = board[toRow][toCol];
            
            board[toRow][toCol] = piece;
            board[fromRow][fromCol] = '';
            
            const valid = !isKingInCheck(currentTurn);
            
            board[fromRow][fromCol] = piece;
            board[toRow][toCol] = tempPiece;
            
            return valid;
        }

        function hasValidMoves(color) {
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const piece = board[row][col];
                    if (piece && getPieceColor(piece) === color) {
                        const moves = getValidMoves(row, col);
                        for (let [toRow, toCol] of moves) {
                            if (isValidMove(row, col, toRow, toCol)) {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        }

        function createBoard() {
            const chessBoard = document.getElementById('chessBoard');
            chessBoard.innerHTML = '';

            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const square = document.createElement('div');
                    square.className = 'square';
                    square.className += (row + col) % 2 === 0 ? ' light' : ' dark';
                    square.dataset.row = row;
                    square.dataset.col = col;
                    square.textContent = board[row][col];
                    
                    if (selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col) {
                        square.classList.add('selected');
                    }
                    
                    if (validMoves.some(([r, c]) => r === row && c === col)) {
                        square.classList.add('valid-move');
                        if (board[row][col]) {
                            square.classList.add('has-piece');
                        }
                    }
                    
                    const kingPos = findKing(currentTurn);
                    if (isKingInCheck(currentTurn) && kingPos && kingPos[0] === row && kingPos[1] === col) {
                        square.classList.add('in-check');
                    }
                    
                    square.onclick = () => handleSquareClick(row, col);
                    chessBoard.appendChild(square);
                }
            }
        }

        function handleSquareClick(row, col) {
            if (gameOver) return;

            const piece = board[row][col];
            
            if (selectedSquare) {
                const [selectedRow, selectedCol] = selectedSquare;
                
                if (row === selectedRow && col === selectedCol) {
                    selectedSquare = null;
                    validMoves = [];
                    createBoard();
                    return;
                }
                
                const moveValid = validMoves.some(([r, c]) => r === row && c === col);
                
                if (moveValid && isValidMove(selectedRow, selectedCol, row, col)) {
                    const capturedPiece = board[row][col];
                    board[row][col] = board[selectedRow][selectedCol];
                    board[selectedRow][selectedCol] = '';
                    
                    // Pawn promotion
                    if ((board[row][col] === PIECES.WHITE_PAWN && row === 0) ||
                        (board[row][col] === PIECES.BLACK_PAWN && row === 7)) {
                        board[row][col] = board[row][col] === PIECES.WHITE_PAWN ? PIECES.WHITE_QUEEN : PIECES.BLACK_QUEEN;
                    }
                    
                    currentTurn = currentTurn === 'white' ? 'black' : 'white';
                    selectedSquare = null;
                    validMoves = [];
                    
                    if (isKingInCheck(currentTurn)) {
                        if (!hasValidMoves(currentTurn)) {
                            gameOver = true;
                            document.getElementById('message').textContent = 
                                `Checkmate! ${currentTurn === 'white' ? 'Black' : 'White'} wins!`;
                        } else {
                            document.getElementById('message').textContent = 'Check!';
                        }
                    } else if (!hasValidMoves(currentTurn)) {
                        gameOver = true;
                        document.getElementById('message').textContent = 'Stalemate! Draw!';
                    } else {
                        document.getElementById('message').textContent = '';
                    }
                    
                    updateGameStatus();
                    createBoard();
                } else if (piece && getPieceColor(piece) === currentTurn) {
                    selectedSquare = [row, col];
                    validMoves = getValidMoves(row, col).filter(([toRow, toCol]) => 
                        isValidMove(row, col, toRow, toCol)
                    );
                    createBoard();
                } else {
                    selectedSquare = null;
                    validMoves = [];
                    createBoard();
                }
            } else if (piece && getPieceColor(piece) === currentTurn) {
                selectedSquare = [row, col];
                validMoves = getValidMoves(row, col).filter(([toRow, toCol]) => 
                    isValidMove(row, col, toRow, toCol)
                );
                createBoard();
            }
        }

        function updateGameStatus() {
            const status = document.getElementById('gameStatus');
            if (gameOver) {
                status.textContent = 'Game Over';
            } else {
                status.textContent = `${currentTurn === 'white' ? 'White' : 'Black'}'s Turn`;
            }
        }

        function resetBoard() {
            board = JSON.parse(JSON.stringify(initialBoard));
            currentTurn = 'white';
            selectedSquare = null;
            validMoves = [];
            gameOver = false;
            document.getElementById('message').textContent = '';
            updateGameStatus();
            createBoard();
        }

        createBoard();