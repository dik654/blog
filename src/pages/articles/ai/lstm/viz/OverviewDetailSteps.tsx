import { motion } from 'framer-motion';
import { RNN_C, LSTM_C } from './OverviewDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const WARN_C = '#f59e0b';

/* Step 0: Vanishing gradient — repeated multiplication shrinks gradients */
export function Step0() {
  const lambdas = [1.0, 0.8, 0.64, 0.51, 0.41, 0.33, 0.26, 0.21];
  const maxH = 80;
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fill="#999">
        ∂hₜ/∂hₖ = ∏ Wₕₕ · diag(tanh'(…)) — 반복 곱셈
      </text>
      {lambdas.map((v, i) => {
        const bx = 30 + i * 55;
        const h = v * maxH;
        return (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ ...sp, delay: i * 0.08 }}>
            <rect x={bx} y={36 + maxH - h} width={36} height={h} rx={4}
              fill={RNN_C + '20'} stroke={RNN_C} strokeWidth={1} />
            <text x={bx + 18} y={34 + maxH - h} textAnchor="middle"
              fontSize={8} fill={RNN_C} fontWeight={600}>{v.toFixed(2)}</text>
            <text x={bx + 18} y={maxH + 48} textAnchor="middle"
              fontSize={8} fill="#999">t-{i}</text>
          </motion.g>
        );
      })}
      <motion.text x={240} y={145} textAnchor="middle" fontSize={9} fill={RNN_C}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        |λ|=0.8 → 7단계 뒤 기울기 0.21 (79% 소실)
      </motion.text>
    </g>
  );
}

/* Step 1: Exploding gradient — gradient clipping */
export function Step1() {
  const vals = [1.0, 2.5, 6.25, 15.6, 39.0];
  const clipped = [1.0, 2.5, 5.0, 5.0, 5.0];
  const maxH = 60;
  const scale = maxH / 39;
  const clipScale = maxH / 5;
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fill="#999">
        |λ| &gt; 1 → 기울기 폭발 | Gradient Clipping으로 완화
      </text>
      {/* Exploding bars */}
      {vals.map((v, i) => {
        const bx = 35 + i * 48;
        const h = Math.min(v * scale, maxH);
        return (
          <motion.g key={`e${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ ...sp, delay: i * 0.1 }}>
            <rect x={bx} y={40 + maxH - h} width={30} height={h} rx={3}
              fill={RNN_C + '25'} stroke={RNN_C} strokeWidth={1} />
            <text x={bx + 15} y={38 + maxH - h} textAnchor="middle"
              fontSize={8} fill={RNN_C} fontWeight={600}>{v.toFixed(1)}</text>
          </motion.g>
        );
      })}
      <text x={145} y={115} textAnchor="middle" fontSize={9} fill={RNN_C}>폭발 (clipping 없음)</text>
      {/* Clipped bars */}
      {clipped.map((v, i) => {
        const bx = 275 + i * 42;
        const h = v * (maxH / 5);
        return (
          <motion.g key={`c${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ ...sp, delay: 0.5 + i * 0.1 }}>
            <rect x={bx} y={40 + maxH - h} width={30} height={h} rx={3}
              fill={LSTM_C + '25'} stroke={LSTM_C} strokeWidth={1} />
            <text x={bx + 15} y={38 + maxH - h} textAnchor="middle"
              fontSize={8} fill={LSTM_C} fontWeight={600}>{v.toFixed(1)}</text>
          </motion.g>
        );
      })}
      <text x={370} y={115} textAnchor="middle" fontSize={9} fill={LSTM_C}>clipping θ=5</text>
      {/* Clip line */}
      <motion.line x1={275} y1={40 + maxH - 5 * (maxH / 5)} x2={445} y2={40 + maxH - 5 * (maxH / 5)}
        stroke={WARN_C} strokeWidth={1} strokeDasharray="4 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }} />
      <motion.text x={460} y={43} fontSize={8} fill={WARN_C}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        θ=5
      </motion.text>
      <motion.text x={240} y={140} textAnchor="middle" fontSize={9} fill="#666"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
        폭발은 clipping으로 완화 가능 — 소실은 구조적 변경 필요
      </motion.text>
    </g>
  );
}

