import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

const PHASES = [
  { label: '아이디어', sub: 'DeepSeek-R1 재현', color: '#6366f1', y: 10 },
  { label: '데이터 수집', sub: '350K 추론 트레이스', color: '#8b5cf6', y: 10 },
  { label: 'SFT', sub: '<think> 형식 학습', color: '#10b981', y: 10 },
  { label: 'GRPO', sub: '강화학습 최적화', color: '#f59e0b', y: 10 },
  { label: '평가', sub: 'MATH, AIME, GPQA', color: '#ec4899', y: 10 },
  { label: '배포', sub: 'SGLang + vLLM', color: '#ef4444', y: 10 },
];

const STEPS = [
  { label: '0. 아이디어: 왜 Open-R1인가', body: 'DeepSeek-R1은 강력하지만 학습 코드 비공개\n→ 전체 파이프라인을 오픈소스로 재현하여 연구 커뮤니티에 기여\n목표: SFT + GRPO로 동등 성능 달성' },
  { label: '1. 데이터: Mixture-of-Thoughts 생성', body: 'DeepSeek-R1으로 수학/코딩 문제의 추론 트레이스 대량 생성\nDistilabel + vLLM + Ray 분산 파이프라인\n→ 350K 검증된 추론 데이터 (OpenR1-Math-220k)' },
  { label: '2. SFT: 추론 형식 학습', body: 'Qwen2.5-Math-7B를 <think>/<answer> 형식으로 미세조정\nChatML 템플릿 + instruction masking\nZeRO-3 + Liger Kernel로 메모리 최적화' },
  { label: '3. GRPO: 강화학습 정책 최적화', body: 'SFT 모델을 출발점으로 GRPO 강화학습\n프롬프트당 14개 응답 → 보상 → 그룹 정규화 Advantage\n→ 좋은 추론 강화, 나쁜 추론 억제' },
  { label: '4. 평가: 벤치마크 검증', body: 'LightEval + vLLM으로 5개 벤치마크 자동 평가\nMATH-500, AIME 2024, GPQA Diamond, LiveCodeBench\n→ DeepSeek-R1-Distill-7B와 동등 성능 확인' },
  { label: '5. 배포: 멀티노드 서빙', body: 'SGLang + Slurm으로 2노드×8GPU 텐서 병렬\n라우터로 부하 분산 + 5분 주기 헬스 체크\n→ 프로덕션 추론 서빙' },
];

const BW = 65, BH = 42;

export default function E2EPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 65" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {PHASES.map((p, i) => {
            const x = 8 + i * 75;
            const active = step === i;
            const done = step > i;
            return (
              <motion.g key={p.label}
                animate={{ opacity: active ? 1 : done ? 0.6 : 0.2 }} transition={sp}>
                <rect x={x} y={p.y} width={BW} height={BH} rx={5}
                  fill={active ? `${p.color}20` : `${p.color}08`}
                  stroke={p.color} strokeWidth={active ? 2 : 0.8} />
                <text x={x + BW / 2} y={p.y + 17} textAnchor="middle"
                  fontSize={11} fontWeight={700} fill={p.color}>{p.label}</text>
                <text x={x + BW / 2} y={p.y + 32} textAnchor="middle"
                  fontSize={8} fill={p.color} opacity={0.7}>{p.sub}</text>
                {i < PHASES.length - 1 && (
                  <text x={x + BW + 5} y={p.y + BH / 2 + 1} fontSize={10}
                    fill="var(--muted-foreground)" opacity={done ? 0.5 : 0.15}>→</text>
                )}
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
