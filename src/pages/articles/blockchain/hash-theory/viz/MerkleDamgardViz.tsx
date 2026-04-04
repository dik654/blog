import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = '#6366f1', C2 = '#10b981', C3 = '#f59e0b', CR = '#ef4444';

const STEPS = [
  { label: 'Merkle-Damgård 전체 구조', body: '입력을 블록 단위로 분할한 뒤, 각 블록을 압축함수 f에 순차 입력하여 해시를 생성한다.' },
  { label: '1. IV (초기값)', body: '미리 정해진 상수. 첫 번째 압축함수의 왼쪽 입력.' },
  { label: '2. 첫 번째 압축', body: 'IV + m₁을 압축함수 f에 넣어 256-bit h₁ 생성.' },
  { label: '3. 체이닝', body: 'h₁이 다음 압축의 입력. 블록 하나만 바뀌어도 이후 전부 변경.' },
  { label: '4. 최종 해시', body: '마지막 블록 처리 출력이 최종 해시 H(m).' },
  { label: '취약점: 길이 확장', body: 'H(m)이 내부 상태 노출 → 공격자가 체인을 이을 수 있다.' },
];

// Layout
const W = 960, H = 170;
const BW = 72, BH = 44, FW = 62, FH = 50;
const GAP = 14;

// Build nodes
const NODES = [
  { id: 'iv', lbl: 'IV', note: '초기값', w: BW, h: BH, c: C, type: 'box' as const },
  { id: 'f1', lbl: 'f', note: '', w: FW, h: FH, c: C3, type: 'f' as const, msg: 'm₁' },
  { id: 'h1', lbl: 'h₁', note: '', w: BW - 10, h: BH - 6, c: C, type: 'box' as const },
  { id: 'f2', lbl: 'f', note: '', w: FW, h: FH, c: C3, type: 'f' as const, msg: 'm₂' },
  { id: 'h2', lbl: 'h₂', note: '', w: BW - 10, h: BH - 6, c: C, type: 'box' as const },
  { id: 'f3', lbl: 'f', note: '', w: FW, h: FH, c: C3, type: 'f' as const, msg: 'm₃' },
  { id: 'hm', lbl: 'H(m)', note: '최종 해시', w: BW + 4, h: BH, c: C, type: 'box' as const },
];

// Which nodes to highlight per step
const HIGHLIGHT: Record<number, string[]> = {
  0: NODES.map(n => n.id), // all
  1: ['iv'],
  2: ['iv', 'f1', 'h1'],
  3: ['h1', 'f2', 'h2'],
  4: ['h2', 'f3', 'hm'],
  5: ['hm'],
};

// Compute positions
function getPositions() {
  const totalW = NODES.reduce((s, n) => s + n.w, 0) + (NODES.length - 1) * GAP;
  const startX = (W - totalW) / 2;
  let x = startX;
  return NODES.map(n => {
    const pos = { x, y: H / 2 + 10, ...n };
    x += n.w + GAP;
    return pos;
  });
}

