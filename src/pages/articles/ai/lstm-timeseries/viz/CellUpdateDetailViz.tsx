import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const d = 0.06;
const B = '#3b82f6', G = '#10b981', W = '#f59e0b', P = '#6366f1', M = 'var(--muted-foreground)';

function L({ y, text, color, delay = 0, bold }: {
  y: number; text: string; color: string; delay?: number; bold?: boolean;
}) {
  return (
    <motion.text x={18} y={y} fontSize={10} fontFamily="monospace" fill={color}
      fontWeight={bold ? 700 : 400}
      initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}>
      {text}
    </motion.text>
  );
}

const STEPS = [
  { label: '1. 입력 연결 & 게이트 동시 계산', body: 'concat = [h_{t-1}, x_t] → 4개 연산 동시 수행\nf_t, i_t, o_t: sigmoid / C_tilde: tanh' },
  { label: '2. 셀 상태 업데이트 (핵심)', body: 'C_t = f_t ⊙ C_{t-1} + i_t ⊙ C_tilde\n이전 기억 보존/삭제 + 새 정보 추가' },
  { label: '3. 히든 상태 & 파라미터 수', body: 'h_t = o_t ⊙ tanh(C_t)\n4개 게이트 총합: 4×((d+h)×h + h) 파라미터' },
];

export default function CellUpdateDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text="입력: x_t, h_{t-1}, C_{t-1}" color={M} delay={0} />
              <L y={38} text="Step 1: concat = [h_{t-1}, x_t]" color={B} delay={d} bold />
              <L y={53} text="  shape: (hidden + input_dim,)" color={M} delay={d*2} />
              <L y={73} text="Step 2: 게이트 + 후보값 동시 계산" color={B} delay={d*3} bold />
              <L y={91} text="f_t = σ(W_f @ concat + b_f)   // forget" color={P} delay={d*4} />
              <L y={106} text="i_t = σ(W_i @ concat + b_i)   // input" color={P} delay={d*5} />
              <L y={121} text="o_t = σ(W_o @ concat + b_o)   // output" color={P} delay={d*6} />
              <L y={136} text="C_t = tanh(W_C @ concat + b_C) // candidate" color={W} delay={d*7} />
              <L y={153} text="// ⊙ = element-wise 곱 (Hadamard)" color={M} delay={d*8} />
            </g>
          )}
          {step === 1 && (
            <g>
              <L y={18} text="Step 3: 셀 상태 업데이트 (핵심)" color={B} delay={0} bold />
              <L y={43} text="C_t = f_t ⊙ C_{t-1}  +  i_t ⊙ C_tilde" color={G} delay={d} bold />
              <L y={63} text="      └── 보존/삭제 ──┘  └── 추가 ──┘" color={M} delay={d*2} />
              <L y={88} text="f_t = 1 → 이전 기억 완전 보존 (장기)" color={G} delay={d*3} />
              <L y={103} text="f_t = 0 → 이전 기억 완전 삭제" color={W} delay={d*4} />
              <L y={123} text="i_t = 1 → 새 정보 전부 저장" color={G} delay={d*5} />
              <L y={138} text="i_t = 0 → 새 정보 전부 무시" color={W} delay={d*6} />
              <L y={153} text="// additive update → 기울기 안정" color={G} delay={d*7} />
            </g>
          )}
          {step === 2 && (
            <g>
              <L y={18} text="Step 4: 히든 상태 계산" color={B} delay={0} bold />
              <L y={38} text="h_t = o_t ⊙ tanh(C_t)" color={P} delay={d} bold />
              <L y={58} text="C_t: 내부 'long-term' 메모리" color={G} delay={d*2} />
              <L y={73} text="h_t: 외부 'working' 메모리 (노출용)" color={W} delay={d*3} />
              <L y={93} text="파라미터 개수 (입력 d, 히든 h):" color={M} delay={d*4} />
              <L y={108} text="각 게이트: (d+h)×h + h  (weight + bias)" color={M} delay={d*5} />
              <L y={123} text="4개 총합: 4 × ((d+h)×h + h)" color={P} delay={d*6} />
              <L y={143} text="예: d=100, h=128 → 약 117K 파라미터" color={W} delay={d*7} bold />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
