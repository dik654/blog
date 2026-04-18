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
  { label: '1. 온라인 학습 & 엣지', body: 'LSTM: hidden state만 O(1) 업데이트 / 고정 메모리\nTransformer: O(n²) attention, 제약 환경 부적합' },
  { label: '2. 소규모·RL·스피치', body: '< 10만 샘플: LSTM inductive bias 유리\nRL 정책: POMDP 환경 표준, 스트리밍 TTS 지연 최소' },
  { label: '3. 의사결정 트리', body: '데이터 > 100만 → Transformer | 실시간 → LSTM\n엣지 → LSTM/GRU | 배치 → PatchTST/DLinear' },
];

export default function LSTMPositionDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text="[1] 온라인 학습 (Online Learning)" color={B} delay={0} bold />
              <L y={38} text="새 데이터가 실시간 스트리밍 도착" color={M} delay={d} />
              <L y={53} text="LSTM: hidden state만 업데이트 O(1)" color={G} delay={d*2} bold />
              <L y={68} text="Transformer: 전체 window 재연산" color={M} delay={d*3} />
              <L y={93} text="[2] 저자원 디바이스 (Edge/Mobile)" color={B} delay={d*4} bold />
              <L y={113} text="IoT 센서, 스마트폰, 임베디드" color={M} delay={d*5} />
              <L y={128} text="LSTM: O(1) 상태, 고정 메모리" color={G} delay={d*6} bold />
              <L y={148} text="Transformer: O(n²) → 부적합" color={M} delay={d*7} />
            </g>
          )}
          {step === 1 && (
            <g>
              <L y={18} text="[3] 소규모 데이터셋 (< 10만)" color={B} delay={0} bold />
              <L y={36} text="Transformer: pretraining 없이 과적합" color={M} delay={d} />
              <L y={51} text="LSTM: inductive bias가 시퀀스에 맞음" color={G} delay={d*2} />
              <L y={66} text="의료·금융 niche 도메인에서 강세" color={W} delay={d*3} />
              <L y={86} text="[4] RL 에이전트 memory" color={B} delay={d*4} bold />
              <L y={101} text="PPO, A3C 등에서 LSTM cell 사용" color={P} delay={d*5} />
              <L y={116} text="부분 관측(POMDP) 환경 표준" color={P} delay={d*6} />
              <L y={136} text="[5] 스피치/오디오 스트리밍" color={B} delay={d*7} bold />
              <L y={151} text="Real-time ASR, Streaming TTS" color={P} delay={d*8} />
            </g>
          )}
          {step === 2 && (
            <g>
              <L y={18} text="실무 의사결정 트리:" color={B} delay={0} bold />
              <L y={43} text="데이터 > 100만?  → Transformer 계열" color={P} delay={d} />
              <L y={63} text="실시간 스트리밍?  → LSTM / GRU" color={G} delay={d*2} bold />
              <L y={83} text="배치 오프라인?   → PatchTST / DLinear" color={P} delay={d*3} />
              <L y={103} text="엣지 디바이스?   → LSTM / GRU (양자화)" color={G} delay={d*4} bold />
              <L y={128} text="// 규모·지연·환경 기준으로 선택" color={W} delay={d*5} bold />
              <L y={148} text="// '무조건 Transformer'는 통념일 뿐" color={W} delay={d*6} />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
