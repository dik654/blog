import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

const STEPS = [
  { label: '1. 인간 레이블의 병목', body: 'RLHF/DPO 모두 인간의 선호 데이터가 필요\n레이블링 비용: 1쌍당 $0.5~2, 수만 쌍 필요\n평가자 간 불일치율 30%+ — 품질 관리 어려움' },
  { label: '2. CAI 아이디어: AI가 자기 평가', body: 'AI에게 "헌법"(원칙 목록)을 주고 스스로 평가하게 함\n"Be helpful, harmless, and honest"\n"Avoid responses that are toxic or discriminatory"\n→ 인간 레이블 대신 AI 피드백(RLAIF)' },
  { label: '3. 단계 1: 비판 → 수정 (SFT)', body: 'AI가 응답 생성 → 원칙에 따라 자기 비판 → 수정본 생성\n"이 응답이 도움이 되면서도 해롭지 않은가?"\n수정본으로 SFT 데이터셋 구축 — 인간 레이블 없이' },
  { label: '4. 단계 2: RLAIF', body: 'AI가 (원본, 수정본) 쌍에서 어느 것이 원칙에 더 부합하는지 판단\n→ AI 선호 데이터로 RM 학습 → PPO 또는 DPO 적용\n인간 비용 0, AI 연산 비용만 발생 — 대규모 확장 가능' },
];

export default function CAIViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={80} y={15} width={300} height={30} rx={5}
                fill="#ef444412" stroke="#ef4444" strokeWidth={1} />
              <text x={230} y={34} textAnchor="middle" fontSize={11} fill="#ef4444">
                인간 레이블링: 느림 · 비쌈 · 불일치 30%+
              </text>
              <text x={230} y={70} textAnchor="middle" fontSize={11} fontWeight={600} fill="#10b981">
                → AI 자체 피드백으로 대체 가능할까?
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={30} y={10} width={180} height={44} rx={5}
                fill="#6366f112" stroke="#6366f1" strokeWidth={1.5} />
              <text x={120} y={28} textAnchor="middle" fontSize={10} fontWeight={600} fill="#6366f1">헌법 (Constitution)</text>
              <text x={120} y={42} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">helpful · harmless · honest</text>

              <line x1={212} y1={32} x2={245} y2={32} stroke="#6366f1" strokeWidth={1} />
              <text x={228} y={28} fontSize={10} fill="var(--muted-foreground)">→</text>

              <rect x={250} y={10} width={180} height={44} rx={5}
                fill="#10b98112" stroke="#10b981" strokeWidth={1.5} />
              <text x={340} y={28} textAnchor="middle" fontSize={10} fontWeight={600} fill="#10b981">AI 자기 평가</text>
              <text x={340} y={42} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">원칙 기반 비판 & 수정</text>

              <text x={230} y={80} textAnchor="middle" fontSize={10} fill="#f59e0b">
                RLAIF: RL from AI Feedback
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {['AI 응답 생성', '원칙 비판', '수정본 생성', 'SFT 데이터'].map((label, i) => {
                const x = 20 + i * 110;
                const colors = ['#6366f1', '#ef4444', '#10b981', '#f59e0b'];
                return (
                  <g key={label}>
                    <motion.rect x={x} y={20} width={95} height={32} rx={4}
                      fill={`${colors[i]}12`} stroke={colors[i]} strokeWidth={1}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.15 }} />
                    <text x={x + 47} y={40} textAnchor="middle" fontSize={10} fill={colors[i]}>{label}</text>
                    {i < 3 && <text x={x + 102} y={39} fontSize={10} fill="var(--muted-foreground)">→</text>}
                  </g>
                );
              })}
              <text x={230} y={75} textAnchor="middle" fontSize={10} fontWeight={600} fill="#10b981">
                인간 레이블 없이 SFT 데이터 자동 생성
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {['AI 선호 평가', 'RM 학습', 'PPO/DPO'].map((label, i) => {
                const x = 50 + i * 130;
                const colors = ['#8b5cf6', '#f59e0b', '#10b981'];
                return (
                  <g key={label}>
                    <rect x={x} y={15} width={110} height={35} rx={5}
                      fill={`${colors[i]}12`} stroke={colors[i]} strokeWidth={1} />
                    <text x={x + 55} y={36} textAnchor="middle" fontSize={11} fontWeight={600} fill={colors[i]}>{label}</text>
                    {i < 2 && <text x={x + 117} y={36} fontSize={12} fill="var(--muted-foreground)">→</text>}
                  </g>
                );
              })}
              <text x={230} y={72} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                인간 비용 0 — AI 연산 비용만 → 대규모 확장 가능
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
