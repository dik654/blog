import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, COLORS } from './RecoveryVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function FineTuneViz() {
  /* 프루닝 후 정확도 복구 곡선 */
  const points = [
    { epoch: 0, acc: 88 }, { epoch: 2, acc: 91 }, { epoch: 4, acc: 93 },
    { epoch: 6, acc: 94 }, { epoch: 8, acc: 94.3 }, { epoch: 10, acc: 94.5 },
  ];
  const scaleX = (e: number) => 80 + e * 32;
  const scaleY = (a: number) => 150 - (a - 85) * 10;
  const pathD = points.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${scaleX(p.epoch)} ${scaleY(p.acc)}`
  ).join(' ');

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">프루닝 후 fine-tuning 복구 곡선</text>
      {/* 원래 정확도 기준선 */}
      <motion.line x1={75} y1={scaleY(95)} x2={410} y2={scaleY(95)}
        stroke={COLORS.finetune} strokeWidth={0.6} strokeDasharray="4 3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }} />
      <motion.text x={415} y={scaleY(95) + 3} fontSize={7} fill={COLORS.finetune}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        원래 정확도 (95%)
      </motion.text>
      {/* 프루닝 직후 */}
      <motion.line x1={75} y1={scaleY(88)} x2={410} y2={scaleY(88)}
        stroke={COLORS.warning} strokeWidth={0.6} strokeDasharray="4 3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }} />
      <motion.text x={415} y={scaleY(88) + 3} fontSize={7} fill={COLORS.warning}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        프루닝 직후 (88%)
      </motion.text>
      {/* 축 */}
      <line x1={75} y1={155} x2={410} y2={155} stroke="var(--border)" strokeWidth={0.5} />
      <line x1={75} y1={155} x2={75} y2={25} stroke="var(--border)" strokeWidth={0.5} />
      <text x={240} y={170} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">Fine-tuning 에폭</text>
      {/* 눈금 */}
      {[0, 2, 4, 6, 8, 10].map(e => (
        <text key={e} x={scaleX(e)} y={165} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">{e}</text>
      ))}
      {/* 복구 곡선 */}
      <motion.path d={pathD} fill="none" stroke={COLORS.finetune} strokeWidth={2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1 }} />
      {points.map((p, i) => (
        <motion.circle key={i} cx={scaleX(p.epoch)} cy={scaleY(p.acc)} r={3}
          fill={COLORS.finetune}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ ...sp, delay: 0.2 + i * 0.1 }} />
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.8 }}>
        <rect x={130} y={30} width={220} height={22} rx={4}
          fill={`${COLORS.finetune}12`} stroke={COLORS.finetune} strokeWidth={0.6} />
        <text x={240} y={44} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={COLORS.finetune}>원래 에폭의 10~30%만 추가 학습으로 복구</text>
      </motion.g>
    </g>
  );
}

function LRSettingViz() {
  /* 학습률 비교 */
  const configs = [
    { label: '원래 LR (1e-3)', result: '발산', color: COLORS.warning, barW: 280 },
    { label: '1/10 LR (1e-4)', result: '최적 복구', color: COLORS.finetune, barW: 200 },
    { label: '1/100 LR (1e-5)', result: '복구 부족', color: COLORS.lr, barW: 80 },
  ];

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">학습률 설정: 원래의 1/10이 최적</text>
      {configs.map((c, i) => {
        const y = 40 + i * 50;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.15 }}>
            <text x={130} y={y + 10} textAnchor="end" fontSize={9} fontWeight={600}
              fill={c.color}>{c.label}</text>
            <rect x={140} y={y} width={c.barW} height={16} rx={4}
              fill={c.color} fillOpacity={0.3} stroke={c.color} strokeWidth={0.6} />
            <text x={140 + c.barW / 2} y={y + 12} textAnchor="middle" fontSize={8}
              fontWeight={700} fill={c.color}>{c.result}</text>
            {/* loss 변동 시각화 */}
            {i === 0 && (
              <motion.path d="M 140 30 Q 200 10 260 35 Q 320 60 380 20 Q 420 -5 430 50"
                fill="none" stroke={c.color} strokeWidth={1} strokeDasharray="3 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }} />
            )}
          </motion.g>
        );
      })}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={90} y={150} width={300} height={36} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={166} textAnchor="middle" fontSize={9} fontWeight={600}
          fill="var(--foreground)">Cosine Annealing 스케줄</text>
        <text x={240} y={180} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">peak LR = 원래의 1/10, warmup 비율 5%, 총 에폭의 10~30%</text>
      </motion.g>
    </g>
  );
}

function DistillationViz() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">Knowledge Distillation + Pruning</text>
      {/* Teacher */}
      <ModuleBox x={30} y={35} w={120} h={50} label="Teacher" sub="원본 (Dense)" color={COLORS.distill} />
      {/* Student */}
      <ModuleBox x={30} y={120} w={120} h={50} label="Student" sub="Pruned 모델" color={COLORS.finetune} />
      {/* Soft label 흐름 */}
      <motion.path d="M 90 85 L 90 120" fill="none" stroke={COLORS.distill}
        strokeWidth={1.2} markerEnd="url(#arrowR)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }} />
      <motion.text x={100} y={106} fontSize={8} fill={COLORS.distill} fontWeight={600}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        soft labels
      </motion.text>
      {/* Loss 합산 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <rect x={180} y={50} width={270} height={60} rx={8}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={315} y={70} textAnchor="middle" fontSize={10} fontWeight={700}
          fill="var(--foreground)">L = α · CE(y, y_hat) + (1-α) · KL(T, S)</text>
        <text x={220} y={90} fontSize={8} fill={COLORS.warning} fontWeight={600}>Hard label loss</text>
        <text x={380} y={90} fontSize={8} fill={COLORS.distill} fontWeight={600}>Soft label loss</text>
        <text x={315} y={104} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">α=0.5, Temperature T=4 (일반적 시작점)</text>
      </motion.g>
      {/* 효과 */}
      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.6 }}>
        <DataBox x={180} y={130} w={130} h={34} label="어두운 지식"
          sub="클래스 간 유사도 전달" color={COLORS.distill} />
        <DataBox x={330} y={130} w={120} h={34} label="복구 가속"
          sub="1~3% 추가 향상" color={COLORS.finetune} />
      </motion.g>

      <defs>
        <marker id="arrowR" viewBox="0 0 8 8" refX={7} refY={4}
          markerWidth={6} markerHeight={6} orient="auto-start-reverse">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill={COLORS.distill} />
        </marker>
      </defs>
    </g>
  );
}

function PipelineViz() {
  const stages = [
    { label: '1. 프루닝', sub: '구조 최적화', color: COLORS.warning, detail: '불필요한 연결 제거' },
    { label: '2. Fine-tuning', sub: '가중치 재조정', color: COLORS.finetune, detail: '정확도 복구' },
    { label: '3. 양자화', sub: '비트 축소', color: COLORS.lr, detail: 'INT4/INT8 변환' },
  ];

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">최적 경량화 파이프라인 순서</text>
      {stages.map((s, i) => {
        const x = 30 + i * 155;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.2 }}>
            <rect x={x} y={35} width={135} height={65} rx={10}
              fill={`${s.color}10`} stroke={s.color} strokeWidth={1.2} />
            <text x={x + 67} y={55} textAnchor="middle" fontSize={11} fontWeight={700}
              fill={s.color}>{s.label}</text>
            <text x={x + 67} y={70} textAnchor="middle" fontSize={8}
              fill="var(--muted-foreground)">{s.sub}</text>
            <text x={x + 67} y={85} textAnchor="middle" fontSize={8}
              fill={s.color} fontWeight={600}>{s.detail}</text>
            {i < 2 && (
              <motion.text x={x + 145} y={68} fontSize={18} fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.3 + i * 0.2 }}>→</motion.text>
            )}
          </motion.g>
        );
      })}
      {/* 주의사항 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
        <AlertBox x={100} y={115} w={280} h={44} label="순서 바꾸면 효과 반감"
          sub="프루닝이 양자화의 가중치 분포를 바꾸기 때문" color={COLORS.warning} />
      </motion.g>
      {/* 최종 효과 */}
      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.9 }}>
        <DataBox x={170} y={168} w={140} h={28} label="최종: 4~8x 경량화"
          color={COLORS.pipeline} />
      </motion.g>
    </g>
  );
}

export default function RecoveryViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <FineTuneViz />}
          {step === 1 && <LRSettingViz />}
          {step === 2 && <DistillationViz />}
          {step === 3 && <PipelineViz />}
        </svg>
      )}
    </StepViz>
  );
}
