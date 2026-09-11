import { spawn } from 'node:child_process';
import { access } from 'node:fs/promises';
import path from 'node:path';

const ENGINE = path.join(process.cwd(), 'api', 'crab');
const MAX_DEPTH = 18;
const TIMEOUT_MS = 9000;

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function parseInfo(line, state) {
  const depth = line.match(/\bdepth (\d+)/);
  const seldepth = line.match(/\bseldepth (\d+)/);
  const nodes = line.match(/\bnodes (\d+)/);
  const nps = line.match(/\bnps (\d+)/);
  const score = line.match(/\bscore (cp|mate) (-?\d+)/);
  if (depth) state.depth = Number(depth[1]);
  if (seldepth) state.seldepth = Number(seldepth[1]);
  if (nodes) state.nodes = Number(nodes[1]);
  if (nps) state.nps = Number(nps[1]);
  if (score) state.score = { type: score[1], value: Number(score[2]) };
}

async function runEngine(fen, depth) {
  await access(ENGINE);
  const state = {};
  return await new Promise((resolve, reject) => {
    const child = spawn(ENGINE, [], { stdio: ['pipe', 'pipe', 'pipe'] });
    let buffer = '';
    let bestmove = null;
    let stderr = '';
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      reject(new Error('engine timeout'));
    }, TIMEOUT_MS);

    const finish = (error) => {
      clearTimeout(timer);
      if (error) reject(error);
      else resolve({ bestmove, ...state });
    };

    child.stdout.on('data', chunk => {
      buffer += chunk.toString();
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        if (line.startsWith('info ')) parseInfo(line, state);
        if (line.startsWith('bestmove ')) {
          bestmove = line.split(/\s+/)[1] ?? null;
          child.stdin.write('quit\n');
          child.stdin.end();
        }
      }
    });
    child.stderr.on('data', chunk => { stderr += chunk.toString(); });
    child.on('error', finish);
    child.on('close', code => {
      if (bestmove) finish();
      else finish(new Error(`engine exited without bestmove (${code}): ${stderr.slice(-500)}`));
    });

    child.stdin.write('uci\n');
    child.stdin.write('isready\n');
    child.stdin.write(`position fen ${fen}\n`);
    child.stdin.write(`go depth ${depth}\n`);
  });
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await access(ENGINE);
      return send(res, 200, { ok: true, engine: 'Crab', enginePath: 'api/crab' });
    } catch {
      return send(res, 503, { ok: false, error: 'Crab binary is not installed in this deployment' });
    }
  }
  if (req.method !== 'POST') return send(res, 405, { error: 'POST or GET required' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {});
    const fen = String(body.fen ?? '').trim();
    const depth = Math.max(1, Math.min(MAX_DEPTH, Number(body.depth ?? 14) || 14));
    if (!fen) return send(res, 400, { error: 'fen is required' });
    if (fen.length > 200) return send(res, 400, { error: 'invalid fen' });
    const result = await runEngine(fen, depth);
    return send(res, 200, { ok: true, engine: 'Crab', depth, ...result });
  } catch (error) {
    return send(res, 500, { ok: false, error: error instanceof Error ? error.message : String(error) });
  }
}
