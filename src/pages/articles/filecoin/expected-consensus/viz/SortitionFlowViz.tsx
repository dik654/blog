import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

const NODES = [
  { label: '에폭 시작', color: '#6366f1' },
  { label: 'VRF 생성', color: '#10b981' },
  { label: '임계값 비교', color: '#f59e0b' },
  { label: 'WinCount', color: '#ec4899' },
  { label: '블록 생성', color: '#8b5cf6' },
  { label: 'Tipset', color: '#ef4444' },
  { label: '체인 가중치', color: '#06b6d4' },
];

const EDGES = ['비밀키', '티켓 값', '통과 시', '증명 포함', '동시 블록', '가중치'];

const STEPS = [
  { label: '에폭 시작', body: '30초 에폭마다 모든 마이너가 독립적으로 참여' },
  { label: 'VRF 티켓 생성', body: '비밀키 + 이전 티켓으로 VRF 해시 생성\n→ 검증 가능한 의사 난수' },
  { label: 'Poisson 임계값 비교', body: '마이너 파워 비례 임계값과 비교\nticket < threshold 이면 당선' },
  { label: '당선 확인', body: 'WinCount ≥ 1이면 블록 생성 권한 획득\n높은 파워 → 여러 번 당선 가능' },
  { label: '블록 생성', body: 'ElectionProof를 블록에 포함하여 생성' },
  { label: 'Tipset 구성', body: '같은 에폭의 복수 당선자 블록이\nhttps 하나의 Tipset을 구성' },
  { label: '최중량 체인 선택', body: 'WinCount 합산으로 체인 가중치 결정\n→ 가장 무거운 체인 선택' },
];

const BW = 100, BH = 38, COL = 112, ROW = 60;

function pos(i: number) {
  const row = i < 4 ? 0 : 1;
  const col = i < 4 ? i : i - 4;
  return { x: 15 + col * COL, y: 15 + row * ROW };
}

export default function SortitionFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 470 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="sf-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Edges */}
          {EDGES.map((label, i) => {
            const from = pos(i), to = pos(i + 1);
            const vis = i < step;
            if (i === 3) {
              /* Row break */
              return (
                <motion.g key={`e-${i}`} animate={{ opacity: vis ? 0.5 : 0.08 }} transition={sp}>
                  <path d={`M${from.x + BW / 2},${from.y + BH + 2} L${from.x + BW / 2},${from.y + BH + 10} L${to.x + BW / 2},${from.y + BH + 10} L${to.x + BW / 2},${to.y - 2}`}
                    fill="none" stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#sf-arr)" />
                </motion.g>
              );
            }
            return (
              <motion.g key={`e-${i}`} animate={{ opacity: vis ? 0.5 : 0.08 }} transition={sp}>
                <line x1={from.x + BW + 2} y1={from.y + BH / 2} x2={to.x - 2} y2={to.y + BH / 2}
                  stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#sf-arr)" />
              </motion.g>
            );
          })}

          {/* Nodes */}
          {NODES.map((n, i) => {
            const p = pos(i);
            const active = i === step;
            const vis = i <= step;
            return (
              <motion.g key={n.label} animate={{ opacity: vis ? 1 : 0.15 }} transition={sp}>
                <rect x={p.x} y={p.y} width={BW} height={BH} rx={6}
                  fill={active ? `${n.color}20` : 'var(--card)'}
                  stroke={n.color} strokeWidth={active ? 2 : 0.8} />
                <text x={p.x + BW / 2} y={p.y + BH / 2 + 5} textAnchor="middle"
                  fontSize={12} fontWeight={600} fill={n.color}>{n.label}</text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
