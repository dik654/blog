import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const B = '#3b82f6', G = '#10b981', W = '#f59e0b', P = '#6366f1', E = '#ef4444';
const DIM = 'var(--muted-foreground)';

const STEPS = [
  { label: '1. Pretraining (사전학습)', body: '수조 토큰으로 다음 토큰 예측(MLE) 학습 → Base Model 생성\n비용: 수백만~수천만 달러. 언어 구조를 습득하지만 지시를 따르지 않음' },
  { label: '2. SFT (지도 미세조정)', body: '고품질 demonstration 데이터(10K~1M)로 지시 따르기 학습\n결과: Instruction-tuned Model. 태스크는 수행하지만 가치 정렬은 아직' },
  { label: '3. RLHF (강화학습 정렬)', body: '선호 비교 데이터(10K~100K pairs)로 인간 가치에 정렬\n안전성·유용성·솔직함 세 축 최적화 → Aligned Model' },
  { label: '4. 단계별 성과 비교', body: 'InstructGPT 논문: 1.3B(RLHF) 58% vs 175B(base) 19%\n정렬 품질이 모델 크기를 압도' },
  { label: '5. 정렬 기법 발전 계보', body: '2017 Christiano → 2022 InstructGPT/ChatGPT → 2023 DPO → 2024 RLAIF\nRL 없이 정렬하는 방향으로 진화' },
];

/* ---- helpers ---- */
function Box({ x, y, w, h, label, sub, color, delay = 0 }: {
  x: number; y: number; w: number; h: number;
  label: string; sub: string; color: string; delay?: number;
}) {
  return (
    <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ ...sp, delay }}>
      <rect x={x} y={y} width={w} height={h} rx={7}
        fill={`${color}10`} stroke={color} strokeWidth={1.2} />
      <text x={x + w / 2} y={y + 16} textAnchor="middle" fontSize={10}
        fontWeight={700} fill={color}>{label}</text>
      <text x={x + w / 2} y={y + 30} textAnchor="middle" fontSize={8}
        fill={DIM}>{sub}</text>
    </motion.g>
  );
}

function Arrow({ x1, y1, x2, y2, delay = 0 }: {
  x1: number; y1: number; x2: number; y2: number; delay?: number;
}) {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay }}>
      <line x1={x1} y1={y1} x2={x2 - 4} y2={y2}
        stroke={DIM} strokeWidth={1} />
      <polygon points={`${x2},${y2} ${x2 - 5},${y2 - 3} ${x2 - 5},${y2 + 3}`}
        fill={DIM} />
    </motion.g>
  );
}

function Tag({ x, y, text, color, delay = 0 }: {
  x: number; y: number; text: string; color: string; delay?: number;
}) {
  const w = text.length * 5.5 + 16;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay }}>
      <rect x={x} y={y} width={w} height={16} rx={8}
        fill={`${color}12`} stroke={color} strokeWidth={0.6} />
      <text x={x + w / 2} y={y + 11} textAnchor="middle" fontSize={7}
        fontWeight={600} fill={color}>{text}</text>
    </motion.g>
  );
}

/* ---- Steps ---- */
function Pretrain() {
  return (
    <g>
      {/* Pipeline boxes */}
      <Box x={10} y={8} w={110} h={40} label="인터넷 텍스트" sub="수 조 토큰" color={B} delay={0} />
      <Arrow x1={120} y1={28} x2={140} y2={28} delay={0.1} />
      <Box x={140} y={8} w={120} h={40} label="다음 토큰 예측" sub="P(xₜ | x<t) 최대화" color={P} delay={0.15} />
      <Arrow x1={260} y1={28} x2={280} y2={28} delay={0.2} />
      <Box x={280} y={8} w={110} h={40} label="Base Model" sub="언어 구조 습득" color={G} delay={0.25} />

      {/* Properties */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.35 }}>
        <rect x={10} y={58} width={380} height={44} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={20} y={74} fontSize={9} fontWeight={600} fill={B}>특징</text>
        <text x={20} y={88} fontSize={8} fill={DIM}>비용: 수백만~수천만 달러 · GPU 수천 대 · 수 개월</text>
        <text x={20} y={100} fontSize={8} fill={DIM}>예: GPT-4 base, LLaMA-3 base</text>
      </motion.g>

      {/* Warnings */}
      <Tag x={10} y={112} text="지시를 따르지 않음" color={W} delay={0.4} />
      <Tag x={130} y={112} text="유해 텍스트 생성 가능" color={E} delay={0.45} />
    </g>
  );
}

function SFT() {
  return (
    <g>
      <Box x={10} y={8} w={110} h={40} label="시연 데이터" sub="10K~1M pairs" color={B} delay={0} />
      <Arrow x1={120} y1={28} x2={140} y2={28} delay={0.1} />
      <Box x={140} y={8} w={120} h={40} label="지시 따르기 학습" sub="(instruction, response)" color={P} delay={0.15} />
      <Arrow x1={260} y1={28} x2={280} y2={28} delay={0.2} />
      <Box x={280} y={8} w={120} h={40} label="Instruction Model" sub="포맷 + 태스크 수행" color={G} delay={0.25} />

      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.35 }}>
        <rect x={10} y={58} width={390} height={44} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={20} y={74} fontSize={9} fontWeight={600} fill={B}>특징</text>
        <text x={20} y={88} fontSize={8} fill={DIM}>비용: 수십만 달러 · 고품질 데이터 수집이 핵심</text>
        <text x={20} y={100} fontSize={8} fill={DIM}>예: LLaMA-Chat, GPT-3.5 baseline</text>
      </motion.g>

      <Tag x={10} y={112} text="태스크 수행 가능" color={G} delay={0.4} />
      <Tag x={130} y={112} text="가치 정렬은 아직 부족" color={W} delay={0.45} />
    </g>
  );
}

