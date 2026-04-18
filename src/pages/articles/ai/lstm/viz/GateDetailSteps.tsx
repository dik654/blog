import { motion } from 'framer-motion';
import { FORGET_C, INPUT_C, OUTPUT_C, CELL_C } from './GateDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* Step 0: Forget gate flow diagram */
export function Step0() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fill="#999">
        Forget Gate: 이전 셀 상태 중 유지할 비율 결정
      </text>
      {/* Inputs */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0 }}>
        <rect x={20} y={35} width={70} height={26} rx={5}
          fill="#88888812" stroke="#888" strokeWidth={0.8} />
        <text x={55} y={52} textAnchor="middle" fontSize={9} fill="#666">hₜ₋₁</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={70} width={70} height={26} rx={5}
          fill="#88888812" stroke="#888" strokeWidth={0.8} />
        <text x={55} y={87} textAnchor="middle" fontSize={9} fill="#666">xₜ</text>
      </motion.g>
      {/* Concat */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
        <line x1={90} y1={48} x2={120} y2={62} stroke="#888" strokeWidth={0.8} />
        <line x1={90} y1={83} x2={120} y2={68} stroke="#888" strokeWidth={0.8} />
        <rect x={120} y={52} width={55} height={26} rx={5}
          fill={FORGET_C + '12'} stroke={FORGET_C} strokeWidth={1} />
        <text x={147} y={69} textAnchor="middle" fontSize={9} fill={FORGET_C}>[h, x]</text>
      </motion.g>
      {/* W_f multiply + sigmoid */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.35 }}>
        <line x1={175} y1={65} x2={210} y2={65} stroke={FORGET_C} strokeWidth={0.8}
          markerEnd="url(#fgArr)" />
        <rect x={210} y={48} width={70} height={32} rx={14}
          fill={FORGET_C + '15'} stroke={FORGET_C} strokeWidth={1.2} />
        <text x={245} y={62} textAnchor="middle" fontSize={9} fill={FORGET_C} fontWeight={600}>σ(W_f·+b_f)</text>
        <text x={245} y={74} textAnchor="middle" fontSize={8} fill={FORGET_C}>→ [0, 1]</text>
      </motion.g>
      {/* Output f_t */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <line x1={280} y1={65} x2={320} y2={65} stroke={FORGET_C} strokeWidth={0.8}
          markerEnd="url(#fgArr)" />
        <rect x={320} y={50} width={50} height={28} rx={6}
          fill={FORGET_C + '20'} stroke={FORGET_C} strokeWidth={1.5} />
        <text x={345} y={68} textAnchor="middle" fontSize={10} fill={FORGET_C} fontWeight={700}>fₜ</text>
      </motion.g>
      {/* Element-wise multiply with C_{t-1} */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.65 }}>
        <line x1={370} y1={64} x2={400} y2={64} stroke={CELL_C} strokeWidth={0.8}
          markerEnd="url(#fgArrC)" />
        <circle cx={410} cy={64} r={10} fill={CELL_C + '15'} stroke={CELL_C} strokeWidth={1} />
        <text x={410} y={68} textAnchor="middle" fontSize={12} fill={CELL_C}>⊙</text>
        <text x={445} y={55} textAnchor="middle" fontSize={8} fill={CELL_C}>Cₜ₋₁</text>
        <line x1={445} y1={58} x2={420} y2={62} stroke={CELL_C} strokeWidth={0.6} strokeDasharray="3 2" />
      </motion.g>
      {/* Bias init note */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <rect x={100} y={105} width={280} height={42} rx={5}
          fill={FORGET_C + '06'} stroke={FORGET_C} strokeWidth={0.6} strokeDasharray="4 3" />
        <text x={240} y={120} textAnchor="middle" fontSize={8} fill={FORGET_C} fontWeight={600}>
          b_f 초기화 = 1 (Jozefowicz 2015)
        </text>
        <text x={240} y={134} textAnchor="middle" fontSize={8} fill="#666">
          학습 초기: σ(…+1) → fₜ ≈ 0.73 — 기억하는 쪽으로 편향
        </text>
      </motion.g>
      <defs>
        <marker id="fgArr" markerWidth={6} markerHeight={4} refX={6} refY={2} orient="auto">
          <path d="M0,0 L6,2 L0,4" fill={FORGET_C} />
        </marker>
        <marker id="fgArrC" markerWidth={6} markerHeight={4} refX={6} refY={2} orient="auto">
          <path d="M0,0 L6,2 L0,4" fill={CELL_C} />
        </marker>
      </defs>
    </g>
  );
}

