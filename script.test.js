const {
  getPieceColor,
  isValidPosition,
  getValidMoves,
  findKing,
  isKingInCheck,
  initialBoard
} = require('./script');

describe('Basic utility functions', () => {

  test('getPieceColor returns correct color', () => {
    expect(getPieceColor('♔')).toBe('white');
    expect(getPieceColor('♚')).toBe('black');
    expect(getPieceColor('')).toBe(null);
  });

  test('isValidPosition works correctly', () => {
    expect(isValidPosition(0, 0)).toBe(true);
    expect(isValidPosition(7, 7)).toBe(true);
    expect(isValidPosition(8, 0)).toBe(false);
    expect(isValidPosition(-1, 5)).toBe(false);
  });

});

describe('Chess piece movement', () => {

  test('white pawn initial moves', () => {
    const moves = getValidMoves(6, 0);
    expect(moves).toContainEqual([5, 0]);
    expect(moves).toContainEqual([4, 0]);
  });

  test('black pawn initial moves', () => {
    const moves = getValidMoves(1, 0);
    expect(moves).toContainEqual([2, 0]);
    expect(moves).toContainEqual([3, 0]);
  });

  test('knight moves correctly', () => {
    const moves = getValidMoves(7, 1); // white knight
    expect(moves).toContainEqual([5, 0]);
    expect(moves).toContainEqual([5, 2]);
  });

});

describe('Game logic', () => {

  test('findKing finds white king', () => {
    const pos = findKing('white');
    expect(pos).toEqual([7, 4]);
  });

  test('findKing finds black king', () => {
    const pos = findKing('black');
    expect(pos).toEqual([0, 4]);
  });

  test('initial board is not in check', () => {
    expect(isKingInCheck('white')).toBe(false);
    expect(isKingInCheck('black')).toBe(false);
  });

});