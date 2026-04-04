import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = ['#6366f1', '#10b981', '#f59e0b'];
const NODES = [
  { label: '검증자', color: C[0], sub: 'Verifier' },
  { label: '챌린지 생성', color: C[0], sub: '랜덤 인덱스' },
  { label: '저장자', color: C[1], sub: 'Prover' },
  { label: '응답 생성', color: C[1], sub: 'σ = H(block)' },
  { label: '검증', color: C[2], sub: 'Accept/Reject' },
];
const EDGES = ['랜덤 블록 선택', '전송', '블록 읽기 + 해시', '응답 전달'];
const STEPS = [
  { label: '검증자가 챌린지 생성', body: '검증자가 파일의 랜덤 블록 인덱스 집합을 선택합니다.' },
  { label: '저장자에게 챌린지 전송', body: '선택된 인덱스를 저장자에게 보냅니다.' },
  { label: '저장자가 블록 읽고 응답', body: '저장자가 해당 블록을 읽고 인증 태그와 함께 응답합니다.' },
  { label: '검증자가 응답 검증', body: '검증자가 미리 저장한 메타데이터와 비교하여 응답을 검증합니다.' },
  { label: '수락 또는 거부', body: '모든 블록이 올바르면 수락, 하나라도 틀리면 거부합니다.' },
];
const NW = 62, NH = 34, GAP = 72, SY = 55;
function nx(i: number) { return 6 + i * GAP; }

export default function PoRFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="por-ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {EDGES.map((lbl, i) => {
            const x1 = nx(i) + NW, x2 = nx(i + 1);
            return (
              <motion.g key={`e-${i}`} animate={{ opacity: i < step ? 0.6 : 0 }}>
                <line x1={x1} y1={SY} x2={x2} y2={SY}
                  stroke="var(--muted-foreground)" strokeWidth={1.2}
                  markerEnd="url(#por-ah)" />
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
        </svg>
      )}
    </StepViz>
  );
}
