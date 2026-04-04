import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'SFT: 지도 미세조정', body: '시연 데이터(인간이 작성한 응답)로 사전학습 LLM을 미세조정\n→ 기본적인 지시 따르기 능력 학습' },
  { label: 'RM: 보상 모델 학습', body: '동일 프롬프트에 대한 2개 응답 중 인간이 선호하는 것을 선택\nBradley-Terry 모델로 보상 함수 R(x,y) 학습' },
  { label: 'PPO: 강화학습 최적화', body: '보상 모델의 점수를 최대화하도록 정책 업데이트\nKL 페널티로 SFT 모델과의 괴리 제한\n→ 인간 선호에 정렬된 LLM' },
];
const PHASES = [
  { label: 'Phase 1: SFT', sub: '시연 데이터 → 조정', x: 8, color: '#3b82f6' },
  { label: 'Phase 2: RM', sub: '선호 → 보상 함수', x: 148, color: '#f59e0b' },
  { label: 'Phase 3: PPO', sub: '보상 + KL 제약', x: 288, color: '#8b5cf6' },
];

const PW = 120, PH = 70;

export default function RLHFPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {PHASES.map((p, i) => {
            const active = step === i;
            const past = step > i;
            return (
              <g key={p.label}>
                <motion.rect x={p.x} y={10} width={PW} height={PH} rx={6}
                  animate={{ fill: `${p.color}${active ? '18' : '08'}`, stroke: p.color,
                    strokeWidth: active ? 2.5 : past ? 1.5 : 0.8, opacity: active ? 1 : past ? 0.7 : 0.35 }}
                  transition={{ duration: 0.3 }} />
                <text x={p.x + PW / 2} y={35} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={p.color} opacity={active || past ? 1 : 0.4}>{p.label}</text>
                <text x={p.x + PW / 2} y={52} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)" opacity={active || past ? 0.7 : 0.25}>{p.sub}</text>
                {i < 2 && (
                  <motion.path d={`M ${p.x + PW + 3} 45 L ${PHASES[i + 1].x - 3} 45`}
                    fill="none" stroke={p.color} strokeWidth={1.2}
                    animate={{ opacity: past || active ? 0.6 : 0.15 }}
                    markerEnd="url(#pArrow)" />
                )}
              </g>
            );
          })}

          {/* Phase detail — below phase boxes */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
              <rect x={20} y={56} width={88} height={16} rx={3}
                fill="#3b82f610" stroke="#3b82f6" strokeWidth={0.7} />
              <text x={64} y={68} textAnchor="middle" fontSize={10} fill="#3b82f6">시연 데이터</text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
              <rect x={160} y={56} width={96} height={16} rx={3}
                fill="#f59e0b10" stroke="#f59e0b" strokeWidth={0.7} />
              <text x={208} y={68} textAnchor="middle" fontSize={10} fill="#f59e0b">A ≻ B 선호 랭킹</text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
              <rect x={295} y={56} width={106} height={16} rx={3}
                fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={0.7} />
              <text x={348} y={68} textAnchor="middle" fontSize={10} fill="#8b5cf6">R(x,y) − β·KL</text>
            </motion.g>
          )}

          {/* Bottom: data flow summary */}
          <text x={63} y={100} textAnchor="middle" fontSize={9} fill="#3b82f6">사전학습 LLM</text>
          <motion.path d="M 63 103 L 63 112 L 189 112" fill="none" stroke="#3b82f6" strokeWidth={0.8} strokeDasharray="3 2" animate={{ opacity: step >= 1 ? 0.5 : 0.1 }} />
          <text x={189} y={100} textAnchor="middle" fontSize={9} fill="#f59e0b">Reward Model</text>
          <motion.path d="M 189 103 L 189 118 L 315 118" fill="none" stroke="#f59e0b" strokeWidth={0.8} strokeDasharray="3 2" animate={{ opacity: step >= 2 ? 0.5 : 0.1 }} />
          <text x={315} y={100} textAnchor="middle" fontSize={9} fill="#8b5cf6">정렬된 LLM</text>
          {/* Moving packet */}
          <motion.circle r={5}
            animate={{ cx: PHASES[step].x + PW / 2, cy: 45 }}
            transition={{ type: 'spring', bounce: 0.2 }}
            fill={PHASES[step].color}
            style={{ filter: `drop-shadow(0 0 4px ${PHASES[step].color}88)` }} />

          <defs>
            <marker id="pArrow" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="var(--border)" />
            </marker>
          </defs>
          {/* body text moved to StepViz steps.body */}
        </svg>
      )}
    </StepViz>
  );
}
