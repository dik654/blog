import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import CompressionStep0 from './CompressionStep0';
import CompressionStep1 from './CompressionStep1';
import CompressionStep2 from './CompressionStep2';
import CompressionStepExpand from './CompressionStepExpand';

const C = '#6366f1', C2 = '#10b981', C3 = '#f59e0b', C4 = '#ec4899';

const STEPS = [
  { label: '전체 흐름', body: '압축함수 f는 이전 해시 + 메시지 블록을 받아 64번 섞은 뒤 새 해시를 출력한다.' },
  { label: '입력 준비', body: '이전 해시 → 8개 변수 a~h. 메시지 → 확장 → 64개 워드.' },
  { label: '워드 확장', body: '원본 16워드에서 σ₀·σ₁ 비트 회전 혼합으로 48개 추가 생성.' },
  { label: '라운드 내부', body: 'a~h + Wₜ + Kₜ → T₁·T₂ 경로 혼합. a\'와 e\' 갱신, 나머지 시프트.' },
  { label: '64회 반복', body: '같은 라운드 구조를 64번 반복한다. 매번 다른 Wₜ와 Kₜ가 주입된다.\n위 "라운드 내부" 동작이 64번 연쇄 적용되는 것.' },
  { label: '최종 덧셈', body: '64라운드 후 결과를 원래 입력에 더해서 이 블록의 출력 hᵢ를 만든다.' },
];

const W = 960;
const VW = 64, VH = 38, VX = 8;
const TOTAL_W = 8 * (VW + VX) - VX;
const X0 = (W - TOTAL_W) / 2;
const CX = W / 2;

function VarRow({ y, labels, color }: { y: number; labels: string[]; color: string }) {
  return (
    <g>
      {labels.map((l, i) => (
        <g key={i}>
          <rect x={X0 + i * (VW + VX)} y={y} width={VW} height={VH} rx={5}
            fill={`${color}12`} stroke={color} strokeWidth={0.8} />
          <text x={X0 + i * (VW + VX) + VW / 2} y={y + VH / 2 + 5}
            textAnchor="middle" fontSize={l.length > 4 ? 11 : 15} fontWeight={600} fill={color}>{l}</text>
        </g>
      ))}
    </g>
  );
}

export default function CompressionFnViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} 480`} className="w-full" style={{ height: 'auto' }}>
          {step === 0 && <CompressionStep0 />}
          {step === 1 && <CompressionStep1 />}
          {step === 2 && <CompressionStepExpand />}
          {step === 3 && <CompressionStep2 />}

          {/* Step 4: 64 rounds stacked */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { idx: 0, label: '초기', labels: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], color: C },
                { idx: 1, label: 'R1 후', labels: ["a'", 'a', 'b', 'c', "e'", 'e', 'f', 'g'], color: C2, w: 0 },
                { idx: 2, label: 'R2 후', labels: ["a''", "a'", 'a', 'b', "e''", "e'", 'e', 'f'], color: C2, w: 1 },
                { idx: 4, label: 'R64 후', labels: ['a₆₄', 'a₆₃', 'a₆₂', 'a₆₁', 'e₆₄', 'e₆₃', 'e₆₂', 'e₆₁'], color: C4 },
              ].map(({ idx, label, labels, color, w }) => {
                const y = idx <= 2 ? 20 + idx * 72 : 20 + 3.8 * 72;
                return (
                  <g key={idx}>
                    <text x={X0 - 12} y={y + VH / 2 + 5} fontSize={14} textAnchor="end"
                      fontWeight={500} fill="var(--muted-foreground)">{label}</text>
                    <VarRow y={y} labels={labels} color={color} />
                    {w !== undefined && (<>
                      <text x={X0 + TOTAL_W + 12} y={y + VH / 2} fontSize={14} fill={C3}>
                        +W{w} +K{w}
                      </text>
                      <text x={X0 + TOTAL_W + 12} y={y + VH / 2 + 16} fontSize={11} fill="var(--muted-foreground)">
                        (→ T₁에 주입)
                      </text>
                    </>)}
                  </g>
                );
              })}
              <text x={CX} y={20 + 2 * 72 + VH + 28} textAnchor="middle" fontSize={22}
                fill="var(--muted-foreground)">⋮</text>
              <text x={CX} y={20 + 3.8 * 72 + VH + 18} textAnchor="middle" fontSize={12}
                fill="var(--muted-foreground)">
                매 라운드마다 a와 e 자리에 새 값이 계산됨 — 64번 반복 후 모든 값이 완전히 변환
              </text>
            </motion.g>
          )}

          {/* Step 5: Final addition */}
          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={CX} y={30} textAnchor="middle" fontSize={15}
                fill="var(--muted-foreground)">64라운드 후 결과</text>
              <VarRow y={42} labels={['a₆₄', 'a₆₃', 'a₆₂', 'a₆₁', 'e₆₄', 'e₆₃', 'e₆₂', 'e₆₁']} color={C4} />
              <text x={CX} y={106} textAnchor="middle" fontSize={24} fontWeight={600} fill={C}>+</text>
              <text x={CX} y={132} textAnchor="middle" fontSize={15}
                fill="var(--muted-foreground)">원래 입력 h(i-1)</text>
              <VarRow y={144} labels={['a₀', 'b₀', 'c₀', 'd₀', 'e₀', 'f₀', 'g₀', 'h₀']} color={C} />
              <line x1={X0} y1={196} x2={X0 + TOTAL_W} y2={196}
                stroke="var(--border)" strokeWidth={1} />
              <text x={CX} y={222} textAnchor="middle" fontSize={15}
                fill="var(--muted-foreground)">
                이 블록의 출력 h
                <tspan baselineShift="sub" fontSize="75%">i</tspan>
                {' (= 다음 블록의 입력)'}
              </text>
              <VarRow y={238} labels={['a₀+a₆₄', 'b₀+a₆₃', '…', '…', '…', '…', '…', 'h₀+e₆₁']} color={C2} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
