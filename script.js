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

  // Pawn
  if (piece === PIECES.WHITE_PAWN) {
    const direction = -1;
    if (isValidPosition(row + direction, col) && !board[row + direction][col]) {
      moves.push([row + direction, col]);
      if (row === 6 && !board[row + 2 * direction][col]) {
        moves.push([row + 2 * direction, col]);
      }
    }
  } else if (piece === PIECES.BLACK_PAWN) {
    const direction = 1;
    if (isValidPosition(row + direction, col) && !board[row + direction][col]) {
      moves.push([row + direction, col]);
      if (row === 1 && !board[row + 2 * direction][col]) {
        moves.push([row + 2 * direction, col]);
      }
    }
  }

  // Knight
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

// 👉 Export for Jest
module.exports = {
  getPieceColor,
  isValidPosition,
  getValidMoves,
  findKing,
  isKingInCheck,
  initialBoard,
  PIECES,
  whitePieces,
  blackPieces
};

// 👉 Prevent Jest crash (DOM check)
if (typeof document !== "undefined") {
  createBoard();
}