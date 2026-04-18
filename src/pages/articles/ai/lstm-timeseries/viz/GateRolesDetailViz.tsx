import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const d = 0.06;
const B = '#3b82f6', G = '#10b981', W = '#f59e0b', P = '#6366f1', E = '#ef4444', M = 'var(--muted-foreground)';

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
  { label: '1. Forget Gate — 무엇을 잊을까?', body: 'C_{t-1}의 각 차원에 대해 유지 비율 결정\nf_t=1 → 완전 보존, f_t=0 → 완전 삭제' },
  { label: '2. Input Gate + Candidate', body: 'Input: 새 후보값 중 저장할 부분 선택\nCandidate: tanh으로 -1~1 범위 정규화' },
  { label: '3. Output Gate & 초기화 팁', body: '셀 상태 중 히든으로 노출할 부분 선택\nforget bias +1 초기화 → 초기 학습 안정' },
];

export default function GateRolesDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text='Forget Gate (f_t) — "무엇을 잊을까?"' color={B} delay={0} bold />
              <L y={38} text="이전 셀 상태 C_{t-1}의 각 차원 유지 비율" color={M} delay={d} />
              <L y={53} text="f_t = 1  →  완전히 보존 (장기 기억)" color={G} delay={d*2} />
              <L y={68} text="f_t = 0  →  완전히 삭제" color={E} delay={d*3} />
              <L y={88} text="예: 새 문장 시작 → 이전 주어 정보 삭제" color={W} delay={d*4} />
              <L y={108} text="// forget gate가 LSTM의 핵심 장치" color={G} delay={d*5} bold />
              <L y={128} text="// f_t ≈ 1 유지 → 기울기 고속도로 형성" color={G} delay={d*6} />
              <L y={148} text="// 원래 LSTM(1997)에는 없었음 → 1999 추가" color={M} delay={d*7} />
            </g>
          )}
          {step === 1 && (
            <g>
              <L y={18} text='Input Gate (i_t) — "무엇을 기록할까?"' color={B} delay={0} bold />
              <L y={38} text="새 후보값 C_tilde 중 저장할 부분 선택" color={M} delay={d} />
              <L y={53} text="i_t = 1  →  전부 저장" color={G} delay={d*2} />
              <L y={68} text="i_t = 0  →  전부 무시" color={E} delay={d*3} />
              <L y={83} text="예: '중요한' 키워드 나올 때 활성화" color={W} delay={d*4} />
              <L y={103} text='Candidate (C_tilde) — "새 후보 기억"' color={B} delay={d*5} bold />
              <L y={123} text="tanh로 -1 ~ 1 범위 정규화된 새 정보" color={P} delay={d*6} />
              <L y={138} text="input gate와 곱해져 실제 저장량 결정" color={P} delay={d*7} />
              <L y={153} text="셀 상태가 너무 커지지 않도록 범위 제한" color={W} delay={d*8} />
            </g>
          )}
          {step === 2 && (
            <g>
              <L y={18} text='Output Gate (o_t) — "무엇을 내보낼까?"' color={B} delay={0} bold />
              <L y={38} text="현재 셀 상태 중 히든으로 노출할 부분" color={M} delay={d} />
              <L y={53} text="h_t = 다음 레이어/시점에서만 보임" color={P} delay={d*2} />
              <L y={68} text="C_t = 내부 long-term | h_t = working" color={W} delay={d*3} />
              <L y={93} text="초기화 팁:" color={G} delay={d*4} bold />
              <L y={108} text="forget bias를 +1 근처로 초기화" color={G} delay={d*5} bold />
              <L y={123} text="  (Jozefowicz 2015)" color={M} delay={d*6} />
              <L y={143} text="기본값 0이면 초기 f_t ≈ 0.5" color={E} delay={d*7} />
              <L y={153} text="→ 기억이 빠르게 소실되는 문제" color={E} delay={d*8} />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
