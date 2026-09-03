import { Chess } from 'https://cdn.jsdelivr.net/npm/chess.js@1.4.0/+esm';

const game = new Chess();
const boardEl = document.querySelector('#board');
const statusEl = document.querySelector('#game-status');
const subStatusEl = document.querySelector('#sub-status');
const plyCountEl = document.querySelector('#ply-count');
const moveListEl = document.querySelector('#move-list');
const promotionDialog = document.querySelector('#promotion-dialog');

let orientation = 'w';
let selectedSquare = null;
let legalMoves = [];
let lastMove = null;

const pieceGlyph = {
  p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚',
};

function orderedSquares() {
  const files = orientation === 'w'
    ? ['a','b','c','d','e','f','g','h']
    : ['h','g','f','e','d','c','b','a'];
  const ranks = orientation === 'w'
    ? ['8','7','6','5','4','3','2','1']
    : ['1','2','3','4','5','6','7','8'];

  return ranks.flatMap(rank => files.map(file => `${file}${rank}`));
}

function render() {
  boardEl.replaceChildren();
  const squares = orderedSquares();

  for (const square of squares) {
    const file = square.charCodeAt(0) - 97;
    const rank = Number(square[1]) - 1;
    const isLight = (file + rank) % 2 === 1;
    const piece = game.get(square);
    const targetMove = legalMoves.find(move => move.to === square);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = `square ${isLight ? 'light' : 'dark'}`;
    button.dataset.square = square;
    button.setAttribute('role', 'gridcell');
    button.setAttribute('aria-label', square);

    if (selectedSquare === square) button.classList.add('selected');
    if (lastMove && (lastMove.from === square || lastMove.to === square)) button.classList.add('last-move');
    if (targetMove) button.classList.add(targetMove.captured ? 'capture' : 'legal');

    if (piece) {
      const span = document.createElement('span');
      span.className = `piece ${piece.color === 'w' ? 'white' : 'black'}`;
      span.textContent = pieceGlyph[piece.type];
      span.setAttribute('aria-hidden', 'true');
      button.append(span);
      button.setAttribute('aria-label', `${square}, ${piece.color === 'w' ? 'white' : 'black'} ${piece.type}`);
    }

    const showRank = orientation === 'w' ? square[0] === 'a' : square[0] === 'h';
    const showFile = orientation === 'w' ? square[1] === '1' : square[1] === '8';

    if (showRank) {
      const coord = document.createElement('span');
      coord.className = 'coord rank';
      coord.textContent = square[1];
      button.append(coord);
    }
    if (showFile) {
      const coord = document.createElement('span');
      coord.className = 'coord file';
      coord.textContent = square[0];
      button.append(coord);
    }

    button.addEventListener('click', () => handleSquare(square));
    boardEl.append(button);
  }

  renderStatus();
  renderMoves();
  renderPlayerLabels();
}

async function handleSquare(square) {
  if (game.isGameOver()) return;

  const piece = game.get(square);

  if (!selectedSquare) {
    if (piece?.color === game.turn()) selectSquare(square);
    return;
  }

  if (square === selectedSquare) {
    clearSelection();
    render();
    return;
  }

  if (piece?.color === game.turn()) {
    selectSquare(square);
    return;
  }

  const candidate = legalMoves.find(move => move.to === square);
  if (!candidate) {
    clearSelection();
    render();
    return;
  }

  let promotion = undefined;
  if (candidate.promotion) promotion = await choosePromotion();

  try {
    lastMove = game.move({ from: selectedSquare, to: square, promotion });
  } catch {
    clearSelection();
    render();
    return;
  }

  clearSelection();
  render();
}

function selectSquare(square) {
  selectedSquare = square;
  legalMoves = game.moves({ square, verbose: true });
  render();
}

function clearSelection() {
  selectedSquare = null;
  legalMoves = [];
}

function choosePromotion() {
  return new Promise(resolve => {
    promotionDialog.addEventListener('close', () => {
      resolve(promotionDialog.returnValue || 'q');
    }, { once: true });
    promotionDialog.showModal();
  });
}

function renderStatus() {
  const side = game.turn() === 'w' ? 'White' : 'Black';
  let headline = `${side} to move`;
  let detail = 'Local two-player game. Crab engine hookup comes next.';

  if (game.isCheckmate()) {
    headline = 'Checkmate';
    detail = `${game.turn() === 'w' ? 'Black' : 'White'} wins.`;
  } else if (game.isStalemate()) {
    headline = 'Stalemate';
    detail = 'Draw by stalemate.';
  } else if (game.isThreefoldRepetition()) {
    headline = 'Draw';
    detail = 'Draw by threefold repetition.';
  } else if (game.isInsufficientMaterial()) {
    headline = 'Draw';
    detail = 'Draw by insufficient material.';
  } else if (game.isDraw()) {
    headline = 'Draw';
    detail = 'Draw by the current game rules.';
  } else if (game.isCheck()) {
    headline = `${side} is in check`;
    detail = `${side} must answer the check.`;
  }

  statusEl.textContent = headline;
  subStatusEl.textContent = detail;
  plyCountEl.textContent = `${game.history().length} ply`;
}

function renderMoves() {
  moveListEl.replaceChildren();
  const history = game.history();

  for (let i = 0; i < history.length; i += 2) {
    const number = document.createElement('li');
    number.className = 'move-number';
    number.textContent = `${Math.floor(i / 2) + 1}.`;

    const white = document.createElement('li');
    white.className = 'move-san';
    white.textContent = history[i] ?? '';

    const black = document.createElement('li');
    black.className = 'move-san';
    black.textContent = history[i + 1] ?? '';

    moveListEl.append(number, white, black);
  }

  moveListEl.scrollTop = moveListEl.scrollHeight;
}

function renderPlayerLabels() {
  document.querySelector('#top-player-name').textContent = orientation === 'w' ? 'Black' : 'White';
  document.querySelector('#bottom-player-name').textContent = orientation === 'w' ? 'White' : 'Black';
}

async function copyText(text, button) {
  const original = button.textContent;
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = 'Copied';
  } catch {
    button.textContent = 'Copy failed';
  }
  window.setTimeout(() => { button.textContent = original; }, 900);
}

document.querySelector('#new-game').addEventListener('click', () => {
  game.reset();
  lastMove = null;
  clearSelection();
  render();
});

document.querySelector('#undo').addEventListener('click', () => {
  game.undo();
  const history = game.history({ verbose: true });
  lastMove = history.at(-1) ?? null;
  clearSelection();
  render();
});

document.querySelector('#flip').addEventListener('click', () => {
  orientation = orientation === 'w' ? 'b' : 'w';
  clearSelection();
  render();
});

document.querySelector('#copy-fen').addEventListener('click', event => {
  copyText(game.fen(), event.currentTarget);
});

document.querySelector('#copy-pgn').addEventListener('click', event => {
  copyText(game.pgn(), event.currentTarget);
});

render();
