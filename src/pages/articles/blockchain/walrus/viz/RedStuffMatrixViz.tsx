import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'RedStuff 2D 코딩 구조', body: '블롭을 2D 행렬로 만들고, 열 방향(Primary) + 행 방향(Secondary) RS 인코딩.' },
  { label: '원본 행렬', body: '블롭 데이터를 (n-2f) x symbol_size 행렬로 패딩.' },
  { label: 'Primary (열 RS)', body: '각 열을 독립적으로 RS 인코딩. 2f개 복구 심볼 추가.' },
  { label: 'Secondary (행 RS)', body: '각 행을 독립적으로 RS 인코딩. 2f개 복구 심볼 추가.' },
];

const ROWS = 4, COLS = 5;
const CW = 28, CH = 18, GAP = 2, OX = 50, OY = 15;

export default function RedStuffMatrixViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {Array.from({ length: ROWS }, (_, r) =>
            Array.from({ length: COLS }, (_, c) => {
              const x = OX + c * (CW + GAP);
              const y = OY + r * (CH + GAP);
              const isSource = r < 3 && c < 3;
              const isPrimary = c >= 3 && r < 3;
              const isSecondary = r >= 3 && c < 3;
              const isRecovery = r >= 3 && c >= 3;
              let color = '#6b7280';
              if (isSource) color = '#6366f1';
              if (isPrimary) color = '#10b981';
              if (isSecondary) color = '#f59e0b';
              if (isRecovery) color = '#ec4899';
              const active = step === 0 || (step === 1 && isSource) ||
                (step === 2 && (isSource || isPrimary)) || (step === 3 && (isSource || isSecondary));
              return (
                <motion.rect key={`${r}-${c}`} x={x} y={y} width={CW} height={CH} rx={3}
                  animate={{ fill: `${color}${active?'20':'06'}`, stroke: color,
                    strokeWidth: active?1.2:0.4, opacity: active?1:0.15 }}
                  transition={{ duration: 0.3 }} />
              );
            })
          )}
          {/* Labels */}
          <text x={OX+1.5*(CW+GAP)} y={OY-3} textAnchor="middle" fontSize={10} fill="#6366f1">Source</text>
          <text x={OX+3.5*(CW+GAP)} y={OY-3} textAnchor="middle" fontSize={10} fill="#10b981">Primary RS</text>
          <text x={OX-8} y={OY+3.5*(CH+GAP)} textAnchor="end" fontSize={10} fill="#f59e0b">Sec RS</text>
        </svg>
      )}
    </StepViz>
  );
}
