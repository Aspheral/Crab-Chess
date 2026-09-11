import { Chess } from 'https://cdn.jsdelivr.net/npm/chess.js@1.4.0/+esm';

const moveList = document.querySelector('#move-list');
const status = document.querySelector('#engine-status');
const subStatus = document.querySelector('#sub-status');
const info = document.querySelector('.engine-grid');
let busy = false;
let lastHistory = '';

function historyFromDom() {
  return [...moveList.querySelectorAll('.move-row')].flatMap(row => {
    const cells = row.querySelectorAll('span');
    return [cells[1]?.textContent, cells[2]?.textContent].filter(Boolean).filter(Boolean);
  });
}

function setInfo(result) {
  const values = info?.querySelectorAll('dd');
  if (!values || values.length < 4) return;
  values[0].textContent = result.depth ?? '—';
  values[1].textContent = result.score
    ? (result.score.type === 'mate' ? `M${result.score.value}` : `${(result.score.value / 100).toFixed(2)}`)
    : '—';
  values[2].textContent = result.nps ? Number(result.nps).toLocaleString() : '—';
  values[3].textContent = 'native';
}

async function askCrab() {
  if (busy) return;
  const chess = new Chess();
  for (const san of historyFromDom()) chess.move(san);
  if (chess.isGameOver() || chess.turn() !== 'b') return;

  busy = true;
  status.textContent = 'Crab thinking';
  subStatus.textContent = 'The accepted native Crab binary is searching this position.';
  try {
    const response = await fetch('/api/engine', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ fen: chess.fen(), depth: 14 })
    });
    const result = await response.json();
    if (!response.ok || !result.bestmove) throw new Error(result.error || 'No best move returned');
    setInfo(result);
    const from = result.bestmove.slice(0, 2);
    const to = result.bestmove.slice(2, 4);
    const promotion = result.bestmove[4];
    const fromEl = document.querySelector(`[data-square="${from}"]`);
    const toEl = document.querySelector(`[data-square="${to}"]`);
    if (!fromEl || !toEl) throw new Error(`Board square missing for ${result.bestmove}`);
    fromEl.click();
    toEl.click();
    if (promotion && document.querySelector('#promotion-dialog')?.open) {
      document.querySelector(`#promotion-dialog button[value="${promotion}"]`)?.click();
    }
    status.textContent = 'Crab ready';
  } catch (error) {
    status.textContent = 'Crab unavailable';
    subStatus.textContent = error instanceof Error ? error.message : String(error);
  } finally {
    busy = false;
  }
}

const observer = new MutationObserver(() => {
  const current = moveList.textContent;
  if (current === lastHistory) return;
  lastHistory = current;
  setTimeout(askCrab, 30);
});
observer.observe(moveList, { childList: true, subtree: true, characterData: true });
status.textContent = 'Crab connected';
