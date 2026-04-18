import { motion } from 'framer-motion';
import { CELL_C, RNN_C, LSTM_C, OUTPUT_C } from './CellDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const FORGET_C = '#ef4444';
const INPUT_C = '#10b981';

/* Step 0: Cell state update — two-phase: delete + add */
export function Step0() {
  /* 예시 상황: "그녀는 파리에서" → "그는 런던에서"
     셀 상태의 각 차원이 특정 정보를 담고 있다고 가정 */
  const dims = [
    { name: '주어 성별', prev: 0.9, f: 0.1, add: 0.85, note: '"그녀"→"그" 교체' },
    { name: '도시 정보', prev: 0.8, f: 0.15, add: 0.7, note: '"파리"→"런던" 교체' },
    { name: '언어(한국어)', prev: 0.7, f: 0.95, add: 0.02, note: '유지 — 언어는 안 바뀜' },
    { name: '시제(과거)', prev: 0.6, f: 0.9, add: 0.05, note: '유지 — 시제도 유지' },
  ];

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        예시: "그녀는 파리에서" 다음에 "그는 런던에서" 입력 시 셀 상태 변화
      </text>

      {/* 헤더 */}
      <text x={15} y={30} fontSize={8} fontWeight={600} fill="var(--foreground)">차원</text>
      <text x={105} y={30} fontSize={8} fontWeight={600} fill={CELL_C}>이전 Cₜ₋₁</text>
      <text x={195} y={30} fontSize={8} fontWeight={600} fill={FORGET_C}>× fₜ (삭제)</text>
      <text x={290} y={30} fontSize={8} fontWeight={600} fill={INPUT_C}>+ iₜC̃ₜ (추가)</text>
      <text x={385} y={30} fontSize={8} fontWeight={600} fill="var(--foreground)">결과</text>

      {dims.map((d, i) => {
        const y = 40 + i * 28;
        const afterF = +(d.prev * d.f).toFixed(2);
        const result = +(afterF + d.add).toFixed(2);
        const isReplaced = d.f < 0.5;

        return (
          <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.1 }}>
            {/* 차원 이름 */}
            <text x={15} y={y + 12} fontSize={8} fill="var(--foreground)">{d.name}</text>

            {/* 이전 값 */}
            <rect x={105} y={y} width={d.prev * 60} height={16} rx={3}
              fill={CELL_C + '25'} stroke={CELL_C} strokeWidth={0.6} />
            <text x={105 + d.prev * 60 + 4} y={y + 12} fontSize={7} fill={CELL_C}>{d.prev}</text>

            {/* forget 결과 */}
            <rect x={195} y={y} width={afterF * 60} height={16} rx={3}
              fill={isReplaced ? FORGET_C + '30' : CELL_C + '20'}
              stroke={isReplaced ? FORGET_C : CELL_C} strokeWidth={0.8} />
            <text x={195 + Math.max(afterF * 60, 8) + 4} y={y + 12} fontSize={7}
              fill={isReplaced ? FORGET_C : '#999'}>{afterF}</text>

            {/* 추가 결과 */}
            <rect x={290} y={y} width={result * 50} height={16} rx={3}
              fill={d.add > 0.3 ? INPUT_C + '25' : CELL_C + '15'}
              stroke={d.add > 0.3 ? INPUT_C : CELL_C} strokeWidth={0.8} />
            <text x={290 + result * 50 + 4} y={y + 12} fontSize={7}
              fill={d.add > 0.3 ? INPUT_C : '#999'}>{result}</text>

            {/* 설명 */}
            <text x={385} y={y + 12} fontSize={7}
              fill={isReplaced ? FORGET_C : '#999'}>{d.note}</text>
          </motion.g>
        );
      })}

      {/* 핵심 인사이트 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={10} y={156} width={460} height={28} rx={5}
          fill={CELL_C + '08'} stroke={CELL_C} strokeWidth={0.6} />
        <text x={240} y={168} textAnchor="middle" fontSize={8} fill={CELL_C} fontWeight={600}>
          fₜ ≈ 0 → 삭제 (새 주어/도시), fₜ ≈ 1 → 보존 (언어/시제). 차원별로 독립 결정.
        </text>
        <text x={240} y={180} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          왜 덧셈? — 곱셈만 하면 기울기 소실. 덧셈 경로(+iₜC̃ₜ)가 gradient highway 역할.
        </text>
      </motion.g>
    </g>
  );
}

/* Step 1: RNN vs LSTM gradient comparison (numeric) */
export function Step1() {
  const rnnGrad = [1.0, 0.45, 0.20, 0.09, 0.04, 0.02];
  const lstmGrad = [1.0, 0.92, 0.85, 0.78, 0.72, 0.66];
  const barW = 28;
  const maxH = 40;

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fill="#999">
        기울기 크기 비교: t-0 → t-5
      </text>
      {/* RNN row */}
      <text x={18} y={48} fontSize={9} fill={RNN_C} fontWeight={600}>RNN</text>
      <text x={18} y={58} fontSize={7} fill={RNN_C}>×Wₕₕ</text>
      {rnnGrad.map((v, i) => {
        const bx = 60 + i * 68;
        const h = v * maxH;
        return (
          <motion.g key={`r${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ ...sp, delay: i * 0.08 }}>
            <rect x={bx} y={35 + maxH - h} width={barW} height={h} rx={3}
              fill={RNN_C + '20'} stroke={RNN_C} strokeWidth={0.8} />
            <text x={bx + barW / 2} y={33 + maxH - h} textAnchor="middle"
              fontSize={8} fill={RNN_C} fontWeight={600}>{v.toFixed(2)}</text>
          </motion.g>
        );
      })}
      {/* LSTM row */}
      <text x={18} y={105} fontSize={9} fill={LSTM_C} fontWeight={600}>LSTM</text>
      <text x={18} y={115} fontSize={7} fill={LSTM_C}>+셀</text>
      {lstmGrad.map((v, i) => {
        const bx = 60 + i * 68;
        const h = v * maxH;
        return (
          <motion.g key={`l${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ ...sp, delay: 0.5 + i * 0.08 }}>
            <rect x={bx} y={90 + maxH - h} width={barW} height={h} rx={3}
              fill={LSTM_C + '20'} stroke={LSTM_C} strokeWidth={0.8} />
            <text x={bx + barW / 2} y={88 + maxH - h} textAnchor="middle"
              fontSize={8} fill={LSTM_C} fontWeight={600}>{v.toFixed(2)}</text>
          </motion.g>
        );
      })}
      {/* Time labels */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <text key={i} x={60 + i * 68 + barW / 2} y={148} textAnchor="middle"
          fontSize={8} fill="#999">t-{i}</text>
      ))}
      <motion.text x={240} y={158} textAnchor="middle" fontSize={8} fill="#666"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        t-5: RNN 0.02 (98% 소실) vs LSTM 0.66 (34% 감소)
      </motion.text>
    </g>
  );
}

