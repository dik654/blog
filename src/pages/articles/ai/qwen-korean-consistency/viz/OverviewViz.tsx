import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, VOCAB_SLICES, LOGIT_SAMPLE, SOLUTIONS } from './OverviewData';

const W = 480, H = 220;

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <VocabSlice />}
          {step === 1 && <Pretrain />}
          {step === 2 && <LmHead />}
          {step === 3 && <OutputLeak />}
          {step === 4 && <SolutionLadder />}
        </svg>
      )}
    </StepViz>
  );
}

function VocabSlice() {
  let acc = 0;
  const total = VOCAB_SLICES.reduce((s, v) => s + v.share, 0);
  const barX = 40, barY = 70, barW = 400, barH = 28;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={40} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">Qwen 토크나이저 vocab ≈ 152K 토큰</text>
      <text x={W / 2} y={56} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">한글과 한자가 같은 vocab에 공존, 중국어 비중이 압도적</text>
      {VOCAB_SLICES.map((v) => {
        const w = (v.share / total) * barW;
        const x = barX + acc;
        acc += w;
        return (
          <motion.g key={v.label}
            initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: 0.1 }}>
            <rect x={x} y={barY} width={w} height={barH}
              fill={`${v.color}30`} stroke={v.color} strokeWidth={1} />
            <text x={x + w / 2} y={barY + 17} textAnchor="middle"
              fontSize={9} fontWeight={700} fill={v.color}>{v.label}</text>
            <text x={x + w / 2} y={barY + barH + 14} textAnchor="middle"
              fontSize={7.5} fill="var(--muted-foreground)">{v.range}</text>
            <text x={x + w / 2} y={barY + barH + 24} textAnchor="middle"
              fontSize={7.5} fill="var(--muted-foreground)">{v.share}%</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={185} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">한자 영역이 한글의 4~5배 크기 → 사전확률 자체가 비대칭</text>
    </motion.g>
  );
}

function Pretrain() {
  const langs = [
    { label: '중국어', share: 32, color: '#ef4444' },
    { label: '영어', share: 48, color: '#10b981' },
    { label: '코드/기타', share: 18, color: '#a3a3a3' },
    { label: '한국어', share: 2, color: '#3b82f6' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={36} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">사전학습 코퍼스 비중 (추정)</text>
      {langs.map((l, i) => {
        const y = 60 + i * 28;
        const barW = (l.share / 50) * 320;
        return (
          <motion.g key={l.label}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}>
            <text x={70} y={y + 14} textAnchor="end" fontSize={10}
              fontWeight={600} fill="var(--foreground)">{l.label}</text>
            <rect x={80} y={y} width={barW} height={20} rx={3}
              fill={`${l.color}30`} stroke={l.color} strokeWidth={1} />
            <text x={80 + barW + 6} y={y + 14} fontSize={9}
              fill="var(--muted-foreground)">{l.share}%</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={195} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">한국어 reasoning 경로가 중국어 경로의 부분집합처럼 형성됨</text>
    </motion.g>
  );
}

function LmHead() {
  const cx = 120;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={28} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">lm_head softmax: z = W · h</text>
      <ModuleBox x={cx - 50} y={70} w={100} h={42} label="hidden h" sub="한국어 문맥" color="#3b82f6" />
      <text x={cx + 70} y={95} fontSize={14} fontWeight={700}
        fill="var(--muted-foreground)">×</text>
      <ModuleBox x={cx + 90} y={70} w={100} h={42} label="W (lm_head)" sub="152K × d" color="#a3a3a3" />
      <text x={cx + 210} y={95} fontSize={14} fontWeight={700}
        fill="var(--muted-foreground)">→</text>
      {LOGIT_SAMPLE.map((l, i) => {
        const isCn = l.kind === 'cn';
        const y = 56 + i * 22;
        const barW = (l.logit - 4) * 22;
        return (
          <motion.g key={l.tok}
            initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            style={{ transformOrigin: '320px center' }}>
            <text x={316} y={y + 11} textAnchor="end" fontSize={9}
              fontWeight={700} fill={isCn ? '#ef4444' : '#3b82f6'}>{l.tok}</text>
            <rect x={320} y={y + 2} width={barW} height={14}
              fill={isCn ? '#ef444440' : '#3b82f640'}
              stroke={isCn ? '#ef4444' : '#3b82f6'} strokeWidth={0.8} />
            <text x={324 + barW} y={y + 12} fontSize={7.5}
              fill="var(--muted-foreground)">{l.logit}</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={200} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">한국어 컨텍스트인데 한자(分析, 解釋) logit이 한글(분석, 해석)을 이긴다</text>
    </motion.g>
  );
}

function OutputLeak() {
  const examples = [
    { ko: '문제를 분석한다', leak: '問題를 分析한다', tag: '어휘 치환' },
    { ko: 'reasoning: 먼저...', leak: '<think>首先 분석하면</think>', tag: 'think 누출' },
    { ko: '코드 결과를 확인', leak: '코드 結果를 確認', tag: '한자어 폭증' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={28} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">실제 누출 패턴</text>
      {examples.map((e, i) => {
        const y = 50 + i * 50;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, y: y + 8 }} animate={{ opacity: 1, y }}
            transition={{ delay: i * 0.12 }}>
            <DataBox x={30} y={0} w={130} h={32} label={e.ko} color="#3b82f6" />
            <text x={172} y={20} fontSize={11}
              fill="var(--muted-foreground)">→</text>
            <AlertBox x={190} y={0} w={170} h={32} label={e.leak} color="#ef4444" />
            <text x={370} y={20} fontSize={8.5} fontWeight={600}
              fill="#ef4444">{e.tag}</text>
          </motion.g>
        );
      })}
    </motion.g>
  );
}

function SolutionLadder() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={28} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">해법의 강도는 lm_head에 가까울수록 커진다</text>
      <text x={40} y={48} fontSize={8.5} fill="var(--muted-foreground)">입력단</text>
      <text x={440} y={48} textAnchor="end" fontSize={8.5} fill="var(--muted-foreground)">가중치단</text>
      <line x1={30} y1={120} x2={450} y2={120} stroke="var(--border)" strokeWidth={0.5} />
      {SOLUTIONS.map((s, i) => {
        const x = 60 + i * 110;
        const h = 12 + s.strength * 14;
        return (
          <motion.g key={s.label}
            initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            style={{ transformOrigin: `${x}px 120px` }}>
            <rect x={x - 32} y={120 - h} width={64} height={h}
              fill={`${s.color}30`} stroke={s.color} strokeWidth={1} />
            <text x={x} y={120 - h - 6} textAnchor="middle" fontSize={9}
              fontWeight={700} fill={s.color}>{s.label}</text>
            <text x={x} y={138} textAnchor="middle" fontSize={8}
              fill="var(--muted-foreground)">강도 {s.strength}/4</text>
            <text x={x} y={150} textAnchor="middle" fontSize={8}
              fill="var(--muted-foreground)">비용 {s.cost}/4</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={195} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">이 글은 4가지를 차례로 깊게 본다</text>
    </motion.g>
  );
}
