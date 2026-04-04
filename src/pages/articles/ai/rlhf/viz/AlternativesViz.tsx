import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

const STEPS = [
  { label: 'RLHF의 문제점', body: '4개 모델(Actor+Critic+Reference+Reward) 동시 운용 → 메모리 ×4\n보상 모델이 부정확하면 "보상 해킹" 발생 (높은 점수 but 실제로 나쁜 응답)\nPPO 학습이 불안정 — 하이퍼파라미터에 민감' },
  { label: 'DPO: 보상 모델 제거', body: '핵심 아이디어: 최적 정책 π*를 보상 함수 r*에 대입하면 RL이 불필요해짐\nL_DPO = −log σ(β·log(π_θ(y_w)/π_ref(y_w)) − β·log(π_θ(y_l)/π_ref(y_l)))\n→ 선호 데이터(y_w, y_l)만으로 직접 정책 최적화\nRM 학습 + PPO 학습 → 단일 분류 손실로 통합' },
  { label: 'Constitutional AI: 자기 개선', body: 'Anthropic의 접근: 인간 레이블 대신 AI가 원칙(헌법)에 따라 자기 평가\n1단계: AI가 응답 생성 → 헌법 원칙으로 자기 비판 → 수정본 생성\n2단계: 수정본 vs 원본을 RL로 학습\n→ 인간 레이블링 비용 대폭 절감, 확장 가능' },
  { label: 'ORPO: SFT + 정렬 통합', body: 'SFT와 선호 정렬을 단일 단계로 통합\nL_ORPO = L_SFT + λ·L_OR (Odds Ratio 손실)\nOR(y_w)/OR(y_l) 비율로 선호 반영 — Reference 모델도 불필요\n→ RLHF 3단계 → 1단계로 압축' },
  { label: 'KTO: 이진 피드백', body: '쌍별 비교(y_w vs y_l) 대신 단일 응답의 좋음/나쁨 이진 피드백\nKahneman-Tversky의 전망이론 적용: 손실 회피 (loss > gain)\nL_KTO = −E[σ(β·z_good)] − E[σ(−β·z_bad)] (z = log_ratio − KL)\n→ 쌍 데이터 수집 불필요, 기존 평점 데이터 활용 가능' },
];

/* 각 방법의 모델 수 비교 */
const METHODS = [
  { name: 'RLHF', models: 4, color: '#ef4444' },
  { name: 'DPO', models: 2, color: '#6366f1' },
  { name: 'CAI', models: 3, color: '#10b981' },
  { name: 'ORPO', models: 1, color: '#f59e0b' },
  { name: 'KTO', models: 2, color: '#8b5cf6' },
];

export default function AlternativesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* 모델 수 비교 바 차트 */}
          <text x={10} y={16} fontSize={11} fontWeight={600} fill="var(--foreground)">
            필요 모델 수 비교
          </text>
          {METHODS.map((m, i) => {
            const barW = m.models * 60;
            const y = 26 + i * 18;
            const active = step === i;
            return (
              <motion.g key={m.name} animate={{ opacity: active ? 1 : 0.25 }} transition={sp}>
                <text x={10} y={y + 12} fontSize={10} fontWeight={600} fill={m.color}>{m.name}</text>
                <motion.rect x={60} y={y} width={barW} height={14} rx={3}
                  fill={active ? `${m.color}30` : `${m.color}10`}
                  stroke={m.color} strokeWidth={active ? 1.5 : 0.5}
                  initial={{ width: 0 }} animate={{ width: barW }}
                  transition={{ ...sp, delay: 0.1 }} />
                <text x={60 + barW + 6} y={y + 11} fontSize={9} fill={m.color}>
                  {m.models}개 모델
                </text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
