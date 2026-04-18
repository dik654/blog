import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, COLORS } from './OverviewVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* 뉴런 좌표 생성 */
const neuronY = (count: number, idx: number) => 40 + (idx - (count - 1) / 2) * 28;
const layers = [
  { x: 50, n: 3, label: 'Input' },
  { x: 150, n: 5, label: 'Hidden 1' },
  { x: 250, n: 5, label: 'Hidden 2' },
  { x: 350, n: 2, label: 'Output' },
];
/* step 0에서 프루닝 대상 가중치 (layer-from-to) */
const pruneTargets = new Set(['1-0', '1-3', '2-1', '2-4']);

function NetworkViz({ step }: { step: number }) {
  return (
    <g>
      <text x={200} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">
        {step === 0 ? 'Dense 네트워크 → 프루닝 후' : ''}
      </text>
      {/* 연결선 */}
      {layers.slice(0, -1).map((l1, li) => {
        const l2 = layers[li + 1];
        return Array.from({ length: l1.n }).flatMap((_, i) =>
          Array.from({ length: l2.n }).map((_, j) => {
            const isPruned = step === 0 && pruneTargets.has(`${li + 1}-${j}`);
            return (
              <motion.line key={`${li}-${i}-${j}`}
                x1={l1.x} y1={neuronY(l1.n, i)}
                x2={l2.x} y2={neuronY(l2.n, j)}
                stroke={isPruned ? COLORS.prune : '#88888850'}
                strokeWidth={isPruned ? 0.8 : 0.3}
                initial={{ opacity: 0 }}
                animate={{ opacity: isPruned ? 0.3 : 0.6 }}
                transition={{ ...sp, delay: 0.05 * (i + j) }} />
            );
          })
        );
      })}
      {/* 뉴런 */}
      {layers.map((l, li) => (
        <g key={li}>
          <text x={l.x} y={neuronY(l.n, l.n - 1) + 24} textAnchor="middle"
            fontSize={8} fill="var(--muted-foreground)">{l.label}</text>
          {Array.from({ length: l.n }).map((_, ni) => {
            const cy = neuronY(l.n, ni);
            const isPruned = step === 0 && pruneTargets.has(`${li}-${ni}`);
            return (
              <motion.circle key={ni} cx={l.x} cy={cy} r={8}
                fill={isPruned ? `${COLORS.prune}20` : `${COLORS.keep}20`}
                stroke={isPruned ? COLORS.prune : COLORS.keep}
                strokeWidth={isPruned ? 0.6 : 1}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ ...sp, delay: li * 0.08 + ni * 0.04 }} />
            );
          })}
        </g>
      ))}
      {step === 0 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
          <rect x={380} y={20} width={90} height={30} rx={4}
            fill={`${COLORS.prune}15`} stroke={COLORS.prune} strokeWidth={0.6} />
          <text x={425} y={33} textAnchor="middle" fontSize={8}
            fill={COLORS.prune} fontWeight={600}>X 표시 = 제거</text>
          <text x={425} y={44} textAnchor="middle" fontSize={7}
            fill="var(--muted-foreground)">정확도 거의 유지</text>
        </motion.g>
      )}
    </g>
  );
}

function LotteryViz() {
  const tickets = [
    { x: 30, label: 'Dense\n(100%)', color: '#888888', w: 80 },
    { x: 150, label: '프루닝 후\n(20%)', color: COLORS.lottery, w: 80 },
    { x: 270, label: '재학습\n→ 동일 정확도', color: COLORS.acc, w: 100 },
  ];
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">Lottery Ticket Hypothesis</text>
      {tickets.map((t, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: i * 0.2 }}>
          <rect x={t.x} y={30} width={t.w} height={50} rx={8}
            fill={`${t.color}15`} stroke={t.color} strokeWidth={1.2} />
          {t.label.split('\n').map((line, li) => (
            <text key={li} x={t.x + t.w / 2} y={52 + li * 14} textAnchor="middle"
              fontSize={9} fontWeight={600} fill={t.color}>{line}</text>
          ))}
          {i < tickets.length - 1 && (
            <text x={t.x + t.w + 15} y={58} fontSize={16} fill="var(--muted-foreground)">→</text>
          )}
        </motion.g>
      ))}
      <motion.text x={240} y={110} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.6 }}>
        "랜덤 초기화 안에 당첨 티켓이 숨어 있다" — Frankle & Carlin, 2019
      </motion.text>
    </g>
  );
}

