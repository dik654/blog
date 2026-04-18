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
  { label: '1. AI Safety & Reliability', body: '위험 행동 사전 탐지, Deception 감지, Alignment 검증\n예측 불가능한 failure mode, 편향 원인 파악' },
  { label: '2. 규제 & 과학', body: 'EU AI Act 설명 가능성, GDPR 설명 권리\n지능의 본질 탐구, 표현 학습 원리' },
  { label: '3. Interpretability 접근법 3가지', body: 'A. Behavioral (입출력) B. Representation (임베딩)\nC. Mechanistic (뉴런·회로) ← SAE의 영역' },
  { label: '4. Anthropic 철학: LLM을 생물학처럼', body: '마이크로스코프 = SAE, 세포 = features\n기관 = circuits, 생명 = behaviors' },
];

export default function InterpDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text="왜 LLM 내부 이해가 필요한가?" color={B} delay={0} bold />
              <L y={38} text="1. AI Safety (안전성)" color={G} delay={d} />
              <L y={53} text="   위험 행동 사전 탐지, Deception 감지" color={M} delay={d*2} />
              <L y={68} text="   Alignment 검증" color={M} delay={d*3} />
              <L y={88} text="2. Reliability (신뢰성)" color={G} delay={d*4} />
              <L y={103} text="   예측 불가능한 failure mode" color={M} delay={d*5} />
              <L y={118} text="   편향 원인 파악, 디버깅 가능성" color={M} delay={d*6} />
              <L y={143} text="// 행동만 관찰 → 충분하지 않음" color={W} delay={d*7} bold />
            </g>
          )}
          {step === 1 && (
            <g>
              <L y={18} text="3. Regulatory Compliance" color={G} delay={0} bold />
              <L y={38} text="   EU AI Act (설명 가능성)" color={M} delay={d} />
              <L y={53} text='   GDPR "설명 권리"' color={M} delay={d*2} />
              <L y={68} text="   의료/금융 규제" color={M} delay={d*3} />
              <L y={88} text="4. Scientific Understanding" color={G} delay={d*4} bold />
              <L y={108} text="   지능의 본질 탐구" color={M} delay={d*5} />
              <L y={123} text="   표현 학습 원리" color={M} delay={d*6} />
              <L y={138} text="   새로운 모델 설계 지침" color={M} delay={d*7} />
            </g>
          )}
          {step === 2 && (
            <g>
              <L y={18} text="Interpretability 접근법 3가지:" color={B} delay={0} bold />
              <L y={43} text="A. Behavioral Interpretability" color={P} delay={d} />
              <L y={58} text="   입출력 관계 분석, Probing, Black-box" color={M} delay={d*2} />
              <L y={78} text="B. Representation Analysis" color={P} delay={d*3} />
              <L y={93} text="   임베딩 공간 탐색, Attention viz" color={M} delay={d*4} />
              <L y={113} text="C. Mechanistic Interpretability ← SAE" color={G} delay={d*5} bold />
              <L y={128} text="   뉴런·회로 수준, 인과 관계 추적" color={G} delay={d*6} />
              <L y={148} text="   가장 야심찬 접근" color={G} delay={d*7} />
            </g>
          )}
          {step === 3 && (
            <g>
              <L y={18} text='Anthropic: "LLM을 생물학처럼 연구"' color={B} delay={0} bold />
              <L y={48} text="마이크로스코프  =  SAE" color={G} delay={d} />
              <L y={73} text="세포          =  features" color={P} delay={d*2} />
              <L y={98} text="기관          =  circuits" color={W} delay={d*3} />
              <L y={123} text="생명          =  behaviors" color={B} delay={d*4} />
              <L y={148} text="// 도구 → 부품 → 구조 → 행동 이해" color={M} delay={d*5} />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
