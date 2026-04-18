import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, REWARDS, ROLLOUT_REWARDS, COST_AXIS } from './RLApproachData';

const W = 480, H = 220;

export default function RLApproachViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <ReasoningAttractor />}
          {step === 1 && <RewardComposition />}
          {step === 2 && <OracleJudge />}
          {step === 3 && <GrpoLoop />}
          {step === 4 && <TrainingCost />}
          {step === 5 && <Results />}
          {step === 6 && <WhenToUse />}
        </svg>
      )}
    </StepViz>
  );
}

function ReasoningAttractor() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">token 보정으로 못 잡는 "사고 경로" 자체</text>
      {/* 좌: token-level 보정 */}
      <text x={120} y={52} textAnchor="middle" fontSize={9} fontWeight={700}
        fill="#3b82f6">Smoothie (token-level)</text>
      <rect x={40} y={62} width={160} height={80} rx={4}
        fill="#3b82f608" stroke="#3b82f6" strokeWidth={1} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={48} y={70 + i * 13} width={144} height={5}
          fill={i % 2 === 0 ? '#ef4444' : '#3b82f6'} opacity={0.6} />
      ))}
      <text x={120} y={156} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">개별 토큰 logit만 깎음</text>

      {/* 우: 시퀀스 분포 */}
      <text x={360} y={52} textAnchor="middle" fontSize={9} fontWeight={700}
        fill="#ef4444">Reasoning attractor</text>
      <motion.path
        d="M 280 120 Q 330 70, 380 100 Q 430 130, 440 90"
        fill="none" stroke="#ef4444" strokeWidth={2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }} />
      <circle cx={280} cy={120} r={4} fill="#ef4444" />
      <circle cx={440} cy={90} r={4} fill="#ef4444" />
      <text x={275} y={138} fontSize={8} fill="var(--muted-foreground)">think 시작</text>
      <text x={440} y={82} textAnchor="end" fontSize={8} fill="var(--muted-foreground)">중국어 mode</text>
      <text x={360} y={156} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">시퀀스 전체의 분포</text>

      <text x={W / 2} y={195} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">긴 사고의 attractor를 재정렬하려면 policy 자체를 학습으로 움직여야 함</text>
    </motion.g>
  );
}

function RewardComposition() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">R = Accuracy + 0.2·(Format + Korean + Length)</text>
      {REWARDS.map((r, i) => {
        const y = 48 + i * 32;
        const barW = r.weight * 160;
        return (
          <motion.g key={r.name}
            initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            style={{ transformOrigin: '180px center' }}>
            <text x={170} y={y + 12} textAnchor="end" fontSize={9.5}
              fontWeight={700} fill="var(--foreground)">{r.name}</text>
            <rect x={180} y={y} width={barW} height={18}
              fill={`${r.color}30`} stroke={r.color} strokeWidth={1} />
            <text x={184 + barW} y={y + 12} fontSize={9}
              fill="var(--muted-foreground)">{r.weight}</text>
            <text x={190} y={y + 30} fontSize={8}
              fill="var(--muted-foreground)">{r.desc}</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={200} textAnchor="middle" fontSize={8.5}
        fill="var(--muted-foreground)">정확성이 압도적이지만 0이 아닌 한국어 보상이 정책을 점진 이동시킨다</text>
    </motion.g>
  );
}

function OracleJudge() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">Korean consistency: oracle judge LLM이 채점</text>
      <DataBox x={20} y={60} w={150} h={40}
        label="생성된 응답" sub="<think> + 답변" color="#3b82f6" outlined />
      <text x={180} y={84} fontSize={12} fill="var(--muted-foreground)">→</text>
      <ModuleBox x={195} y={56} w={110} h={46}
        label="Oracle Judge" sub="큰 LLM" color="#a855f7" />
      <text x={315} y={84} fontSize={12} fill="var(--muted-foreground)">→</text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <rect x={330} y={60} width={130} height={20} rx={3}
          fill="#10b98130" stroke="#10b981" strokeWidth={1} />
        <text x={395} y={74} textAnchor="middle" fontSize={9}
          fontWeight={700} fill="#10b981">1.0 (일관)</text>
        <rect x={330} y={84} width={90} height={20} rx={3}
          fill="#f59e0b30" stroke="#f59e0b" strokeWidth={1} />
        <text x={375} y={98} textAnchor="middle" fontSize={9}
          fontWeight={700} fill="#f59e0b">0.5 (혼합)</text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={40} y={128} width={400} height={68} rx={4}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={55} y={146} fontSize={9} fontWeight={700}
          fill="var(--foreground)">왜 규칙 기반만으로 부족한가</text>
        <text x={55} y={160} fontSize={9}
          fill="var(--muted-foreground)">• "한글 비율 ≥ 95%" 단순 규칙 → gaming: 한자를 음차로 회피</text>
        <text x={55} y={174} fontSize={9}
          fill="var(--muted-foreground)">• LLM judge → 의미 보존까지 포함한 평가</text>
        <text x={55} y={188} fontSize={9}
          fill="var(--muted-foreground)">• 실제 설계: 규칙 + LLM 혼합, 서로 보정</text>
      </motion.g>
    </motion.g>
  );
}