/* Step 2: Gradient highway — why addition preserves gradients */
export function Step2() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fill="#999">
        Gradient Highway — 덧셈의 미분 = 1
      </text>
      {/* Addition chain */}
      {['Cₜ₋₃', 'Cₜ₋₂', 'Cₜ₋₁', 'Cₜ'].map((lbl, i) => {
        const x = 50 + i * 110;
        return (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ ...sp, delay: i * 0.15 }}>
            <rect x={x} y={35} width={70} height={30} rx={6}
              fill={CELL_C + '15'} stroke={CELL_C} strokeWidth={1.2} />
            <text x={x + 35} y={54} textAnchor="middle" fontSize={10} fill={CELL_C} fontWeight={600}>
              {lbl}
            </text>
            {i < 3 && (
              <g>
                <line x1={x + 70} y1={50} x2={x + 110} y2={50}
                  stroke={LSTM_C} strokeWidth={1.5} markerEnd="url(#ghArr)" />
                <text x={x + 90} y={44} textAnchor="middle" fontSize={8} fill={LSTM_C} fontWeight={600}>
                  +
                </text>
              </g>
            )}
          </motion.g>
        );
      })}
      {/* Gradient arrow below */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <line x1={415} y1={80} x2={85} y2={80}
          stroke={CELL_C} strokeWidth={1.5} strokeDasharray="5 3" markerEnd="url(#ghArrR)" />
        <text x={240} y={76} textAnchor="middle" fontSize={8} fill={CELL_C} fontWeight={600}>
          ← 기울기 역전파 방향
        </text>
        <text x={240} y={96} textAnchor="middle" fontSize={8} fill={CELL_C}>
          ∂Cₜ/∂Cₜ₋₁ = fₜ ≈ 1 — 기울기 거의 그대로 전달
        </text>
      </motion.g>
      {/* ResNet comparison */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        <rect x={100} y={110} width={280} height={38} rx={5}
          fill={LSTM_C + '06'} stroke={LSTM_C} strokeWidth={0.6} strokeDasharray="4 3" />
        <text x={240} y={125} textAnchor="middle" fontSize={8} fill={LSTM_C} fontWeight={600}>
          같은 원리: ResNet skip connection
        </text>
        <text x={240} y={139} textAnchor="middle" fontSize={8} fill="#666">
          y = F(x) + x → ∂y/∂x = ∂F/∂x + 1 — 항상 1 이상 보장
        </text>
      </motion.g>
      <defs>
        <marker id="ghArr" markerWidth={6} markerHeight={4} refX={6} refY={2} orient="auto">
          <path d="M0,0 L6,2 L0,4" fill={LSTM_C} />
        </marker>
        <marker id="ghArrR" markerWidth={6} markerHeight={4} refX={0} refY={2} orient="auto">
          <path d="M6,0 L0,2 L6,4" fill={CELL_C} />
        </marker>
      </defs>
    </g>
  );
}