/* Step 1: Input gate + candidate */
export function Step1() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fill="#999">
        Input Gate: filter(σ) × content(tanh) 분리
      </text>
      {/* Input concat */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0 }}>
        <rect x={15} y={50} width={60} height={50} rx={5}
          fill="#88888810" stroke="#888" strokeWidth={0.8} />
        <text x={45} y={72} textAnchor="middle" fontSize={9} fill="#666">[hₜ₋₁,</text>
        <text x={45} y={86} textAnchor="middle" fontSize={9} fill="#666">xₜ]</text>
      </motion.g>
      {/* Two branches */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.15 }}>
        <line x1={75} y1={65} x2={115} y2={50} stroke={INPUT_C} strokeWidth={0.8} />
        <line x1={75} y1={85} x2={115} y2={100} stroke={INPUT_C} strokeWidth={0.8} />
      </motion.g>
      {/* Sigmoid branch - i_t */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.25 }}>
        <rect x={115} y={35} width={80} height={30} rx={12}
          fill={INPUT_C + '15'} stroke={INPUT_C} strokeWidth={1.2} />
        <text x={155} y={50} textAnchor="middle" fontSize={9} fill={INPUT_C} fontWeight={600}>σ(W_i·+b_i)</text>
        <text x={155} y={62} textAnchor="middle" fontSize={8} fill={INPUT_C}>→ iₜ [0,1]</text>
      </motion.g>
      {/* Tanh branch - C_tilde */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.35 }}>
        <rect x={115} y={85} width={80} height={30} rx={12}
          fill={CELL_C + '15'} stroke={CELL_C} strokeWidth={1.2} />
        <text x={155} y={100} textAnchor="middle" fontSize={9} fill={CELL_C} fontWeight={600}>tanh(W_c·+b_c)</text>
        <text x={155} y={112} textAnchor="middle" fontSize={8} fill={CELL_C}>→ C̃ₜ [-1,1]</text>
      </motion.g>
      {/* Merge - element-wise multiply */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <line x1={195} y1={50} x2={240} y2={72} stroke={INPUT_C} strokeWidth={0.8} />
        <line x1={195} y1={100} x2={240} y2={78} stroke={CELL_C} strokeWidth={0.8} />
        <circle cx={250} cy={75} r={12} fill={INPUT_C + '12'} stroke={INPUT_C} strokeWidth={1.2} />
        <text x={250} y={79} textAnchor="middle" fontSize={13} fill={INPUT_C}>⊙</text>
      </motion.g>
      {/* Result */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.65 }}>
        <line x1={262} y1={75} x2={300} y2={75} stroke={INPUT_C} strokeWidth={1}
          markerEnd="url(#igArr)" />
        <rect x={305} y={58} width={80} height={34} rx={6}
          fill={INPUT_C + '15'} stroke={INPUT_C} strokeWidth={1.5} />
        <text x={345} y={73} textAnchor="middle" fontSize={9} fill={INPUT_C} fontWeight={600}>iₜ ⊙ C̃ₜ</text>
        <text x={345} y={86} textAnchor="middle" fontSize={8} fill={INPUT_C}>셀에 추가될 양</text>
      </motion.g>
      {/* Annotation */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <rect x={310} y={105} width={155} height={40} rx={5}
          fill={INPUT_C + '06'} stroke={INPUT_C} strokeWidth={0.6} strokeDasharray="4 3" />
        <text x={387} y={120} textAnchor="middle" fontSize={8} fill={INPUT_C} fontWeight={600}>
          σ = "얼마나" (filter)
        </text>
        <text x={387} y={134} textAnchor="middle" fontSize={8} fill={CELL_C} fontWeight={600}>
          tanh = "무엇을" (content)
        </text>
      </motion.g>
      <defs>
        <marker id="igArr" markerWidth={6} markerHeight={4} refX={6} refY={2} orient="auto">
          <path d="M0,0 L6,2 L0,4" fill={INPUT_C} />
        </marker>
      </defs>
    </g>
  );
}