function RLHF() {
  return (
    <g>
      <Box x={10} y={8} w={110} h={40} label="선호 비교 데이터" sub="10K~100K pairs" color={B} delay={0} />
      <Arrow x1={120} y1={28} x2={140} y2={28} delay={0.1} />
      <Box x={140} y={8} w={120} h={40} label="RM + PPO" sub="보상 최적화 + KL" color={P} delay={0.15} />
      <Arrow x1={260} y1={28} x2={280} y2={28} delay={0.2} />
      <Box x={280} y={8} w={120} h={40} label="Aligned Model" sub="인간 가치 정렬" color={G} delay={0.25} />

      {/* 3H */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}>
        {[
          { label: 'Helpful', desc: '유용한 응답', color: G },
          { label: 'Harmless', desc: '안전한 응답', color: B },
          { label: 'Honest', desc: '솔직한 응답', color: P },
        ].map((h, i) => (
          <g key={i}>
            <rect x={10 + i * 134} y={58} width={124} height={32} rx={6}
              fill={`${h.color}10`} stroke={h.color} strokeWidth={0.8} />
            <text x={72 + i * 134} y={72} textAnchor="middle" fontSize={9}
              fontWeight={700} fill={h.color}>{h.label}</text>
            <text x={72 + i * 134} y={84} textAnchor="middle" fontSize={7}
              fill={DIM}>{h.desc}</text>
          </g>
        ))}
      </motion.g>

      <Tag x={10} y={100} text="ChatGPT, Claude, Gemini" color={G} delay={0.45} />
    </g>
  );
}

function ResultCompare() {
  const data = [
    { label: 'GPT-3 175B (base)', pct: 19, color: E },
    { label: 'GPT-3 175B (SFT)', pct: 44, color: W },
    { label: 'InstructGPT 1.3B (RLHF)', pct: 58, color: G },
    { label: 'InstructGPT 175B (RLHF)', pct: 70, color: G },
  ];
  const maxW = 260;

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">InstructGPT 사용자 선호율 (%)</text>

      {data.map((d, i) => {
        const y = 28 + i * 28;
        const bw = (d.pct / 100) * maxW;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.1 }}>
            <text x={148} y={y + 14} textAnchor="end" fontSize={8}
              fontWeight={d.pct >= 58 ? 700 : 400} fill="var(--foreground)">{d.label}</text>
            <motion.rect x={155} y={y + 2} height={14} rx={3}
              fill={d.color} fillOpacity={0.4}
              initial={{ width: 0 }} animate={{ width: bw }}
              transition={{ ...sp, delay: 0.1 + i * 0.1 }} />
            <text x={155 + bw + 6} y={y + 14} fontSize={9} fontWeight={700}
              fill={d.color}>{d.pct}%</text>
          </motion.g>
        );
      })}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={155} y={142} width={200} height={16} rx={8}
          fill={`${G}12`} stroke={G} strokeWidth={0.8} />
        <text x={255} y={153} textAnchor="middle" fontSize={8} fontWeight={700}
          fill={G}>1.3B RLHF &gt; 175B base — 정렬이 크기를 압도</text>
      </motion.g>
    </g>
  );
}

function Timeline() {
  const events = [
    { year: '2017', label: 'Christiano', desc: 'Preference Learning 최초 제안', color: B },
    { year: '2022', label: 'InstructGPT', desc: 'RLHF 실증 + ChatGPT 탄생', color: G },
    { year: '2023', label: 'DPO/IPO', desc: 'RL 없이 정렬 가능', color: P },
    { year: '2024', label: 'RLAIF', desc: 'AI 피드백으로 인간 대체', color: W },
  ];

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">정렬 연구 발전 계보</text>

      {/* timeline line */}
      <motion.line x1={60} y1={44} x2={420} y2={44}
        stroke={DIM} strokeWidth={1.5}
        initial={{ x2: 60 }} animate={{ x2: 420 }}
        transition={{ ...sp, duration: 0.8 }} />

      {events.map((e, i) => {
        const x = 80 + i * 95;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: 0.2 + i * 0.12 }}>
            {/* dot */}
            <circle cx={x} cy={44} r={5} fill={e.color} />
            {/* year */}
            <text x={x} y={36} textAnchor="middle" fontSize={8} fontWeight={700}
              fill={e.color}>{e.year}</text>
            {/* card */}
            <rect x={x - 42} y={56} width={84} height={36} rx={6}
              fill={`${e.color}08`} stroke={e.color} strokeWidth={0.6} />
            <text x={x} y={70} textAnchor="middle" fontSize={9} fontWeight={700}
              fill={e.color}>{e.label}</text>
            <text x={x} y={82} textAnchor="middle" fontSize={7}
              fill={DIM}>{e.desc}</text>
          </motion.g>
        );
      })}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <rect x={100} y={104} width={280} height={16} rx={8}
          fill={`${P}12`} stroke={P} strokeWidth={0.6} />
        <text x={240} y={115} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={P}>방향: 더 적은 인간 개입, 더 단순한 학습</text>
      </motion.g>
    </g>
  );
}

export default function LLMPipelineDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 135" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <Pretrain />}
          {step === 1 && <SFT />}
          {step === 2 && <RLHF />}
          {step === 3 && <ResultCompare />}
          {step === 4 && <Timeline />}
        </svg>
      )}
    </StepViz>
  );
}
