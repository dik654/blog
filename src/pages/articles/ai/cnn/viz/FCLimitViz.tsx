import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, sp, GRID, PIX, GAP } from './FCLimitVizData';
import FCLimitFCLayer from './FCLimitFCLayer';
import FCLimitCNNLayer from './FCLimitCNNLayer';

export default function FCLimitViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Left: 5x5 pixel grid (image) */}
          {Array.from({ length: GRID }, (_, r) =>
            Array.from({ length: GRID }, (_, c) => {
              const x = 20 + c * (PIX + GAP);
              const y = 15 + r * (PIX + GAP);
              const isCenter = r >= 1 && r <= 3 && c >= 1 && c <= 3;
              const cnnHighlight = step === 3 && isCenter;
              return (
                <motion.rect key={`${r}-${c}`} x={x} y={y} width={PIX} height={PIX} rx={1.5}
                  animate={{
                    fill: cnnHighlight ? '#6366f130' : '#64748b15',
                    stroke: cnnHighlight ? '#6366f1' : '#94a3b8',
                    strokeWidth: cnnHighlight ? 1.5 : 0.5,
                  }}
                  transition={sp} />
              );
            })
          )}
          <text x={44} y={86} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">이미지 (5×5)</text>

          <FCLimitFCLayer step={step} />
          <FCLimitCNNLayer step={step} />

          {/* Right: comparison box */}
          <motion.g animate={{ opacity: step >= 2 ? 1 : 0 }} transition={sp}>
            <rect x={245} y={10} width={200} height={step === 3 ? 120 : 55} rx={6}
              fill="none" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
            <text x={258} y={30} fontSize={12} fontWeight={700} fill="var(--foreground)">파라미터 비교</text>
            {step >= 2 && (
              <>
                <rect x={258} y={38} width={120} height={10} rx={2} fill="#ef4444" fillOpacity={0.6} />
                <text x={384} y={48} fontSize={11} fontWeight={600} fill="#ef4444">FC: 100,352</text>
              </>
            )}
            {step === 3 && (
              <>
                <rect x={258} y={58} width={5} height={10} rx={1} fill="#10b981" />
                <text x={270} y={68} fontSize={11} fontWeight={600} fill="#10b981">CNN: 9 (×필터 수)</text>
                <text x={258} y={90} fontSize={11} fontWeight={700} fill="var(--foreground)">감소율: ~11,000배</text>
                <text x={258} y={108} fontSize={11} fill="#6366f1" fontWeight={600}>+ 공간 구조 보존</text>
                <text x={258} y={124} fontSize={11} fill="#6366f1" fontWeight={600}>+ 평행이동 불변성</text>
              </>
            )}
          </motion.g>

          <defs>
            <marker id="arrowB" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="#6366f1" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
