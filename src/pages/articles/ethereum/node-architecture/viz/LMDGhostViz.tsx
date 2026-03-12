import { motion } from 'framer-motion';
import StepViz from './StepViz';

const CA = '#6366f1';
const CB = '#f59e0b';
const CG = '#94a3b8';

const STEPS = [
  { label: '포크 발생: 제네시스에서 두 체인이 분기됩니다', body: '네트워크 지연으로 같은 슬롯에 두 블록이 제안되어 포크가 발생합니다. 파란색(Chain A)과 주황색(Chain B)가 동시에 존재합니다. 단순 블록 수만으로는 어느 쪽이 정규 체인인지 결정할 수 없습니다.' },
  { label: '검증자들의 최신 투표(LMD)가 블록으로 날아갑니다', body: 'V1·V2·V3는 Chain A 최신 블록에 투표하고, V4·V5는 Chain B에 투표합니다. LMD(Latest Message Driven): 각 검증자의 가장 최근 투표 한 표만 집계합니다.' },
  { label: 'GHOST: 누적 가중치 계산 — Chain A 3표 vs Chain B 2표', body: '각 분기점에서 자식 블록들의 "누적 어테스테이션 스테이크 합"을 비교합니다. Greedy Heaviest-Observed Sub-Tree: 블록 수가 아닌 스테이크 무게로 경쟁합니다.' },
  { label: 'Chain A가 더 무겁습니다 → A3가 정규 헤드로 선택됩니다', body: '3표 vs 2표, Chain A가 정규 체인이 됩니다. Chain B는 잠정적으로 무시됩니다. 이것이 LMD-GHOST의 단기 합의 — 슬롯마다 반복 수행됩니다.' },
];

// Genesis at bottom-center, chains branch up-left and up-right
const GX = 210, GY = 272;
// Chain A blocks at x=110, Chain B blocks at x=310
const AB = [{ id: 'A1', cy: 215 }, { id: 'A2', cy: 155 }, { id: 'A3', cy: 95 }];
const BB = [{ id: 'B1', cy: 215 }, { id: 'B2', cy: 155 }, { id: 'B3', cy: 95 }];

// Edges: [x1,y1,x2,y2]
const EDGES: [number, number, number, number][] = [
  [GX, GY, 110, 215], [GX, GY, 310, 215],
  [110, 215, 110, 155], [110, 155, 110, 95],
  [310, 215, 310, 155], [310, 155, 310, 95],
];

// Validators: v on left for Chain A, right for Chain B
// Positioned to not overlap with block labels
const VOTES = [
  { id: 'V1', vx: 28,  vy: 78,  bx: 84,  by: 95,  s: 'a', d: 0 },
  { id: 'V2', vx: 28,  vy: 118, bx: 84,  by: 95,  s: 'a', d: 0.12 },
  { id: 'V3', vx: 28,  vy: 158, bx: 84,  by: 155, s: 'a', d: 0.24 },
  { id: 'V4', vx: 392, vy: 78,  bx: 336, by: 95,  s: 'b', d: 0.08 },
  { id: 'V5', vx: 392, vy: 118, bx: 336, by: 155, s: 'b', d: 0.2 },
];

function Block({ cx, cy, id, c, canonical, dimmed }: {
  cx: number; cy: number; id: string; c: string; canonical: boolean; dimmed: boolean;
}) {
  return (
    <g>
      <motion.rect x={cx - 26} y={cy - 19} width={52} height={38} rx={8}
        animate={{
          fill: canonical ? '#22c55e22' : `${c}22`,
          stroke: canonical ? '#22c55e' : c,
          strokeWidth: canonical ? 2.5 : 2,
          opacity: dimmed ? 0.15 : 1,
        }}
        transition={{ duration: 0.4 }} />
      <motion.text x={cx} y={cy + 5} textAnchor="middle" fontSize={11} fontWeight="700"
        animate={{ fill: dimmed ? '#6b7280' : canonical ? '#22c55e' : c, opacity: dimmed ? 0.2 : 1 }}
        transition={{ duration: 0.4 }}>{id}</motion.text>
    </g>
  );
}

export default function LMDGhostViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 305" className="w-full max-w-[420px]" style={{ height: 'auto' }}>
          <defs>
            <marker id="arr-a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={CA} />
            </marker>
            <marker id="arr-b" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={CB} />
            </marker>
          </defs>

          {/* Tree edges */}
          {EDGES.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="hsl(var(--border))" strokeWidth={1.5} />
          ))}

          {/* Genesis block */}
          <rect x={GX - 26} y={GY - 17} width={52} height={34} rx={8} fill={`${CG}22`} stroke={CG} strokeWidth={2} />
          <text x={GX} y={GY + 5} textAnchor="middle" fontSize={10} fontWeight="700" fill={CG}>G</text>

          {/* Chain labels — positioned above the top blocks */}
          <text x={110} y={68} textAnchor="middle" fontSize={11} fontWeight="700" fill={CA}>Chain A</text>
          <text x={310} y={68} textAnchor="middle" fontSize={11} fontWeight="700" fill={CB}>Chain B</text>

          {/* Blocks */}
          {AB.map(b => <Block key={b.id} cx={110} cy={b.cy} id={b.id} c={CA} canonical={step === 3} dimmed={false} />)}
          {BB.map(b => <Block key={b.id} cx={310} cy={b.cy} id={b.id} c={CB} canonical={false} dimmed={step === 3} />)}

          {/* Validators + vote arrows */}
          {VOTES.map(v => (
            <g key={v.id}>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: 0.2 }}>
                <circle cx={v.vx} cy={v.vy} r={12}
                  fill={v.s === 'a' ? `${CA}22` : `${CB}22`}
                  stroke={v.s === 'a' ? CA : CB} strokeWidth={1.5} />
                <text x={v.vx} y={v.vy + 4} textAnchor="middle" fontSize={8} fontWeight="700"
                  fill={v.s === 'a' ? CA : CB}>{v.id}</text>
              </motion.g>
              <motion.path
                d={`M${v.vx + (v.s === 'a' ? 12 : -12)} ${v.vy} L${v.bx} ${v.by}`}
                stroke={v.s === 'a' ? CA : CB} strokeWidth={2} fill="none"
                markerEnd={`url(#arr-${v.s})`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: step >= 1 ? 1 : 0, opacity: step >= 1 ? 1 : 0 }}
                transition={{ duration: 0.4, delay: step >= 1 ? v.d : 0 }} />
            </g>
          ))}

          {/* Vote count labels — show single tally (not stacked counters) */}
          <motion.text x={68} y={52} textAnchor="middle" fontSize={12} fontWeight="700" fill={CA}
            initial={{ opacity: 0 }} animate={{ opacity: step >= 2 ? 1 : 0 }}
            transition={{ duration: 0.3 }}>
            3표
          </motion.text>
          <motion.text x={352} y={52} textAnchor="middle" fontSize={12} fontWeight="700" fill={CB}
            initial={{ opacity: 0 }} animate={{ opacity: step >= 2 ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}>
            2표
          </motion.text>

          {/* Checkmark — positioned below Chain A label, above A3 block */}
          <motion.text x={148} y={84} textAnchor="middle" fontSize={18}
            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: step === 3 ? 1 : 0, scale: step === 3 ? 1 : 0.5 }}
            transition={{ duration: 0.3 }}>✓</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