function AccuracyCurveViz() {
  /* 프루닝 비율 vs 정확도 (가상 데이터) */
  const points = [
    { ratio: 0, acc: 95 }, { ratio: 20, acc: 95 }, { ratio: 40, acc: 94.5 },
    { ratio: 50, acc: 94 }, { ratio: 60, acc: 93.5 }, { ratio: 70, acc: 92.5 },
    { ratio: 80, acc: 90 }, { ratio: 85, acc: 85 }, { ratio: 90, acc: 75 },
    { ratio: 95, acc: 55 },
  ];
  const scaleX = (r: number) => 60 + r * 3.5;
  const scaleY = (a: number) => 140 - (a - 50) * 2.2;
  const pathD = points.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${scaleX(p.ratio)} ${scaleY(p.acc)}`
  ).join(' ');

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">프루닝 비율 vs 정확도</text>
      {/* 축 */}
      <line x1={55} y1={142} x2={400} y2={142} stroke="var(--border)" strokeWidth={0.5} />
      <line x1={55} y1={142} x2={55} y2={20} stroke="var(--border)" strokeWidth={0.5} />
      <text x={230} y={158} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
        프루닝 비율 (%)
      </text>
      <text x={20} y={80} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)"
        transform="rotate(-90, 20, 80)">정확도 (%)</text>
      {/* 눈금 */}
      {[0, 20, 40, 60, 80, 95].map(r => (
        <text key={r} x={scaleX(r)} y={154} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">{r}</text>
      ))}
      {[60, 70, 80, 90, 95].map(a => (
        <text key={a} x={48} y={scaleY(a) + 3} textAnchor="end" fontSize={7}
          fill="var(--muted-foreground)">{a}</text>
      ))}
      {/* Free lunch 영역 */}
      <motion.rect x={scaleX(0)} y={20} width={scaleX(80) - scaleX(0)} height={122} rx={4}
        fill={COLORS.acc} fillOpacity={0.06}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }} />
      <motion.text x={scaleX(40)} y={34} textAnchor="middle" fontSize={8}
        fill={COLORS.acc} fontWeight={600}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        Free Lunch 구간
      </motion.text>
      {/* 곡선 */}
      <motion.path d={pathD} fill="none" stroke={COLORS.keep} strokeWidth={2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.1 }} />
      {/* 임계점 표시 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <circle cx={scaleX(80)} cy={scaleY(90)} r={4} fill={COLORS.prune} fillOpacity={0.3}
          stroke={COLORS.prune} strokeWidth={1} />
        <text x={scaleX(80) + 8} y={scaleY(90) - 6} fontSize={8}
          fill={COLORS.prune} fontWeight={600}>임계점 (~80%)</text>
      </motion.g>
    </g>
  );
}

function CompressionViz() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">양자화 + 프루닝 = 최대 경량화</text>
      <ModuleBox x={30} y={35} w={120} h={50} label="원본 모델" sub="FP32, Dense" color={COLORS.keep} />
      <ActionBox x={180} y={35} w={110} h={50} label="프루닝 50%" sub="연결 제거" color={COLORS.prune} />
      <ActionBox x={320} y={35} w={110} h={50} label="양자화 INT4" sub="비트 축소" color={COLORS.quant} />
      {/* 화살표 */}
      <motion.path d="M 150 60 L 175 60" fill="none" stroke="var(--muted-foreground)"
        strokeWidth={1} markerEnd="url(#arrowO)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }} />
      <motion.path d="M 290 60 L 315 60" fill="none" stroke="var(--muted-foreground)"
        strokeWidth={1} markerEnd="url(#arrowO)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }} />
      {/* 결과 */}
      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.6 }}>
        <DataBox x={140} y={110} w={190} h={36} label="4~8x 경량화" sub="속도 + 메모리 동시 절감" color={COLORS.acc} />
      </motion.g>
      {/* 비교 표 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.8 }}>
        <rect x={60} y={155} width={350} height={28} rx={4}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={150} y={173} textAnchor="middle" fontSize={8} fill={COLORS.prune} fontWeight={600}>
          프루닝: 연산량(FLOP) 감소
        </text>
        <text x={320} y={173} textAnchor="middle" fontSize={8} fill={COLORS.quant} fontWeight={600}>
          양자화: 메모리(VRAM) 감소
        </text>
      </motion.g>
      <defs>
        <marker id="arrowO" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="var(--muted-foreground)" />
        </marker>
      </defs>
    </g>
  );
}

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <NetworkViz step={step} />}
          {step === 1 && <LotteryViz />}
          {step === 2 && <AccuracyCurveViz />}
          {step === 3 && <CompressionViz />}
        </svg>
      )}
    </StepViz>
  );
}
