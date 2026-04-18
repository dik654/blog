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
  { label: '1. 시계열 Transformer 혁신', body: 'Informer(ProbSparse), Autoformer(FFT 주기성), PatchTST(ViT 방식)\n단순 DLinear가 복잡한 Attention을 압도하는 발견' },
  { label: '2. LSTM이 여전히 유효한 영역', body: '온라인 학습(O(1) 상태), 엣지 디바이스(고정 메모리)\n소규모 데이터(<10만), RL 에이전트, 스트리밍' },
  { label: '3. 실무 의사결정 트리', body: '데이터 > 100만 → Transformer | 실시간 → LSTM\n엣지 → LSTM/GRU | 배치 → PatchTST/DLinear 벤치' },
];

export default function TransformerTSDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text="시계열 Transformer 변형 (2020~):" color={B} delay={0} bold />
              <L y={36} text="Informer:  ProbSparse Attention O(L log L)" color={P} delay={d} />
              <L y={51} text="Autoformer: FFT 기반 주기성 탐지" color={P} delay={d*2} />
              <L y={66} text="FEDformer: 주파수 도메인 attention" color={P} delay={d*3} />
              <L y={81} text="PatchTST:  시계열을 패치로 분할 (ViT)" color={G} delay={d*4} bold />
              <L y={96} text="TimesNet:  1D→2D 변환 (CNN)" color={P} delay={d*5} />
              <L y={116} text="놀라운 발견 (Zeng 2022):" color={W} delay={d*6} bold />
              <L y={131} text="단순 Linear(DLinear)가 Transformer 압도" color={W} delay={d*7} />
              <L y={148} text="// inductive bias 무시한 Attention은 해로움" color={M} delay={d*8} />
            </g>
          )}
          {step === 1 && (
            <g>
              <L y={18} text="LSTM이 여전히 유효한 시나리오:" color={G} delay={0} bold />
              <L y={38} text="[1] 온라인 학습 — hidden state만 업데이트 O(1)" color={G} delay={d} />
              <L y={53} text="    Transformer: 전체 window 재연산 비용" color={M} delay={d*2} />
              <L y={73} text="[2] 엣지/모바일 — O(1) 상태, 고정 메모리" color={G} delay={d*3} />
              <L y={88} text="    Transformer: O(n²) attention 부적합" color={M} delay={d*4} />
              <L y={108} text="[3] 소규모 데이터 (< 10만 샘플)" color={G} delay={d*5} />
              <L y={123} text="    Transformer pretraining 없이 과적합" color={M} delay={d*6} />
              <L y={143} text="[4] RL 에이전트 메모리 (PPO, A3C)" color={G} delay={d*7} />
            </g>
          )}
          {step === 2 && (
            <g>
              <L y={18} text="실무 의사결정 트리:" color={B} delay={0} bold />
              <L y={43} text="데이터 > 100만? → Transformer 계열" color={P} delay={d} />
              <L y={63} text="실시간 스트리밍? → LSTM / GRU" color={G} delay={d*2} bold />
              <L y={83} text="배치 오프라인?  → PatchTST / DLinear" color={P} delay={d*3} />
              <L y={103} text="엣지 디바이스?  → LSTM / GRU (양자화)" color={G} delay={d*4} bold />
              <L y={128} text="// '무조건 Transformer' 통념을 버리고" color={W} delay={d*5} />
              <L y={148} text="// 데이터 규모·지연·환경 기준으로 선택" color={W} delay={d*6} bold />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