function GrpoLoop() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">GRPO: rollout 8개 → 상대적 advantage → update</text>
      <ActionBox x={20} y={48} w={100} h={36}
        label="Prompt" sub="입력" color="#3b82f6" />
      <text x={130} y={68} fontSize={12} fill="var(--muted-foreground)">→</text>
      <DataBox x={145} y={52} w={90} h={28}
        label="N=8 rollout" color="#a855f7" outlined />

      {/* rollout bars */}
      {ROLLOUT_REWARDS.map((r, i) => {
        const x = 250 + (i % 4) * 50;
        const y = 48 + Math.floor(i / 4) * 22;
        return (
          <motion.g key={r.idx}
            initial={{ opacity: 0, y: y + 4 }} animate={{ opacity: 1, y }}
            transition={{ delay: 0.1 + i * 0.04 }}>
            <rect x={0} y={0} width={40} height={14}
              fill={r.korean > 0.5 ? '#10b98140' : '#ef444440'}
              stroke={r.korean > 0.5 ? '#10b981' : '#ef4444'} strokeWidth={0.6}
              transform={`translate(${x}, ${0})`} />
            <text x={x + 20} y={10} textAnchor="middle" fontSize={7.5}
              fontWeight={700} fill="var(--foreground)">R={r.r.toFixed(1)}</text>
          </motion.g>
        );
      })}

      <line x1={20} y1={108} x2={460} y2={108} stroke="var(--border)" strokeWidth={0.5} />

      <ActionBox x={20} y={118} w={130} h={32}
        label="A = R − mean(R)" color="#f59e0b" />
      <text x={160} y={138} fontSize={12} fill="var(--muted-foreground)">→</text>
      <ActionBox x={175} y={118} w={130} h={32}
        label="policy gradient" sub="∇ log π · A" color="#10b981" />
      <text x={315} y={138} fontSize={12} fill="var(--muted-foreground)">→</text>
      <ActionBox x={330} y={118} w={130} h={32}
        label="θ ← θ + lr·∇" color="#3b82f6" />

      <text x={W / 2} y={175} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">한국어 일관된 rollout이 평균보다 높으면 + advantage → 그 분포가 강화</text>
      <text x={W / 2} y={190} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">그룹 baseline: critic 없이 mean으로 variance 감축 (GRPO 특징)</text>
    </motion.g>
  );
}