/* Step 3: Cell state vs hidden state — two memories */
export function Step3() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fill="#999">
        셀 상태(장기) vs 은닉 상태(단기) — 두 기억의 분리
      </text>
      {/* Cell state - top track */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0 }}>
        <rect x={40} y={30} width={400} height={36} rx={8}
          fill={CELL_C + '10'} stroke={CELL_C} strokeWidth={1.2} />
        <text x={240} y={46} textAnchor="middle" fontSize={10} fill={CELL_C} fontWeight={600}>
          Cₜ — 셀 상태 (장기 기억, 메모장)
        </text>
        <text x={240} y={60} textAnchor="middle" fontSize={8} fill={CELL_C}>
          수십~수백 단계 정보 보존 | 외부 미노출 | 직선 경로
        </text>
      </motion.g>
      {/* Output gate filter */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <line x1={240} y1={66} x2={240} y2={85} stroke={OUTPUT_C} strokeWidth={1.2} />
        <rect x={200} y={82} width={80} height={20} rx={8}
          fill={OUTPUT_C + '15'} stroke={OUTPUT_C} strokeWidth={1} />
        <text x={240} y={95} textAnchor="middle" fontSize={8} fill={OUTPUT_C}>
          oₜ ⊙ tanh(Cₜ)
        </text>
        <line x1={240} y1={102} x2={240} y2={112} stroke={OUTPUT_C} strokeWidth={1.2}
          markerEnd="url(#csArr)" />
      </motion.g>
      {/* Hidden state - bottom track */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={40} y={115} width={400} height={36} rx={8}
          fill={OUTPUT_C + '10'} stroke={OUTPUT_C} strokeWidth={1.2} />
        <text x={240} y={131} textAnchor="middle" fontSize={10} fill={OUTPUT_C} fontWeight={600}>
          hₜ — 은닉 상태 (단기 출력, 발표 자료)
        </text>
        <text x={240} y={145} textAnchor="middle" fontSize={8} fill={OUTPUT_C}>
          다음 레이어/예측에 전달 | 필터링된 버전 | 상황별 선별
        </text>
      </motion.g>
      <defs>
        <marker id="csArr" markerWidth={6} markerHeight={4} refX={6} refY={2} orient="auto">
          <path d="M0,0 L6,2 L0,4" fill={OUTPUT_C} />
        </marker>
      </defs>
    </g>
  );
}
