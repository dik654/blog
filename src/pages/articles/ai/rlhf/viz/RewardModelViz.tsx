import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

const STEPS = [
  { label: '1. 인간 평가자 비교', body: '동일 프롬프트 x에 대해 2개 응답 생성\n인간 평가자가 "어떤 응답이 더 나은가?" 선택\n→ (y_win, y_lose) 선호 쌍 수집' },
  { label: '2. 보상 스칼라 계산', body: '보상 모델이 각 응답에 스칼라 점수 부여\nr_w = R(x, y_win) → 높은 점수 기대\nr_l = R(x, y_lose) → 낮은 점수 기대' },
  { label: '3. Bradley-Terry 손실', body: 'P(y_w > y_l) = σ(r_w − r_l)\nLoss = −log σ(r_w − r_l)\n→ r_w와 r_l의 차이가 클수록 loss 감소\n→ 인간 선호를 반영하는 보상 함수 학습' },
];

export default function RewardModelViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* 프롬프트 */}
          <rect x={10} y={10} width={80} height={28} rx={5}
            fill="#6366f115" stroke="#6366f1" strokeWidth={1} />
          <text x={50} y={28} textAnchor="middle" fontSize={10} fill="#6366f1">프롬프트 x</text>

          {/* 두 응답 */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.2 }} transition={sp}>
            <line x1={92} y1={24} x2={118} y2={18} stroke="var(--muted-foreground)" strokeWidth={0.8} />
            <line x1={92} y1={24} x2={118} y2={40} stroke="var(--muted-foreground)" strokeWidth={0.8} />
            <rect x={120} y={4} width={110} height={24} rx={4}
              fill={step >= 0 ? '#10b98118' : '#10b98108'} stroke="#10b981" strokeWidth={step >= 0 ? 1.5 : 0.5} />
            <text x={175} y={20} textAnchor="middle" fontSize={10} fill="#10b981">y_win ✓</text>
            <rect x={120} y={34} width={110} height={24} rx={4}
              fill={step >= 0 ? '#ef444418' : '#ef444408'} stroke="#ef4444" strokeWidth={step >= 0 ? 1.5 : 0.5} />
            <text x={175} y={50} textAnchor="middle" fontSize={10} fill="#ef4444">y_lose ✗</text>
          </motion.g>

          {/* 보상 스칼라 */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={232} y1={16} x2={260} y2={16} stroke="#10b981" strokeWidth={0.8} markerEnd="url(#rmArr)" />
              <line x1={232} y1={46} x2={260} y2={46} stroke="#ef4444" strokeWidth={0.8} markerEnd="url(#rmArr)" />
              <rect x={262} y={4} width={60} height={24} rx={4} fill="#10b98115" stroke="#10b981" strokeWidth={1} />
              <text x={292} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">r_w=0.8</text>
              <rect x={262} y={34} width={60} height={24} rx={4} fill="#ef444415" stroke="#ef4444" strokeWidth={1} />
              <text x={292} y={50} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">r_l=0.3</text>
            </motion.g>
          )}

          {/* Bradley-Terry 수식 */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={340} y={10} width={90} height={48} rx={5}
                fill="#f59e0b12" stroke="#f59e0b" strokeWidth={1} />
              <text x={385} y={28} textAnchor="middle" fontSize={9} fill="#f59e0b">σ(0.8−0.3)</text>
              <text x={385} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">= 0.62</text>

              <rect x={60} y={80} width={320} height={40} rx={6}
                fill="#8b5cf608" stroke="#8b5cf6" strokeWidth={0.8} />
              <text x={220} y={98} textAnchor="middle" fontSize={11} fill="#8b5cf6" fontFamily="monospace">
                Loss = −log σ(r_w − r_l)
              </text>
              <text x={220} y={114} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                r_w↑ r_l↓ → 차이↑ → loss↓ → 인간 선호 반영
              </text>
            </motion.g>
          )}

          <defs>
            <marker id="rmArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
