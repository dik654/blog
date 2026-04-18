import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { r1: '#6366f1', r2: '#10b981', r3: '#f59e0b', r4: '#8b5cf6', r5: '#ec4899' };

const STEPS = [
  { label: 'R1: a(X), b(X), c(X) 커밋', body: 'witness를 보간하고 블라인딩 항을 추가한 뒤 KZG MSM으로 커밋. transcript에 기록.' },
  { label: 'R2: copy constraint 순열 검사', body: 'grand product 누적자 Z(X)를 구성. Z(omega^n)=1이면 와이어 간 copy constraint 성립.' },
  { label: 'R3: 제약 결합 -> 몫 t(X)', body: 'gate, perm, boundary 세 제약을 alpha로 결합하고 Zh(X)로 나눠 3등분 커밋.' },
  { label: 'R4: 스칼라 평가', body: '랜덤 점 zeta에서 6개 다항식을 평가하여 Fr 스칼라로 전송.' },
  { label: 'R5: 배치 오프닝 증명', body: 'nu로 선형 결합한 W_zeta, W_zeta_omega 2개 opening proof를 생성. 증명 완성.' },
];

const ROUND_DATA = [
  { label: 'R1', desc: 'Wire Commit', color: C.r1, fs: '', out: '[a],[b],[c]' },
  { label: 'R2', desc: 'Perm Acc', color: C.r2, fs: 'beta,gamma', out: '[Z]' },
  { label: 'R3', desc: 'Quotient', color: C.r3, fs: 'alpha', out: '[tl],[tm],[th]' },
  { label: 'R4', desc: 'Eval', color: C.r4, fs: 'zeta', out: '6 Fr' },
  { label: 'R5', desc: 'Opening', color: C.r5, fs: 'nu', out: '[Wz],[Wzw]' },
];

export default function PLONKRoundsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Pipeline of 5 rounds */}
          {ROUND_DATA.map((r, i) => {
            const x = 8 + i * 95;
            const active = step === i;
            const past = step > i;
            return (
              <g key={r.label}>
                {/* Main round box */}
                <motion.rect x={x} y={15} width={85} height={70} rx={6}
                  initial={{ opacity: 0.15 }}
                  animate={{
                    opacity: active ? 1 : past ? 0.65 : 0.2,
                    fill: active ? `${r.color}15` : `${r.color}05`,
                    stroke: r.color,
                    strokeWidth: active ? 1.8 : 0.5,
                  }}
                  transition={sp} />
                {/* Top color accent */}
                <rect x={x} y={15} width={85} height={4} rx={0} fill={r.color}
                  opacity={active ? 0.9 : past ? 0.35 : 0.1} />

                {/* Round number */}
                <text x={x + 42.5} y={33} textAnchor="middle"
                  fontSize={12} fontWeight={700} fill={r.color}
                  opacity={active || past ? 1 : 0.3}>{r.label}</text>
                <text x={x + 42.5} y={45} textAnchor="middle"
                  fontSize={8} fill={r.color}
                  opacity={active || past ? 0.7 : 0.2}>{r.desc}</text>

                {/* FS challenge pill */}
                {r.fs && (
                  <motion.g initial={{ opacity: 0 }}
                    animate={{ opacity: active || past ? 0.8 : 0.1 }}
                    transition={sp}>
                    <rect x={x + 10} y={52} width={65} height={14} rx={7}
                      fill={`${r.color}12`} stroke={r.color} strokeWidth={0.4} />
                    <text x={x + 42.5} y={62} textAnchor="middle"
                      fontSize={7} fill={r.color}>FS: {r.fs}</text>
                  </motion.g>
                )}

                {/* Output */}
                {r.out && (
                  <motion.g initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: active || past ? 0.8 : 0.1, y: 0 }}
                    transition={sp}>
                    <line x1={x + 42.5} y1={85} x2={x + 42.5} y2={100}
                      stroke={r.color} strokeWidth={0.6} strokeDasharray="2 2" />
                    <rect x={x + 4} y={100} width={77} height={18} rx={9}
                      fill={`${r.color}10`} stroke={r.color} strokeWidth={0.5} />
                    <text x={x + 42.5} y={112} textAnchor="middle"
                      fontSize={7.5} fill={r.color}>{r.out}</text>
                  </motion.g>
                )}

                {/* Arrow to next round */}
                {i < 4 && (
                  <motion.g initial={{ opacity: 0 }}
                    animate={{ opacity: past ? 0.5 : 0.08 }}
                    transition={sp}>
                    <line x1={x + 85} y1={50} x2={x + 95} y2={50}
                      stroke={ROUND_DATA[i + 1].color} strokeWidth={0.8} />
                    <polygon
                      points={`${x + 93},47 ${x + 93},53 ${x + 97},50`}
                      fill={ROUND_DATA[i + 1].color} />
                  </motion.g>
                )}
              </g>
            );
          })}

          {/* Bottom: total proof summary */}
          <motion.g initial={{ opacity: 0 }}
            animate={{ opacity: step === 4 ? 0.8 : 0 }}
            transition={sp}>
            <rect x={140} y={128} width={200} height={22} rx={6}
              fill="#ec489910" stroke={C.r5} strokeWidth={0.6} />
            <text x={240} y={143} textAnchor="middle"
              fontSize={8.5} fontWeight={600} fill={C.r5}>
              Proof = 7 G1 + 7 Fr = 704B
            </text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
