import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { t: '#6366f1', bd: '#f59e0b', tr: '#10b981', q: '#8b5cf6' };

const STEPS = [
  { label: 'AIR 제약 구조', body: '레지스터 (a, b)의 전이 규칙과 경계 조건을 다항식으로 인코딩하여 실행 추적을 검증한다.' },
  { label: '경계 제약 (Boundary)', body: '특정 행의 레지스터 값을 고정. 경계점에서 다항식이 0이 되어야 제약 충족.' },
  { label: '전이 제약 (Transition)', body: '연속 두 행 간 관계를 강제. 모든 도메인 점에서 다항식이 0이어야 한다.' },
  { label: '몫 다항식 Q(x)', body: '모든 제약을 하나로 합산 후 vanishing polynomial로 나눠 저차성을 FRI로 검증.' },
];

/* arrow helper */
const Arrow = ({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) => {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const ax = x2 - ux * 5, ay = y2 - uy * 5;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} />
      <polygon
        points={`${x2},${y2} ${ax - uy * 3},${ay + ux * 3} ${ax + uy * 3},${ay - ux * 3}`}
        fill={color}
      />
    </g>
  );
};

export default function AIRConstraintViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Registers */}
              <ModuleBox x={20} y={10} w={90} h={42} label="Register a" sub="값 추적" color={C.t} />
              <ModuleBox x={130} y={10} w={90} h={42} label="Register b" sub="값 추적" color={C.t} />

              {/* Transition rule arrow */}
              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.15 }}>
                <Arrow x1={110} y1={52} x2={130} y2={52} color={C.tr} />
                <text x={120} y={63} textAnchor="middle" fontSize={7.5} fill={C.tr}>a'=b</text>
              </motion.g>

              {/* Trace table */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.2 }}>
                {/* header */}
                <rect x={260} y={10} width={200} height={22} rx={4} fill={`${C.t}18`} stroke={C.t} strokeWidth={0.6} />
                <text x={310} y={25} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.t}>a</text>
                <text x={410} y={25} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.t}>b</text>
                <line x1={360} y1={10} x2={360} y2={32} stroke={C.t} strokeWidth={0.4} />
                {/* rows */}
                {[['1', '1'], ['1', '2'], ['2', '3'], ['3', '5']].map(([a, b], i) => (
                  <g key={i}>
                    <rect x={260} y={32 + i * 20} width={200} height={20} rx={0}
                      fill={i % 2 === 0 ? `${C.t}08` : 'transparent'} stroke="var(--border)" strokeWidth={0.3} />
                    <text x={280} y={46 + i * 20} fontSize={8} fill="var(--muted-foreground)">row {i}</text>
                    <text x={310} y={46 + i * 20} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.t}>{a}</text>
                    <line x1={360} y1={32 + i * 20} x2={360} y2={52 + i * 20} stroke="var(--border)" strokeWidth={0.3} />
                    <text x={410} y={46 + i * 20} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.t}>{b}</text>
                  </g>
                ))}
              </motion.g>

              {/* Constraint labels */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.3 }}>
                <DataBox x={20} y={75} w={90} h={28} label="경계 제약" color={C.bd} />
                <text x={65} y={115} textAnchor="middle" fontSize={8} fill={C.bd}>초기·출력값 고정</text>
                <DataBox x={130} y={75} w={90} h={28} label="전이 제약" color={C.tr} />
                <text x={175} y={115} textAnchor="middle" fontSize={8} fill={C.tr}>행 간 관계 강제</text>
              </motion.g>

              {/* b'=a+b */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.15 }}>
                <path d="M 175 10 C 175 0, 200 0, 200 10" fill="none" stroke={C.tr} strokeWidth={1} />
                <text x={188} y={7} textAnchor="middle" fontSize={7.5} fill={C.tr}>b'=a+b</text>
              </motion.g>

              {/* Bottom summary */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
                <text x={245} y={140} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  제약을 다항식으로 인코딩 → 몫 존재 여부로 검증
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Three boundary constraints as boxes */}
              {[
                { label: 'B₁(x)', sub: 'a(x) - 1', row: 'x = omega^0', val: 'a₀ = 1' },
                { label: 'B₂(x)', sub: 'b(x) - 1', row: 'x = omega^0', val: 'b₀ = 1' },
                { label: 'B₃(x)', sub: 'b(x) - 5', row: 'x = omega^3', val: 'b₃ = 5' },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.1 }}>
                  <ActionBox x={20 + i * 155} y={12} w={140} h={50} label={item.label} sub={item.sub} color={C.bd} />
                  {/* evaluation point */}
                  <rect x={35 + i * 155} y={70} width={110} height={22} rx={11}
                    fill={`${C.bd}12`} stroke={C.bd} strokeWidth={0.6} />
                  <text x={90 + i * 155} y={84} textAnchor="middle" fontSize={8.5} fontWeight={500} fill={C.bd}>
                    {item.row}
                  </text>
                  {/* enforced value */}
                  <Arrow x1={90 + i * 155} y1={92} x2={90 + i * 155} y2={108} color={C.bd} />
                  <rect x={50 + i * 155} y={110} width={80} height={24} rx={12}
                    fill={`${C.tr}15`} stroke={C.tr} strokeWidth={0.6} />
                  <text x={90 + i * 155} y={125} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.tr}>
                    {item.val}
                  </text>
                </motion.g>
              ))}

              {/* Verification note */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.35 }}>
                <rect x={100} y={148} width={290} height={24} rx={4} fill={`${C.tr}10`} stroke={C.tr} strokeWidth={0.5} />
                <text x={245} y={163} textAnchor="middle" fontSize={8.5} fill={C.tr}>
                  경계점에서 B(x) = 0 → (x - omega^i)로 나눠 몫 생성
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Two transition constraints */}
              <ModuleBox x={20} y={8} w={210} h={42} label="T₁(x) = a(omega*x) - b(x)" sub="a의 다음 값 = b의 현재 값" color={C.tr} />
              <ModuleBox x={250} y={8} w={220} h={42} label="T₂(x) = b(omega*x) - a(x) - b(x)" sub="b의 다음 값 = a + b" color={C.tr} />

              {/* Verification example: row 0 -> row 1 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.15 }}>
                <text x={245} y={70} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.t}>검증: row 0 → row 1</text>

                {/* T1 check */}
                <rect x={30} y={80} width={200} height={40} rx={6} fill={`${C.t}08`} stroke="var(--border)" strokeWidth={0.4} />
                <text x={40} y={96} fontSize={8.5} fill={C.t}>T₁(omega^0) = a(omega^1) - b(omega^0)</text>
                <text x={40} y={110} fontSize={8.5} fill={C.tr}>= 1 - 1 = 0</text>
                <circle cx={215} cy={100} r={8} fill={`${C.tr}20`} stroke={C.tr} strokeWidth={0.8} />
                <text x={215} y={104} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.tr}>OK</text>

                {/* T2 check */}
                <rect x={250} y={80} width={220} height={40} rx={6} fill={`${C.t}08`} stroke="var(--border)" strokeWidth={0.4} />
                <text x={260} y={96} fontSize={8.5} fill={C.t}>T₂(omega^0) = b(omega^1) - a(omega^0) - b(omega^0)</text>
                <text x={260} y={110} fontSize={8.5} fill={C.tr}>= 2 - 1 - 1 = 0</text>
                <circle cx={455} cy={100} r={8} fill={`${C.tr}20`} stroke={C.tr} strokeWidth={0.8} />
                <text x={455} y={104} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.tr}>OK</text>
              </motion.g>

              {/* Domain points */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
                <text x={245} y={142} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  omega^0, omega^1, ..., omega^(n-2) 모든 점에서 T(x) = 0 필요
                </text>
                {/* domain dots */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.circle key={i} cx={100 + i * 40} cy={160} r={4}
                    fill={i < 3 ? C.tr : `${C.tr}30`} stroke={C.tr} strokeWidth={0.6}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ ...sp, delay: 0.35 + i * 0.04 }} />
                ))}
                {Array.from({ length: 8 }).map((_, i) => (
                  <text key={`l${i}`} x={100 + i * 40} y={175} textAnchor="middle" fontSize={7} fill={C.tr}>
                    omega^{i}
                  </text>
                ))}
              </motion.g>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Constraint combination */}
              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.05 }}>
                {['T₁', 'T₂', 'B₁', 'B₂', 'B₃'].map((name, i) => (
                  <g key={i}>
                    <DataBox x={15 + i * 60} y={8} w={52} h={26} label={name} color={i < 2 ? C.tr : C.bd} />
                    <Arrow x1={41 + i * 60} y1={34} x2={41 + i * 60} y2={48} color={C.q} />
                  </g>
                ))}
                <text x={340} y={25} fontSize={8} fill="var(--muted-foreground)">alpha_i 랜덤 계수</text>
              </motion.g>

              {/* C(x) combined */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.15 }}>
                <ActionBox x={60} y={52} w={200} h={36} label="C(x) = Sum alpha_i * constraint_i" color={C.q} />
              </motion.g>

              {/* Division by Z_H */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.25 }}>
                <Arrow x1={160} y1={88} x2={160} y2={106} color={C.q} />
                <AlertBox x={280} y={56} w={130} h={32} label="Z_H(x) = x^n - 1" sub="vanishing poly" color={C.q} />
                <Arrow x1={280} y1={72} x2={265} y2={72} color={C.q} />
                <text x={272} y={82} textAnchor="middle" fontSize={7.5} fill={C.q}>나누기</text>
              </motion.g>

              {/* Q(x) result */}
              <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.35 }}>
                <ModuleBox x={90} y={110} w={140} h={40} label="Q(x) = C(x) / Z_H(x)" sub="몫 다항식" color={C.q} />
              </motion.g>

              {/* Equivalence */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.45 }}>
                <Arrow x1={230} y1={130} x2={280} y2={130} color={C.q} />
                <rect x={285} y={115} width={180} height={36} rx={6} fill={`${C.q}10`} stroke={C.q} strokeWidth={0.6} />
                <text x={375} y={130} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.q}>
                  Q가 다항식
                </text>
                <text x={375} y={143} textAnchor="middle" fontSize={8} fill={C.q}>
                  = 모든 제약 만족 → FRI로 검증
                </text>
              </motion.g>

              {/* Bottom note */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <text x={245} y={170} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  deg(Q) ≤ max_constraint_deg - |H|
                </text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
