import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

const STEPS = [
  { label: '1. 모델 응답 수신', body: 'GRPO가 생성한 응답을 보상 파이프라인에 입력\n<think>..추론..</think><answer>..답..</answer> 형식' },
  { label: '2. 답안 추출 (LaTeX)', body: 'math_verify.parse()로 <answer> 내용 추출\n\\boxed{} 우선 → 일반 LaTeX 폴백\n"1/2", "0.5", "\\frac{1}{2}" 동일 파싱' },
  { label: '3. 형식 + 태그 검증', body: '정규식: <think>.*</think>\\s*<answer>.*</answer>\n4개 태그 각 0.25점 → 지름길 학습 방지' },
  { label: '4. 정확도 검증', body: 'math_verify.verify(gold, answer)\n대수적 동치 판정 → 정답 1.0 / 오답 0.0' },
  { label: '5. 가중 합산 → R', body: 'R = accuracy×0.7 + format×0.2 + tag×0.1\n정확도 지배적이지만 형식 무시 시 최대 0.7' },
];

const SCORES = [
  { func: 'accuracy', score: 1.0, weight: 0.7, color: '#6366f1' },
  { func: 'format', score: 1.0, weight: 0.2, color: '#10b981' },
  { func: 'tag_count', score: 0.75, weight: 0.1, color: '#f59e0b' },
];

export default function RewardPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* 응답 입력 */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.2 }} transition={sp}>
            <rect x={10} y={8} width={440} height={26} rx={5}
              fill={step === 0 ? '#6366f115' : '#6366f108'} stroke="#6366f1" strokeWidth={step === 0 ? 1.5 : 0.5} />
            <text x={20} y={25} fontSize={10} fill="#6366f1">
              {'<think>'}Let me solve...{'</think><answer>'}42{'</answer>'}
            </text>
          </motion.g>

          {/* 추출 */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <line x1={230} y1={34} x2={230} y2={44} stroke="var(--muted-foreground)" strokeWidth={0.8} strokeDasharray="2 2" />
              <rect x={160} y={46} width={140} height={20} rx={4}
                fill="#8b5cf612" stroke="#8b5cf6" strokeWidth={1} />
              <text x={230} y={60} textAnchor="middle" fontSize={10} fill="#8b5cf6">추출: "42"</text>
            </motion.g>
          )}

          {/* 3개 보상 함수 */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={230} y1={66} x2={230} y2={76} stroke="var(--muted-foreground)" strokeWidth={0.8} strokeDasharray="2 2" />
              {SCORES.map((s, i) => {
                const x = 30 + i * 150;
                const barW = s.score * 100;
                return (
                  <motion.g key={s.func} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ ...sp, delay: i * 0.1 }}>
                    <text x={x} y={90} fontSize={10} fontWeight={600} fill={s.color}>{s.func}</text>
                    <text x={x + 105} y={90} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">×{s.weight}</text>
                    <rect x={x} y={94} width={110} height={12} rx={3} fill="var(--muted)" opacity={0.1} />
                    <motion.rect x={x} y={94} height={12} rx={3}
                      fill={`${s.color}30`} stroke={s.color} strokeWidth={0.8}
                      initial={{ width: 0 }} animate={{ width: barW * 1.1 }}
                      transition={{ ...sp, delay: i * 0.1 }} />
                    <text x={x + barW * 1.1 + 5} y={104} fontSize={9} fill={s.color}>{s.score}</text>
                  </motion.g>
                );
              })}
            </motion.g>
          )}

          {/* 가중 합산 */}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={100} y={120} width={260} height={26} rx={5}
                fill="#ef444412" stroke="#ef4444" strokeWidth={1.5} />
              <text x={230} y={137} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
                R = 1.0×0.7 + 1.0×0.2 + 0.75×0.1 = 0.975
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
