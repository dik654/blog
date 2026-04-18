import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, COLORS } from './UnstructuredVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* 가중치 행렬 (4x5) — magnitude pruning 시각화 */
const W = [
  [0.92, -0.03, 0.71, -0.88, 0.05],
  [-0.01, 0.45, -0.02, 0.67, -0.04],
  [0.83, 0.02, -0.56, 0.01, 0.79],
  [-0.06, 0.91, 0.03, -0.72, -0.01],
];
const threshold = 0.1;

function MagnitudeViz({ step }: { step: number }) {
  const cellW = 52;
  const cellH = 28;
  const startX = 80;
  const startY = 30;

  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">
        {step === 0 ? 'Magnitude Pruning: |w| < 0.1 → 0' : 'Sparse Matrix (CSR 포맷)'}
      </text>
      {W.map((row, ri) =>
        row.map((v, ci) => {
          const x = startX + ci * cellW;
          const y = startY + ri * cellH;
          const isPruned = Math.abs(v) < threshold;
          const showPruned = step >= 0;

          return (
            <motion.g key={`${ri}-${ci}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...sp, delay: (ri * 5 + ci) * 0.03 }}>
              <rect x={x} y={y} width={cellW - 2} height={cellH - 2} rx={3}
                fill={showPruned && isPruned ? `${COLORS.pruned}15` : `${COLORS.weight}12`}
                stroke={showPruned && isPruned ? COLORS.pruned : COLORS.weight}
                strokeWidth={0.6} />
              <text x={x + cellW / 2 - 1} y={y + cellH / 2 + 3} textAnchor="middle"
                fontSize={9} fontWeight={500}
                fill={showPruned && isPruned ? COLORS.pruned : 'var(--foreground)'}>
                {step === 1 && isPruned ? '0' : v.toFixed(2)}
              </text>
              {step === 0 && isPruned && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: 0.5 }}>
                  <line x1={x + 4} y1={y + 4} x2={x + cellW - 6} y2={y + cellH - 6}
                    stroke={COLORS.pruned} strokeWidth={1.2} />
                  <line x1={x + cellW - 6} y1={y + 4} x2={x + 4} y2={y + cellH - 6}
                    stroke={COLORS.pruned} strokeWidth={1.2} />
                </motion.g>
              )}
            </motion.g>
          );
        })
      )}
      {/* 범례 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={350} y={38} width={110} height={48} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <circle cx={366} cy={54} r={5} fill={`${COLORS.weight}30`} stroke={COLORS.weight} strokeWidth={0.8} />
        <text x={376} y={57} fontSize={8} fill="var(--foreground)">유지 (|w| ≥ 0.1)</text>
        <circle cx={366} cy={74} r={5} fill={`${COLORS.pruned}30`} stroke={COLORS.pruned} strokeWidth={0.8} />
        <text x={376} y={77} fontSize={8} fill={COLORS.pruned}>제거 (|w| {'<'} 0.1)</text>
      </motion.g>
      {step === 1 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
          <text x={240} y={160} textAnchor="middle" fontSize={9} fill={COLORS.sparse} fontWeight={600}>
            CSR: values=[0.92, 0.71, -0.88, 0.45, 0.67, ...] indices=[0,2,3, 1,3, ...]
          </text>
          <text x={240} y={176} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
            0이 아닌 값 + 열 인덱스 + 행 포인터만 저장 → 메모리 절감
          </text>
        </motion.g>
      )}
    </g>
  );
}

function LotteryViz() {
  const phases = [
    { label: '1. Dense 학습', sub: '전체 네트워크', color: '#888888' },
    { label: '2. 프루닝', sub: '작은 |w| 제거', color: COLORS.pruned },
    { label: '3. 초기값 리셋', sub: '남은 위치만', color: COLORS.lottery },
    { label: '4. 재학습', sub: '동일 정확도!', color: COLORS.lottery },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">Lottery Ticket Hypothesis — 4단계</text>
      {phases.map((p, i) => {
        const x = 20 + i * 115;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: i * 0.15 }}>
            <rect x={x} y={35} width={105} height={55} rx={8}
              fill={`${p.color}12`} stroke={p.color} strokeWidth={1} />
            <text x={x + 52} y={55} textAnchor="middle" fontSize={9} fontWeight={700}
              fill={p.color}>{p.label}</text>
            <text x={x + 52} y={72} textAnchor="middle" fontSize={8}
              fill="var(--muted-foreground)">{p.sub}</text>
            {i < 3 && (
              <text x={x + 112} y={62} fontSize={14} fill="var(--muted-foreground)">→</text>
            )}
          </motion.g>
        );
      })}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
        <rect x={60} y={105} width={360} height={40} rx={6}
          fill={`${COLORS.lottery}10`} stroke={COLORS.lottery} strokeWidth={0.8} strokeDasharray="4 3" />
        <text x={240} y={122} textAnchor="middle" fontSize={9} fontWeight={600}
          fill={COLORS.lottery}>핵심 인사이트</text>
        <text x={240} y={136} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">
          "어디를 연결하느냐"(topology)가 "초기 가중치 값"보다 중요 — 구조가 학습을 결정
        </text>
      </motion.g>
    </g>
  );
}

function HardwareLimitViz() {
  const bars = [
    { label: 'Unstructured\n90% sparse', flop: '10%', real: '70%', color: COLORS.pruned },
    { label: 'N:M (2:4)\nhw 지원', flop: '50%', real: '55%', color: COLORS.sparse },
    { label: 'Dense\n기준선', flop: '100%', real: '100%', color: '#888888' },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">비정형 희소성의 하드웨어 한계</text>
      {/* 이론 vs 실측 비교 바 */}
      {bars.map((b, i) => {
        const y = 35 + i * 52;
        const flopW = parseFloat(b.flop) * 2.8;
        const realW = parseFloat(b.real) * 2.8;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: i * 0.15 }}>
            {b.label.split('\n').map((line, li) => (
              <text key={li} x={90} y={y + 8 + li * 12} textAnchor="end"
                fontSize={8} fontWeight={600} fill={b.color}>{line}</text>
            ))}
            {/* 이론 FLOP 바 */}
            <rect x={100} y={y} width={flopW} height={10} rx={3}
              fill={b.color} fillOpacity={0.3} />
            <text x={100 + flopW + 4} y={y + 9} fontSize={7}
              fill="var(--muted-foreground)">이론 {b.flop}</text>
            {/* 실측 시간 바 */}
            <rect x={100} y={y + 14} width={realW} height={10} rx={3}
              fill={b.color} fillOpacity={0.7} />
            <text x={100 + realW + 4} y={y + 23} fontSize={7}
              fill="var(--foreground)" fontWeight={600}>실측 {b.real}</text>
          </motion.g>
        );
      })}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <AlertBox x={310} y={50} w={150} h={50} label="GPU 비효율"
          sub="불규칙 메모리 접근" color={COLORS.pruned} />
        <DataBox x={310} y={115} w={150} h={34} label="N:M 희소성"
          sub="A100 텐서코어 지원" color={COLORS.sparse} />
      </motion.g>
    </g>
  );
}

export default function UnstructuredViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step <= 1 && <MagnitudeViz step={step} />}
          {step === 2 && <LotteryViz />}
          {step === 3 && <HardwareLimitViz />}
        </svg>
      )}
    </StepViz>
  );
}