function TrainingCost() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">1 스텝 = N×8192 토큰 생성 × reward 평가</text>
      <DataBox x={30} y={52} w={90} h={30} label="1 sample" color="#3b82f6" outlined />
      <text x={128} y={71} fontSize={11} fill="var(--muted-foreground)">×</text>
      <DataBox x={140} y={52} w={90} h={30} label="N=8 rollout" color="#a855f7" outlined />
      <text x={238} y={71} fontSize={11} fill="var(--muted-foreground)">×</text>
      <DataBox x={250} y={52} w={120} h={30} label="max 8192 tok" color="#ef4444" outlined />
      <text x={378} y={71} fontSize={11} fill="var(--muted-foreground)">=</text>
      <DataBox x={390} y={52} w={80} h={30} label="~65K tok" color="#10b981" outlined />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <rect x={40} y={104} width={400} height={94} rx={4}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={55} y={122} fontSize={9} fontWeight={700}
          fill="var(--foreground)">논문 보고 (Qwen3-8B 기준)</text>
        <text x={55} y={138} fontSize={9} fill="var(--muted-foreground)">• 학습 스텝: 약 1~2K step</text>
        <text x={55} y={152} fontSize={9} fill="var(--muted-foreground)">• 하드웨어: A100 8장 급</text>
        <text x={55} y={166} fontSize={9} fill="var(--muted-foreground)">• 소요 시간: 수 일 단위</text>
        <text x={55} y={180} fontSize={9} fill="var(--muted-foreground)">• 추가: 한국어 reasoning 데이터셋 + judge prompt 세트 구축</text>
        <text x={55} y={194} fontSize={9} fill="#ef4444">→ Smoothie 대비 100~1000배 비용</text>
      </motion.g>
    </motion.g>
  );
}

function Results() {
  const rows = [
    { name: '한자 leak %', smoothie: 1.5, rl: 0.2, unit: '%' },
    { name: 'KMMLU', smoothie: 39.5, rl: 42.0, unit: '' },
    { name: '긴 think 안정성', smoothie: 60, rl: 95, unit: '%' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">RL은 "사고 모드" 자체를 재정렬한다</text>
      <text x={250} y={48} textAnchor="middle" fontSize={9}
        fontWeight={700} fill="#3b82f6">Smoothie</text>
      <text x={360} y={48} textAnchor="middle" fontSize={9}
        fontWeight={700} fill="#ef4444">+ RL</text>
      {rows.map((r, i) => {
        const y = 60 + i * 36;
        return (
          <motion.g key={r.name}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}>
            <text x={170} y={y + 12} textAnchor="end" fontSize={9.5}
              fontWeight={700} fill="var(--foreground)">{r.name}</text>
            <rect x={180} y={y} width={Math.min(r.smoothie * 1.5, 140)} height={10}
              fill="#3b82f640" stroke="#3b82f6" strokeWidth={0.5} />
            <text x={180 + Math.min(r.smoothie * 1.5, 140) + 4} y={y + 9} fontSize={7.5}
              fill="var(--muted-foreground)">{r.smoothie}{r.unit}</text>
            <rect x={180} y={y + 14} width={Math.min(r.rl * 1.5, 140)} height={10}
              fill="#ef444440" stroke="#ef4444" strokeWidth={0.5} />
            <text x={180 + Math.min(r.rl * 1.5, 140) + 4} y={y + 23} fontSize={7.5}
              fill="var(--muted-foreground)">{r.rl}{r.unit}</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={195} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">긴 think 안정성이 가장 크게 개선 — attractor 재정렬의 직접 효과</text>
    </motion.g>
  );
}

function WhenToUse() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">해법 사다리: 비용 vs 강도</text>
      {COST_AXIS.map((s, i) => {
        const x = 60 + i * 110;
        const ch = 8 + s.cost * 14;
        const sh = 8 + s.strength * 14;
        return (
          <motion.g key={s.label}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}>
            <text x={x} y={68} textAnchor="middle" fontSize={9} fontWeight={700}
              fill={s.color}>{s.label}</text>
            <text x={x - 28} y={92} fontSize={8} fill="var(--muted-foreground)">비용</text>
            <rect x={x + 2} y={82} width={ch * 2} height={10}
              fill="#ef444440" stroke="#ef4444" strokeWidth={0.5} />
            <text x={x - 28} y={112} fontSize={8} fill="var(--muted-foreground)">강도</text>
            <rect x={x + 2} y={102} width={sh * 2} height={10}
              fill="#10b98140" stroke="#10b981" strokeWidth={0.5} />
          </motion.g>
        );
      })}
      <AlertBox x={60} y={140} w={360} h={40}
        label="RL은 Smoothie + 런타임 가드로 안 되는 잔여 문제에만"
        sub="긴 사고가 핵심 워크로드이고 GPU·데이터셋이 확보됐을 때"
        color="#ef4444" />
    </motion.g>
  );
}
