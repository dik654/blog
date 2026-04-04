import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const P = '#6366f1', S = '#10b981', A = '#f59e0b';

const NODES = [
  { id: 'chain', label: 'irys-chain', color: P, x: 120, y: 5 },
  { id: 'actors', label: 'irys-actors', color: P, x: 10, y: 55 },
  { id: 'vdf', label: 'irys-vdf', color: S, x: 90, y: 55 },
  { id: 'packing', label: 'irys-packing', color: S, x: 170, y: 55 },
  { id: 'gossip', label: 'irys-gossip', color: A, x: 250, y: 55 },
  { id: 'storage', label: 'irys-storage', color: A, x: 50, y: 105 },
  { id: 'reth', label: 'reth-bridge', color: A, x: 170, y: 105 },
  { id: 'types', label: 'irys-types', color: P, x: 120, y: 150 },
];

const EDGES = [
  [0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [3, 5], [0, 6],
  [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7],
];

const STEPS = [
  { label: '전체 크레이트 의존 그래프', body: 'irys-chain이 모든 하위 크레이트를 조립. irys-types가 공유 기반.' },
  { label: '합의 & 패킹 레이어', body: 'VDF 합의와 매트릭스 패킹이 체인 코어에서 스케줄링됩니다.' },
  { label: '스토리지 & 네트워킹', body: 'storage는 청킹/Merkle, gossip은 블록 전파를 담당합니다.' },
];

const GROUPS = [[0,1,2,3,4,5,6,7], [0,2,3], [0,4,5]];
const BW = 70, BH = 28;

export default function CrateDepViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const active = GROUPS[step];
        return (
          <svg viewBox="0 0 480 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {EDGES.map(([fi, ti], ei) => {
              const f = NODES[fi], t = NODES[ti];
              const show = active.includes(fi) && active.includes(ti);
              return (
                <motion.line key={ei}
                  x1={f.x + BW / 2} y1={f.y + BH} x2={t.x + BW / 2} y2={t.y}
                  stroke="var(--muted-foreground)" strokeWidth={show ? 1 : 1}
                  strokeDasharray="4 3"
                  animate={{ opacity: show ? 0.6 : 0.1 }} transition={{ duration: 0.3 }} />
              );
            })}
            {NODES.map((n, i) => {
              const show = active.includes(i);
              return (
                <g key={n.id}>
                  <motion.rect x={n.x} y={n.y} width={BW} height={BH} rx={5}
                    animate={{ fill: `${n.color}${show ? '12' : '06'}`,
                      stroke: n.color, strokeWidth: show ? 1.5 : 1, opacity: show ? 1 : 0.2 }}
                    transition={{ duration: 0.3 }} />
                  <text x={n.x + BW / 2} y={n.y + BH / 2 + 3} textAnchor="middle"
                    fontSize={10} fontWeight={500} fill={n.color} opacity={show ? 1 : 0.2}>
                    {n.label}
                  </text>
                </g>
              );
            })}
        </svg>
        );
      }}
    </StepViz>
  );
}
