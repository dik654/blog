import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: '유동성 제공', color: '#6366f1', sub: 'DEX/대출 풀' },
  { label: '게이지 투표', color: '#10b981', sub: 'BGT 홀더' },
  { label: '검증자 선택', color: '#f59e0b', sub: 'PoL 위임' },
  { label: '블록 생성', color: '#8b5cf6', sub: 'CometBFT' },
  { label: 'BGT 발행', color: '#ec4899', sub: '보상 배분' },
  { label: '플라이휠', color: '#ef4444', sub: '선순환' },
];

const EDGES = ['유동성 증명', '가중치 결정', '블록 제안', '보상 생성', 'BGT → LP', '재투자'];

const STEPS = [
  { label: '유동성 제공', body: '사용자가 DEX, 대출 풀 등에 유동성을 공급합니다.' },
  { label: '게이지 투표', body: 'BGT 홀더가 게이지 가중치를 투표로 결정합니다.' },
  { label: '검증자 선택', body: '유동성 부트스트래퍼가 원하는 검증자를 PoL로 지원합니다.' },
  { label: '블록 생성', body: 'CometBFT 합의로 즉시 최종성을 가진 블록을 생성합니다.' },
  { label: 'BGT 발행', body: '검증자가 블록 보상으로 BGT를 발행하고 게이지 가중치에 따라 배분합니다.' },
  { label: '플라이휠 완성', body: 'BGT 보상이 다시 유동성 제공으로 이어지는 선순환 구조가 완성됩니다.' },
];

const W = 420, GAP = 64, NW = 70, NH = 36, SY = 60;

function nx(i: number) { return 10 + i * GAP; }

export default function PoLFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W + 140} 130`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="pol-ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {EDGES.map((lbl, i) => {
            const x1 = nx(i) + NW, x2 = i < 5 ? nx(i + 1) : nx(0);
            const visible = i < step || (step === 5 && i <= 5);
            const isLoop = i === 5;
            if (isLoop && step === 5) {
              return (
                <motion.g key={`e-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}>
                  <path d={`M${nx(5) + NW / 2},${SY + NH / 2} Q${nx(5) + NW / 2},${SY + 50} ${nx(0) + NW / 2},${SY + NH / 2}`}
                    fill="none" stroke="#ef4444" strokeWidth={1.2} markerEnd="url(#pol-ah)" strokeDasharray="3,3" />
                  <rect x={W / 2 - 14} y={SY + 43} width={28} height={11} rx={2} fill="var(--card)" />
                  <text x={W / 2} y={SY + 50} textAnchor="middle" fontSize={9} fill="#ef4444">{lbl}</text>
                </motion.g>
              );
            }
            return (
              <motion.g key={`e-${i}`} initial={{ opacity: 0 }} animate={{ opacity: visible ? 0.6 : 0 }}>
                <line x1={x1} y1={SY} x2={x2} y2={SY} stroke="var(--muted-foreground)"
                  strokeWidth={1.2} markerEnd="url(#pol-ah)" />
                <rect x={(x1 + x2) / 2 - 18} y={SY - 15} width={36} height={11} rx={2} fill="var(--card)" />
                <text x={(x1 + x2) / 2} y={SY - 8} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">{lbl}</text>
              </motion.g>
            );
          })}
          {NODES.map((n, i) => {
            const x = nx(i), visible = i <= step;
            const glow = i === step;
            return (
              <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: visible ? 1 : 0.15 }}
                transition={{ duration: 0.3 }}>
                <rect x={x} y={SY - NH / 2} width={NW} height={NH} rx={6}
                  fill={glow ? n.color + '22' : '#ffffff08'} stroke={n.color}
                  strokeWidth={glow ? 2 : 1} opacity={0.9} />
                <text x={x + NW / 2} y={SY + 1} textAnchor="middle" fontSize={9} fontWeight="700"
                  fill={n.color}>{n.label}</text>
                <text x={x + NW / 2} y={SY + 11} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">{n.sub}</text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
