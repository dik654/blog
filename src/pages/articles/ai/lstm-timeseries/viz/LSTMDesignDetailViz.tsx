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
  { label: '1. 게이트 메커니즘', body: 'sigmoid로 0~1 밸브 역할, 학습 가능한 동적 제어\n정보를 선택적으로 통과/차단 — 정적 필터가 아님' },
  { label: '2. 셀 상태와 Additive Update', body: 'hidden state와 분리된 별도 메모리 라인\nC_t = f_t·C_{t-1} + i_t·C_tilde — 덧셈 기반' },
  { label: '3. Identity Shortcut & 역사', body: 'f_t ≈ 1이면 C_t ≈ C_{t-1} — ResNet skip connection과 유사\n1991 석사논문 → 1997 LSTM → 1999 forget gate 추가' },
];

export default function LSTMDesignDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text="1. 게이트 메커니즘 (Gating)" color={B} delay={0} bold />
              <L y={38} text="sigmoid로 0~1 범위의 '밸브' 역할" color={P} delay={d} />
              <L y={53} text="정보를 선택적으로 통과 / 차단" color={G} delay={d*2} />
              <L y={68} text="학습 가능한 동적 제어 (정적 필터 아님)" color={G} delay={d*3} bold />
              <L y={93} text="2. 셀 상태 (Cell State, C_t)" color={B} delay={d*4} bold />
              <L y={113} text="hidden state와 분리된 별도 '메모리 라인'" color={P} delay={d*5} />
              <L y={128} text="컨베이어 벨트처럼 시간축 방향으로 흐름" color={G} delay={d*6} />
              <L y={148} text="게이트로만 수정 가능 (직접 변환 없음)" color={W} delay={d*7} />
            </g>
          )}
          {step === 1 && (
            <g>
              <L y={18} text="3. Additive Update" color={B} delay={0} bold />
              <L y={38} text="C_t = f_t * C_{t-1} + i_t * C_tilde" color={P} delay={d} />
              <L y={53} text="      └── 보존 ──┘   └── 추가 ──┘" color={M} delay={d*2} />
              <L y={73} text="곱셈이 아닌 덧셈 기반 업데이트" color={G} delay={d*3} bold />
              <L y={88} text="→ 기울기 흐름이 훨씬 안정적" color={G} delay={d*4} />
              <L y={108} text="4. Identity Shortcut" color={B} delay={d*5} bold />
              <L y={128} text="forget gate f_t ≈ 1일 때 C_t ≈ C_{t-1}" color={P} delay={d*6} />
              <L y={143} text="정보를 손실 없이 장기간 보존" color={G} delay={d*7} />
              <L y={153} text="ResNet의 skip connection과 유사 발상" color={W} delay={d*8} />
            </g>
          )}
          {step === 2 && (
            <g>
              <L y={18} text="역사적 배경:" color={B} delay={0} bold />
              <L y={38} text="1991  Hochreiter 석사: vanishing gradient 문제 제기" color={M} delay={d} />
              <L y={53} text="1997  LSTM 논문 (Hochreiter & Schmidhuber)" color={G} delay={d*2} bold />
              <L y={68} text="1999  Gers: forget gate 추가 (원조엔 없었음)" color={W} delay={d*3} />
              <L y={83} text="2000s 음성 인식(Alex Graves)에서 대성공" color={P} delay={d*4} />
              <L y={98} text="2014  seq2seq로 기계 번역 혁명" color={P} delay={d*5} />
              <L y={118} text="// forget gate bias를 +1로 초기화하면" color={W} delay={d*6} />
              <L y={133} text="// 초기 학습 안정성이 크게 개선" color={G} delay={d*7} bold />
              <L y={148} text="// (Jozefowicz 2015 권장)" color={M} delay={d*8} />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
