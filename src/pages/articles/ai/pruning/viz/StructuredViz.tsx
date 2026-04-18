import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, COLORS } from './StructuredVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function ChannelPruningViz() {
  const channels = [
    { label: 'Ch 0', color: COLORS.channel, kept: true },
    { label: 'Ch 1', color: COLORS.pruned, kept: false },
    { label: 'Ch 2', color: COLORS.channel, kept: true },
    { label: 'Ch 3', color: COLORS.pruned, kept: false },
    { label: 'Ch 4', color: COLORS.channel, kept: true },
  ];

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">Channel Pruning: 필터 통째로 제거</text>
      {/* 입력 feature map */}
      <text x={60} y={32} textAnchor="middle" fontSize={8} fontWeight={600}
        fill="var(--muted-foreground)">Conv 출력 (5 채널)</text>
      {channels.map((ch, ci) => {
        const x = 10 + ci * 50;
        return (
          <motion.g key={ci}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...sp, delay: ci * 0.08 }}>
            <text x={x + 22} y={48} textAnchor="middle" fontSize={7}
              fontWeight={600} fill={ch.kept ? COLORS.channel : COLORS.pruned}>
              {ch.label}
            </text>
            {/* 4x4 grid */}
            {Array.from({ length: 9 }).map((_, pi) => {
              const px = x + (pi % 3) * 14;
              const py = 52 + Math.floor(pi / 3) * 14;
              return (
                <motion.rect key={pi} x={px} y={py} width={12} height={12} rx={2}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: ch.kept ? 0.6 : 0.15 }}
                  transition={{ ...sp, delay: ci * 0.08 + pi * 0.01 }}
                  fill={ch.kept ? COLORS.channel : COLORS.pruned} />
              );
            })}
            {!ch.kept && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <line x1={x + 2} y1={52} x2={x + 40} y2={92}
                  stroke={COLORS.pruned} strokeWidth={1.5} />
                <line x1={x + 40} y1={52} x2={x + 2} y2={92}
                  stroke={COLORS.pruned} strokeWidth={1.5} />
              </motion.g>
            )}
          </motion.g>
        );
      })}
      {/* 화살표 */}
      <motion.path d="M 260 70 L 285 70" fill="none" stroke="var(--muted-foreground)"
        strokeWidth={1} markerEnd="url(#arrowS)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }} />
      {/* 프루닝 후 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
        <text x={380} y={32} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={COLORS.kept}>프루닝 후 (3 채널)</text>
        {[0, 2, 4].map((ci, ni) => {
          const x = 300 + ni * 55;
          return (
            <g key={ci}>
              <text x={x + 22} y={48} textAnchor="middle" fontSize={7}
                fontWeight={600} fill={COLORS.kept}>Ch {ci}</text>
              {Array.from({ length: 9 }).map((_, pi) => {
                const px = x + (pi % 3) * 14;
                const py = 52 + Math.floor(pi / 3) * 14;
                return (
                  <rect key={pi} x={px} y={py} width={12} height={12} rx={2}
                    fill={COLORS.kept} fillOpacity={0.6} />
                );
              })}
            </g>
          );
        })}
      </motion.g>
      {/* 이점 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.9 }}>
        <rect x={100} y={110} width={280} height={28} rx={6}
          fill={`${COLORS.kept}12`} stroke={COLORS.kept} strokeWidth={0.6} />
        <text x={240} y={128} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={COLORS.kept}>텐서 shape 자체가 축소 → Dense 행렬곱 유지 → GPU 가속 가능</text>
      </motion.g>
      <defs>
        <marker id="arrowS" viewBox="0 0 8 8" refX={7} refY={4}
          markerWidth={6} markerHeight={6} orient="auto-start-reverse">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="var(--muted-foreground)" />
        </marker>
      </defs>
    </g>
  );
}

function L1NormViz() {
  const filters = [
    { idx: 0, norm: 4.2, kept: true },
    { idx: 1, norm: 0.8, kept: false },
    { idx: 2, norm: 3.5, kept: true },
    { idx: 3, norm: 1.1, kept: false },
    { idx: 4, norm: 5.1, kept: true },
    { idx: 5, norm: 3.9, kept: true },
  ];
  const maxNorm = 5.5;

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">L1-norm 기준 필터 중요도</text>
      <text x={240} y={28} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">각 필터의 Σ|w| 계산 → 하위 33% 제거</text>
      {filters.map((f, i) => {
        const y = 42 + i * 24;
        const barW = (f.norm / maxNorm) * 250;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.1 }}>
            <text x={68} y={y + 12} textAnchor="end" fontSize={8} fontWeight={600}
              fill={f.kept ? COLORS.channel : COLORS.pruned}>
              Filter {f.idx}
            </text>
            <rect x={75} y={y + 2} width={barW} height={14} rx={3}
              fill={f.kept ? COLORS.channel : COLORS.pruned}
              fillOpacity={f.kept ? 0.5 : 0.25} />
            <text x={75 + barW + 5} y={y + 13} fontSize={8}
              fill={f.kept ? COLORS.channel : COLORS.pruned} fontWeight={600}>
              {f.norm.toFixed(1)}
            </text>
            {!f.kept && (
              <text x={75 + barW + 30} y={y + 13} fontSize={7}
                fill={COLORS.pruned}>제거</text>
            )}
          </motion.g>
        );
      })}
      {/* 임계선 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
        <line x1={75 + (1.5 / maxNorm) * 250} y1={40} x2={75 + (1.5 / maxNorm) * 250} y2={188}
          stroke={COLORS.pruned} strokeWidth={0.8} strokeDasharray="4 3" />
        <text x={75 + (1.5 / maxNorm) * 250} y={198} textAnchor="middle"
          fontSize={7} fill={COLORS.pruned} fontWeight={600}>threshold</text>
      </motion.g>
    </g>
  );
}

function HeadPruningViz() {
  const heads = Array.from({ length: 8 }, (_, i) => ({
    idx: i,
    importance: [0.85, 0.12, 0.73, 0.08, 0.91, 0.15, 0.67, 0.05][i],
    kept: ![1, 3, 5, 7].includes(i),
  }));

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">Head Pruning: Transformer attention head 제거</text>
      <text x={240} y={28} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">8개 head 중 4개 제거 — BLEU 0.5 이내 하락</text>
      {heads.map((h, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = 60 + col * 100;
        const y = 42 + row * 70;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...sp, delay: i * 0.08 }}>
            <rect x={x} y={y} width={85} height={55} rx={8}
              fill={h.kept ? `${COLORS.head}10` : `${COLORS.pruned}10`}
              stroke={h.kept ? COLORS.head : COLORS.pruned}
              strokeWidth={h.kept ? 1 : 0.8}
              strokeDasharray={h.kept ? 'none' : '4 3'} />
            <text x={x + 42} y={y + 18} textAnchor="middle" fontSize={9} fontWeight={700}
              fill={h.kept ? COLORS.head : COLORS.pruned}>Head {h.idx}</text>
            <text x={x + 42} y={y + 33} textAnchor="middle" fontSize={8}
              fill="var(--muted-foreground)">중요도: {h.importance.toFixed(2)}</text>
            <text x={x + 42} y={y + 47} textAnchor="middle" fontSize={8} fontWeight={600}
              fill={h.kept ? COLORS.kept : COLORS.pruned}>
              {h.kept ? '유지' : '제거'}
            </text>
          </motion.g>
        );
      })}
    </g>
  );
}

function SpeedCompareViz() {
  const methods = [
    { name: 'Unstructured 90%', theory: 10, actual: 1.3, color: COLORS.pruned },
    { name: 'Structured 50%', theory: 2, actual: 1.9, color: COLORS.kept },
  ];

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">실제 속도 비교: Structured 압승</text>
      {/* 범례 */}
      <rect x={130} y={24} width={10} height={10} rx={2} fill={COLORS.compare} fillOpacity={0.3} />
      <text x={144} y={33} fontSize={8} fill="var(--muted-foreground)">이론 속도↑</text>
      <rect x={240} y={24} width={10} height={10} rx={2} fill={COLORS.compare} fillOpacity={0.8} />
      <text x={254} y={33} fontSize={8} fill="var(--muted-foreground)">실측 속도↑</text>

      {methods.map((m, i) => {
        const y = 50 + i * 70;
        const theoryW = m.theory * 25;
        const actualW = m.actual * 25;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.2 }}>
            <text x={115} y={y + 8} textAnchor="end" fontSize={9} fontWeight={600}
              fill={m.color}>{m.name}</text>
            {/* 이론 바 */}
            <rect x={125} y={y} width={theoryW} height={14} rx={3}
              fill={m.color} fillOpacity={0.25} />
            <text x={125 + theoryW + 4} y={y + 11} fontSize={8}
              fill="var(--muted-foreground)">{m.theory}×</text>
            {/* 실측 바 */}
            <rect x={125} y={y + 20} width={actualW} height={14} rx={3}
              fill={m.color} fillOpacity={0.7} />
            <text x={125 + actualW + 4} y={y + 31} fontSize={8}
              fill={m.color} fontWeight={700}>{m.actual}×</text>
          </motion.g>
        );
      })}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <AlertBox x={180} y={148} w={120} h={40} label="Unstructured"
          sub="이론 ≠ 실측" color={COLORS.pruned} />
        <DataBox x={320} y={150} w={120} h={36} label="Structured"
          sub="이론 ≈ 실측" color={COLORS.kept} />
      </motion.g>
    </g>
  );
}

export default function StructuredViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <ChannelPruningViz />}
          {step === 1 && <L1NormViz />}
          {step === 2 && <HeadPruningViz />}
          {step === 3 && <SpeedCompareViz />}
        </svg>
      )}
    </StepViz>
  );
}
