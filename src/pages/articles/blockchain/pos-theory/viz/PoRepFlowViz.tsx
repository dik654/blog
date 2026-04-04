import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = ['#6366f1', '#10b981', '#f59e0b'];
const NODES = [
  { label: '원본 D', color: C[0], sub: '데이터' },
  { label: 'Seal', color: C[1], sub: 'VDE 체인' },
  { label: 'R (복제본)', color: C[1], sub: 'R = Seal(D, id)' },
  { label: 'Prove', color: C[2], sub: 'Merkle + ZK' },
  { label: '검증', color: C[2], sub: 'on-chain' },
];
const EDGES = ['입력', 'VDE 인코딩', '증명 생성', '제출'];
const STEPS = [
  { label: '원본 데이터 입력', body: '저장자가 원본 데이터 D를 받습니다.' },
  { label: 'Seal: VDE로 순차 인코딩', body: 'VDE(Verifiable Delay Encoding)로 순차적 인코딩. 병렬화 불가.' },
  { label: '고유 복제본 R 생성', body: 'R = Seal(D, prover_id). 각 저장자마다 고유한 복제본을 생성합니다.' },
  { label: 'Merkle 경로 + ZK 증명 생성', body: '복제본의 Merkle tree + zk-SNARK 증명을 생성합니다.' },
  { label: '온체인 검증', body: '온체인에서 증명을 검증하여 고유 복제본임을 확인합니다.' },
];
const NW = 62, NH = 34, GAP = 72, SY = 55;
function nx(i: number) { return 6 + i * GAP; }

export default function PoRepFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="porep-ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {EDGES.map((lbl, i) => {
            const x1 = nx(i) + NW, x2 = nx(i + 1);
            return (
              <motion.g key={`e-${i}`} animate={{ opacity: i < step ? 0.6 : 0 }}>
                <line x1={x1} y1={SY} x2={x2} y2={SY}
                  stroke="var(--muted-foreground)" strokeWidth={1.2}
                  markerEnd="url(#porep-ah)" />
                <text x={(x1 + x2) / 2} y={SY - 8} textAnchor="middle"
                  fontSize={9} fill="var(--muted-foreground)">{lbl}</text>
              </motion.g>
            );
          })}
          {NODES.map((n, i) => {
            const x = nx(i), glow = i === step;
            return (
              <motion.g key={i} animate={{ opacity: i <= step ? 1 : 0.15 }}>
                <rect x={x} y={SY - NH / 2} width={NW} height={NH} rx={6}
                  fill={glow ? `${n.color}22` : '#ffffff08'}
                  stroke={n.color} strokeWidth={glow ? 2 : 1} />
                <text x={x + NW / 2} y={SY - 1} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={n.color}>{n.label}</text>
                <text x={x + NW / 2} y={SY + 9} textAnchor="middle"
                  fontSize={9} fill="var(--muted-foreground)">{n.sub}</text>
              </motion.g>
            );
          })}
          {/* VDE sequential lock icon */}
          {step >= 1 && (
            <motion.text x={nx(1) + NW / 2} y={SY + 28} textAnchor="middle"
              fontSize={9} fill={C[1]} initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
              순차적 — 병렬화 불가
            </motion.text>
          )}
        </svg>
      )}
    </StepViz>
  );
}
