import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const LAYERS = [
  { label: 'Group (군)', color: '#6366f1', y: 72, w: 280, axioms: '폐쇄·결합·항등·역원' },
  { label: 'Abelian (아벨군)', color: '#10b981', y: 54, w: 220, axioms: '+ 교환법칙' },
  { label: 'Ring (환)', color: '#f59e0b', y: 36, w: 160, axioms: '+ 곱셈·분배' },
  { label: 'Field (체)', color: '#8b5cf6', y: 18, w: 100, axioms: '+ 곱셈역원' },
];

const STEPS = [
  { label: 'Group (군)', body: '4가지 공리: 폐쇄성, 결합성, 항등원, 역원. ECDLP는 타원곡선군의 이산로그 문제.' },
  { label: 'Abelian Group (아벨군)', body: '군 + 교환법칙 (a*b = b*a). ZK에서 사용하는 거의 모든 군이 아벨군.' },
  { label: 'Ring (환)', body: '두 연산(+, *). 곱셈 역원 불필요. 다항식 환 F[x]는 QAP에서 핵심.' },
  { label: 'Field (체)', body: '환 + 곱셈역원. 0 외 모든 원소에 역원 존재. ZK 산술회로의 기반 구조.' },
];

export default function AlgebraStructureViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {LAYERS.map((l, i) => {
            const active = i <= step;
            const highlighted = i === step;
            const cx = 160;
            return (
              <g key={l.label}>
                <motion.rect
                  x={cx - l.w / 2} y={l.y} width={l.w} height={20} rx={4}
                  animate={{
                    fill: highlighted ? `${l.color}25` : active ? `${l.color}10` : `${l.color}04`,
                    stroke: l.color,
                    strokeWidth: highlighted ? 1.8 : 0.6,
                    opacity: active ? 1 : 0.2,
                  }}
                  transition={sp}
                />
                <motion.text
                  x={cx} y={l.y + 9} textAnchor="middle" fontSize={9} fontWeight={600}
                  animate={{ fill: l.color, opacity: active ? 1 : 0.2 }} transition={sp}
                >{l.label}</motion.text>
                <motion.text
                  x={cx} y={l.y + 16} textAnchor="middle" fontSize={9}
                  animate={{ fill: l.color, opacity: active ? 0.6 : 0.15 }} transition={sp}
                >{l.axioms}</motion.text>
              </g>
            );
          })}
          {/* containment arrows */}
          {[0, 1, 2].map(i => (
            <motion.line key={i}
              x1={160} y1={LAYERS[i + 1].y + 20} x2={160} y2={LAYERS[i].y}
              stroke="var(--border)" strokeWidth={0.6} strokeDasharray="2 2"
              animate={{ opacity: step > i ? 0.4 : 0.1 }} transition={sp}
            />
          ))}
        </svg>
      )}
    </StepViz>
  );
}
