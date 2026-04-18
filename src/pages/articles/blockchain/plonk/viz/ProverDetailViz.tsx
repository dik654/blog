import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { r1: '#6366f1', r2: '#10b981', r3: '#f59e0b', r4: '#8b5cf6', r5: '#ec4899' };

const STEPS = [
  { label: 'R1: Wire 블라인딩 + KZG 커밋', body: 'witness를 보간하고 블라인딩 항을 더한 뒤, SRS로 MSM 커밋하여 transcript에 기록.' },
  { label: 'R2: Z(X) 순열 누적자', body: 'Fiat-Shamir로 beta, gamma를 뽑고 grand product Z(X)를 구성. Z가 1로 돌아오면 순열 성립.' },
  { label: 'R3: t(X) 몫 다항식', body: 'gate + perm + boundary 제약을 alpha로 결합한 뒤 Zh(X)로 나눠 몫 t(X)를 3등분 커밋.' },
  { label: 'R4: 평가값 전송', body: '랜덤 점 zeta에서 a, b, c, sigma1, sigma2, z_omega 6개 스칼라를 평가하여 검증자에게 전송.' },
  { label: 'R5: 배치 KZG 오프닝', body: 'nu로 선형 결합한 뒤 (X-zeta)와 (X-zeta*omega)로 나눠 2개 opening proof를 생성.' },
];

const ROUNDS = [
  { label: 'R1', sub: 'Wire Commit', items: ['a(X)', 'b(X)', 'c(X)'], out: '[a],[b],[c]' },
  { label: 'R2', sub: 'Perm Acc', items: ['Z(X)'], out: '[Z]' },
  { label: 'R3', sub: 'Quotient', items: ['tlo', 'tmid', 'thi'], out: '[tl],[tm],[th]' },
  { label: 'R4', sub: 'Evaluate', items: ['6 Fr'], out: 'scalars' },
  { label: 'R5', sub: 'Opening', items: ['W_z', 'W_zw'], out: 'proof' },
];

export default function ProverDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Round boxes */}
          {ROUNDS.map((r, i) => {
            const x = 12 + i * 94;
            const active = step === i;
            const past = step > i;
            const color = Object.values(C)[i];
            return (
              <g key={r.label}>
                {/* Main box */}
                <motion.rect x={x} y={10} width={86} height={90} rx={6}
                  initial={{ opacity: 0.15 }}
                  animate={{
                    opacity: active ? 1 : past ? 0.7 : 0.2,
                    fill: active ? `${color}18` : `${color}06`,
                    stroke: color,
                    strokeWidth: active ? 1.8 : 0.5,
                  }}
                  transition={sp} />
                {/* Color top bar */}
                <rect x={x} y={10} width={86} height={5} rx={0} fill={color}
                  opacity={active ? 0.85 : past ? 0.4 : 0.1}
                  clipPath={`inset(0 0 0 0 round 6px 6px 0 0)`} />
                <motion.rect x={x} y={10} width={86} height={5} fill={color}
                  initial={{ opacity: 0.1 }}
                  animate={{ opacity: active ? 0.85 : past ? 0.4 : 0.1 }}
                  transition={sp} />
                {/* Label */}
                <text x={x + 43} y={28} textAnchor="middle"
                  fontSize={11} fontWeight={700} fill={color}
                  opacity={active || past ? 1 : 0.3}>{r.label}</text>
                <text x={x + 43} y={40} textAnchor="middle"
                  fontSize={8} fill={color}
                  opacity={active || past ? 0.7 : 0.2}>{r.sub}</text>
                {/* Items */}
                {r.items.map((item, j) => (
                  <motion.g key={j}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: active ? 1 : past ? 0.5 : 0.15, y: 0 }}
                    transition={{ ...sp, delay: active ? j * 0.08 : 0 }}>
                    <rect x={x + 8} y={48 + j * 14} width={70} height={12} rx={3}
                      fill={`${color}12`} stroke={color} strokeWidth={0.4} />
                    <text x={x + 43} y={48 + j * 14 + 9} textAnchor="middle"
                      fontSize={8} fill={color}>{item}</text>
                  </motion.g>
                ))}
              </g>
            );
          })}
          {/* Arrow connectors between rounds */}
          {[0, 1, 2, 3].map(i => {
            const x1 = 12 + i * 94 + 86;
            const x2 = 12 + (i + 1) * 94;
            const color = Object.values(C)[i + 1];
            return (
              <motion.g key={`arrow-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: step > i ? 0.6 : 0.1 }}
                transition={sp}>
                <line x1={x1} y1={55} x2={x2} y2={55}
                  stroke={color} strokeWidth={0.8} />
                <polygon points={`${x2},52 ${x2},58 ${x2 + 4},55`}
                  fill={color} />
              </motion.g>
            );
          })}
          {/* Output row */}
          {ROUNDS.map((r, i) => {
            const x = 12 + i * 94;
            const color = Object.values(C)[i];
            const show = step >= i;
            return (
              <motion.g key={`out-${i}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: show ? 0.8 : 0.1, y: show ? 0 : 6 }}
                transition={sp}>
                <line x1={x + 43} y1={100} x2={x + 43} y2={115}
                  stroke={color} strokeWidth={0.5} strokeDasharray="2 2" />
                <rect x={x + 6} y={115} width={74} height={18} rx={9}
                  fill={`${color}10`} stroke={color} strokeWidth={0.6} />
                <text x={x + 43} y={127} textAnchor="middle"
                  fontSize={7.5} fill={color}>{r.out}</text>
              </motion.g>
            );
          })}
          {/* Bottom label */}
          <text x={240} y={152} textAnchor="middle"
            fontSize={8} fill="var(--muted-foreground)">
            Proof = 7 G1 + 7 Fr (704B)
          </text>
        </svg>
      )}
    </StepViz>
  );
}
