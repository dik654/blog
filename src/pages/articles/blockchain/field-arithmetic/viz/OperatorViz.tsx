import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const OPS = [
  { sym: '+', trait: 'Add', c: '#6366f1', method: 'limb-wise carry', cost: 1 },
  { sym: '-', trait: 'Sub', c: '#10b981', method: 'borrow + 조건 +p', cost: 1 },
  { sym: '×', trait: 'Mul', c: '#f59e0b', method: 'Montgomery CIOS', cost: 6 },
  { sym: '-a', trait: 'Neg', c: '#8b5cf6', method: 'p - a', cost: 0.5 },
  { sym: 'a⁻¹', trait: 'Inv', c: '#ec4899', method: 'a^(p-2)', cost: 10 },
];

const STEPS = [
  { label: 'Rust 연산자 오버로딩', body: 'Fp 구조체에 Add, Sub, Mul 등 trait를 구현하여 a + b, a * b 문법을 사용합니다.' },
  { label: 'Add: limb별 carry 전파', body: 'limb[0]부터 더하고 carry를 다음 limb에 전파. 결과 ≥ p이면 조건부 감산.' },
  { label: 'Mul: Montgomery CIOS', body: '4×4 limb 곱셈 → 즉시 축소. 가장 비싼 연산이지만 나눗셈 0회.' },
  { label: 'Inv: Fermat 소정리', body: 'a⁻¹ = a^(p-2) mod p. 약 254번의 제곱+곱. 드물게 사용하지만 필수.' },
];

export default function OperatorViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 105" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Operator symbols row */}
          {OPS.map((o, i) => {
            const x = 22 + i * 64;
            const highlight = (step === 1 && i === 0) || (step === 2 && i === 2) || (step === 3 && i === 4) || step === 0;
            return (
              <motion.g key={o.sym} animate={{ opacity: highlight ? 1 : 0.3 }} transition={sp}>
                <motion.rect x={x} y={8} width={52} height={36} rx={5}
                  animate={{
                    fill: highlight ? `${o.c}1a` : `${o.c}06`,
                    stroke: o.c, strokeWidth: highlight ? 1.5 : 0.5,
                  }} transition={sp} />
                <text x={x + 26} y={24} textAnchor="middle" fontSize={10} fontWeight={600} fill={o.c}>{o.sym}</text>
                <text x={x + 26} y={37} textAnchor="middle" fontSize={9} fill={`${o.c}99`}>{o.trait}</text>
              </motion.g>
            );
          })}
          {/* Cost bar chart */}
          <text x={20} y={60} fontSize={9} fill="var(--muted-foreground)">상대 비용</text>
          {OPS.map((o, i) => {
            const x = 22 + i * 64;
            const barW = (o.cost / 10) * 50;
            return (
              <motion.g key={`bar-${i}`}>
                <rect x={x} y={65} width={52} height={10} rx={2} fill={`${o.c}08`} stroke={o.c} strokeWidth={0.3} />
                <motion.rect x={x + 1} y={66} rx={1.5} height={8}
                  animate={{ width: step >= 1 ? barW : 0 }}
                  transition={{ ...sp, delay: i * 0.06 }} fill={`${o.c}50`} />
                <text x={x + 26} y={73} textAnchor="middle" fontSize={9} fill={o.c}>{o.method}</text>
              </motion.g>
            );
          })}
          {/* Code example */}
          <motion.g animate={{ opacity: step >= 1 ? 0.8 : 0.2 }} transition={sp}>
            <rect x={20} y={82} width={300} height={18} rx={4} fill="#6366f108" stroke="#6366f1" strokeWidth={0.4} />
            <text x={170} y={94} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="#6366f1">
              {step === 1 ? 'let c = a + b;  // Add<Output=Fp> → carry + 조건감산'
                : step === 2 ? 'let c = a * b;  // Mul<Output=Fp> → Montgomery CIOS'
                : step === 3 ? 'let c = a.invert();  // a^(p-2) mod p'
                : 'let c = a + b;  let d = a * b;  // Rust 연산자'}
            </text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
