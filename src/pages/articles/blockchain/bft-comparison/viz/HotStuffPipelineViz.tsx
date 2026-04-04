import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const PHASES = [
  { name: 'Prepare', color: '#6366f1' },
  { name: 'Pre-Commit', color: '#10b981' },
  { name: 'Commit', color: '#f59e0b' },
  { name: 'Decide', color: '#8b5cf6' },
];

const STEPS = [
  { label: 'Chained HotStuff 파이프라인', body: '각 View에서 새 블록 제안과 이전 블록의 다음 단계를 동시 진행' },
  { label: 'View 1 — B1 Prepare', body: '리더가 B1을 제안, Threshold Signature로 O(n) 통신' },
  { label: 'View 2 — B2 제안 + B1 Pre-Commit', body: 'B2 Prepare와 B1 Pre-Commit 동시 — 파이프라인 시작' },
  { label: 'View 3-4 — 풀 파이프라인', body: 'View 4에서 B1 확정 — 3-chain commit rule로 매 View 1블록 확정' },
];

const BAR_H = 22, GAP = 4, LEFT = 90, W = 60;

export default function HotStuffPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* View labels */}
          {[1, 2, 3, 4].map(v => (
            <text key={v} x={LEFT + (v - 1) * (W + GAP) + W / 2} y={18}
              textAnchor="middle" fontSize={10} fontWeight="700" fill="var(--foreground)">
              View {v}
            </text>
          ))}
          {/* Phase labels */}
          {PHASES.map((p, i) => (
            <text key={p.name} x={LEFT - 8} y={38 + i * (BAR_H + GAP) + BAR_H / 2 + 3}
              textAnchor="end" fontSize={10} fontWeight="600" fill={p.color}>
              {p.name}
            </text>
          ))}
          {/* Pipeline bars: block b appears at phase p in view (b + p) */}
          {[0, 1, 2, 3].map(b =>
            PHASES.map((p, pi) => {
              const viewIdx = b + pi; // which view column
              if (viewIdx > 3) return null;
              const x = LEFT + viewIdx * (W + GAP);
              const y = 28 + pi * (BAR_H + GAP);
              const maxView = step === 0 || step === 3 ? 4 : step;
              const visible = viewIdx < maxView;
              return (
                <motion.g key={`${b}-${pi}`}
                  animate={{ opacity: visible ? 1 : 0.1 }}
                  transition={{ duration: 0.3 }}>
                  <motion.rect x={x} y={y} width={W} height={BAR_H} rx={4}
                    fill={`${p.color}20`} stroke={p.color} strokeWidth={1.5}
                    initial={{ scaleX: 0 }} animate={{ scaleX: visible ? 1 : 0 }}
                    style={{ transformOrigin: `${x}px ${y + BAR_H / 2}px` }}
                    transition={{ duration: 0.4, delay: pi * 0.08 }} />
                  {visible && (
                    <text x={x + W / 2} y={y + BAR_H / 2 + 3}
                      textAnchor="middle" fontSize={10} fontWeight="600" fill={p.color}>
                      B{b + 1}
                    </text>
                  )}
                  {/* Decide checkmark */}
                  {pi === 3 && visible && (
                    <motion.text x={x + W + 6} y={y + BAR_H / 2 + 3} fontSize={10} fill="#10b981"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}>
                      ✓
                    </motion.text>
                  )}
                </motion.g>
              );
            })
          )}
          {/* Legend */}
          <text x={200} y={162} textAnchor="middle" fontSize={10}
            fill="var(--muted-foreground)">
            O(n) 메시지 복잡도 · 매 View 하나의 블록 확정
          </text>
        </svg>
      )}
    </StepViz>
  );
}
