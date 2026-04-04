import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const NODES = [
  { label: 'RISC-V', sub: 'ADD, XOR...', color: '#a855f7', x: 30 },
  { label: '8비트 분해', sub: 'PrefixSuffix', color: '#3b82f6', x: 100 },
  { label: '서브테이블', sub: 'AND/XOR/Range', color: '#10b981', x: 170 },
  { label: '희소 MLE', sub: '사용 항목만', color: '#f59e0b', x: 240 },
  { label: 'Sumcheck', sub: '클레임 감소', color: '#ec4899', x: 310 },
  { label: 'Dory', sub: '개구 증명', color: '#6366f1', x: 380 },
];

const STEPS = [
  { label: 'RISC-V 명령어 입력', body: '명령어 피연산자 추출' },
  { label: '8비트 분해', body: '64비트 -> 8비트 청크 분해' },
  { label: '서브테이블 룩업', body: 'AND/XOR/Range 서브테이블 룩업' },
  { label: '희소 MLE 구성', body: '사용 항목만 희소 MLE 포함' },
  { label: 'Sumcheck 감소', body: 'Sumcheck 클레임 환원' },
  { label: 'Dory 개구 증명', body: 'Dory PCS 최종 검증' },
];

export default function LassoLookupViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 560 70" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {NODES.map((n, i) => {
            const active = i <= step;
            const hl = i === step;
            return (
              <g key={n.label}>
                {i > 0 && (
                  <motion.line
                    x1={NODES[i - 1].x + 24} y1={35} x2={n.x - 24} y2={35}
                    stroke={NODES[i - 1].color} strokeWidth={0.7}
                    animate={{ opacity: active ? 0.5 : 0.1 }} transition={sp} />
                )}
                <motion.rect x={n.x - 23} y={18} width={46} height={34} rx={4}
                  animate={{
                    fill: hl ? `${n.color}25` : active ? `${n.color}10` : `${n.color}04`,
                    stroke: n.color, strokeWidth: hl ? 1.8 : 0.6,
                    opacity: active ? 1 : 0.2,
                  }} transition={sp} />
                <motion.text x={n.x} y={32} textAnchor="middle" fontSize={9} fontWeight={600}
                  animate={{ fill: n.color, opacity: active ? 1 : 0.2 }} transition={sp}>
                  {n.label}
                </motion.text>
                <motion.text x={n.x} y={43} textAnchor="middle" fontSize={9}
                  animate={{ fill: n.color, opacity: active ? 0.5 : 0.1 }} transition={sp}>
                  {n.sub}
                </motion.text>
              </g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