/* Step 2: Output gate — cell state → hidden state */
export function Step2() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fill="#999">
        Output Gate: 셀 상태 중 외부에 노출할 부분 선별
      </text>
      {/* Cell state Ct */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0 }}>
        <rect x={40} y={40} width={90} height={30} rx={6}
          fill={CELL_C + '15'} stroke={CELL_C} strokeWidth={1.2} />
        <text x={85} y={56} textAnchor="middle" fontSize={9} fill={CELL_C} fontWeight={600}>Cₜ (장기 기억)</text>
        <text x={85} y={68} textAnchor="middle" fontSize={8} fill={CELL_C}>전체 정보 보존</text>
      </motion.g>
      {/* tanh */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.15 }}>
        <line x1={130} y1={55} x2={160} y2={55} stroke={CELL_C} strokeWidth={0.8}
          markerEnd="url(#ogArrC)" />
        <rect x={160} y={42} width={55} height={26} rx={10}
          fill={CELL_C + '10'} stroke={CELL_C} strokeWidth={1} />
        <text x={187} y={59} textAnchor="middle" fontSize={9} fill={CELL_C}>tanh</text>
      </motion.g>
      {/* o_t gate */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <rect x={40} y={90} width={90} height={26} rx={5}
          fill={OUTPUT_C + '12'} stroke={OUTPUT_C} strokeWidth={1} />
        <text x={85} y={107} textAnchor="middle" fontSize={9} fill={OUTPUT_C}>oₜ = σ(W_o·+b_o)</text>
      </motion.g>
      {/* Element-wise multiply */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.45 }}>
        <line x1={215} y1={55} x2={260} y2={72} stroke={CELL_C} strokeWidth={0.8} />
        <line x1={130} y1={103} x2={260} y2={78} stroke={OUTPUT_C} strokeWidth={0.8} />
        <circle cx={270} cy={75} r={12} fill={OUTPUT_C + '12'} stroke={OUTPUT_C} strokeWidth={1.2} />
        <text x={270} y={79} textAnchor="middle" fontSize={13} fill={OUTPUT_C}>⊙</text>
      </motion.g>
      {/* h_t output */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <line x1={282} y1={75} x2={320} y2={75} stroke={OUTPUT_C} strokeWidth={1}
          markerEnd="url(#ogArr)" />
        <rect x={325} y={58} width={80} height={34} rx={6}
          fill={OUTPUT_C + '20'} stroke={OUTPUT_C} strokeWidth={1.5} />
        <text x={365} y={73} textAnchor="middle" fontSize={10} fill={OUTPUT_C} fontWeight={700}>hₜ</text>
        <text x={365} y={86} textAnchor="middle" fontSize={8} fill={OUTPUT_C}>단기 출력</text>
      </motion.g>
      {/* Split annotation */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <rect x={320} y={105} width={145} height={40} rx={5}
          fill={OUTPUT_C + '06'} stroke={OUTPUT_C} strokeWidth={0.6} strokeDasharray="4 3" />
        <text x={392} y={120} textAnchor="middle" fontSize={8} fill={CELL_C}>
          Cₜ = 모든 정보 보존 (장기)
        </text>
        <text x={392} y={134} textAnchor="middle" fontSize={8} fill={OUTPUT_C}>
          hₜ = 필요한 부분만 출력 (단기)
        </text>
      </motion.g>
      <defs>
        <marker id="ogArr" markerWidth={6} markerHeight={4} refX={6} refY={2} orient="auto">
          <path d="M0,0 L6,2 L0,4" fill={OUTPUT_C} />
        </marker>
        <marker id="ogArrC" markerWidth={6} markerHeight={4} refX={6} refY={2} orient="auto">
          <path d="M0,0 L6,2 L0,4" fill={CELL_C} />
        </marker>
      </defs>
    </g>
  );
}

/* Step 3: Parameter count breakdown */
export function Step3() {
  const rows = [
    { gate: 'Forget (W_f)', params: 'H×(H+I)+H', color: FORGET_C },
    { gate: 'Input (W_i)', params: 'H×(H+I)+H', color: INPUT_C },
    { gate: 'Candidate (W_c)', params: 'H×(H+I)+H', color: CELL_C },
    { gate: 'Output (W_o)', params: 'H×(H+I)+H', color: OUTPUT_C },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fill="#999">
        파라미터 구성: 4개 행렬 × (H² + HI + H)
      </text>
      {/* Table rows */}
      {rows.map((r, i) => {
        const y = 30 + i * 28;
        return (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ ...sp, delay: i * 0.12 }}>
            <rect x={50} y={y} width={160} height={24} rx={4}
              fill={r.color + '12'} stroke={r.color} strokeWidth={0.8} />
            <text x={130} y={y + 16} textAnchor="middle" fontSize={9} fill={r.color} fontWeight={600}>
              {r.gate}
            </text>
            <rect x={230} y={y} width={160} height={24} rx={4}
              fill="#88888808" stroke="#88888840" strokeWidth={0.5} />
            <text x={310} y={y + 16} textAnchor="middle" fontSize={9} fill="#666">
              {r.params}
            </text>
          </motion.g>
        );
      })}
      {/* Total */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <line x1={50} y1={148} x2={390} y2={148} stroke="#888" strokeWidth={0.5} />
        <text x={130} y={160} textAnchor="middle" fontSize={9} fill="#888" fontWeight={600}>
          합계
        </text>
        <text x={310} y={160} textAnchor="middle" fontSize={9} fill="#888" fontWeight={600}>
          4 × H × (H + I + 1)
        </text>
      </motion.g>
      <motion.text x={240} y={175} textAnchor="middle" fontSize={8} fill="#666"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        H=512, I=300 → 4 × 512 × 813 = 약 1.66M/layer
      </motion.text>
    </g>
  );
}
