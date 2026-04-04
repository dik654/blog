import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: '스테이킹', color: '#6366f1', sub: '32 ETH' },
  { label: '검증자 선출', color: '#10b981', sub: 'RANDAO' },
  { label: '블록 제안', color: '#f59e0b', sub: '슬롯 내 제안' },
  { label: '어테스테이션', color: '#8b5cf6', sub: '커미티 투표' },
  { label: '최종성', color: '#ec4899', sub: 'Casper FFG' },
  { label: '보상 분배', color: '#ef4444', sub: '에폭 정산' },
];

const EDGES = ['비콘체인 등록', '제안자 지정', '블록 전파', '2/3+ 투표', '에폭 정산'];

const STEPS = [
  { label: '스테이킹', body: '검증자가 32 ETH를 비콘체인 컨트랙트에 예치합니다.' },
  { label: '검증자 선출', body: 'RANDAO 기반으로 각 슬롯의 제안자와 커미티를 선정합니다.' },
  { label: '제안 & 커미티 배정', body: '선출된 제안자가 블록을 생성하고 커미티가 검증을 준비합니다.' },
  { label: '어테스테이션', body: '커미티 검증자들이 블록에 대한 투표(attestation)를 전파합니다.' },
  { label: '최종성 확보', body: 'Casper FFG로 2에폭(~12.8분) 후 최종성이 달성됩니다.' },
  { label: '보상 분배', body: '에폭 정산 시 제안/검증 보상이 분배됩니다. 슬래싱 조건 위반 시 벌금.' },
];

const NW = 62, NH = 36, GAP = 66, SY = 55;
function nx(i: number) { return 6 + i * GAP; }

export default function PoSFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 548 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="pos-ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {EDGES.map((lbl, i) => {
            const srcIdx = i < 2 ? i : i + 1;
            const tgtIdx = i < 2 ? i + 1 : i + 2;
            const x1 = nx(srcIdx) + NW, x2 = nx(tgtIdx);
            const visible = i < step;
            return (
              <motion.g key={`e-${i}`} initial={{ opacity: 0 }} animate={{ opacity: visible ? 0.6 : 0 }}>
                <line x1={x1} y1={SY} x2={x2} y2={SY} stroke="var(--muted-foreground)"
                  strokeWidth={1.2} markerEnd="url(#pos-ah)" />
                <rect x={(x1 + x2) / 2 - 20} y={SY - 15} width={40} height={11} rx={2} fill="var(--card)" />
                <text x={(x1 + x2) / 2} y={SY - 8} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">{lbl}</text>
              </motion.g>
            );
          })}
          {NODES.map((n, i) => {
            const x = nx(i), visible = i <= step, glow = i === step;
            return (
              <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: visible ? 1 : 0.15 }}
                transition={{ duration: 0.3 }}>
                <rect x={x} y={SY - NH / 2} width={NW} height={NH} rx={6}
                  fill={glow ? n.color + '22' : '#ffffff08'} stroke={n.color}
                  strokeWidth={glow ? 2 : 1} opacity={0.9} />
                <text x={x + NW / 2} y={SY} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={n.color}>{n.label}</text>
                <text x={x + NW / 2} y={SY + 10} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">{n.sub}</text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
