import { Chess } from 'https://cdn.jsdelivr.net/npm/chess.js@1.4.0/+esm';

const game = new Chess();
const boardEl = document.querySelector('#board');
const statusEl = document.querySelector('#game-status');
const subStatusEl = document.querySelector('#sub-status');
const moveListEl = document.querySelector('#move-list');
const promotionDialog = document.querySelector('#promotion-dialog');
const engineStatusEl = document.querySelector('#engine-status');

let orientation = 'w';
let selectedSquare = null;
let legalMoves = [];
let lastMove = null;
let drag = null;

const paths = {
  p: '<path d="M12 4.1a3.1 3.1 0 1 0 0 6.2c-1.2 1.5-2.2 3.5-2.2 5.8H6.9v2.2h10.2v-2.2h-2.9c0-2.3-1-4.3-2.2-5.8a3.1 3.1 0 0 0 0-6.2Z"/>',
  n: '<path d="M7.1 18.3h10.8v-2.1h-2.1c.2-2.1-.5-3.7-2.1-5.1l2.4-4.2-3.7-1.8-2.7 3.2-2.2 1.2 1.5 2.1-2.3 2.8c-.8 1-1.2 2.3-1.2 3.7H4.9v2.1h2.2Zm3.2-7.1 1.5-2.1 1.2.6-1.1 2c-.6-.2-1.1-.3-1.6-.5Z"/>',
  b: '<path d="M12 3.5c-2.3 1.5-3.1 3.3-1.9 5.1L7.1 15l-1.7 2.1h13.2L16.9 15l-3-6.4c1.2-1.8.4-3.6-1.9-5.1Zm0 3.1c.7.8.8 1.5.2 2.3l-.2.3-.2-.3c-.6-.8-.5-1.5.2-2.3Zm-3.1 8.4 2-4.2h2.2l2 4.2H8.9Z"/>',
  r: '<path d="M6 4h2v2h2V4h4v2h2V4h2v4.1h-2.1l1.4 7.2H4.7l1.4-7.2H4V4h2Zm1.6 4.1-1 5.1h10.8l-1-5.1H7.6Zm-2.1 9.1h13v2H5.5v-2Z"/>',
  q: '<path d="m5.3 6.2 2.7 3.1 4-5.3 4 5.3 2.7-3.1-1.1 8.6H6.4L5.3 6.2Zm2.4 10.5h8.6v2H7.7v-2Z"/>',
  k: '<path d="M10.7 3h2.6v3.2h3.2v2.4h-3.2v3.1h2.8l1.4 6.3H5.5l1.4-6.3h2.8V8.6H6.5V6.2h3.2V3h1Zm-2.7 10.8-.7 3.1h9.4l-.7-3.1H8Z"/>'
};

function pieceSvg(piece) {
  const fill = piece.color === 'w' ? '#fbfaf7' : '#252422';
  const stroke = piece.color === 'w' ? '#36332e' : '#11110f';
  return `<svg class="piece-svg ${piece.color === 'w' ? 'piece-white' : 'piece-black'}" viewBox="0 0 24 24" aria-hidden="true"><g fill="${fill}" stroke="${stroke}" stroke-width=".8" stroke-linejoin="round">${paths[piece.type]}</g></svg>`;
}

function orderedSquares() {
  const files = orientation === 'w' ? ['a','b','c','d','e','f','g','h'] : ['h','g','f','e','d','c','b','a'];
  const ranks = orientation === 'w' ? ['8','7','6','5','4','3','2','1'] : ['1','2','3','4','5','6','7','8'];
  return ranks.flatMap(rank => files.map(file => `${file}${rank}`));
}

