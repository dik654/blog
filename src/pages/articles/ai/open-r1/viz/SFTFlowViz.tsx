import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

const STEPS = [
  { label: '1. 데이터셋 구조', body: 'OpenR1-Math-220k: 각 샘플 = (질문, 추론 트레이스)\n추론 트레이스 = DeepSeek-R1이 생성한 단계별 풀이\n350K 샘플 중 수학 220K 사용' },
  { label: '2. ChatML 템플릿 적용', body: '시스템 프롬프트 + 사용자 질문 → ChatML 형식 변환\n<|im_start|>system\\n...<|im_end|>\n<|im_start|>user\\n질문<|im_end|>\n<|im_start|>assistant\\n<think>추론</think><answer>답</answer><|im_end|>' },
  { label: '3. 토큰화 & 패킹', body: '토크나이저: Qwen2.5 BPE (max_seq_length=16384)\n어시스턴트 응답에만 loss 계산 (instruction masking)\n짧은 샘플을 하나의 시퀀스로 패킹 → GPU 효율 ↑' },
  { label: '4. 분산 학습 (ZeRO-3)', body: 'DeepSpeed ZeRO Stage 3: 옵티마이저·그래디언트·파라미터 분할\n+ gradient_checkpointing: 메모리 ↔ 연산 트레이드오프\n+ Liger Kernel: 최적화 CUDA 커널로 20-30% 메모리 절약' },
  { label: '5. 체크포인트 & 평가', body: '학습 완료 → HuggingFace Hub에 업로드\nLightEval로 MATH-500, AIME 등 벤치마크 평가\n→ 성능 확인 후 GRPO 단계로 진행' },
];

/* 학습 데이터 구조 시각화 */
const SAMPLE = {
  q: '∫ x² dx = ?',
  think: 'Step 1: Power rule...\nStep 2: ∫ xⁿ dx = xⁿ⁺¹/(n+1)\nStep 3: x³/3 + C',
  answer: 'x³/3 + C',
};

export default function SFTFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* 데이터셋 샘플 */}
          <motion.g animate={{ opacity: step === 0 ? 1 : 0.3 }} transition={sp}>
            <rect x={10} y={8} width={200} height={22} rx={4}
              fill="#6366f115" stroke="#6366f1" strokeWidth={step === 0 ? 1.5 : 0.5} />
            <text x={110} y={23} textAnchor="middle" fontSize={10} fill="#6366f1">
              질문: {SAMPLE.q}
            </text>
          </motion.g>

          {/* 추론 트레이스 */}
          <motion.g animate={{ opacity: step <= 1 ? 1 : 0.3 }} transition={sp}>
            <rect x={220} y={8} width={230} height={64} rx={4}
              fill={step <= 1 ? '#10b98115' : '#10b98108'} stroke="#10b981" strokeWidth={step <= 1 ? 1.5 : 0.5} />
            <text x={230} y={22} fontSize={9} fill="#10b981" fontWeight={600}>{'<think>'}</text>
            {SAMPLE.think.split('\n').map((l, i) => (
              <text key={i} x={235} y={34 + i * 11} fontSize={8} fill="var(--muted-foreground)">{l}</text>
            ))}
            <text x={230} y={66} fontSize={9} fill="#f59e0b" fontWeight={600}>
              {'<answer>'}{SAMPLE.answer}{'</answer>'}
            </text>
          </motion.g>

          {/* ChatML 변환 */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: step === 1 ? 1 : 0.3, y: 0 }} transition={sp}>
              <text x={230} y={72} fontSize={10} fill="var(--muted-foreground)">↓ ChatML 변환</text>
              <rect x={10} y={76} width={440} height={22} rx={4}
                fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={0.8} />
              <text x={20} y={91} fontSize={9} fill="#8b5cf6" fontFamily="monospace">
                {'<|im_start|>assistant\\n<think>...</think><answer>...</answer><|im_end|>'}
              </text>
            </motion.g>
          )}

          {/* 학습 과정 */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 2 ? 1 : 0.3 }} transition={sp}>
              <text x={230} y={112} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">↓ 토큰화 (max 16K)</text>
              <rect x={10} y={118} width={440} height={14} rx={3} fill="var(--muted)" opacity={0.1} />
              {/* 토큰 시각화 */}
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.rect key={i} x={12 + i * 22} y={119} width={18} height={12} rx={2}
                  fill={i < 5 ? '#6366f130' : i < 8 ? '#10b98130' : '#f59e0b30'}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }} />
              ))}
              <text x={20} y={145} fontSize={8} fill="#6366f1">system</text>
              <text x={120} y={145} fontSize={8} fill="#10b981">think (loss 계산)</text>
              <text x={240} y={145} fontSize={8} fill="#f59e0b">answer (loss 계산)</text>
              <text x={370} y={145} fontSize={8} fill="var(--muted-foreground)">padding</text>
            </motion.g>
          )}

          {/* ZeRO-3 + Liger */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={10} y={150} width={140} height={14} rx={3} fill="#ef444412" stroke="#ef4444" strokeWidth={0.5} />
              <text x={80} y={160} textAnchor="middle" fontSize={8} fill="#ef4444">ZeRO-3 분산</text>
              <rect x={160} y={150} width={140} height={14} rx={3} fill="#f59e0b12" stroke="#f59e0b" strokeWidth={0.5} />
              <text x={230} y={160} textAnchor="middle" fontSize={8} fill="#f59e0b">Liger Kernel -30% mem</text>
              <rect x={310} y={150} width={140} height={14} rx={3} fill="#10b98112" stroke="#10b981" strokeWidth={0.5} />
              <text x={380} y={160} textAnchor="middle" fontSize={8} fill="#10b981">grad checkpointing</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