export default function MerkleDamgardViz() {
  const positions = getPositions();

  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const hl = HIGHLIGHT[step] ?? [];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 'auto' }}>
            {positions.map((p, i) => {
              const active = hl.includes(p.id);
              const dim = !active && step !== 0;
              const rx = p.x;
              const ry = p.y - p.h / 2;

              return (
                <motion.g key={p.id}
                  animate={{ opacity: dim ? 0.15 : 1 }}
                  transition={{ duration: 0.3 }}>
                  {/* Connecting line from previous node */}
                  {i > 0 && (
                    <line
                      x1={positions[i - 1].x + positions[i - 1].w}
                      y1={p.y}
                      x2={rx}
                      y2={p.y}
                      stroke={C} strokeWidth={1} />
                  )}

                  {/* Message input for f nodes */}
                  {p.type === 'f' && 'msg' in p && (
                    <>
                      <rect x={rx + p.w / 2 - 32} y={ry - 36} width={64} height={26} rx={5}
                        fill={`${C2}10`} stroke={C2} strokeWidth={0.8} />
                      <text x={rx + p.w / 2} y={ry - 19} textAnchor="middle"
                        fontSize={12} fontWeight={600} fill={C2}>{(p as any).msg}</text>
                      <line x1={rx + p.w / 2} y1={ry - 10} x2={rx + p.w / 2} y2={ry}
                        stroke={C2} strokeWidth={0.8} />
                    </>
                  )}

                  {/* Node box */}
                  <rect x={rx} y={ry} width={p.w} height={p.h}
                    rx={p.type === 'f' ? 10 : 7}
                    fill={`${p.c}${active && step !== 0 ? '20' : '10'}`}
                    stroke={step === 5 && p.id === 'hm' ? CR : p.c}
                    strokeWidth={active && step !== 0 ? 1.6 : 0.9} />
                  <text x={rx + p.w / 2} y={p.y + (p.note ? 2 : 6)}
                    textAnchor="middle"
                    fontSize={p.type === 'f' ? 20 : 14}
                    fontWeight={600}
                    fill={step === 5 && p.id === 'hm' ? CR : p.c}>
                    {p.lbl}
                  </text>

                  {/* Note below */}
                  {p.note && (
                    <text x={rx + p.w / 2} y={p.y + 16} textAnchor="middle"
                      fontSize={10} fill="var(--muted-foreground)">{p.note}</text>
                  )}
                </motion.g>
              );
            })}

            {/* Step 5: attack chain extends from H(m) */}
            {step === 5 && (() => {
              const hmPos = positions[6];
              const ax = hmPos.x + hmPos.w + GAP; // start of attack chain
              const ay = hmPos.y;
              return (
                <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}>
                  {/* Line: H(m) → attack f */}
                  <line x1={hmPos.x + hmPos.w} y1={ay} x2={ax} y2={ay}
                    stroke={CR} strokeWidth={1.2} />
                  {/* Attack message block */}
                  <rect x={ax + FW / 2 - 32} y={ay - FH / 2 - 36} width={64} height={26} rx={5}
                    fill={`${CR}12`} stroke={CR} strokeWidth={0.8} />
                  <text x={ax + FW / 2} y={ay - FH / 2 - 19} textAnchor="middle"
                    fontSize={12} fontWeight={600} fill={CR}>m'</text>
                  <text x={ax + FW / 2 + 44} y={ay - FH / 2 - 22} textAnchor="start"
                    fontSize={9} fill={CR}>← 공격자가 선택</text>
                  <line x1={ax + FW / 2} y1={ay - FH / 2 - 10} x2={ax + FW / 2} y2={ay - FH / 2}
                    stroke={CR} strokeWidth={0.8} />
                  {/* Attack f box */}
                  <rect x={ax} y={ay - FH / 2} width={FW} height={FH} rx={10}
                    fill={`${CR}14`} stroke={CR} strokeWidth={1.4} />
                  <text x={ax + FW / 2} y={ay + 8} textAnchor="middle"
                    fontSize={20} fontWeight={700} fill={CR}>f</text>
                  {/* Line: attack f → result */}
                  <line x1={ax + FW} y1={ay} x2={ax + FW + GAP} y2={ay}
                    stroke={CR} strokeWidth={1.2} />
                  {/* Attack result */}
                  <rect x={ax + FW + GAP} y={ay - BH / 2} width={BW + 20} height={BH} rx={7}
                    fill={`${CR}18`} stroke={CR} strokeWidth={1.4} />
                  <text x={ax + FW + GAP + (BW + 20) / 2} y={ay + 2} textAnchor="middle"
                    fontSize={12} fontWeight={600} fill={CR}>H(m||m')</text>
                  <text x={ax + FW + GAP + (BW + 20) / 2} y={ay + 16} textAnchor="middle"
                    fontSize={9} fill={CR}>위조 해시!</text>
                </motion.g>
              );
            })()}
          </svg>
        );
      }}
    </StepViz>
  );
}