function squareFromPointer(clientX, clientY) {
  const rect = boardEl.getBoundingClientRect();
  const x = Math.max(0, Math.min(rect.width - 1, clientX - rect.left));
  const y = Math.max(0, Math.min(rect.height - 1, clientY - rect.top));
  const fileIndex = Math.floor(x / (rect.width / 8));
  const rankIndex = Math.floor(y / (rect.height / 8));
  const files = orientation === 'w' ? ['a','b','c','d','e','f','g','h'] : ['h','g','f','e','d','c','b','a'];
  const ranks = orientation === 'w' ? ['8','7','6','5','4','3','2','1'] : ['1','2','3','4','5','6','7','8'];
  return `${files[fileIndex]}${ranks[rankIndex]}`;
}

function render() {
  boardEl.replaceChildren();
  for (const square of orderedSquares()) {
    const file = square.charCodeAt(0) - 97;
    const rank = Number(square[1]) - 1;
    const isLight = (file + rank) % 2 === 1;
    const piece = game.get(square);
    const target = legalMoves.find(move => move.to === square);
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = `square ${isLight ? 'light' : 'dark'}`;
    cell.dataset.square = square;
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', piece ? `${square}, ${piece.color === 'w' ? 'white' : 'black'} ${piece.type}` : square);
    if (selectedSquare === square) cell.classList.add('selected');
    if (lastMove && (lastMove.from === square || lastMove.to === square)) cell.classList.add('last-move');
    if (target) cell.classList.add(target.captured ? 'capture' : 'legal');

    if (piece) {
      const pieceWrap = document.createElement('span');
      pieceWrap.className = 'piece';
      pieceWrap.innerHTML = pieceSvg(piece);
      cell.append(pieceWrap);
      if (drag?.square === square) cell.classList.add('drag-source');
    }

    const showRank = orientation === 'w' ? square[0] === 'a' : square[0] === 'h';
    const showFile = orientation === 'w' ? square[1] === '1' : square[1] === '8';
    if (showRank) { const coord = document.createElement('span'); coord.className = 'coord rank'; coord.textContent = square[1]; cell.append(coord); }
    if (showFile) { const coord = document.createElement('span'); coord.className = 'coord file'; coord.textContent = square[0]; cell.append(coord); }

    cell.addEventListener('click', () => handleSquare(square));
    cell.addEventListener('pointerdown', event => startDrag(event, square));
    boardEl.append(cell);
  }
  renderStatus();
  renderMoves();
  document.querySelector('#you-side').textContent = orientation === 'w' ? 'White' : 'Black';
}

function selectSquare(square) {
  selectedSquare = square;
  legalMoves = game.moves({ square, verbose: true });
  render();
}
function clearSelection() { selectedSquare = null; legalMoves = []; }

async function handleSquare(square) {
  if (game.isGameOver()) return;
  const piece = game.get(square);
  if (!selectedSquare) { if (piece?.color === game.turn()) selectSquare(square); return; }
  if (square === selectedSquare) { clearSelection(); render(); return; }
  if (piece?.color === game.turn()) { selectSquare(square); return; }
  const candidate = legalMoves.find(move => move.to === square);
  if (!candidate) { clearSelection(); render(); return; }
  let promotion;
  if (candidate.promotion) promotion = await choosePromotion();
  try { lastMove = game.move({ from: selectedSquare, to: square, promotion }); } catch { clearSelection(); render(); return; }
  clearSelection();
  render();
}

