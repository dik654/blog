import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { a: '#6366f1', b: '#10b981', c: '#f59e0b' };

const STEPS = [
  { label: 'F₇ (체) vs F₇* (군)', body: 'F₇*는 0을 제외한 곱셈군(6개). 0은 곱셈 역원이 없어 제외.' },
  { label: '순환군 — g=3 반복 곱셈', body: '3의 거듭제곱이 {1~6} 전부 순회 → 순환군. g=3이 생성원.' },
  { label: 'Fermat 소정리', body: '어떤 원소든 p-1번 곱하면 1로 복귀 — aᵖ⁻¹ ≡ 1 (mod p).' },
  { label: '역원 = 거듭제곱', body: 'aᵖ⁻² = a⁻¹ — 나눗셈을 거듭제곱(mod 연산)으로 변환.' },
];

const CW = 38, EY = 14;
const ex = (v: number) => 30 + v * CW;
const Sup = ({ children }: { children: string }) => (
  <tspan baselineShift="super" fontSize="75%">{children}</tspan>
);

export default function MultiplicativeGroupViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 175" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {[0, 1, 2, 3, 4, 5, 6].map(v => {
            const dimmed = v === 0 && step !== 2;
            const hl = step === 1 ? v > 0 : step === 2 ? v > 0 : step === 3 ? (v === 3 || v === 5) : v > 0;
            const col = step <= 1 ? (step === 1 ? C.c : C.a) : C.b;
            return (
              <motion.g key={v} animate={{ opacity: dimmed ? 0.2 : 1 }}>
                <rect x={ex(v)} y={EY} width={CW - 4} height={26} rx={5}
                  fill={hl ? `${col}20` : `${C.a}08`} stroke={hl ? col : C.a}
                  strokeWidth={hl ? 1.5 : 0.5} />
                <text x={ex(v) + (CW - 4) / 2} y={EY + 17} textAnchor="middle"
                  fontSize={11} fontWeight={hl ? 600 : 400} fill={hl ? col : C.a}>{v}</text>
              </motion.g>
            );
          })}

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1={ex(1)} y1={EY + 32} x2={ex(7) - 8} y2={EY + 32}
                stroke={C.a} strokeWidth={0.8} />
              <text x={(ex(1) + ex(7) - 8) / 2} y={EY + 46} textAnchor="middle"
                fontSize={9} fontWeight={500} fill={C.a}>F₇* = 곱셈군 (6개)</text>
              <rect x={40} y={EY + 56} width={300} height={40} rx={5}
                fill={`${C.a}08`} stroke={C.a} strokeWidth={0.6} />
              <text x={50} y={EY + 72} fontSize={10} fill="var(--muted-foreground)">
                0 × ? = 1 불가 → 곱셈 역원 없음
              </text>
              <text x={50} y={EY + 88} fontSize={10} fill="var(--muted-foreground)">
                군은 모든 원소에 역원 요구 → 0 제외해야 군
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {['3¹=3', '3²=2', '3³=6', '3⁴=4', '3⁵=5', '3⁶=1'].map((s, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}>
                  {i > 0 && <text x={22 + i * 72 - 7} y={EY + 66} fontSize={10} fill={C.c} textAnchor="middle">→</text>}
                  <rect x={22 + i * 72} y={EY + 50} width={58} height={24} rx={4}
                    fill={`${C.c}15`} stroke={C.c} strokeWidth={0.8} />
                  <text x={22 + i * 72 + 29} y={EY + 66} textAnchor="middle"
                    fontSize={10} fontWeight={500} fill={C.c}>{s}</text>
                </motion.g>
              ))}
              <motion.text x={230} y={EY + 100} textAnchor="middle" fontSize={10}
                fill={C.c} fontWeight={500}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                {'{'}1,2,3,4,5,6{'}'} 전부 순회 → 순환군
              </motion.text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={60} y={EY + 48} fontSize={9} fontWeight={500} fill={C.b}>공식</text>
              <rect x={60} y={EY + 52} width={340} height={26} rx={5}
                fill={`${C.b}10`} stroke={C.b} strokeWidth={0.8} />
              <text x={230} y={EY + 69} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.b}>
                a<Sup>p−1</Sup> ≡ 1 (mod p)
              </text>
              <text x={20} y={EY + 92} fontSize={9} fontWeight={500} fill={C.b}>예시 (F₇, p=7)</text>
              {[
                { eq: '3⁶ = 729 mod 7 = 1 ✓', d: 0.3 },
                { eq: '2⁶ = 64 mod 7 = 1 ✓', d: 0.5 },
                { eq: '5⁶ = 15625 mod 7 = 1 ✓', d: 0.7 },
              ].map((e, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: e.d }}>
                  <rect x={20 + i * 148} y={EY + 96} width={140} height={22} rx={4}
                    fill={`${C.b}08`} stroke={C.b} strokeWidth={0.5} />
                  <text x={20 + i * 148 + 70} y={EY + 111} textAnchor="middle" fontSize={9} fill={C.b}>{e.eq}</text>
                </motion.g>
              ))}
            </motion.g>
          )}

          {step === 3 && (() => {
            const bx = [40, 180, 320], bw = 110;
            return (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 공식 */}
              <text x={20} y={EY + 48} fontSize={9} fontWeight={500} fill={C.b}>공식</text>
              <rect x={20} y={EY + 52} width={420} height={22} rx={4}
                fill={`${C.b}10`} stroke={C.b} strokeWidth={0.8} />
              <text x={230} y={EY + 67} textAnchor="middle" fontSize={10} fontWeight={500} fill={C.b}>
                a<Sup>p−1</Sup> = 1 → ÷a → a<Sup>p−2</Sup> = a⁻¹
              </text>
              {/* 변환 흐름 */}
              <text x={20} y={EY + 88} fontSize={9} fontWeight={500} fill={C.b}>변환 흐름</text>
              {[
                { text: '나눗셈', i: 0 },
                { text: '거듭제곱', i: 1 },
                { text: 'mod 연산', i: 2 },
              ].map(s => (
                <g key={s.i}>
                  {s.i > 0 && <text x={bx[s.i] - 16} y={EY + 106} fontSize={10} fill={C.b} textAnchor="middle">→</text>}
                  <rect x={bx[s.i]} y={EY + 92} width={bw} height={24} rx={4}
                    fill={`${C.b}10`} stroke={C.b} strokeWidth={0.8} />
                  <text x={bx[s.i] + bw / 2} y={EY + 108} textAnchor="middle" fontSize={10} fontWeight={500} fill={C.b}>{s.text}</text>
                </g>
              ))}
              {/* 예시 — 각 변환 아래 대응 */}
              <text x={20} y={EY + 130} fontSize={9} fontWeight={500} fill={C.b}>예시 (F₇, a=3)</text>
              {[
                { text: '3⁻¹', i: 0, d: 0.3 },
                { text: '3⁵ = 243', i: 1, d: 0.5 },
                { text: '243 mod 7 = 5 ✓', i: 2, d: 0.7 },
              ].map(e => (
                <motion.g key={e.i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: e.d }}>
                  {e.i > 0 && <text x={bx[e.i] - 16} y={EY + 148} fontSize={10} fill={C.b} textAnchor="middle">→</text>}
                  <rect x={bx[e.i]} y={EY + 134} width={bw} height={22} rx={4}
                    fill={`${C.b}08`} stroke={C.b} strokeWidth={0.5} />
                  <text x={bx[e.i] + bw / 2} y={EY + 149} textAnchor="middle" fontSize={9} fill={C.b}>{e.text}</text>
                </motion.g>
              ))}
            </motion.g>);
          })()}
        </svg>
      )}
    </StepViz>
  );
}