/* Step 2: LSTM additive path vs RNN multiplicative */
export function Step2() {
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fill="#999">
        RNN 곱셈 경로 vs LSTM 덧셈 경로
      </text>
      {/* RNN row */}
      <text x={15} y={55} fontSize={9} fill={RNN_C} fontWeight={600}>RNN</text>
      {['hₜ₋₃', 'hₜ₋₂', 'hₜ₋₁', 'hₜ'].map((lbl, i) => {
        const bx = 60 + i * 100;
        return (
          <motion.g key={`r${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ ...sp, delay: i * 0.12 }}>
            <rect x={bx} y={40} width={60} height={28} rx={6}
              fill={RNN_C + '12'} stroke={RNN_C} strokeWidth={1} />
            <text x={bx + 30} y={58} textAnchor="middle" fontSize={10} fill={RNN_C}>{lbl}</text>
            {i < 3 && (
              <g>
                <line x1={bx + 60} y1={54} x2={bx + 100} y2={54}
                  stroke={RNN_C} strokeWidth={1} markerEnd="url(#arrR)" />
                <text x={bx + 80} y={48} textAnchor="middle" fontSize={8} fill={RNN_C}>×W</text>
              </g>
            )}
          </motion.g>
        );
      })}
      {/* LSTM row */}
      <text x={15} y={115} fontSize={9} fill={LSTM_C} fontWeight={600}>LSTM</text>
      {['Cₜ₋₃', 'Cₜ₋₂', 'Cₜ₋₁', 'Cₜ'].map((lbl, i) => {
        const bx = 60 + i * 100;
        return (
          <motion.g key={`l${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ ...sp, delay: 0.5 + i * 0.12 }}>
            <rect x={bx} y={100} width={60} height={28} rx={6}
              fill={LSTM_C + '12'} stroke={LSTM_C} strokeWidth={1} />
            <text x={bx + 30} y={118} textAnchor="middle" fontSize={10} fill={LSTM_C}>{lbl}</text>
            {i < 3 && (
              <g>
                <line x1={bx + 60} y1={114} x2={bx + 100} y2={114}
                  stroke={LSTM_C} strokeWidth={1} markerEnd="url(#arrL)" />
                <text x={bx + 80} y={108} textAnchor="middle" fontSize={8} fill={LSTM_C}>+new</text>
              </g>
            )}
          </motion.g>
        );
      })}
      <motion.text x={240} y={148} textAnchor="middle" fontSize={9} fill={LSTM_C}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
        덧셈 → ∂Cₜ/∂Cₜ₋₁ = fₜ ≈ 1 — 기울기가 거의 그대로 전달
      </motion.text>
      <defs>
        <marker id="arrR" markerWidth={6} markerHeight={4} refX={6} refY={2} orient="auto">
          <path d="M0,0 L6,2 L0,4" fill={RNN_C} />
        </marker>
        <marker id="arrL" markerWidth={6} markerHeight={4} refX={6} refY={2} orient="auto">
          <path d="M0,0 L6,2 L0,4" fill={LSTM_C} />
        </marker>
      </defs>
    </g>
  );
}

/* Step 3: LSTM timeline — past to present */
export function Step3() {
  const events = [
    { year: '1997', label: 'LSTM', color: LSTM_C },
    { year: '2014', label: 'Seq2Seq', color: '#6366f1' },
    { year: '2017', label: 'Transformer', color: WARN_C },
    { year: '2023', label: 'Mamba/RWKV', color: '#8b5cf6' },
  ];
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fill="#999">
        LSTM의 위상 변화
      </text>
      {/* Timeline line */}
      <line x1={40} y1={60} x2={440} y2={60} stroke="#888" strokeWidth={1.5} />
      {events.map((e, i) => {
        const x = 70 + i * 110;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.2 }}>
            <circle cx={x} cy={60} r={5} fill={e.color} />
            <text x={x} y={50} textAnchor="middle" fontSize={9} fill={e.color} fontWeight={600}>
              {e.year}
            </text>
            <text x={x} y={78} textAnchor="middle" fontSize={9} fill={e.color}>
              {e.label}
            </text>
          </motion.g>
        );
      })}
      {/* Current usage areas */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        <rect x={60} y={95} width={360} height={50} rx={6}
          fill={LSTM_C + '08'} stroke={LSTM_C} strokeWidth={0.8} />
        <text x={240} y={112} textAnchor="middle" fontSize={9} fill={LSTM_C} fontWeight={600}>
          LSTM 여전히 유효한 영역
        </text>
        <text x={240} y={128} textAnchor="middle" fontSize={8} fill="#666">
          시계열 예측 | 강화학습 | 임베디드/모바일 | 음성 인식
        </text>
        <text x={240} y={140} textAnchor="middle" fontSize={8} fill="#666">
          Mamba·RWKV — 게이트/선형 RNN 아이디어 계승
        </text>
      </motion.g>
    </g>
  );
}