function startDrag(event, square) {
  if (game.isGameOver()) return;
  const piece = game.get(square);
  if (!piece || piece.color !== game.turn()) return;
  event.preventDefault();
  event.currentTarget.setPointerCapture?.(event.pointerId);
  drag = { square, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, moved: false };
  selectSquare(square);
  window.addEventListener('pointermove', onDragMove, { passive: false });
  window.addEventListener('pointerup', onDragEnd, { once: true });
  window.addEventListener('pointercancel', onDragCancel, { once: true });
}
function onDragMove(event) {
  if (!drag || event.pointerId !== drag.pointerId) return;
  event.preventDefault();
  if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 6) drag.moved = true;
  if (drag.moved) {
    const over = squareFromPointer(event.clientX, event.clientY);
    document.querySelectorAll('.square').forEach(el => el.classList.toggle('drag-over', el.dataset.square === over));
  }
}
async function onDragEnd(event) {
  if (!drag || event.pointerId !== drag.pointerId) return;
  event.preventDefault();
  const from = drag.square;
  const moved = drag.moved;
  drag = null;
  window.removeEventListener('pointermove', onDragMove);
  document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
  if (!moved) return;
  const to = squareFromPointer(event.clientX, event.clientY);
  if (to === from) return;
  const candidate = legalMoves.find(move => move.to === to);
  if (!candidate) { clearSelection(); render(); return; }
  let promotion;
  if (candidate.promotion) promotion = await choosePromotion();
  try { lastMove = game.move({ from, to, promotion }); } catch {}
  clearSelection();
  render();
}
function onDragCancel() { drag = null; window.removeEventListener('pointermove', onDragMove); clearSelection(); render(); }

function choosePromotion() {
  return new Promise(resolve => {
    const close = () => resolve(promotionDialog.returnValue || 'q');
    promotionDialog.addEventListener('close', close, { once: true });
    promotionDialog.showModal();
  });
}

function renderStatus() {
  const side = game.turn() === 'w' ? 'White' : 'Black';
  let headline = `${side} to move`;
  let detail = 'Local board is ready. Crab engine integration is the next layer.';
  if (game.isCheckmate()) { headline = 'Checkmate'; detail = `${game.turn() === 'w' ? 'Black' : 'White'} wins.`; }
  else if (game.isStalemate()) { headline = 'Stalemate'; detail = 'Draw by stalemate.'; }
  else if (game.isThreefoldRepetition()) { headline = 'Draw'; detail = 'Draw by threefold repetition.'; }
  else if (game.isInsufficientMaterial()) { headline = 'Draw'; detail = 'Draw by insufficient material.'; }
  else if (game.isDraw()) { headline = 'Draw'; detail = 'Draw by the current game rules.'; }
  else if (game.isCheck()) { headline = `${side} is in check`; detail = `${side} must answer the check.`; }
  statusEl.textContent = headline;
  subStatusEl.textContent = detail;
}

function renderMoves() {
  moveListEl.replaceChildren();
  const history = game.history();
  for (let i = 0; i < history.length; i += 2) {
    const row = document.createElement('div'); row.className = 'move-row';
    const num = document.createElement('span'); num.className = 'move-number'; num.textContent = `${i / 2 + 1}.`;
    const white = document.createElement('span'); white.textContent = history[i] ?? '';
    const black = document.createElement('span'); black.textContent = history[i + 1] ?? '';
    row.append(num, white, black); moveListEl.append(row);
  }
  moveListEl.scrollTop = moveListEl.scrollHeight;
}

async function copyText(text, button) {
  const original = button.textContent;
  try { await navigator.clipboard.writeText(text); button.textContent = 'Copied'; }
  catch { button.textContent = 'Copy failed'; }
  setTimeout(() => button.textContent = original, 900);
}

document.querySelector('#new-game').addEventListener('click', () => { game.reset(); lastMove = null; clearSelection(); render(); });
document.querySelector('#new-game-top').addEventListener('click', () => { game.reset(); lastMove = null; clearSelection(); render(); });
document.querySelector('#undo').addEventListener('click', () => { game.undo(); lastMove = game.history({ verbose: true }).at(-1) ?? null; clearSelection(); render(); });
document.querySelector('#flip').addEventListener('click', () => { orientation = orientation === 'w' ? 'b' : 'w'; clearSelection(); render(); });
document.querySelector('#copy-fen').addEventListener('click', event => copyText(game.fen(), event.currentTarget));
document.querySelector('#copy-pgn').addEventListener('click', event => copyText(game.pgn(), event.currentTarget));
engineStatusEl.textContent = 'Crab adapter ready';
render();
