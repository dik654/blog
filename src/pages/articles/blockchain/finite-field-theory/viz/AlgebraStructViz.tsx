import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: '대수 구조: 군 → 환 → 체', body: '공리를 추가할수록 강력해진다. 체가 가장 완성된 구조.' },
  { label: '군 — 하나의 연산 + 4개 공리', body: '닫힘, 결합법칙, 항등원, 역원.' },
  { label: '환 — 두 연산 + 분배법칙', body: '군의 공리 + 곱셈과 분배법칙. 예: 정수 Z.' },
  { label: '체 — 곱셈 역원까지 존재', body: '환 + 0 외 모든 원소에 곱셈 역원. ZKP의 핵심 무대.' },
];

const BX = 60, BW = 300, BH = 36, GAP = 8;
const by = (i: number) => 130 - i * (BH + GAP); // bottom-up

export default function AlgebraStructViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 175" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Stacked blocks: bottom = 군, middle = 환, top = 체 */}
          {[
            { label: '군 (Group)', sub: '닫힘 · 결합 · 항등원 · 역원', tag: '(G, ·)', color: C1, i: 0 },
            { label: '환 (Ring)', sub: '+ 두 번째 연산(·), 분배법칙', tag: '(R, +, ·)', color: C2, i: 1 },
            { label: '체 (Field)', sub: '+ 곱셈 역원 (0 제외)', tag: '(F, +, ·)', color: C3, i: 2 },
          ].map((s) => {
            const active = step === s.i + 1;
            const visible = step === 0 || step >= s.i + 1;
            const y = by(s.i);
            return (
              <motion.g key={s.label}
                animate={{ opacity: visible ? 1 : 0.15 }}
                transition={{ duration: 0.3 }}>
                <motion.rect x={BX} y={y} width={BW} height={BH} rx={6}
                  fill={`${s.color}${active ? '18' : '0a'}`}
                  stroke={s.color} strokeWidth={active ? 1.5 : 0.8} />
                <text x={BX + 12} y={y + 15} fontSize={10} fontWeight={600} fill={s.color}>
                  {s.label}
                </text>
                <text x={BX + 12} y={y + 29} fontSize={9} fill={s.color} opacity={0.7}>
                  {s.sub}
                </text>
                <text x={BX + BW - 10} y={y + 22} textAnchor="end" fontSize={9}
                  fill="var(--muted-foreground)">{s.tag}</text>
              </motion.g>
            );
          })}

          {/* 화살표: 아래에서 위로 쌓아감 */}
          <text x={BX + BW + 14} y={by(0) + BH / 2 + 4} fontSize={9}
            fill="var(--muted-foreground)">기반</text>
          {[0, 1].map(i => (
            <g key={i}>
              <line x1={BX + BW + 20} y1={by(i) - 2} x2={BX + BW + 20} y2={by(i + 1) + BH + 2}
                stroke="var(--muted-foreground)" strokeWidth={0.6} />
              <polygon points={`${BX + BW + 17},${by(i)} ${BX + BW + 20},${by(i) - 4} ${BX + BW + 23},${by(i)}`}
                fill="var(--muted-foreground)" />
            </g>
          ))}
          <text x={BX + BW + 14} y={by(2) + BH / 2 + 4} fontSize={9}
            fill={C3} fontWeight={500}>완성</text>
        </svg>
      )}
    </StepViz>
  );
}
