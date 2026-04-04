import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { coef: '#6366f1', eval: '#10b981', mul: '#f59e0b' };

const STEPS = [
  { label: '왜 NTT가 필요한가?', body: '다항식 곱셈은 ZKP 증명 생성의 핵심 연산이다.\n계수끼리 직접 곱하면 O(n²). n이 2²⁰ 이상이면 현실적으로 불가능.\nNTT를 쓰면 O(n log n)으로 줄어든다.' },
  { label: '계수 표현에서 곱셈 = O(n²)', body: 'f = [1, 2, 3], g = [4, 5]일 때 f·g를 구하려면\n각 계수 쌍을 모두 곱하고 합산 → n² 번 연산.\n(1·4, 1·5+2·4, 2·5+3·4, 3·5) = [4, 13, 22, 15]' },
  { label: '평가 표현에서 곱셈 = O(n)', body: '같은 x값에서 평가한 f(x)·g(x)를 곱하면 끝.\nf(1)=6, g(1)=9 → (f·g)(1)=54.\n점마다 곱셈 1번 → n번이면 충분.' },
  { label: 'NTT → 점별 곱 → INTT', body: '① NTT: 계수 → 평가 O(n log n)\n② 점별 곱: O(n)\n③ INTT: 평가 → 계수 O(n log n)\n총 O(n log n). 직접 곱셈 대비 수만 배 빠름.' },
];

export default function NTTConceptViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: problem statement */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={30} y={20} width={180} height={36} rx={5}
                fill={`${C.coef}10`} stroke={C.coef} strokeWidth={0.8} />
              <text x={120} y={42} textAnchor="middle" fontSize={10} fontWeight={500} fill={C.coef}>
                계수 곱셈: O(n²)
              </text>
              <text x={240} y={42} fontSize={11} fill="var(--muted-foreground)">→</text>
              <rect x={260} y={20} width={180} height={36} rx={5}
                fill={`${C.eval}10`} stroke={C.eval} strokeWidth={0.8} />
              <text x={350} y={42} textAnchor="middle" fontSize={10} fontWeight={500} fill={C.eval}>
                NTT 활용: O(n log n)
              </text>
              <text x={230} y={90} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                n = 2²⁰ (≈100만)일 때: 10¹² → 2천만 연산
              </text>
            </motion.g>
          )}
          {/* Step 1: coefficient multiplication */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={30} y={25} fontSize={10} fontWeight={500} fill={C.coef}>f = [1, 2, 3]</text>
              <text x={200} y={25} fontSize={10} fontWeight={500} fill={C.coef}>g = [4, 5]</text>
              <text x={30} y={50} fontSize={9} fill="var(--muted-foreground)">
                1·4=4,  1·5+2·4=13,  2·5+3·4=22,  3·5=15
              </text>
              <rect x={30} y={60} width={250} height={26} rx={4}
                fill={`${C.coef}12`} stroke={C.coef} strokeWidth={0.8} />
              <text x={155} y={78} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.coef}>
                f·g = [4, 13, 22, 15]  — O(n²) 연산
              </text>
            </motion.g>
          )}
          {/* Step 2: evaluation multiplication */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { x: 1, fv: 6, gv: 9, r: 54 },
                { x: 2, fv: 17, gv: 14, r: 238 },
                { x: 3, fv: 34, gv: 19, r: 646 },
              ].map((p, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}>
                  <text x={30 + i * 150} y={30} fontSize={9} fill={C.eval}>
                    x={p.x}: f={p.fv}, g={p.gv}
                  </text>
                  <text x={30 + i * 150} y={48} fontSize={10} fontWeight={500} fill={C.eval}>
                    → {p.fv}×{p.gv} = {p.r}
                  </text>
                </motion.g>
              ))}
              <rect x={30} y={65} width={300} height={26} rx={4}
                fill={`${C.eval}12`} stroke={C.eval} strokeWidth={0.8} />
              <text x={180} y={82} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.eval}>
                점마다 곱셈 1번 → O(n)
              </text>
            </motion.g>
          )}
          {/* Step 3: pipeline */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { x: 15, t: '① NTT', sub: 'O(n log n)', c: C.coef },
                { x: 170, t: '② 점별 곱', sub: 'O(n)', c: C.mul },
                { x: 325, t: '③ INTT', sub: 'O(n log n)', c: C.coef },
              ].map((s, i) => (
                <g key={i}>
                  {i > 0 && (
                    <>
                      <line x1={s.x - 18} y1={40} x2={s.x - 4} y2={40}
                        stroke="var(--muted-foreground)" strokeWidth={0.8} />
                      <polygon points={`${s.x - 4},37 ${s.x},40 ${s.x - 4},43`}
                        fill="var(--muted-foreground)" />
                    </>
                  )}
                  <rect x={s.x} y={22} width={130} height={36} rx={5}
                    fill={`${s.c}12`} stroke={s.c} strokeWidth={0.8} />
                  <text x={s.x + 65} y={40} textAnchor="middle" fontSize={10} fontWeight={500} fill={s.c}>
                    {s.t}
                  </text>
                  <text x={s.x + 65} y={52} textAnchor="middle" fontSize={9} fill={s.c} opacity={0.7}>
                    {s.sub}
                  </text>
                </g>
              ))}
              <text x={230} y={85} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.mul}>
                총 O(n log n) — 직접 곱셈 O(n²) 대비 수만 배 빠름
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
